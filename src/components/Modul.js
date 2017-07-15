require('styles/Modul.scss');

import React from 'react';
import Keys from './Keys';
import Controls from './Controls';
import Audio from '../controllers/Audio';

class Modul extends React.Component {
  constructor(props) {
    super(props);

    Audio.initModule(this.props.name);
    Audio.setInstrument(this.props.name, this.props.instruments[0].id);
  }

  onChangeKey(enabled, note, time, loop) {
    console.log(enabled, `module:${this.props.name}`, note, time, loop);
    Audio.setLoop(enabled, `module:${this.props.name}`, note, time, loop);
  }

  render() {
    let style = {
      "--color": "var(" + this.props.color +")",
      "--color-light":"var("+ this.props.color +"-light)"
    };
    return (
      <div className="modul" style={style}>
        <select>
          {this.props.instruments.map(function(inst) {
            return <option key={"instrument" + inst.id} value={inst.id}>{inst.name}</option>
          })}
        </select>
        <Keys pitches={5} note={4} onChange={this.onChangeKey.bind(this)}/>
        <Controls />
      </div>
    );
  }
}

Modul.defaultProps = {
  name: "Modulname",
  instruments: [{name: "Default", id: "default"}],
  color: "--color-blue"
};

export default Modul;
