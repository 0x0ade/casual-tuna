require('styles/Controls.scss');

import React from 'react';
import Keys from './Keys';
import Audio from '../controllers/Audio';

class Controls extends React.Component {
  changeInstrument(e) {
    Audio.setInstrument(this.props.module, e.target.value);
  }

  render() {
    return (
      <div className="controls">
        <button>Solo</button>
        <select onChange={this.changeInstrument.bind(this)}>
          {this.props.instruments.map(function(inst, i){
            return <option key={"instrument" + inst[1]} value={inst[1]}>{inst[0]}</option>
          })}
        </select>
        <input type="range"/>
      </div>
    );
  }
}

Controls.defaultProps = {
  module: null,
  instruments: [["default", "default"]]
};

export default Controls;
