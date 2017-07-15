require('styles/IconSlider.scss');

import React from 'react';
import Slider from 'rc-slider';

class IconSlider extends React.Component {
  changeEvent(e){
    this.props.onChange(e);
  }

  render() {
    return (
      <div className="icon-slider">
        <Slider min={0} max={100} defaultValue={50} onChange={this.changeEvent.bind(this)} />
        <img className="icon" src={this.props.icon} />
      </div>
    );
  }
}

IconSlider.defaultProps = {
  icon: require("../images/sound.png")
};

export default IconSlider;
