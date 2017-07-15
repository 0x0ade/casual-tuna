require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

import Preloader from './Preloader';

import Modul from './Modul';

class AppComponent extends React.Component {
  render() {
    return (
      <Preloader>
        <div className="index">
          <Modul name="Bass" instruments={[
            ["Bass", "acoustic-kit/bass"],
            ["8-Bit Bass", "8-bit/8-bit-bass"],
            ["Dubstep Bass", "dubstep/bass"]
          ]}/>
          <Modul name="Keyboard" instruments={[
            ["Piano", "acoustic-kit/piano"],
            ["8-Bit Lead", "8-bit/8-bit-lead"],
            ["Dubstep Lead", "dubstep/lead"]
          ]}/>
        </div>
      </Preloader>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
