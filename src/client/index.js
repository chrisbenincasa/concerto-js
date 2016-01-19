const React = require('react'),
      ReactDOM = require('react-dom');

let Library = React.createClass({
    render() {
        return (
            <div>
                <h1>Library</h1>
            </div>
        );
    }
});

ReactDOM.render(
    <Library />,
    document.getElementById('library')
);