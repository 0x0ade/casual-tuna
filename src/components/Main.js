require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import Modul from './Modul';

let yeomanImage = require('../images/yeoman.png');

class AppComponent extends React.Component {
  render() {
    return (
      <div className="index">
        <Modul name="Base"></Modul>
        <Modul name="Keyboard"></Modul>
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
