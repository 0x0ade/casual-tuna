require('styles/Level2.scss');

import React from 'react';
import Keys from '../components/Keys';

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
        <Modul
          name="Bass" instruments={[
          {name: "Bass", id: "acoustic-kit/bass"},
          {name: "8-Bit Bass", id: "8-bit/8-bit-bass"},
          {name: "Dubstep Bass", id: "dubstep/bass"}
        ]}
          color={"--color-red"}
        />
      </div>
    );
  }
}

Level2.defaultProps = {

};

export default Level2;
