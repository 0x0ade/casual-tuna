import React from 'react';
import Modul from '../components/Modul';
import Timeline from '../components/Timeline';

class Level4 extends React.Component {

  render() {
    return (<div className="level level4">
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
      </div>
    </div>);
  }
}

Level4.defaultProps = {

};

export default Level4;
