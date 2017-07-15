require('styles/Controls.scss');

import React from 'react';
import Button from './Button';
import IconSlider from './Slider';
import 'rc-slider/assets/index.css';

class Controls extends React.Component {
  test(e){
    console.log(e);
  }
  render() {
    let icon = require("../images/audio.svg");
    return (
      <div className="controls">
        <IconSlider icon={icon} onChange={this.test}/>
        <Button>SOLO</Button>
      </div>
    );
  }
}

Controls.defaultProps = {

};

export default Controls;
