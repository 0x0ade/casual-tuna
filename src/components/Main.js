require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import Preloader from './Preloader';
import Modul from './Modul';
import Score from '../controllers/Score'

import Level1 from '../levels/Level1';
import Level2 from '../levels/Level2';
import Level3 from '../levels/Level3';

let background = require('../images/background.jpg');

class AppComponent extends React.Component {
  constructor(){
    super();
    this.state = {
      activeLevel: 0
    };
  }

  render() {
    return (
      <Preloader>
        <header className="header">
          <img src={background} />
        </header>
        <div className="index">
          {this.props.levels[0]}
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
