require('styles/Timeline.scss');

import React from 'react';

class Timeline extends React.Component {
  render() {
    let measures = [];
    for(var i = 0; i < this.props.measures.length; i++){
      measures.push(<Measure active={this.props.measures[i]} />)
    }
    return (
      <div className="timeline">
        {measures}
      </div>
    );
  }
}

Timeline.defaultProps = {
  measures: [
    [false, false, false],
    [false, true, true],
    [true, true, false],
    [false, false, false],
    [false, true, false],
    [false, true, true],
    [false, false, false],
    [true, true, true],
    [true, true, true],
    [false, true, true],
    [false, true, true]
  ],
};

export default Timeline;

class Measure extends React.Component{
  render(){
    let lines = [];
    if(this.props.active[0]){
      lines.push(<div className="line" style={{"--color": "var(--color-green-light)"}}></div>);
    }else{
      lines.push(<div className="line" style={{"--color": "var(--color-faded)"}}></div>);
    }
    if(this.props.active[1]){
      lines.push(<div className="line" style={{"--color": "var(--color-red-light)"}}></div>);
    }else{
      lines.push(<div className="line" style={{"--color": "var(--color-faded)"}}></div>);
    }
    if(this.props.active[2]){
      lines.push(<div className="line" style={{"--color": "var(--color-blue-light)"}}></div>);
    }else{
      lines.push(<div className="line" style={{"--color": "var(--color-faded)"}}></div>);
    }

    return (
      <div className="measure">
        {lines}
      </div>
    );
  }
}

Measure.defaultProps = {
  active: [true, false, false]
};
