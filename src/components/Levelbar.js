require('styles/Levelbar.scss');

import React from 'react';

class Levelbar extends React.Component {
  render() {
    return (
      <div className="levelbar">
        <div className="scorebar-wrap"><div className="scorebar"></div></div>
      </div>
    );
  }
}

Levelbar.defaultProps = {
  level: 0,
  score: 0,
  scoreMax: 100
};

export default Levelbar;
