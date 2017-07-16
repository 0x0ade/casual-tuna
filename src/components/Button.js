require('styles/Button.scss');

import React from 'react';
import Keys from './Keys';
import Controls from './Controls';

class Button extends React.Component {
  render() {
    return (
      <button className="button" onClick={this.props.onClick} style={this.props.style}>
        {this.props.children}
      </button>
    );
  }
}

Button.defaultProps = {
  enabled: false,
  onClick: () => {}
};

export default Button;
