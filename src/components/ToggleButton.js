require('styles/Button.scss');

import React from 'react';
import Keys from './Keys';
import Controls from './Controls';

class ToggleButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      enabled: props.enabled
    }
  }

  toggle() {
    let enabled = !this.state.enabled;
    this.setState({
      enabled: enabled
    });
    this.props.onChange(enabled);
  }

  render() {
    return (
      <button className={"button" + (this.state.enabled ? " enabled" : "") + " " + this.props.className} style={this.props.style} onClick={this.toggle.bind(this)}>
        {this.props.children}
      </button>
    );
  }
}

ToggleButton.defaultProps = {
  enabled: false,
  onChange: (enabled) => {}
};

export default ToggleButton;
