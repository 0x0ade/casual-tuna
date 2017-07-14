require('styles/Modul.scss');

import React from 'react';
import Keys from './Keys';
import Controls from './Controls';

class Modul extends React.Component {
  render() {
    return (
      <div className="modul">
        <h4>{this.props.name}</h4>
        <Controls />
        <Keys pitches={5} note={4}/>
      </div>
    );
  }
}

Modul.defaultProps = {
  name: "Modulname"
};

export default Modul;
