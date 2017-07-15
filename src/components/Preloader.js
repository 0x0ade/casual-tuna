require('styles/Preloader.scss');

import React from 'react';

import Audio from '../controllers/Audio.js';

class Preloader extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            finished: false,
            removed: false
        };
        Audio.init().then(() => {
            this.setState(state => {
                state.finished = true;
                return state;
            });
            return new Promise(resolve => setTimeout(resolve, 3000));
        }).then(() => {
            this.setState(state => {
                state.removed = true;
                return state;
            });
        });
    }

    render() {
        if (this.state.removed)
            return this.props.children;

        if (this.state.finished)
            return (
                <div className="preloader-wrapper">
                    {this.props.children}
                    <div className="preloader finished">
                        <div id="logo"></div>
                    </div>
                </div>
            );

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
