const React = require('react'),
      ReactDOM = require('react-dom'),
      update = require('react-addons-update'),
      FileInput = require('../common/FileInput'),
      $ = require('jquery');

var PreferencesPanel = React.createClass({
    componentDidMount() {
        let self = this;

        $.ajax({
            url: 'http://localhost:3000/preferences',
            method: 'GET',
            dataType: 'json'
        }).then((prefs) => {
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
    saveConfig() {
        $.ajax({
            url: 'http://localhost:3000/preferences',
            method: 'POST',
            data: this.state.config
        });
    },
    handleDirectoryChosen(e) {
        let newState = update(this.state, {
            config: {
                directory: { $set: e.target.files[0].path }
            }
        });

        this.setState(newState);
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
                Chosen filepath = {this.state.config.directory}
                <FileInput directory="true" onChange={this.handleDirectoryChosen} value={this.state.config.directory} />
                <div>
                    <button onClick={this.saveConfig}>Apply</button>
                </div>
            </div>
        );
    }
});

ReactDOM.render(
    <PreferencesPanel />,
    document.getElementById('preferences-panel')
);
