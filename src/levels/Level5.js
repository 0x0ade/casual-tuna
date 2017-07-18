require('styles/Level5.scss');

import React from 'react';
import Modules from '../components/Modules';
import Timeline from '../components/Timeline';

class Level5 extends React.Component {

  render() {
    return (<div className="level level5">
      <header className="header">
        <Timeline rows={3}/>
      </header>
      <div className="modules large">
        <Modules.Drums notes={8}/>
        <Modules.Bass notes={8}/>
        <Modules.Lead notes={8}/>
      </div>
    </div>);
  }
}

Level5.defaultProps = {

};

export default Level5;
