import React from 'react';
import Modules from '../components/Modules';

class Level2 extends React.Component {
  render() {
    return (<div className="level level2">
      <div className="modules">
        <Modules.Drums/>
      </div>
    </div>);
  }
}

Level2.defaultProps = {

};

export default Level2;
