export default class Audio {
    static log(txt) { console.log(`[CASUAL TUNA AUDIO] ${txt}`); }

    static context = null
    static master = null
    static masterCompressor = null
    static masterGain = null
    static masterFilter = null
    static masterConvolverBypass = null
    static masterConvolver = null
    static masterConvolverGain = null
    
    static bpm = 120
    static get speed() { return Audio.bpm / 240; }

    static time = -1
    static rawtime = 0
    static paused = false
    static timelinePaused = true

    static lastb = -1
    static bOffset = 0
    static get __b() {
        let b = Math.floor(Audio.time * 16.0) / 16.0;
        if (b == Audio.lastb)
            return -1;
        Audio.lastb = b;
        return b + Audio.bOffset;
    }
    static _b = 0
    static b = 0
    
    static onBar = []

    static sources = []

    static modules = {}

    static samples = {}
    static samplemap = {}
    static irs = {}
    static irmap = []

    static loops = []
    static loopLength = 1

    static scheduledRefreshes = []

    static timeline = []
    static currentTimeline = 0

    static onSetTimeline = []
    static onUpdateLoop = []

    static _solo = null
    static get solo() {return Audio._solo;}
    static set solo(value) {
        Audio._solo = value;
        let moduleSolo = value;
        if (moduleSolo != null && moduleSolo.startsWith('module:'))
            moduleSolo = moduleSolo.substr('module:'.length);
        for (let key in CTModules) {
            let module = CTModules[key];
            module.setState({
                solo: module.props.name == moduleSolo 
            });
        };
    }
    
    static fetching = 0
    static fetchSample(url) {
        Audio.fetching++;
        let target = Audio.samples;
        if (url.startsWith('assets/irs/'))
            target = Audio.irs;
        fetch(url)
        .then(response => response.arrayBuffer())
        .then(data => Audio.context.decodeAudioData(data))
        .then(sample => {
            for (let i = 0; i < arguments.length; i++)
                target[arguments[i]] = sample;
            Audio.fetching--;
            return sample;
        });
    }

    static initModule(module) {
        return Audio.modules[module] = Audio.modules[module] || {
            instrument: null,
            volume: 1,
            target: null
        };
    }

    static setInstrument(module, instrument) {
        Audio.initModule(module);
        Audio.modules[module].instrument = instrument;
    }

    static setVolume(module, value) {
        Audio.initModule(module);
        Audio.modules[module].volume = value;
    }

    static setTimeline(i) {
        i %= Audio.timeline.length;
        Audio.log(`Setting timeline to #${i}`); 
        Audio.timeline[Audio.currentTimeline] = Audio.loops;
        Audio.loops = Audio.timeline[i];
        Audio.currentTimeline = i;
        Audio.forceRefresh();
        Audio.onSetTimeline.forEach(f => f(i, Audio.loops));
    }

    static play(name, note, data) {
        if (name === 'default')
            name = 'acoustic-kit/piano'

        if (Audio.solo != null && Audio.solo != name)
            return;

        data = data || {};

        if (name.startsWith('module:')) {
            let mod = Audio.modules[name.substr('module:'.length)];
            if (mod != null) {
                name = mod.instrument;
                data.volume = data.volume != null ? data.volume : mod.volume;
                data.target = data.target || mod.target;
            }
        }

        data.volume = data.volume != null ? data.volume : 1;
        data.speed = data.speed != null ? data.speed : 1;
        data.detune = data.detune != null ? data.detune : 0;

        if (data.volume <= 0)
            return;

        if (name.endsWith(':drums')) {
            // TODO: Don't hardcode this?
            name = name.substr(0, name.length - ':drums'.length)
            switch (note) {
                case 1:
                name = name + "-kick";
                break;

                case 2:
                name = name + "-snare";
                break;

                case 3:
                name = name + "-hh";
                break;
            }
            note = 0;
            data.target = data.target || Audio.masterConvolverBypass;
        }

        data.target = data.target || Audio.master;

        if (note != null && note != 0)
            name = `${name}${Audio.samplemap.notes[Math.floor((note - 1) / 5)][(note - 1) % 5]}`;

        let buffer = Audio.samples[name];

        let info;
        let reused;
        for (let i = 0; i < Audio.sources.length; i++) {
            info = Audio.sources[i];
            if (info.free && info.target == data.target) {
                info.free = false;
                reused = true;
                // Audio.log(`Reusing source #${i}`);
                info.source.disconnect();
                break;
            }
            if (i >= Audio.sources.length - 1)
                info = null;
        }

        if (info == null) {
            reused = false;
            info = {
                free: false,
                target: data.target,
                source: null,
                gain: Audio.context.createGain()
            };
            // Audio.log(`New source #${Audio.sources.length}`);
            info.gain.connect(data.target);
        }
        
        info.gain.gain.value = data.volume;

        info.source = Audio.context.createBufferSource();
        info.source.playbackRate.value = data.speed;
        info.source.detune.value = data.detune;
        info.source.connect(info.gain);
        
        info.source.buffer = buffer;
        info.source.onended = () => info.free = true;
        info.source.start();

        if (!reused)
            Audio.sources.push(info);
    }

