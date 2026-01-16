import React from "react";

class Clock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date()
        };
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        this.setState({
            date: new Date()
        });
    }

    render() {
        return (
            <div>
                <h2>Horloge</h2>
                <p>Date: {this.state.date.toLocaleDateString()}</p>
                <p>Heure: {this.state.date.toLocaleTimeString()}</p>
            </div>
        );
    }
}

export default Clock;
