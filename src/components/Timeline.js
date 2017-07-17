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
      selected: 0
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
      if (measure != null)
        measure[0] = true;
      return 0;

      case 'Bass':
      if (measure != null)
        measure[1] = true;
      return 1;

      case 'Keyboard':
      if (measure != null)
        measure[2] = true;
      return 2;
    }

    return -1;
  }

  parseMeasure(loops) {
    var measure = [false, false, false];
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
  }

  onChangeMute(e) {
    Audio.masterGain.gain.value = e ? 0 : 1;
  }

  onChangeSpeed(v) {
    Audio.bpm = 100 + 4 * v;
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
            ><img alt="play / pause timeline" src={require("../images/play.png")}/></ToggleButton>
          <ToggleButton
            className="mini"
            style={buttonStyle}
            onChange={this.onChangeMute.bind(this)}
            ><img alt="mute" src={require("../images/mute.png")}/></ToggleButton>
          <IconSlider
            icon={require("../images/tempo.png")}
            onChange={this.onChangeSpeed.bind(this)}
          />
        </div>
      </div>
    );
  }
}

Timeline.defaultProps = {
  
};

export default Timeline;

class Measure extends React.Component{
  render(){
    let lines = [];
    if(this.props.active[0]){
      lines.push(<div key="a" className="line" style={{"--color": "var(--color-green-light)"}}></div>);
    }else{
      lines.push(<div key="b" className="line" style={{"--color": "var(--color-faded)"}}></div>);
    }
    if(this.props.active[1]){
      lines.push(<div key="c" className="line" style={{"--color": "var(--color-red-light)"}}></div>);
    }else{
      lines.push(<div key="d" className="line" style={{"--color": "var(--color-faded)"}}></div>);
    }
    if(this.props.active[2]){
      lines.push(<div key="e" className="line" style={{"--color": "var(--color-blue-light)"}}></div>);
    }else{
      lines.push(<div key="f" className="line" style={{"--color": "var(--color-faded)"}}></div>);
    }

    return (
      <div className={this.props.className + " measure"} onClick={() => this.props.onSelect(this.props.index)}>
        {lines}
      </div>
    );
  }
}

Measure.defaultProps = {
  active: [false, false, false],
  onSelect: (i) => {},
  index: 0
};