    static playLoop(name, note, position, loopLength, data) {
        let info = {
            name: name,
            note: note,
            position: position,
            loopLength: loopLength,
            data: data
        };
        Audio.loops.push(info);
        Audio.onUpdateLoop.forEach(f => f(Audio.loops));
        return info;
    }

    static stopLoop(info) {
        Audio.loops.splice(Audio.loops.indexOf(info), 1);
        Audio.onUpdateLoop.forEach(f => f(Audio.loops));
    }

    static setLoop(enabled, name, note, position, loopLength, data) {
        let info = null;
        for (let i = 0; i < Audio.loops.length; i++) {
            info = Audio.loops[i];
            if (
                info.name == name &&
                info.note == note &&
                info.position == position &&
                info.loopLength == loopLength &&
                info.data == data
            )
                break;
            info = null;
        }

        if (info == null && enabled)
            Audio.playLoop(name, note, position, loopLength, data);
        else if (info != null && !enabled)
            Audio.stopLoop(info);

        if (data != null && data.updateModule != null) {
            // Dirty dirty horrible hack: Access the targetted module (if any) and "reset" key states.
            Audio.refreshModule(window.CTModules[info.name.substr('module:'.length)], info);
            delete data.updateModule;
        }

        return info;
    }

    static refreshModule(module, loop) {
        Audio.log(`Refreshing loop in module ${module.props.name}`);
        
        if (module.refs.keys.props == null)
            return;
        let notes = module.refs.keys.props.notes;
        module.state.values[loop.position / loop.loopLength * notes][loop.note - 1] = true;
        module.forceUpdate();
    }

    static forceRefresh() {
        Audio.log('Forcibly refreshing every module');
        
        let moduleSolo = Audio.solo;
        if (moduleSolo != null && moduleSolo.startsWith('module:'))
            moduleSolo = moduleSolo.substr('module:');
        for (let key in CTModules) {
            let module = CTModules[key];

            if (module.refs.keys.props == null)
                return;

            for (let i = 0; i < module.state.values.length; i++) {
                let values = module.state.values[i];
                for (let ii = 0; ii < values.length; ii++) {
                    values[ii] = false;
                }
            }

            module.state.solo = module.props.name == moduleSolo;

            module.forceUpdate();
        };

        Audio.loops.forEach(info => {
            let moduleName = info.name.substr('module:'.length);
            let module = window.CTModules[moduleName];
            Audio.refreshModule(module, info);
        });
    }

    static scheduleRefreshModule(loop) {
        Audio.scheduledRefreshes.push(loop);
    }

