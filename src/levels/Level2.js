require('styles/Level2.scss');

import React from 'react';
import Modul from '../components/Modul';

class Level2 extends React.Component {
  render() {
    return (
      <div className="modules">
        <Modul
          name="Drums" instruments={[
          {name: "Acoustic Drums", id: "acoustic-kit/acoustic:drums"},
          {name: "8-Bit Drums", id: "8-bit/8-bit:drums"},
          {name: "Dubstep Drums", id: "dubstep/dub:drums"}
        ]}
          color={"--color-green"}
        />
      </div>
    );
  }
}

Level2.defaultProps = {

};

export default Level2;
