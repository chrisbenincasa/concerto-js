const React = require('react'),
      ReactDOM = require('react-dom'),
      $ = require('jquery'),
      q = require('q');

let Library = React.createClass({
    componentWillMount() {
        q($.getJSON('/', null)).then((resp) => console.log(resp));
    },
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