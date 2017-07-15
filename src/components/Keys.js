require('styles/Keys.scss');

import React from 'react';

import Audio from '../controllers/Audio';

class Keys extends React.Component {
  render() {
    let rows = [];
    for (let i = 0; i < this.props.notes; i++) {
      rows.push(<KeyColoumn
        module={this.props.module}
        pitches={this.props.pitches}
        time={i / this.props.notes * this.props.loop}
        loop={this.props.loop}
      />);
    }

    return (
      <div className="pitches">
        {rows}
      </div>
    );
  }
}

Keys.defaultProps = {
  module: null,
  pitches: 5,
  notes: 4,
  loop: 1
};

export default Keys;

class KeyColoumn extends React.Component {

  render() {
    let rows = [];
    for (let i = 0; i < this.props.pitches; i++) {
      rows.push(<Key module={this.props.module} note={this.props.pitches - i} time={this.props.time} loop={this.props.loop}/>);
    }
    return (
      <div className="column">
        {rows}
      </div>
    );

  }
}

KeyColoumn.defaultProps = {
  module: null,
  pitches: 5,
  time: 0,
  loop: 1
}

class Key extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        enabled: false,
        highlighted: false,
        loop: null
      }
    }

    enable() {
      this.setState(state => {
        state.enabled = true;
        state.loop = Audio.playLoop(`module:${this.props.module}`, this.props.note, this.props.time, this.props.loop);
        return state;
      });
    }

    disable() {
      this.setState(state => {
        state.enabled = false;
        state.loop.stop();
        return state;
      });
    }

    render() {
      if (this.state.enabled)
        return (<div className="key enabled" onClick={this.disable.bind(this)}></div>)
      if (this.state.highlighted)
        return (<div className="key highlighted" onClick={this.enable.bind(this)}></div>)
      return (<div className="key" onClick={this.enable.bind(this)}></div>)      
    }
}

Key.defaultProps = {
  module: null,
  note: 1,
  time: 0,
  loop: 1
}
