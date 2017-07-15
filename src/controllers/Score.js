window.ScoreData = null;

class Score {

    static get data() {return window.ScoreData;}
    static set data(value) {window.ScoreData = value;}

    static reset() {
        Score.data = {
            score: 0,
            level: 0,
            progress: {},
            flags: {}
        };
        validate();        
    }

    static load() {
        let data = localStorage.getItem('ScoreData');
        if (data == null) {
            reset();
            return;
        }
        Score.data = JSON.parse(data);
    }

    static save() {
        localStorage.setItem('ScoreData', JSON.stringify(Score.data));
    }

    static validate() {
        Score.flags['FirstSteps'] = level == 0 && score < 30;

        while (Score.data.score >= 100) {
            Score.data.score -= 100;
            Score.level++;
        }

        Score.save();
    }

    static progress(e, score) {
        if (Score.flags['FirstSteps'] && e == 'passive')
            return;

        if (Score.data.progress[e] == null)
            Score.data.progress[e] = score;
        else
            Score.data.progress[e] += score;
        Score.validate();
    }

}

export default Score;
