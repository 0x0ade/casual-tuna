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

Score.init();

let background = require('../images/background.jpg');

class AppComponent extends React.Component {
  constructor(){
    super();
    this.state = {
      activeLevel: Score.data.level
    };
    Score.onLevelUp = level => this.setState(state => {
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
    return (
      <Preloader>
        <div className="index">
          {this.props.levels.map(function (level, i) {
            if(i != this.state.activeLevel){
              return <div className="inactive-level">{level}</div>
            }else{
              return level;
            }
          }.bind(this))}
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
    <Level4/>
  ]
};

export default AppComponent;
