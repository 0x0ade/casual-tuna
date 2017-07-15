require('styles/Modul.scss');

import React from 'react';
import Keys from './Keys';
import Controls from './Controls';

class Modul extends React.Component {
  render() {
    let style = {
      "--color": "var(" + this.props.color +")",
      "--color-light":"var("+ this.props.color +"-light)"
    };
    return (
      <div className="modul" style={style}>
        <select>
          {this.props.instruments.map(function(inst, i){
            return <option key={"instrument" + inst} value={i}>{inst}</option>
          })}
        </select>

        <Keys pitches={5} note={4}/>
        <Controls />
      </div>
    );
  }
}

Modul.defaultProps = {
  name: "Modulname",
  color: "--color-blue",
  instruments: ["default"]
};

export default Modul;
