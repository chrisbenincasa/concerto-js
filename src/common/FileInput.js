(() => {
    const React = require('react'),
          ReactDOM = require('react-dom'),
          _ = require('underscore');

    const noop = function() {};

    var FileInput = React.createClass({
        getInitialState() {
            return {
                value: '',
                styles: {
                    parent: {
                        position: 'relative'
                    },
                    file: {
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        opacity: 0,
                        width: '100%',
                        zIndex: 1
                    },
                    text: {
                        position: 'relative',
                        zIndex: -1
                    }
                }
            }
        },
        handleChange(e) {
            this.setState({
                value: e.target.value.split(/(\\|\/)/g).pop()
            });

            if (this.props.onChange) {
                this.props.onChange(e);
            }
        },
        componentDidMount() {
            // Shim to allow custom attributes for directory support
            if (this.props.directory) {
                var children = _(ReactDOM.findDOMNode(this).children).chain();
                children.filter((node) => {
                    return node.nodeName === 'INPUT' && node.type === 'file';
                }).forEach((fileInput) => {
                    fileInput.setAttribute('directory', true);
                    fileInput.setAttribute('webkitdirectory', true);
                })
            }
        },
        render() {
            return (
                <div style={this.state.styles.parent}>
                    <input type="file"
                           name={this.props.name}
                           className={this.props.className}
                           onChange={this.handleChange}
                           disabled={this.props.disabled}
                           accept={this.props.accept}
                           style={this.state.styles.file}
                           multiple={this.props.multiple || this.props.directory}
                    />
                    <input type="text"
                           tabIndex="-1"
                           name={this.props.name + '_filename'}
                           value={this.state.value || this.props.value}
                           className={this.props.className}
                           onChange={noop}
                           placeholder={this.props.placeholder}
                           disabled={this.props.disabled}
                           style={this.state.styles.text}
                    />
                </div>
            );
        }
    });

    module.exports = FileInput;
})();