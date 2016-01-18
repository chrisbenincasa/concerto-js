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
                config: prefs.raw
            })
        });
    },
    getInitialState() {
        return {
            config: {},
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
                Chosen filepath = {this.state.chosenFilePath}
                <FileInput directory="true" onChange={this.handleDirectoryChosen} />
            </div>
        );
    }
});

//console.log('hehehehehe')

ReactDOM.render(
    <PreferencesPanel />,
    document.getElementById('preferences-panel')
);
