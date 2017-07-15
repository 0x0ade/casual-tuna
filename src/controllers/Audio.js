export default class Audio {
    static log(txt) { console.log(`[CASUAL TUNA AUDIO] ${txt}`); }

    static context = null
    static bpm = 120
    static get speed() { return this.bpm / 120; }
    static time = 0
    static lastb = 0;
    static get b() {
        var b = Math.floor(this.time * this.speed * 16.0) / 16.0;
        if (b == Audio.lastb)
            return -1;
        Audio.lastb = b;
        return b;
    }

    static sources = []

    static samples = {}
    static samplemap = {}

    static fetching = 0;
    static fetchSample(url) {
        Audio.fetching++;
        fetch(url)
        .then(response => response.arrayBuffer())
        .then(data => Audio.context.decodeAudioData(data))
        .then(sample => {
            for (var i = 0; i < arguments.length; i++)
                Audio.samples[arguments[i]] = sample;
            Audio.fetching--;
            return sample;
        });
    }

    static play(name, note, data) {
        data = data || {};
        data.volume = data.volume || 1;

        if (note != null && note != 0)
            name = `${name}${Audio.samplemap.notes[note - 1]}`;

        var buffer = Audio.samples[name];

        var info;
        var reused;
        for (var i = 0; i < Audio.sources.length; i++) {
            info = Audio.sources[i];
            if (info.free) {
                info.free = false;
                reused = true;
                Audio.log(`Reusing source #${i}`);
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
                source: null,
                gain: Audio.context.createGain()
            };
            Audio.log(`New source #${Audio.sources.length}`);
            info.gain.connect(Audio.context.destination);
        }
        
        info.gain.gain.value = data.volume;

        info.source = Audio.context.createBufferSource();
        info.source.connect(info.gain);
        
        info.source.buffer = buffer;
        info.source.onended = () => info.free = true;
        info.source.start();

        if (!reused)
            Audio.sources.push(info);
    }

    static inited = false;
    static initFinished = false;
    static init() {
        if (Audio.inited)
            return;
        Audio.inited = true;

        Audio.log('[init] Creating AudioContext');
        Audio.context = new AudioContext();

        Audio.log('[init] Filling samples');
        Audio.fetching++;
        fetch('assets/samplemap.json').then(response => response.json())
        .then(map => {
            Audio.samplemap = map;
            map.instruments.forEach(instr => {
                map.notes.forEach(note => {
                    var full = `${instr}${note}`;
                    var short = full.split('/');
                    Audio.fetchSample(`assets/samples/${full}.ogg`, full, short[short.length - 1]);
                });
            });
            map.samples.forEach(full => {
                var short = full.split('/');
                Audio.fetchSample(`assets/samples/${full}.ogg`, full, short[short.length - 1]);
            });
            Audio.fetching--;
        });

        Audio.log('[init] Starting update loop');
        window.requestAnimationFrame(Audio.update);
    }
    static initFetched() {
        if (Audio.initFinished)
            return;
        Audio.initFinished = true;

        Audio.log('[init] Hooray!');

    }

    static lastFetching = -1;
    static update(rtime) {
        window.requestAnimationFrame(Audio.update);

        Audio.time = rtime * 0.001;

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

        var b = Audio.b;
        if (b <= 0)
            // Not "on beat."
            return;

        // TODO: Any audio management (f.e. custom loops) should end up here.
        if (b % 0.5 == 0 && b % 2 != 0) {
            Audio.play('8-bit-kick', null, {volume: 1.0});
            Audio.play('8-bit-bass', 1, {volume: 1.0});
        }

        if (b % 1 == 0) {
            Audio.play('8-bit-snare', null, {volume: 1.0});
        }

        if (b % 2 == 0) {
            Audio.play('8-bit-lead', 5, {volume: 0.7});
            Audio.play('8-bit-bass', 2, {volume: 1.0});
        }

        if (b % 4 == 1)
            Audio.play('8-bit-lead', 4, {volume: 0.6});
    }
}
