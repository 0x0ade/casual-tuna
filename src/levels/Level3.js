require('styles/Level3.scss');

import React from 'react';
import Modules from '../components/Modules';

class Level3 extends React.Component {

  render() {
    return (<div className="level level3">
      <div className="modules">
        <Modules.Drums/>
        <Modules.Bass/>
      </div>
    </div>);
  }
}

Level3.defaultProps = {

};

export default Level3;
