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
          <Modul
            instruments={[
            {name: "Bass", id: "acoustic-kit/bass"},
            {name: "8-Bit Bass", id: "8-bit/8-bit-bass"},
            {name: "Dubstep Bass", id: "dubstep/bass"}
            ]}
            color={"--color-green"}
          />
          <Modul name="Keyboard" instruments={[
            {name: "Piano", id: "acoustic-kit/piano"},
            {name: "8-Bit Lead", id: "8-bit/8-bit-lead"},
            {name: "Dubstep Lead", id: "dubstep/lead"}
            ]}
          />
        </div>
      </Preloader>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
