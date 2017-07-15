require('styles/Controls.scss');

import React from 'react';
import Button from './Button';
import IconSlider from './Slider';
import 'rc-slider/assets/index.css';

class Controls extends React.Component {
  render() {
    return (
      <div className="controls">
        <IconSlider/>
        <Button>SOLO</Button>
      </div>
    );
  }
}

Controls.defaultProps = {

};

export default Controls;
