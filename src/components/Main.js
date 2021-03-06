require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import Preloader from './Preloader';
import Modul from './Modul';
import Levelbar from './Levelbar'

import Audio from '../controllers/Audio'
import Score from '../controllers/Score'

import Level1 from '../levels/Level1';
import Level2 from '../levels/Level2';
import Level3 from '../levels/Level3';
import Level4 from '../levels/Level4';
import Level5 from '../levels/Level5';
import Level6 from '../levels/Level6';

Score.init();

class AppComponent extends React.Component {
  constructor(){
    super();
    this.state = {
      activeLevel: Score.data.level
    };
    Score.onLevelUp.push(this.onLevelUp.bind(this));
    this.fakeLevelUp = true;
    this.onLevelUp(Score.data.level);
    this.fakeLevelUp = false;
  }

  fakeLevelUp = true
  onLevelUp(level) {
    if (level > 0)
      Audio.paused = false;
    if (this.fakeLevelUp)
      return;

    this.setState(state => {
      if (state.activeLevel == 0 && level == 1) {
        console.log('Switching from level 1 to level 2, applying special case for module transfer');
        Audio.loops.forEach(info => {
          info.name = 'module:Drums';
          info.note = 1;
          info.data = null;
          Audio.scheduleRefreshModule(info);
        });
      }

      state.activeLevel = level;
      return state;
    });
  }

  render() {
    let activeLevel = Math.min(this.state.activeLevel, this.props.levels.length - 1);
    return (
      <Preloader>
        <div className="index">
          {
            // Great idea, but unfortunately breaks preserving the pattern during level up.
            // That's because right now, modules register themselves as the current one on construction.
            /*
            this.props.levels.map((level, i) => {
              if (i != activeLevel) {
                return <div key={i} className="inactive-level">{level}</div>;
              } else {
                return <div key={i}>{level}</div>;
              }
            })
            */
            this.props.levels[activeLevel]
          }
          <Levelbar/>
        </div>
      </Preloader>
    );
  }
}

AppComponent.defaultProps = {
  levels: [
    <Level1/>,
    <Level2/>,
    <Level3/>,
    <Level4/>,
    <Level5/>,
    <Level6/>
  ]
};

export default AppComponent;
