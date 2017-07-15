require('styles/Modul.scss');

import React from 'react';
import Keys from './Keys';
import Controls from './Controls';

class Modul extends React.Component {
  render() {
    let style = {
      "--color": this.props.color
    };
    return (
      <div className="modul" style={style}>
        <h4>{this.props.name}</h4>
        <Controls />
        <Keys pitches={5} note={4}/>
      </div>
    );
  }
}

Modul.defaultProps = {
  name: "Modulname",
  color: "var(--color-blue)"
};

export default Modul;
