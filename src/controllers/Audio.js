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
    static fetchSample(name, url) {
        Audio.fetching++;
        fetch(url)
        .then(response => response.arrayBuffer())
        .then(data => Audio.context.decodeAudioData(data))
        .then(sample => { Audio.samples[name] = sample; Audio.fetching--; });
    }

    static play(name, note) {
        if (note !== undefined)
            name = `${name}${Audio.samplemap.notes[note - 1]}`;

        var source = Audio.context.createBufferSource();
        source.buffer = Audio.samples[name];
        var index = Audio.sources.length;
        source.onended = () => Audio.sources.splice(index, 1);
        Audio.sources.push(source);
        source.connect(Audio.context.destination);
        source.start();
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
        // Audio.fetchSample('test', 'assets/samples/test.wav');
        Audio.fetching++;
        fetch('assets/samplemap.json').then(response => response.json())
        .then(map => {
            Audio.samplemap = map;
            map.instruments.forEach(instr => {
                map.notes.forEach(note => {
                    var full = `${instr}${note}`;
                    Audio.fetchSample(full, `assets/samples/${full}.ogg`);
                });
            });
            map.samples.forEach(full => {
                Audio.fetchSample(full, `assets/samples/${full}.ogg`);
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

    static update(rtime) {
        window.requestAnimationFrame(Audio.update);

        Audio.time = rtime * 0.001;

        if (Audio.fetching) {
            // Wait until samples fetched completely.
            Audio.log(`[init] Fetching: ${Audio.fetching}`);
            return;
        }
        if (!Audio.initFinished) {
            // Second half of initialization, with the samples intact, starts here.
            Audio.log('[init] Fetching finished, resuming init');
            Audio.initFetched();
        }

        var b = Audio.b;
        if (b <= 0)
            // Not on beat.
            return;

        // TODO: Any audio management (f.e. custom loops) should end up here.
        if (b % 0.5 == 0)
            Audio.play('bass', 1);

        if (b % 1 == 0)
            Audio.play('bass', 3);

        if (b % 2 == 0)
            Audio.play('piano', 5);

        if (b % 4 == 1)
            Audio.play('piano', 4);
    }
}
