import React from 'react';
import Modul from './Modul';
import Keys from './Keys';
import Controls from './Controls';
import Audio from '../controllers/Audio';
import Score from '../controllers/Score';

export default {
  Drums: props => (
    <Modul
      name="Drums" instruments={[
        {name: "Hiphop Drums", id: "hiphop/hiphop:drums"},
        {name: "Acoustic Drums", id: "acoustic-kit/acoustic:drums"},
        {name: "8-Bit Drums", id: "8-bit/8-bit:drums"},
        {name: "Dubstep Drums", id: "dubstep/dub:drums"}
      ]}
      notes={props.notes}
      pitches={3}
      color={"--color-green"}
    />
  ),

  Bass: props => (
    <Modul
      name="Bass" instruments={[
        {name: "Bass", id: "acoustic-kit/bass"},
        {name: "8-Bit Bass", id: "8-bit/8-bit-bass"},
        {name: "Dubstep Bass", id: "dubstep/bass"},
        {name: "808", id: "hiphop/808"}
      ]}
      notes={props.notes}
      color={"--color-red"}
    />
  ),

  Lead: props => (
    <Modul
      name="Lead" instruments={[
        // {name: "Piano", id: "acoustic-kit/piano"},
        {name: "Saxophone", id: "acoustic-kit/saxophone"},
        {name: "8-Bit Lead", id: "8-bit/8-bit-lead"},
        {name: "Dubstep Lead", id: "dubstep/lead"},
        {name: "Koto", id: "hiphop/koto"},
        {name: "Ukulele", id: "other/ukulele"},
      ]}
      notes={props.notes}
    />
  )

};
