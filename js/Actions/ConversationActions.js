var VelvetConstants = require('../VelvetConstants');

var ConversationActions = {
	loadConversation: function(numberId) {
		this.dispatch(VelvetConstants.LOADING_MESSAGES, {});

		$.ajax({
			url: '/api/conversation/' + numberId,
			type: 'get',
			success: function(result) {
				this.dispatch(VelvetConstants.LOADING_MESSAGES_SUCCESS, {messages: result.messages, number: result.number});
			}.bind(this),
			error: function(xhr) {
				this.dispatch(VelvetConstants.LOADING_MESSAGES_FAILURE, {error: 'Something went wrong.'});
			}.bind(this)
		});
	},

	sendReply: function(numberId, reply) {
		this.dispatch(VelvetConstants.LOADING_SEND_REPLY, {});
		
		$.ajax({
			url: '/api/send-reply',
			type: 'post',
			data: {numberId: numberId, body: reply},
			success: function(result) {
				this.dispatch(VelvetConstants.LOADING_SEND_REPLY_SUCCESS, {});
			}.bind(this),
			error: function(result) {
				this.dispatch(VelvetConstants.LOADING_SEND_REPLY_FAILURE, {});
			}.bind(this)
		});
	},

	setName: function(numberId, name, email) {
		this.dispatch(VelvetConstants.LOADING_SET_NAME, {});
		
		$.ajax({
			url: '/api/number/' + numberId + '/set_name',
			type: 'post',
			data: {name: name, email: email},
			success: function(result) {
				this.dispatch(VelvetConstants.LOADING_SET_NAME_SUCCESS, {});
			}.bind(this),
			error: function(result) {
				this.dispatch(VelvetConstants.LOADING_SET_NAME_FAILURE, {});
			}.bind(this)
		});
	},

	sendReceipt: function(clientName, clientEmail, rmtName, rmtNumber, description, date, amount) {
		this.dispatch(VelvetConstants.LOADING_SEND_RECEIPT, {});
		
		$.ajax({
			url: '/api/receipt/create',
			type: 'post',
			data: {clientName: clientName, clientEmail: clientEmail, rmtName: rmtName, rmtNumber: rmtNumber, description: description, date: date, amount: amount},
			success: function(result) {
				this.dispatch(VelvetConstants.LOADING_SEND_RECEIPT_SUCCESS, {});
			}.bind(this),
			error: function(result) {
				var errorString;

				try {
					var responseJson = JSON.parse(xhr.responseText);
					if (typeof(responseJson.error) != "undefined")
						errorString = responseJson.error;
					else {
						for (var error in responseJson) {
							errorString = error[0];
							break;
						}
					}
				}
				catch (e) {
					var errorString = "Sorry, something went wrong. Please try again later.";
				}
				finally {
					this.dispatch(VelvetConstants.LOADING_SEND_RECEIPT_FAILURE, {error: errorString});
				}
			}.bind(this)
		});
	},

	toggleSendReceipt: function(show) {
		this.dispatch(VelvetConstants.TOGGLE_SEND_RECEIPT, {show: show});
	},

	getMedicalProfileToken: function(number) {

		this.dispatch(VelvetConstants.LOADING_GET_MEDICAL_PROFILE_TOKEN, {});

		$.ajax({
			url: '/api/medical/token/create',
			type: 'post',
			data: {number: number},
			success: function(result) {
				this.dispatch(VelvetConstants.LOADING_GET_MEDICAL_PROFILE_TOKEN_SUCCESS, result);
			}.bind(this),
			error: function(result) {
				var errorString;

				try {
					var responseJson = JSON.parse(xhr.responseText);
					if (typeof(responseJson.error) != "undefined")
						errorString = responseJson.error;
					else {
						for (var error in responseJson) {
							errorString = error[0];
							break;
						}
					}
				}
				catch (e) {
					var errorString = "Sorry, something went wrong. Please try again later.";
				}
				finally {
					this.dispatch(VelvetConstants.LOADING_GET_MEDICAL_PROFILE_TOKEN_FAILURE, {error: errorString});
				}
			}.bind(this)
		});

	},

	closeGetMedicalProfileTokenModal: function() {

		this.dispatch(VelvetConstants.CLOSE_GET_MEDICAL_PROFILE_TOKEN_MODAL);

	}
};

module.exports = ConversationActions;