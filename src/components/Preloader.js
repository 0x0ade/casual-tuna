require('styles/Preloader.scss');

import React from 'react';

import Audio from '../controllers/Audio.js';

class Preloader extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            finished: false
        };
        Audio.init().then(() => this.setState(state => {
            state.finished = true;
            return state;
        }));
    }

    render() {
        if (this.state.finished)
            return this.props.children;

        return (
            <div className="preloader">
                <div id="logo"></div>
            </div>
        );
    }
}

Preloader.defaultProps = {
};

export default Preloader;
