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
          <Modul name="Base" instruments={["Bass", "8-Bit Bass"]}/>
          <Modul name="Keyboard" instruments={["Piano", "8-Bit Lead"]}/>
        </div>
      </Preloader>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