    static inited = false
    static initFinished = false
    static _initPromise = null
    static _initResolve = null
    static _initReject = null
    static init() {
        if (window.CTAudio != Audio && window.CTAudio !== undefined) {
            // Old instance still hanging around somewhere - kill it with fire!
            window.CTAudio.context.close();
            window.CTAudio.context = null;
            Audio.time = window.CTAudio.time;
            Audio.bpm = window.CTAudio.bpm;
            Audio.paused = window.CTAudio.paused;
        }
        window.CTAudio = Audio;
        if (Audio.inited)
            return Audio._initPromise;
        Audio.inited = true;

        return Audio._initPromise = new Promise((resolve, reject) => {
            Audio._initResolve = resolve;
            Audio._initReject = reject;

            Audio.log('[init] Creating AudioContext');
            Audio.context = new AudioContext();

            Audio.masterCompressor = Audio.context.createDynamicsCompressor();
            Audio.masterCompressor.connect(Audio.context.destination);

            Audio.masterGain = Audio.context.createGain();
            Audio.masterGain.connect(Audio.masterCompressor);

            Audio.masterFilter = Audio.context.createBiquadFilter();
            Audio.masterFilter.frequency.value = Audio.context.sampleRate * 0.5;
            Audio.masterFilter.connect(Audio.masterGain);

            Audio.masterConvolverBypass = Audio.context.createGain();
            Audio.masterConvolverBypass.connect(Audio.masterFilter);
            
            Audio.masterConvolver = Audio.context.createConvolver();
            Audio.masterConvolver.connect(Audio.masterFilter);

            Audio.masterConvolverGain = Audio.context.createGain();
            Audio.masterConvolverGain.connect(Audio.masterConvolver);

            Audio.masterConvolverGain.gain.value = 0.5;
            Audio.masterConvolverBypass.gain.value = 0.9;

            // What other nodes should see as "master output".
            Audio.master = Audio.context.createGain();
            Audio.master.connect(Audio.masterConvolverGain);
            Audio.master.connect(Audio.masterConvolverBypass);
            
            Audio.log('[init] Filling samples and irs');
            Audio.fetching++;
            // TODO: Replace fetch json with require
            fetch('assets/samplemap.json').then(response => response.json())
            .then(map => {
                Audio.samplemap = map;
                map.instruments.forEach((oct, octi) => {
                    oct.forEach(instr => {
                        map.notes[octi].forEach((note, notei) => {
                            let full = `${instr}${note}`;
                            let short = full.split('/');
                            Audio.fetchSample(`assets/samples/${full}.ogg`, full, short[short.length - 1]);
                        });
                    });
                });
                map.samples.forEach(full => {
                    let short = full.split('/');
                    Audio.fetchSample(`assets/samples/${full}.ogg`, full, short[short.length - 1]);
                });
                Audio.fetching--;
            });

            Audio.fetching++;
            // TODO: Replace fetch json with require
            fetch('assets/irmap.json').then(response => response.json())
            .then(map => {
                Audio.irmap = map;
                map.forEach(full => {
                    let short = full.split('/');
                    Audio.fetchSample(`assets/irs/${full}.wav`, full, short[short.length - 1]);
                });
                Audio.fetching--;
            });

            for (let i = 0; i < 10; i++)
                Audio.timeline.push([]); 

            Audio.log('[init] Starting update loop');
            window.requestAnimationFrame(Audio.update);
        });
    }
    static initFetched() {
        if (Audio.initFinished) {
            if (Audio._initReject != null)
                Audio._initReject();
            return;
        }
        Audio.initFinished = true;

        Audio.log('[init] Hooray!');

        Audio.masterConvolver.buffer = Audio.irs['halls/keno-2'];

        if (Audio._initResolve != null)
            Audio._initResolve();

    }

    static lastFetching = -1;
    static update(newtime) {
        if (Audio.context == null)
            // If the context == null (has been disposed and nullified), don't continue this update loop.
            // Instead, let any other possible update loop take over.
            return;
        window.requestAnimationFrame(Audio.update);

        let oldtime = Audio.rawtime; // Stored temporarily. Audio.rawtime needs to update, but we maybe need its old value later.
        Audio.rawtime = newtime;

        if (Audio.fetching) {
            // Wait until samples fetched completely.
            if (Audio.fetching != Audio.lastFetching)
                Audio.log(`[init] Fetching: ${Audio.fetching}`);
            Audio.lastFetching = Audio.fetching;
            return;
        }
        if (!Audio.initFinished) {
            // Second half of initialization, with the samples intact, starts here.
            Audio.log('[init] Fetching finished, resuming init');
            Audio.initFetched();
        }

        if (Audio.paused)
            // Audio paused - don't play anything, don't progress time.
            return;
        Audio.time += (newtime - oldtime) * 0.001 * Audio.speed;

        let b = Audio.__b;
        Audio._b = b;
        if (b <= 0)
            // Not "on beat."
            return;
        Audio.b = b;
        
        // Any audio management (f.e. custom loops) should end up here.

        if (!Audio.timelinePaused) {
            let maxLength = Audio.loopLength;
            Audio.loops.forEach(info => {
                if (maxLength < info.loopLength)
                    maxLength = info.loopLength
            });
            if (b >= maxLength) {
                Audio.setTimeline(Audio.currentTimeline + 1);
                Audio.bOffset -= b;
                Audio.lastb = -1;
                b = Audio.__b;
                Audio._b = b;
                Audio.b = b;
            }
        }

        Audio.onBar.forEach(cb => cb(b, Audio.time));

        for (let i = Audio.scheduledRefreshes.length - 1; i > -1; --i) {
            let info = Audio.scheduledRefreshes[i];
            let moduleName = info.name.substr('module:'.length);
            let module = window.CTModules[moduleName];
            if (module == null) {
                Audio.log(`Scheduled refresh for ${moduleName} delayed further. This should only happen once at most.`);
                continue;
            }
            Audio.refreshModule(module, info);
            Audio.scheduledRefreshes.splice(i, 1);
        }

        Audio.loops.forEach(info => {
            if (b % (info.loopLength || Audio.loopLength) != info.position)
                return;
            Audio.play(info.name, info.note, info.data);
        });

    }
}
