require('styles/IconSlider.scss');

import React from 'react';
import Slider from 'rc-slider';

class IconSlider extends React.Component {
  render() {
    return (
      <div className="icon-slider">
        <Slider min={0} max={100} />
        <img className="icon"/>
      </div>
    );
  }
}

IconSlider.defaultProps = {

};

export default IconSlider;
