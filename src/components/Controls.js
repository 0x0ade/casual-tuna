require('styles/Controls.scss');

import React from 'react';
import Button from './Button';
import IconSlider from './Slider';
import 'rc-slider/assets/index.css';

class Controls extends React.Component {
  render() {
    let icon = require("../images/audio.svg");
    return (
      <div className="controls">
        <IconSlider icon={icon} onChange={e => this.props.onChangeVolume(e.target.value / 100)}/>
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
