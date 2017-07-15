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
  }

  render() {
    return (
      <div className="modul">
        <h4>{this.props.name}</h4>
        <Controls module={this.props.name} instruments={this.props.instruments} />
        <Keys module={this.props.name} pitches={5} note={4}/>
      </div>
    );
  }
}

Modul.defaultProps = {
  name: "Modulname",
  instruments: [["default", "default"]]
};

export default Modul;
