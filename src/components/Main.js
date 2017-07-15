require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import Modul from './Modul';

let background = require('../images/background.jpg');

class AppComponent extends React.Component {
  render() {
    return (
      <div>
        <header className="header">
          <img src={background} />
        </header>
        <div className="index">
          <Modul name="Base"></Modul>
          <Modul name="Keyboard"></Modul>
        </div>
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
