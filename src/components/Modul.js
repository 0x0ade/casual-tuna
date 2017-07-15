require('styles/Modul.scss');

import React from 'react';
import Keys from './Keys';
import Controls from './Controls';
import Audio from '../controllers/Audio';

class Modul extends React.Component {
  constructor(props) {
    super(props);

    Audio.initModule(this.props.name);
    Audio.setInstrument(this.props.name, this.props.instruments[0][1])
    //state.loop = Audio.playLoop(`module:${this.props.module}`, this.props.note, this.props.time, this.props.loop);
    //state.loop.stop();
  }

  onChangeKey(enabled, note, time, loop) {
    console.log(enabled, `module:${this.props.name}`, note, time, loop);
    Audio.setLoop(enabled, `module:${this.props.name}`, note, time, loop);
  }

  render() {
    return (
      <div className="modul">
        <h4>{this.props.name}</h4>
        <Controls instruments={this.props.instruments} />
        <Keys pitches={5} note={4} onChange={this.onChangeKey.bind(this)}/>
      </div>
    );
  }
}

Modul.defaultProps = {
  name: "Modulname",
  instruments: [["default", "default"]]
};

export default Modul;
