require('styles/Keys.scss');

import React from 'react';
import Audio from '../controllers/Audio';

class Keys extends React.Component {
  render() {
    let rows = [];
    for (let i = 0; i < this.props.notes; i++) {
      rows.push(<KeyColoumn
        pitches={this.props.pitches}
        time={i / this.props.notes * this.props.loop}
        loop={this.props.loop}
        onChange={(enabled, note, time) => this.props.onChange(enabled, note, time, this.props.loop)}
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
  onChange: (enabled, note, time, loop) => {},
  pitches: 5,
  notes: 4,
  loop: 1
};

export default Keys;

class KeyColoumn extends React.Component {
  onBar;

  constructor(props) {
    super(props);

    this.state = {
      highlighted: false
    };

    Audio.onBar.push(this.onBar = b => {
      b = b % (this.props.loop || Audio.loopLength)
      let isOnBar = this.props.time <= b && b < this.props.time + 0.25;
      if (!isOnBar && this.state.highlighted)
        this.setState(state => {
          state.highlighted = false;
        });
      else if (isOnBar && !this.state.highlighted)
        this.setState(state => {
          state.highlighted = true;
        });
    });
  }

  componentWillUnmount() {
    Audio.onBar.splice(Audio.onBar.indexOf(this.onBar), 1);
  }

  render() {
    let rows = [];
    for (let i = 0; i < this.props.pitches; i++) {
      rows.push(<Key
        module={this.props.module} note={this.props.pitches - i}
        onChange={(enabled, note) => this.props.onChange(enabled, note, this.props.time)}
      />);
    }
    if (this.state.highlighted) {
      return (
        <div className="column highlighted">
          {rows}
        </div>
      );
    }
    return (
      <div className="column">
        {rows}
      </div>
    );

  }
}

KeyColoumn.defaultProps = {
  onChange: (enabled, note, time) => {},
  pitches: 5,
  time: 0,
  loop: 1
}

class Key extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        enabled: false,
        highlighted: false
      }
    }

    enable() {
      this.setState(state => {
        state.enabled = true;
        this.props.onChange(true, this.props.note);
        return state;
      });
    }

    disable() {
      this.setState(state => {
        state.enabled = false;
        this.props.onChange(false, this.props.note);
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
  onChange: (enabled, note) => {},
  note: 1
}
