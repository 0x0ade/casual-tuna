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
