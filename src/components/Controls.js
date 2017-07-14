require('styles/Controls.scss');

import React from 'react';
import Keys from './Keys';

class Controls extends React.Component {
  render() {
    return (
      <div className="controls">
        <button>Solo</button>
        <select>
          {this.props.instruments.map(function(inst, i){
            return <option key={"instrument" + inst} value={i}>{inst}</option>
          })}
        </select>
        <input type="range"/>
      </div>
    );
  }
}

Controls.defaultProps = {
  instruments: ["default"]
};

export default Controls;
