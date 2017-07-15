require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

import Preloader from './Preloader';

import Modul from './Modul';

let background = require('../images/background.jpg');

class AppComponent extends React.Component {
  render() {
    return (
      <Preloader>
        <header className="header">
          <img src={background} />
        </header>
        <div className="index">
          <Modul name="Base"></Modul>
          <Modul name="Keyboard"></Modul>
        </div>
      </Preloader>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
