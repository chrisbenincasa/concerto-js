const React = require('react'),
      ReactDOM = require('react-dom'),
      fs = require('fs'),
      UserPreferences = require('./userPreferences'),
      FileInput = require('../common/FileInput');

var PreferencesPanel = React.createClass({
    componentDidMount() {
        let self = this;

        UserPreferences.getGlobalPreferences().then((prefs) => {
            self.setState({
                loading: false,
                config: prefs.raw,
                lastConfig: prefs.raw
            });
        });
    },
    getInitialState() {
        return {
            lastConfig: {},
            config: {},
            loading: true
        }
    },
    handleDirectoryChosen(e) {
        this.setState({ config: { chosenFilePath: e.target.files[0].path }});
    },
    handleApply() {
        let self = this;
        let prefs = {
            chosenFilePath: this.state.chosenFilePath
        };

        UserPreferences.saveGlobalPreferences(prefs).then((newPrefs) => {
            self.setState({ config: newPrefs.raw });
        });
    },
    render() {
        let loading;

        if (this.state.loading) {
            loading = 'Loading....';
        } else {
            loading = 'Loading complete!';
        }

        return (
            <div className="preferences-container">
                {loading}
                <br/>
                Chosen filepath = {this.state.config.chosenFilePath}
                <FileInput directory="true" onChange={this.handleDirectoryChosen} value={this.state.config.chosenFilePath} />
                <div>
                    <button onClick={this.handleApply}>Apply</button>
                </div>
            </div>
        );
    }
});

ReactDOM.render(
    <PreferencesPanel />,
    document.getElementById('preferences-panel')
);
