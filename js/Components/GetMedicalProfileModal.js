var React = require('react');
var Fluxxor = require('fluxxor');
var VelvetLibrary = require('../VelvetLibrary');
var Modal = require('react-modal');

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var GetMedicalProfileModal = React.createClass({

	getInitialState: function() {

		return {
			isCopied: false
		};

	},

	handleCopy: function() {

		this.refs.profileTokenField.getDOMNode().select();
		if (document.execCommand('copy')) {
			this.setState({isCopied: true});
		}

	},

	render: function() {

		if (this.props.isLoading) {
			return (<Modal isOpen={this.props.isLoading} className="Modal__Bootstrap modal-dialog loading-modal">
					<p style={{textAlign: 'center'}}><i className="fa fa-cog fa-spin"></i></p>
				</Modal>);
		}

		if (this.props.medicalProfileToken) {
			return (<Modal isOpen={this.props.medicalProfileToken} onRequestClose={this.props.onClose} className="Modal__Bootstrap modal-dialog token-modal">
					<input type="text" readonly="readonly" className="form-control profile-token" value={"https://tryvelvet.com/medical.html?token=" + this.props.medicalProfileToken} ref="profileTokenField"/>
					<div>
						<a onClick={this.props.onClose} className="btn btn-default">Close</a>
						<a onClick={this.handleCopy} className="btn btn-primary">{this.state.isCopied ? "Copied!" : "Copy to Clipboard"}</a>
					</div>
				</Modal>)
		}

		return (<div></div>);

	}

});

module.exports = GetMedicalProfileModal;