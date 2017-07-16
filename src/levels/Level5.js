require('styles/Level5.scss');

import React from 'react';
import Modul from '../components/Modul';
import Timeline from '../components/Timeline';

class Level5 extends React.Component {

  render() {
    return (<div className="level level5">
      <header className="header">
        <Timeline/>
      </header>
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
          {name: "Dubstep Bass", id: "dubstep/bass"}
        ]}
          color={"--color-red"}
        />
        <Modul name="Keyboard" instruments={[
          // {name: "Piano", id: "acoustic-kit/piano"},
          {name: "Saxophone", id: "acoustic-kit/saxophone"},
          {name: "8-Bit Lead", id: "8-bit/8-bit-lead"},
          {name: "Dubstep Lead", id: "dubstep/lead"},
          {name: "808", id: "hiphop/808"},
          {name: "Koto", id: "hiphop/koto"},
          {name: "Ukulele", id: "other/ukulele"},
          ]}
        />
      </div>
    </div>);
  }
}

Level5.defaultProps = {

};

export default Level5;
