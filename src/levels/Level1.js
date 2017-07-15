require('styles/Level1.scss');

import React from 'react';
import Keys from '../components/Keys';
import Audio from '../controllers/Audio';

class Level1 extends React.Component {
  onChangeKey(enabled, note, time, loop){
    Audio.setLoop(enabled, "acoustic-kick", 0, time, loop);
  }

  render() {
    return (
      <div className="drum">
        <Keys pitches={1} note={4} onChange={this.onChangeKey.bind(this)}/>
      </div>
    );
  }
}

Level1.defaultProps = {

};

export default Level1;
