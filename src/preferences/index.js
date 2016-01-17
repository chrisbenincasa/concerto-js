const React = require('react'),
      ReactDOM = require('react-dom');

var CommentBox = React.createClass({
    getInitialState() {
        return { name: 'dingus' }
    },
    handleNameChange(e) {
        this.setState({ name: e.target.value });
    },
    render() {
        return (
            <div className="commentBox">
                Hello, world! I am a {this.state.name}.
                <br />
                <input type="text"
                       placeholder="dingus"
                       value={this.state.name}
                       onChange={this.handleNameChange}
                />
            </div>
        );
    }
});

ReactDOM.render(
    <CommentBox />,
    document.getElementById('example')
);
