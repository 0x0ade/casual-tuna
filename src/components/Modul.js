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
        [false, false, false, false, false]],
      solo: false
    };

    if (window.CTModules[this.props.name] == null) {
      window.CTModules[this.props.name] = this;
      Audio.initModule(this.props.name);
      Audio.setInstrument(this.props.name, this.props.instruments[0].id);
    } else {
      window.CTModules[this.props.name] = this;
      let name = `module:${this.props.name}`;
      Audio.loops.forEach(info => {
        if (info.name == name)
          Audio.scheduleRefreshModule(info);
      });
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

  onChangeSolo(value) {
    if (value)
      Audio.solo = `module:${this.props.name}`;
    else
      Audio.solo = null;
  }

  onClear() {
    let name = `module:${this.props.name}`;
    for (let i = Audio.loops.length - 1; i > -1; --i) {
      let info = Audio.loops[i];
      if (info.name == name)
        Audio.stopLoop(info);
    }
    for (let i = 0; i < this.state.values.length; i++) {
        let values = this.state.values[i];
        for (let ii = 0; ii < values.length; ii++) {
            values[ii] = false;
        }
    }
    this.forceUpdate();
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
        <Keys pitches={this.props.pitches} note={this.props.note} values={this.state.values} onChange={this.onChangeKey.bind(this)} ref="keys"/>
        <Controls
          onChangeVolume={this.onChangeVolume.bind(this)}
          onChangeSolo={this.onChangeSolo.bind(this)}
          solo={this.state.solo}
          onClear={this.onClear.bind(this)}
        />
      </div>
    );
  }
}

Modul.defaultProps = {
  name: "Modulname",
  instruments: [{name: "Default", id: "default"}],
  color: "--color-blue",
  pitches: 5,
  note: 4
};

export default Modul;
