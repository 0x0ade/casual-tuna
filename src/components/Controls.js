require('styles/Controls.scss');

import React from 'react';
import Button from './Button';

class Controls extends React.Component {
  changeInstrument(e) {
    Audio.setInstrument(this.props.module, e.target.value);
  }

  render() {
    return (
      <div className="controls">
        <input type="range"/>
        <Button>SOLO</Button>
      </div>
    );
  }
}

Controls.defaultProps = {
};

export default Controls;
