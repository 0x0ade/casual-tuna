require('styles/Timeline.scss');

import React from 'react';
import Audio from '../controllers/Audio';
import Button from './Button'
import ToggleButton from './ToggleButton'

class Timeline extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      measures: [
        [false, false, false],
        [false, false, false],
        [false, false, false],
        [false, false, false],
        [false, false, false],
        [false, false, false],
        [false, false, false],
        [false, false, false],
        [false, false, false],
        [false, false, false]
      ],
      selected: 0
    }

    Audio.onSetTimeline.push(i => this.setState({
      selected: i
    }));

    this.onUpdateLoop = this.onUpdateLoop.bind(this);
    Audio.onUpdateLoop.push(this.onUpdateLoop);
  }

  componentWillUnmount() {
    Audio.onUpdateLoop.splice(Audio.onUpdateLoop.indexOf(this.onUpdateLoop), 1);
  }

  onUpdateLoop = (loops) => {
    var values = [false, false, false];
    loops.forEach(info => {
      switch (info.name.substr('module:'.length)) {
        case 'Drums':
        values[0] = true;
        break;

        case 'Bass':
        values[1] = true;
        break;

        case 'Keyboard':
        values[2] = true;
        break;
      }
    });
    this.state.measures[Audio.currentTimeline] = values;
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

  render() {
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
            className="mini" onChange={this.onChangePlay.bind(this)}
            style={{"--color-light": "rgba(255, 255, 255, 0.5)", "width": "32px"}}
            onChange={this.onChangePlay.bind(this) }
            ><img alt="play / pause" src={require("../images/play.png")}/></ToggleButton>
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
  active: [true, false, false],
  onSelect: (i) => {},
  index: 0
};
