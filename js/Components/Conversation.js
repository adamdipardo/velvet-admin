var React = require('react');
var Fluxxor = require('fluxxor');
var VelvetLibrary = require('../VelvetLibrary');

var ReceiptModal = require('./ReceiptModal');
var GetMedicalProfileModal = require('./GetMedicalProfileModal');

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Conversation = React.createClass({

	mixins: [FluxMixin, StoreWatchMixin("ConversationStore")],

	getInitialState: function() {
		return {};
	},

	getStateFromFlux: function() {

		var ConversationStore = this.getFlux().store("ConversationStore").getState();

		return {
			messages: ConversationStore.messages,
			isLoadingSendReply: ConversationStore.isLoadingSendReply,
			sendReplySuccess: ConversationStore.sendReplySuccess,
			sendReplyFailure: ConversationStore.sendReplyFailure,
			number: ConversationStore.number,
			isLoadingSetName: ConversationStore.isLoadingSetName,
			showSendReceipt: ConversationStore.showSendReceipt,
			isLoadingGetMedicalProfileToken: ConversationStore.isLoadingGetMedicalProfileToken,
			medicalProfileToken: ConversationStore.medicalProfileToken
		};

	},

	handleReplyChange: function(e) {

		this.setState({replyMessage: e.target.value});

	},

	sendReply: function(e) {

		e.preventDefault();

		// get number id
		var numberId;
		$.each(this.state.messages, function(index, message) {
			numberId = message.number_id;
			return false;
		});

		this.getFlux().actions.ConversationActions.sendReply(numberId, this.state.replyMessage);

		this.setState({replyMessage: ''});

	},

	handleSetName: function() {

		var newName = window.prompt("Please enter a new name", this.state.number.name || "");
		var newEmail = window.prompt("Please enter a new email address", this.state.number.email || "");

		if (
			(newName != this.state.number.name || newEmail != this.state.number.email) &&
			newName &&
			newEmail)
		{
			if (newName && newName.trim() != "") {
				this.getFlux().actions.ConversationActions.setName(this.state.number._id, newName, newEmail);
			}
		}

	},

	componentDidUpdate: function() {

		$('ul.messages-list').scrollTop($('ul.messages-list')[0].scrollHeight);

	},

	handleReceiptModalClose: function() {

		this.getFlux().actions.ConversationActions.toggleSendReceipt(false);

	},

	handleReceiptClick: function() {

		this.getFlux().actions.ConversationActions.toggleSendReceipt(true);

	},

	handleGetMedicalProfileClick: function() {

		this.getFlux().actions.ConversationActions.getMedicalProfileToken(this.state.number.number);

	},

	handleGetMedicalProfileModalClose: function() {

		this.getFlux().actions.ConversationActions.closeGetMedicalProfileTokenModal();

	},

	render: function() {

		var messages = [];

		var lastMessageDay;
		$.each(this.state.messages, function(index, message) {
			if (lastMessageDay != message.created_at_day)
				messages.push(<li key={index + "_0"}><span className="date-div">{message.created_at_day}</span></li>);

			lastMessageDay = message.created_at_day;

			var classes = message.direction;
			messages.push(<li key={index} className={classes}><span className="message">{message.text_message}<span className="time">{message.created_at_nice}</span></span><div className="clearfix"></div></li>);
		});

		if (!messages.length) {
			return (
				<div></div>
			);
		}

		var sendButton = this.state.isLoadingSendReply ? <button type="submit" className="btn btn-primary" disabled="disabled">Sending...</button> : <button type="submit" className="btn btn-primary">Send</button>;

		var setNameLoadingIcon = this.state.isLoadingSetName ? <i className="fa fa-spin fa-cog"></i> : null;

		var formattedNumber = VelvetLibrary.formatNumber(this.state.number.number);
		var userName = this.state.number.name ? <span>{this.state.number.name} <small>{formattedNumber}</small></span> : formattedNumber;

		return (
			<div>
				<div className="title-bar">
					<h3>Messaging with {userName} <a onClick={this.handleSetName}>Set Name {setNameLoadingIcon}</a> <a onClick={this.handleReceiptClick}>Send Receipt</a> <a onClick={this.handleGetMedicalProfileClick}>Get Medical Profile</a></h3>
				</div>
				<ul className="messages-list">
					{messages}
				</ul>
				<form className="form reply-form" onSubmit={this.sendReply}>
				<div className="row">
					<div className="col-md-10"><input type="text" className="form-control" value={this.state.replyMessage} onChange={this.handleReplyChange} placeholder="Reply" /></div>
					<div className="col-md-2">{sendButton}</div>
				</div>
				</form>
				<ReceiptModal isOpen={this.state.showSendReceipt} handleClose={this.handleReceiptModalClose} defaultName={this.state.number.name || ""} defaultEmail={this.state.number.email || ""} />
				<GetMedicalProfileModal onClose={this.handleGetMedicalProfileModalClose} isLoading={this.state.isLoadingGetMedicalProfileToken} medicalProfileToken={this.state.medicalProfileToken} />
			</div>
		);

	}

});

module.exports = Conversation;