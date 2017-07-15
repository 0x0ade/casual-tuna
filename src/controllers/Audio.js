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

    static lastb = -1
    static get b() {
        let b = Math.floor(Audio.time * 16.0) / 16.0;
        if (b == Audio.lastb)
            return -1;
        Audio.lastb = b;
        return b;
    }

    static onBar = []

    static sources = []

    static modules = {}

    static samples = {}
    static samplemap = {}
    static irs = {}
    static irmap = []

    static loops = []
    static loopLength = 1

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

    static play(name, note, data) {
        if (name === 'default')
            name = 'acoustic-kit/piano'

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

        if (name.endsWith(':drums')) {
            // TODO: Don't hardcode this?
            name = name.substr(0, name.length - ':drums'.length)
            switch (note) {
                case 1:
                name = name + "-kick";
                break;

                case 2:
                name = name + "-kick";
                data.volume *= 0.7;
                data.speed *= 4.0;
                break;

                case 3:
                name = name + "-snare";
                break;

                case 4:
                name = name + "-snare";
                data.volume *= 0.7;
                data.speed *= 4.0;
                break;

                case 5:
                name = name + "-snare";
                data.volume *= 0.5;
                data.speed *= 6.0;
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
            data: data,
            stop: () => Audio.loops.splice(Audio.loops.indexOf(info), 1)
        };
        Audio.loops.push(info);
        return info;
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
            info.stop();
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

        // TODO: Remove this test.
        /*
        Audio.playLoop('8-bit-kick',  0, 0.00, 1);
        Audio.playLoop('8-bit-snare', 0, 0.25, 1);
        // Audio.playLoop('8-bit-kick',  0, 0.50, 1);
        Audio.playLoop('8-bit-kick',  0, 0.50, 1, {volume: 0.7, speed: 4.0});
        Audio.playLoop('8-bit-kick',  0, 0.625, 1);
        Audio.playLoop('8-bit-snare', 0, 0.75, 1);

        for (let i = 1; i < 8; i += 2)
            Audio.playLoop('8-bit-snare', 0, 0.125 * i, 1, {volume: 0.7, speed: 4.0});

        for (let i = 1; i < 16; i += 2)
            Audio.playLoop('8-bit-snare', 0, 0.0625 * i, 1, {volume: 0.5, speed: 6.0});
        Audio.playLoop('8-bit-bass', 1, 0.00, 2);
        Audio.playLoop('8-bit-bass', 2, 0.50, 2);
        Audio.playLoop('8-bit-bass', 3, 1.00, 2);
        Audio.playLoop('8-bit-bass', 2, 1.50, 2);

        Audio.playLoop('8-bit-lead', 1, 0.00, 4);
        Audio.playLoop('8-bit-lead', 2, 0.25, 4);
        Audio.playLoop('8-bit-lead', 3, 0.50, 4);
        Audio.playLoop('8-bit-lead', 4, 0.75, 4);

        Audio.playLoop('8-bit-lead', 1, 0.00, 4, {volume: 0.5, speed: 0.5});
        Audio.playLoop('8-bit-lead', 2, 0.25, 4, {volume: 0.5, speed: 0.5});
        Audio.playLoop('8-bit-lead', 3, 0.50, 4, {volume: 0.5, speed: 0.5});
        Audio.playLoop('8-bit-lead', 4, 0.75, 4, {volume: 0.5, speed: 0.5});

        Audio.playLoop('piano', 1, 1.00, 4, {volume: 0.5, speed: 0.5});
        Audio.playLoop('piano', 2, 1.25, 4, {volume: 0.5, speed: 1});
        Audio.playLoop('piano', 3, 1.50, 4, {volume: 0.5, speed: 0.5});
        Audio.playLoop('piano', 4, 1.75, 4, {volume: 0.5, speed: 1});

        Audio.playLoop('8-bit-lead', 5, 2.00, 4);
        Audio.playLoop('8-bit-lead', 4, 2.25, 4);
        Audio.playLoop('8-bit-lead', 3, 2.50, 4);
        Audio.playLoop('8-bit-lead', 2, 2.75, 4);

        Audio.playLoop('8-bit-lead', 5, 2.00, 4, {volume: 0.5, speed: 0.5});
        Audio.playLoop('8-bit-lead', 4, 2.25, 4, {volume: 0.5, speed: 0.5});
        Audio.playLoop('8-bit-lead', 3, 2.50, 4, {volume: 0.5, speed: 0.5});
        Audio.playLoop('8-bit-lead', 2, 2.75, 4, {volume: 0.5, speed: 0.5});

        Audio.playLoop('piano', 5, 3.00, 4, {volume: 0.5, speed: 0.5});
        Audio.playLoop('piano', 4, 3.25, 4, {volume: 0.5, speed: 1});
        Audio.playLoop('piano', 3, 3.50, 4, {volume: 0.5, speed: 0.5});
        Audio.playLoop('piano', 2, 3.75, 4, {volume: 0.5, speed: 1});
        */

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

        let b = Audio.b;
        if (b <= 0)
            // Not "on beat."
            return;

        // Any audio management (f.e. custom loops) should end up here.

        Audio.onBar.forEach(cb => cb(b, Audio.time));

        Audio.loops.forEach(info => {
            if (b % (info.loopLength || Audio.loopLength) != info.position)
                return;
            Audio.play(info.name, info.note, info.data);
        });

    }
}
