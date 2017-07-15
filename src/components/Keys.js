require('styles/Keys.scss');

import React from 'react';

class Keys extends React.Component {
  render() {
    let rows = [];
    for (var i=0; i < this.props.notes; i++) {
      rows.push(<KeyColoumn></KeyColoumn>);
    }

    return (
      <div className="pitches">
        {rows}
      </div>
    );
  }
}

Keys.defaultProps = {
  pitches: 5,
  notes: 4
};

export default Keys;

class KeyColoumn extends React.Component{

  render(){
    let rows = [];
    for (var i=0; i < this.props.pitches; i++) {
      rows.push(<div className="key" key={i}></div>);
    }
    return (
      <div className="column">
        {rows}
      </div>
    );

  }
}

KeyColoumn.defaultProps = {
  pitches: 5
}
