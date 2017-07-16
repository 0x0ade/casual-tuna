require('styles/ClickMich.scss');

import React from 'react';

class ClickMich extends React.Component {
  render() {
    return (
      <img className="clickmich" alt="Click mich!" src={require("../images/clickme.png")}/>
    );
  }
}

ClickMich.defaultProps = {
};

export default ClickMich;
