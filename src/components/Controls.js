require('styles/Controls.scss');

import React from 'react';
import Button from './Button';
import IconSlider from './Slider';
import 'rc-slider/assets/index.css';

class Controls extends React.Component {
  constructor(props) {
    super(props);

    props.onChangeVolume(0.5); // Default value.
  }

  render() {
    let icon = require('../images/sound.png');
    return (
      <div className="controls">
        <IconSlider icon={icon} onChange={e => this.props.onChangeVolume(e / 100)}/>
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
