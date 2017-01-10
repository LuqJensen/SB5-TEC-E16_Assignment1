class Clock extends React.Component {
    constructor(props) {
        super(props);
        this.state = { timer : props.updateInterval };
    }

    componentDidMount() {
        this.timerID = setInterval(() => this.tick(), 1000 );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        this.setState(function(prevState, props) {
            var timer = prevState.timer - 1;
            if (timer <= 0)
            {
                timer = props.updateInterval;
                if (props.callback)
                    props.callback();
            }
            return { timer : timer }
        });
    }

    render() {
        return (
            <label>{this.state.timer}</label>
        );
    }
}

class ClockCheckContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = { checked : false };
    }

    checkBoxClicked() {
        // https://facebook.github.io/react/docs/state-and-lifecycle.html#state-updates-may-be-asynchronous
        this.setState(function(prevState, props) {
            return {
                checked : !prevState.checked
            }
        });
    }

    render() {
        return (
            <div>
                <div className="checkbox-inline">
                    {/* Inline reactjs styling using js objects rather than css.
                        https://facebook.github.io/react/docs/dom-elements.html#style
                        http://stackoverflow.com/questions/26882177/react-js-inline-style-best-practices */}
                    <label style={{marginRight: "10px"}}>
                        {/* Event binding and variable binding: http://stackoverflow.com/questions/33840150/onclick-doesnt-render-new-react-component
                            Bind 'this' to the event handler in order to access state: https://facebook.github.io/react/docs/handling-events.html*/}
                        <input type="checkbox" title={this.props.description.title} checked={this.state.checked} onClick={this.checkBoxClicked.bind(this)}/>
                        { this.props.description.text }
                    </label>
                    {/* https://facebook.github.io/react/docs/conditional-rendering.html */}
                    { this.state.checked &&
                        <Clock updateInterval={this.props.updateInterval} callback={this.props.callback} />
                    }
                </div>
            </div>
        );
    }
}

class InputGroup extends React.Component {
    constructor(props) {
        super(props);
        this.state = { inputValue: "" };
    }

    // http://stackoverflow.com/questions/27827234/keypress-event-handling-in-reactjs
    onKeyPress = (e) => {
        if (e.key == 'Enter')
            this.sendOnClick();
    }

    sendOnClick() {
        $.post(this.props.url, this.state.inputValue, () => {
            this.setState({ inputValue: "" });
        });
    }

    handleChange(e) {
        this.setState({ inputValue: e.target.value });
    }

    render() {
        return (
            <div className="input-group">
                <input className="form-control" placeholder="Write something..." value={this.state.inputValue} onChange={this.handleChange.bind(this)} onKeyPress={this.onKeyPress}></input>
                <span className="input-group-btn">
                    <button className="btn btn-success" onClick={this.sendOnClick.bind(this)}>Send</button>
                </span>
                {/* In practice this should probably be associated with the output area, but i wanted to show the input-group as a reusable component... */}
                <span className="input-group-btn">
                    <button className="btn btn-info" onClick={this.props.getCallback}>Get messages</button>
                </span>
            </div>
        );
    }
}

// Keep usage specific variable values out of the components for higher reusability: https://facebook.github.io/react/docs/components-and-props.html#extracting-components
const autoUpdate = {
    updateInterval: 5,
    description: {
        text: "Auto update messages",
        title: "Fetch new messages automatically"
    }
};

const url = "http://localhost:9998/resources/messages";

class ReactChatApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = { messagesValue: "" };
        // Used twice so bind it here.
        this.getMessages = this.getMessages.bind(this);
    }

    getMessages() {
        var classRef = this; // Apparantly $.get replaces 'this' but $.post does not...

        $.get(url, function (data) {
            var output = "";
            data.forEach(function(v)
            {
                output += v + "\n\n";
            });

            classRef.setState({ messagesValue: output });
        });
    }

    render() {
        return (
            <div>
                <ClockCheckContainer updateInterval={autoUpdate.updateInterval} callback={this.getMessages} description={autoUpdate.description} />
                {/* Difficult to componentize this part. Ideally InputGroup would be componentized without the GET button,
                and the GET button would be componentized with the textarea, and a third component 'ChatArea' would join the two.*/}
                <textarea className="form-control" rows="25" cols="50" value={this.state.messagesValue} readOnly></textarea>
                <InputGroup url={url} getCallback={this.getMessages} />
            </div>
        );
    }
}

ReactDOM.render(
    <ReactChatApp />,
    document.getElementById('root')
);