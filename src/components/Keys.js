require('styles/Keys.scss');

import React from 'react';
import Audio from '../controllers/Audio';

class Keys extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let columns = [];
    for (let i = 0; i < this.props.notes; i++) {
      columns.push(<KeyColoumn
        key={i} // Required by react.
        pitches={this.props.pitches}
        time={i / this.props.notes * this.props.loop}
        loop={this.props.loop}
        values={this.props.values[i]}
        onChange={(enabled, note, time) => this.props.onChange(enabled, note, time, this.props.loop)}
      />);
    }

    return (
      <div className="pitches">
        {columns}
      </div>
    );
  }
}

Keys.defaultProps = {
  onChange: (enabled, note, time, loop) => {},
  pitches: 5,
  notes: 4,
  loop: 1,
  values: [
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, false, false, false, false]]
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
        key={i} // Required by react.
        module={this.props.module} note={this.props.pitches - i}
        enabled={this.props.values[this.props.pitches - i - 1]}
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
  loop: 1,
  values: [false, false, false, false, false]
}

class Key extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        highlighted: false
      }
    }

    enable() {
      this.props.onChange(true, this.props.note);
    }

    disable() {
      this.props.onChange(false, this.props.note);
    }

    render() {
      if (this.props.enabled)
        return (<div className="key enabled" onClick={this.disable.bind(this)}></div>)
      if (this.props.highlighted)
        return (<div className="key highlighted" onClick={this.enable.bind(this)}></div>)
      return (<div className="key" onClick={this.enable.bind(this)}></div>)      
    }
}

Key.defaultProps = {
  onChange: (enabled, note) => {},
  note: 1,
  enabled: false
}
