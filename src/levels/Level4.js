import React from 'react';
import Modules from '../components/Modules';
import Timeline from '../components/Timeline';

class Level4 extends React.Component {

  render() {
    return (<div className="level level4">
      <header className="header">
        <Timeline rows={2}/>
      </header>
      <div className="modules">
        <Modules.Drums/>
        <Modules.Bass/>
      </div>
    </div>);
  }
}

Level4.defaultProps = {

};

export default Level4;
