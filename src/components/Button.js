require('styles/Button.scss');

import React from 'react';
import Keys from './Keys';
import Controls from './Controls';

class Button extends React.Component {
  render() {
    return (
      <div className="button">
        {this.props.children}
      </div>
    );
  }
}

Button.defaultProps = {
  active: false,
};

export default Button;
