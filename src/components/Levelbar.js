require('styles/Levelbar.scss');

import React from 'react';
import Score from '../controllers/Score';

class Levelbar extends React.Component {
  constructor(params) {
    super(params);

    this.state = {
      level: Score.data.level,
      score: Score.data.score,
      scoreMax: Score.toNextLevel
    };

    Score.onChange.push((data) => {
      this.setState({
        level: data.level,
        score: data.score,
        scoreMax: Score.toNextLevel
      });
    });
  }

  render() {
    return (
      <div className="levelbar">
        <div className="scorebar-wrap">
          <div className="scorebar" style={{"width": `calc(${15 * this.state.score / this.state.scoreMax}vw - 8px)`}}></div>
        </div>
        <span className="score">LVL {this.state.level}</span>
      </div>
    );
  }
}

export default Levelbar;
