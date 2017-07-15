require('styles/Level3.scss');

import React from 'react';
import Keys from '../components/Keys';

class Level3 extends React.Component {

  render() {
    return (
      <div className="modules">
        <Modul name="Lead" instruments={[
          // {name: "Piano", id: "acoustic-kit/piano"},
          {name: "Saxophone", id: "acoustic-kit/saxophone"},
          {name: "8-Bit Lead", id: "8-bit/8-bit-lead"},
          {name: "Dubstep Lead", id: "dubstep/lead"}
        ]}
        />
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

Level3.defaultProps = {

};

export default Level3;
