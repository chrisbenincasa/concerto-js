var React = require('react'),
    ReactDOM = require('react-dom');

var CommentBox = React.createClass({
    render() {
        return (
            <div className="commentBox">
                Hello, world! I am a CommentBox.
            </div>
        );
    }
});

console.log('hey')

ReactDOM.render(
    <CommentBox />,
    document.getElementById('example')
);