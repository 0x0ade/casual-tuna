require('styles/Controls.scss');

import React from 'react';
import Button from './Button';

class Controls extends React.Component {
  render() {
    return (
      <div className="controls">
        <input type="range" onChange={e => this.props.onChangeVolume(e.target.value / 100)}/>
        <Button onChange={e => this.props.onChangeSolo(e.target.value)}>SOLO</Button>
      </div>
    );
  }
}

Controls.defaultProps = {
  onChangeVolume: value => {},
  onChangeSolo: value => {}
};

export default Controls;
