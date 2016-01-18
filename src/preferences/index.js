const React = require('react'),
      ReactDOM = require('react-dom'),
      FileInput = require('../common/FileInput');

var PreferencesPanel = React.createClass({
    getInitialState() {
        return {
            chosenFilePath: '',
            loading: true
        }
    },
    handleNameChange(e) {
        this.setState({ name: e.target.value });
    },
    handleDirectoryChosen(e) {
        this.setState({ chosenFilePath: e.target.files[0].path });
    },
    render() {
        return (
            <div className="preferences-container">
                Chosen filepath = {this.state.chosenFilePath}
                <FileInput directory="true" onChange={this.handleDirectoryChosen} />
            </div>
        );
    }
});

ReactDOM.render(
    <PreferencesPanel />,
    document.getElementById('preferences-panel')
);
