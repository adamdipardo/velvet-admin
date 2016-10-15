var React = require('react');
var Fluxxor = require('fluxxor');
var VelvetLibrary = require('../VelvetLibrary');

var Modal = require('react-modal');

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var ReceiptModal = React.createClass({

	mixins: [FluxMixin, StoreWatchMixin("ConversationStore")],

	getInitialState: function() {
		return {
			errors: [],
			clientName: this.props.defaultName,
			clientEmail: this.props.defaultEmail
		};
	},

	getStateFromFlux: function() {

		var ConversationStore = this.getFlux().store("ConversationStore").getState();

		return {
			isLoadingSendReceipt: ConversationStore.isLoadingSendReceipt,
			sendReceiptError: ConversationStore.sendReceiptError
		};

	},

	handleFormChange: function(e) {

		var newProperty = {};
		newProperty[e.target.name] = e.target.value;
		this.setState(newProperty);

	},

	handleSubmit: function(e) {

		e.preventDefault();

		var errors = [];

		if (!this.state.clientName ||
			!this.state.clientEmail ||
			!this.state.rmtName ||
			!this.state.rmtNumber ||
			!this.state.description ||
			!this.state.date ||
			!this.state.amount ) {
			errors.push("Please fill in all fields");
		}

		if (!/@/.test(this.state.clientEmail)) {
			errors.push("Please enter a valid Client Email");
		}

		if (!/\d+(?:\.{1}\d+)?/.test(this.state.amount)) {
			errors.push("Please enter a numeric Amount");
		}

		this.setState({errors: errors});

		if (!errors.length) {

			this.getFlux().actions.ConversationActions.sendReceipt(this.state.clientName, this.state.clientEmail, this.state.rmtName, this.state.rmtNumber, this.state.description, this.state.date, this.state.amount);

		}

	},

	componentWillReceiveProps: function(nextProps) {

		if (this.props.isOpen == false && nextProps.isOpen == true) {
			this.setState({
				clientName: nextProps.defaultName,
				clientEmail: nextProps.defaultEmail,
				rmtName: "",
				rmtNumber: "",
				description: "",
				date: "",
				amount: null
			});
		}

	},

	render: function() {

		var sendButton;
		if (this.state.isLoadingSendReceipt)
			sendButton = <button type="submit" disabled className="btn btn-primary btn-lg">Sending&hellip;</button>;
		else
			sendButton = <button type="submit" className="btn btn-primary btn-lg"><i className="fa fa-envelope-o"></i> Send Receipt</button>;

		var errorMessages = [];
		for (var i = 0; i < this.state.errors.length; i++) {
			errorMessages.push(<p className="text-danger"><i className="fa fa-exclamation-triangle"></i> {this.state.errors[i]}</p>);
		}

		if (this.state.sendReceiptError) {
			errorMessages.push(<p className="text-danger"><i className="fa fa-exclamation-triangle"></i> {this.state.sendReceiptError}</p>);
		}

		return (<Modal isOpen={this.props.isOpen} onRequestClose={this.props.handleClose} className="Modal__Bootstrap modal-dialog">
			<form className="form" onSubmit={this.handleSubmit}>
				<div className="form-group">
					<label htmlFor="clientName">Client Name</label>
					<input type="text" name="clientName" id="clientName" value={this.state.clientName} onChange={this.handleFormChange} className="form-control" />
				</div>
				<div className="form-group">
					<label htmlFor="clientEmail">Client Email</label>
					<input type="email" name="clientEmail" id="clientEmail" value={this.state.clientEmail} onChange={this.handleFormChange} className="form-control" />
				</div>
				<div className="form-group">
					<label htmlFor="rmtName">RMT Name</label>
					<input type="text" name="rmtName" id="rmtName" value={this.state.rmtName} onChange={this.handleFormChange} className="form-control" />
				</div>
				<div className="form-group">
					<label htmlFor="rmtNumber">RMT Number</label>
					<input type="text" name="rmtNumber" id="rmtNumber" value={this.state.rmtNumber} onChange={this.handleFormChange} className="form-control" />
				</div>
				<div className="form-group">
					<label htmlFor="description">Description</label>
					<input type="text" name="description" id="description" value={this.state.description} onChange={this.handleFormChange} className="form-control" />
				</div>
				<div className="form-group">
					<label htmlFor="date">Date</label>
					<input type="text" name="date" id="date" value={this.state.date} onChange={this.handleFormChange} className="form-control" />
				</div>
				<div className="form-group">
					<label htmlFor="amount">Amount</label>
					<div className="input-group">
						<span className="input-group-addon">$</span>
						<input type="number" name="amount" id="amount" value={this.state.amount} onChange={this.handleFormChange} className="form-control" />
					</div>
				</div>
				<div className="form-group">
					{errorMessages}
				</div>
				<div className="form-group">
					<div className="row">
						<div className="col-md-6">
							{sendButton}
						</div>
						<div className="col-md-6">
							<a onClick={this.props.handleClose} className="btn btn-default btn-lg">Cancel</a>
						</div>
					</div>
				</div>
			</form>
		</Modal>);

	}

});

module.exports = ReceiptModal;