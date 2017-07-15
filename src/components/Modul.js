require('styles/Modul.scss');

import React from 'react';
import Keys from './Keys';
import Controls from './Controls';
import Audio from '../controllers/Audio';
import Score from '../controllers/Score';

window.CTModules = window.CTModules || {};

class Modul extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      values: [
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false]]
    };

    if (window.CTModules[this.props.name] == null) {
      window.CTModules[this.props.name] = this;
      Audio.initModule(this.props.name);
      Audio.setInstrument(this.props.name, this.props.instruments[0].id);
    } else {
      window.CTModules[this.props.name] = this;
      Audio.loops.forEach(info => {
        if (info.name == `module:${this.props.name}`)
          Audio.refreshModule(this, info);
      }, this);
    }
  }

  onChangeKey(enabled, note, time, loop) {
    console.log(enabled, `module:${this.props.name}`, note, time, loop);
    Audio.setLoop(enabled, `module:${this.props.name}`, note, time, loop);
    Score.progress('draw', enabled ? 20 : 10);

    let notes = this.refs.keys.props.notes;
    this.state.values[time / loop * notes][note - 1] = enabled;
    this.forceUpdate();
  }

  onChangeInstrument(value) {
    Audio.setInstrument(this.props.name, value);
    Score.progress('draw', 20);
  }

  onChangeVolume(value) {
    Audio.setVolume(this.props.name, value);
  }

  render() {
    let style = {
      "--color": "var(" + this.props.color +")",
      "--color-light":"var("+ this.props.color +"-light)"
    };
    return (
      <div className="modul" style={style}>
        <select onChange={e => this.onChangeInstrument(e.target.value)}>
          {this.props.instruments.map(function(inst) {
            return <option key={"instrument" + inst.id} value={inst.id}>{inst.name}</option>
          })}
        </select>
        <Keys pitches={5} note={4} values={this.state.values} onChange={this.onChangeKey.bind(this)} ref="keys"/>
        <Controls onChangeVolume={this.onChangeVolume.bind(this)}/>
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
