window.ScoreData = null;

class Score {
    static log(txt) { console.log(`[CASUAL TUNA SCORE] ${txt}`); }
    
    static get data() {return window.ScoreData;}
    static set data(value) {window.ScoreData = value;}

    static get toNextLevel() {return 130 * (Score.data.level + 1);}

    static onChange = []
    static onLevelUp = []
    
    static init() {
        window.Score = Score;
        Score.load();
        Score.passive();
    }

    static reset() {
        Score.data = {
            score: 0,
            level: 0,
            progress: {},
            flags: {}
        };
        Score.validate();
    }

    static load() {
        let data = localStorage.getItem('ScoreData');
        if (data == null) {
            Score.reset();
            return;
        }
        Score.data = JSON.parse(data);
        Score.validate();
    }

    static save() {
        localStorage.setItem('ScoreData', JSON.stringify(Score.data));
    }

    static validate() {
        Score.data.flags['FirstSteps'] = Score.data.level != 0;

        while (Score.data.score >= Score.toNextLevel) {
            Score.log(`Level up: ${Score.data.level}`)
            Score.data.score -= Score.toNextLevel;
            Score.data.level++;
            Score.onLevelUp.forEach(f => f(Score.data.level));
        }

        Score.onChange.forEach(f => f(Score.data));
        Score.save();
    }

    static progress(e, score) {
        if (!Score.data.flags['FirstSteps'] && e == 'passive')
                return;

        if (Score.data.progress[e] == null)
            Score.data.progress[e] = score;
        else
            Score.data.progress[e] += score;
        Score.data.score += score;
        Score.log(`Progress: "${e}" gives ${score}, now total ${Score.data.score}`)

        Score.validate();
    }

    static passive() {
        Score.progress('passive', 10);
        setTimeout(Score.passive, 5000);
    }

}

export default Score;
