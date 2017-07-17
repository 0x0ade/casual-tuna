import React from 'react';
import Modules from '../components/Modules';
import Timeline from '../components/Timeline';

class Level6 extends React.Component {

  render() {
    return (<div className="level level6">
      <header className="header">
        <Timeline/>
      </header>
      <div className="modules large">
        <Modules.Drums notes={8}/>
        <Modules.Bass notes={8}/>
        <Modules.Lead notes={8}/>
        <Modules.Chords notes={8}/>
      </div>
    </div>);
  }
}

Level6.defaultProps = {

};

export default Level6;
