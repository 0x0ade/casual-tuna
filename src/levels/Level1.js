require('styles/Level1.scss');

import React from 'react';
import Keys from '../components/Keys';
import Audio from '../controllers/Audio';

class Level1 extends React.Component {
  sharedKeyData = {target: Audio.masterConvolverBypass}

  constructor(props) {
    super(props);

    this.state = {
      values: [
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false]]
    };
  }

  onChangeKey(enabled, note, time, loop){
    Audio.setLoop(enabled, "hiphop-kick", 0, time, loop, this.sharedKeyData);
    Score.progress('draw', enabled ? 30 : 20);
    
    let notes = this.refs.keys.props.notes;
    this.state.values[time / loop * notes][note - 1] = enabled;
    this.forceUpdate();
  }

  render() {
    return (<div className="level level1">
      <div className="drum">
        <Keys pitches={1} note={4} values={this.state.values} onChange={this.onChangeKey.bind(this)} ref="keys"/>
      </div>
    </div>);
  }
}

Level1.defaultProps = {

};

export default Level1;
