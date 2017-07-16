require('styles/Level3.scss');

import React from 'react';
import Modul from '../components/Modul';

class Level3 extends React.Component {

  render() {
    return (<div className="level level3">
      <div className="modules">
        <Modul
          name="Drums" instruments={[
            {name: "Hiphop Drums", id: "hiphop/hiphop:drums"},
            {name: "Acoustic Drums", id: "acoustic-kit/acoustic:drums"},
            {name: "8-Bit Drums", id: "8-bit/8-bit:drums"},
            {name: "Dubstep Drums", id: "dubstep/dub:drums"}
          ]}
          pitches={3}
          color={"--color-green"}
        />
        <Modul
          name="Bass" instruments={[
          {name: "Bass", id: "acoustic-kit/bass"},
          {name: "8-Bit Bass", id: "8-bit/8-bit-bass"},
          {name: "Dubstep Bass", id: "dubstep/bass"},
          {name: "808", id: "hiphop/808"}
        ]}
          color={"--color-red"}
        />
      </div>
    </div>);
  }
}

Level3.defaultProps = {

};

export default Level3;
