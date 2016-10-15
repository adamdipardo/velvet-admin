var Fluxxor = require('fluxxor');
var VelvetConstants = require('../VelvetConstants');
var moment = require('moment');

var ConversationStore = Fluxxor.createStore({
	initialize: function() {
		this.messages = {};
		this.number = {};
		this.isLoadingMessages = false;
		this.loadingMessagesError = null;
		this.isLoadingSendReply;
		this.sendReplySuccess = false;
		this.sendReplyError = null;
		this.isLoadingSetName = false;
		this.setNameError = null;
		this.isLoadingSendReceipt = false;
		this.sendReceiptError = null;
		this.showSendReceipt = false;
		this.isLoadingGetMedicalProfileToken = false;
		this.medicalProfileToken = "";

		this.bindActions(
			VelvetConstants.LOADING_MESSAGES, this.onLoadingMessages,
			VelvetConstants.LOADING_MESSAGES_SUCCESS, this.onLoadingMessagesSuccess,
			VelvetConstants.LOADING_MESSAGES_FAILURE, this.onLoadingMessagesFailure,
			VelvetConstants.NEW_MESSAGE, this.onNewMessage,
			VelvetConstants.LOADING_SEND_REPLY, this.onLoadingSendReply,
			VelvetConstants.LOADING_SEND_REPLY_SUCCESS, this.onLoadingSendReplySuccess,
			VelvetConstants.LOADING_SEND_REPLY_FAILURE, this.onLoadingSendReplyFailure,
			VelvetConstants.NEW_NAME, this.onNewName,
			VelvetConstants.LOADING_SET_NAME, this.onLoadingSetName,
			VelvetConstants.LOADING_SET_NAME_SUCCESS, this.onLoadingSetNameSuccess,
			VelvetConstants.LOADING_SET_NAME_FAILURE, this.onLoadingSetNameFailure,
			VelvetConstants.LOADING_SEND_RECEIPT, this.onLoadingSendReceipt,
			VelvetConstants.LOADING_SEND_RECEIPT_SUCCESS, this.onLoadingSendReceiptSuccess,
			VelvetConstants.LOADING_SEND_RECEIPT_FAILURE, this.onLoadingSendReceiptFailure,
			VelvetConstants.TOGGLE_SEND_RECEIPT, this.onToggleSendReceipt,
			VelvetConstants.LOADING_GET_MEDICAL_PROFILE_TOKEN, this.onLoadingGetMedicalProfileToken,
			VelvetConstants.LOADING_GET_MEDICAL_PROFILE_TOKEN_SUCCESS, this.onLoadingGetMedicalProfileTokenSuccess,
			VelvetConstants.LOADING_GET_MEDICAL_PROFILE_TOKEN_FAILURE, this.onLoadingGetMedicalProfileTokenFailure,
			VelvetConstants.CLOSE_GET_MEDICAL_PROFILE_TOKEN_MODAL, this.onCloseGetMedicalProfileTokenModal
		);
	},

	onLoadingMessages: function(payload) {
		this.messages = {};
		this.isLoadingMessages = true;
		this.loadingMessagesError = null;
		this.emit("change");
	},

	onLoadingMessagesSuccess: function(payload) {
		payload.messages = payload.messages.reverse();
		this.messages = payload.messages.reduce(function(acc, message){
			var clientId = message._id;
			this._formatMessage(message);
			acc[clientId] = message;
			return acc;
		}.bind(this), {});
		this.number = payload.number;
		this.isLoadingMessages = false;
		this.emit("change");
	},

	onLoadingMessagesFailure: function(payload) {
		this.isLoadingMessages = false;
		this.loadingMessagesError = payload.error;
		this.emit("change");
	},

	onLoadingSendReply: function(payload) {
		this.isLoadingSendReply = true;
		this.sendReplyError = null;
		this.sendReplySuccess = false;
		this.emit("change");
	},

	onLoadingSendReplySuccess: function(payload) {
		this.isLoadingSendReply = false;
		this.sendReplySuccess = true;
		this.emit("change");
	},

	onLoadingSendReplyFailure: function(payload) {
		this.isLoadingSendReply = false;
		this.sendReplyFailure = "Sorry, something went wrong.";
		this.emit("change");
	},

	onNewMessage: function(newMessage) {

		$.each(this.messages, function(index, message) {

			if (message.number_id == newMessage.number_id) {
				this._formatMessage(newMessage);
				this.messages[newMessage._id] = newMessage;
				this.emit("change");
			}

			return false;

		}.bind(this));

	},

	onNewName: function(number) {

		if (number._id == this.number._id) {
			this.number.name = number.name;
			this.number.email = number.email;
			this.emit("change");
		}

	},

	onLoadingSetName: function(payload) {
		this.isLoadingSetName = true;
		this.setNameError = null;
		this.emit("change");
	},

	onLoadingSetNameSuccess: function(payload) {
		this.isLoadingSetName = false;
		this.emit("change");
	},

	onLoadingSetNameFailure: function(payload) {
		this.isLoadingSetName = false;
		this.emit("change");
		alert('Sorry, something went wrong.');
	},

	onLoadingSendReceipt: function(payload) {
		this.isLoadingSendReceipt = true;
		this.sendReceiptError = null;
		this.emit("change");
	},

	onLoadingSendReceiptSuccess: function(payload) {
		this.isLoadingSendReceipt = false;
		this.showSendReceipt = false;
		this.emit("change");
	},

	onLoadingSendReceiptFailure: function(payload) {
		this.isLoadingSendReceipt = false;
		this.sendReceiptError = payload.error;
		this.emit("change");
	},

	onToggleSendReceipt: function(payload) {

		this.showSendReceipt = payload.show;
		this.emit("change");

	},

	onLoadingGetMedicalProfileToken: function() {

		this.isLoadingGetMedicalProfileToken = true;
		this.medicalProfileToken = "";
		this.emit("change");

	},

	onLoadingGetMedicalProfileTokenSuccess: function(payload) {

		this.isLoadingGetMedicalProfileToken = false;
		this.medicalProfileToken = payload.token;
		this.emit("change");

	},

	onLoadingGetMedicalProfileTokenFailure: function(payload) {

		this.isLoadingGetMedicalProfileToken = false;
		this.medicalProfileToken = "";
		this.emit("change");
		alert(payload.error);

	},

	onCloseGetMedicalProfileTokenModal: function() {

		this.isLoadingGetMedicalProfileToken = false;
		this.medicalProfileToken = "";
		this.emit("change");

	},

	getState: function() {

		return {
			messages: this.messages,
			isLoadingMessages: this.isLoadingMessages,
			loadingMessagesError: this.loadingMessagesError,
			isLoadingSendReply: this.isLoadingSendReply,
			sendReplySuccess: this.sendReplySuccess,
			sendReplyFailure: this.sendReplyFailure,
			number: this.number,
			isLoadingSetName: this.isLoadingSetName,
			isLoadingSendReceipt: this.isLoadingSendReceipt,
			sendReceiptError: this.sendReceiptError,
			showSendReceipt: this.showSendReceipt,
			isLoadingGetMedicalProfileToken: this.isLoadingGetMedicalProfileToken,
			medicalProfileToken: this.medicalProfileToken
		};

	},

	_formatMessage: function(message) {
		var createdTime = moment(message.created_at)
		message.created_at_moment = createdTime;

		message.created_at_nice = createdTime.format('h:mm a');
		message.created_at_day = createdTime.format('MMM D, YYYY');
	}

});

module.exports = ConversationStore;