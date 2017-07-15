require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import Preloader from './Preloader';
import Modul from './Modul';
import Score from '../controllers/Score'
import Timeline from './Timeline';

import Level1 from '../levels/Level1';
import Level2 from '../levels/Level2';
import Level3 from '../levels/Level3';

Score.init();

let background = require('../images/background.jpg');

class AppComponent extends React.Component {
  constructor(){
    super();
    this.state = {
      activeLevel: 2
    };
  }

  render() {
    return (
      <Preloader>
        <header className="header">
          <Timeline/>
        </header>
        <div className="index">
          {this.props.levels[this.state.activeLevel]}
        </div>
      </Preloader>
    );
  }
}

AppComponent.defaultProps = {
  levels: [
    <Level1/>,
    <Level2/>,
    <Level3/>
  ]
};

export default AppComponent;
