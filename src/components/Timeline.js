require('styles/Timeline.scss');

import React from 'react';
import Audio from '../controllers/Audio';
import Button from './Button';
import ToggleButton from './ToggleButton';
import IconSlider from './Slider';

class Timeline extends React.Component {
  constructor(props) {
    super(props);

    let measures = [];
    Audio.timeline.forEach(loops => measures.push(this.parseMeasure(loops)));
    measures[Audio.currentTimeline] = this.parseMeasure(Audio.loops);

    this.state = {
      measures: measures,
      selected: Audio.currentTimeline,
      playing: !Audio.timelinePaused,
      muted: Audio.masterGain.gain.value == 0,
      speed: (Audio.bpm - 100) / 4
    }

    this.onSetTimeline = this.onSetTimeline.bind(this);
    Audio.onSetTimeline.push(this.onSetTimeline);

    this.onUpdateLoop = this.onUpdateLoop.bind(this);
    Audio.onUpdateLoop.push(this.onUpdateLoop);
  }

  componentWillUnmount() {
    Audio.onSetTimeline.splice(Audio.onSetTimeline.indexOf(this.onSetTimeline), 1);
    Audio.onUpdateLoop.splice(Audio.onUpdateLoop.indexOf(this.onUpdateLoop), 1);
  }

  parseInfo(info, measure) {
    if (!info.name.startsWith('module:'))
      return -1;
    
    switch (info.name.substr('module:'.length)) {
      case 'Drums':
      if (measure != null && measure.length > 0)
        measure[0] = true;
      return 0;

      case 'Bass':
      if (measure != null && measure.length > 1)
        measure[1] = true;
      return 1;

      case 'Keyboard':
      case 'Lead':
      if (measure != null && measure.length > 2)
        measure[2] = true;
      return 2;

      case 'Chords':
      if (measure != null && measure.length > 3)
        measure[3] = true;
      return 3;
    }

    return -1;
  }

  parseMeasure(loops) {
    var measure = Array(this.props.rows).fill().map((e, i) => false);
    loops.forEach(info => this.parseInfo(info, measure));
    return measure;
  }

  onSetTimeline = i => {
    this.setState({
      selected: i
    });
  }

  onUpdateLoop = loops => {
    this.state.measures[Audio.currentTimeline] = this.parseMeasure(loops);
    this.forceUpdate();
  }

  onSelect(i) {
    Audio.setTimeline(i);
  }

  onChangePlay(e) {
    if (e)
      Audio.bOffset -= Audio.b;
    Audio.timelinePaused = !e;
    this.state.playing = !e; // Don't rerender.
  }

  onChangeMute(e) {
    Audio.masterGain.gain.value = e ? 0 : 1;
    this.state.muted = e; // Don't rerender.
  }

  onChangeSpeed(v) {
    Audio.bpm = 100 + 4 * v;
    this.state.speed = v; // Don't rerender.
  }

  render() {
    let buttonStyle = {"--color-light": "rgba(255, 255, 255, 0.5)", "width": "32px"};
    let measures = [];
    for (var i = 0; i < this.state.measures.length; i++){
      if (i == this.state.selected)
        measures.push(<Measure className="enabled" key={i} index={i} active={this.state.measures[i]} onSelect={this.onSelect.bind(this)} />);
      else
        measures.push(<Measure key={i} index={i} active={this.state.measures[i]} onSelect={this.onSelect.bind(this)} />);      
    }
    return (
      <div className="timeline">
        <div className="measures">
          {measures}
        </div>
        <div className="controls">
          <ToggleButton
            className="mini"
            style={buttonStyle}
            onChange={this.onChangePlay.bind(this)}
            enabled={this.state.playing}
            ><img alt="play / pause timeline" src={require("../images/play.png")}/></ToggleButton>
          <ToggleButton
            className="mini"
            style={buttonStyle}
            onChange={this.onChangeMute.bind(this)}
            enabled={this.state.muted}
            ><img alt="mute" src={require("../images/mute.png")}/></ToggleButton>
          <IconSlider
            icon={require("../images/tempo.png")}
            defaultValue={this.state.speed}
            onChange={this.onChangeSpeed.bind(this)}
          />
        </div>
      </div>
    );
  }
}

Timeline.defaultProps = {
  rows: 4
};

export default Timeline;

class Measure extends React.Component{
  render(){
    let lines = [];
    let colors = ["green", "red", "blue", "yellow"];
    for (let i = 0; i < this.props.active.length; i++)
      if (this.props.active[i])
        lines.push(<div key={i} className="line" style={{"--color": `var(--color-${colors[i]}-light)`}}></div>);
      else
        lines.push(<div key={i} className="line" style={{"--color": "var(--color-faded)"}}></div>);

    return (
      <div className={((this.props.className || "") + " measure").trim()} onClick={() => this.props.onSelect(this.props.index)}>
        {lines}
      </div>
    );
  }
}

Measure.defaultProps = {
  active: [false, false, false, false],
  onSelect: (i) => {},
  index: 0
};
