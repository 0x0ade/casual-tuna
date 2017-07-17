require('styles/Controls.scss');

import React from 'react';
import Button from './Button';
import ToggleButton from './ToggleButton';
import IconSlider from './Slider';
import 'rc-slider/assets/index.css';

class Controls extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let icon = require('../images/sound.png');
    return (
      <div className="controls">
        <IconSlider icon={icon} defaultValue={this.props.volume * 100} onChange={e => this.props.onChangeVolume(e / 100)}/>
        <ToggleButton onChange={e => this.props.onChangeSolo(e)} enabled={this.props.solo} externalState={true}>SOLO</ToggleButton>
        <Button onClick={e => this.props.onClear(e)}>CLEAR</Button>
      </div>
    );
  }
}

Controls.defaultProps = {
  onChangeVolume: value => {},
  onChangeSolo: value => {},
  onClear: () => {},
  solo: false,
  volume: 0.5
};

export default Controls;
