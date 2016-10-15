var Fluxxor = require('fluxxor');
var VelvetConstants = require('../VelvetConstants');
var moment = require('moment');
var VelvetLibrary = require('../VelvetLibrary');

var NumbersStore = Fluxxor.createStore({

	initialize: function() {
		this.numbers = [];
		this.internalNumbers = [];
		this.isLoadingNumbers = false;
		this.loadingNumbersError = null;
		this.newMessages = 0;
		this.newInternalMessages = 0;
		this.chosenNumberId = null;

		this.bindActions(
			VelvetConstants.LOADING_NUMBERS, this.onLoadingNumbers,
			VelvetConstants.LOADING_NUMBERS_SUCCESS, this.onLoadingNumbersSuccess,
			VelvetConstants.LOADING_NUMBERS_FAILURE, this.onLoadingNumbersFailure,
			VelvetConstants.NEW_MESSAGE, this.onNewMessage,
			VelvetConstants.NEW_NAME, this.onNewName,
			VelvetConstants.NUMBER_CHOSEN, this.onNumberChosen
		);
	},

	onLoadingNumbers: function(payload) {
		this.isLoadingNumbers = true;
		this.loadingNumbersError = null;
		this.numbers = [];
		this.emit("change");
	},

	onLoadingNumbersSuccess: function(payload) {
		this.isLoadingNumbers = false;
		// payload.numbers = payload.numbers.reverse();
		for (var i = 0; i < payload.external.length; i++) {
			this._formatNumber(payload.external[i]);
			this.numbers.push(payload.external[i]);
		}
		for (var i = 0; i < payload.internal.length; i++) {
			this._formatNumber(payload.internal[i]);
			this.internalNumbers.push(payload.internal[i]);
		}
		// this.numbers = payload.numbers.reduce(function(acc, number){
		// 	var clientId = number.number_id;
		// 	this._formatNumber(number);
		// 	acc[clientId] = number;
		// 	return acc;
		// }.bind(this), {});
		this.emit("change");
	},

	onLoadingNumbersFailure: function(payload) {
		this.isLoadingNumbers = false;
		this.loadingNumbersError = payload.error;
		this.emit("change");
	},

	onNewMessage: function(newMessage) {

		var numberFoundInList = false;

		if (newMessage.direction == 'outbound')
			return;

		this._formatNumber(newMessage);

		// show notification
		if ("Notification" in window) {
			if (Notification.permission === "granted") {
				var options = {
					body: newMessage.text_message,
					icon: "https://tryvelvet.com/img/velvet-180.png"
				};
				var notification = new Notification("Message from " + (newMessage.number.name || newMessage.number.number), options);
			}
			if (this.chosenNumberId == newMessage.number_id)
				document.getElementById("bellSound").play();
		}

		if (newMessage.internal == true) {

			$.each(this.internalNumbers, function(index, number) {

				if (newMessage.number_id == number.number_id) {

					if (newMessage.number_id != this.chosenNumberId) {
						if (number.newCount)
							newMessage.newCount = number.newCount + 1;
						else
							newMessage.newCount = 1;
					}

					this.internalNumbers.splice(index, 1);
					this.internalNumbers.unshift(newMessage);
					numberFoundInList = true;
					return false;

				}

			}.bind(this));

			if (newMessage.number_id != this.chosenNumberId)
				this.incrementNewInternalMessages();

		}
		else {

			$.each(this.numbers, function(index, number) {

				if (newMessage.number_id == number.number_id) {

					if (newMessage.number_id != this.chosenNumberId) {
						if (number.newCount)
							newMessage.newCount = number.newCount + 1;
						else
							newMessage.newCount = 1;
					}

					this.numbers.splice(index, 1);
					this.numbers.unshift(newMessage);
					numberFoundInList = true;
					return false;

				}

			}.bind(this));

			if (newMessage.number_id != this.chosenNumberId)
				this.incrementNewMessages();

		}
		

		if (!numberFoundInList) {

			newMessage.newCount = 1;

			if (newMessage.internal == true)
				this.internalNumbers.unshift(newMessage);
			else
				this.numbers.unshift(newMessage);

		}

		this.emit("change");

	},

	onNewName: function(number) {

		for (var i = 0; i < this.numbers.length; i++)
		{
			if (number._id == this.numbers[i].number_id)
			{
				this.numbers[i].number.name = number.name;
				this.numbers[i].number.email = number.email;
				break;
			}
		}

		for (var i = 0; i < this.internalNumbers.length; i++)
		{
			if (number._id == this.internalNumbers[i].number_id)
			{
				this.internalNumbers[i].number.name = number.name;
				this.internalNumbers[i].number.email = number.email;
				break;
			}
		}

		this.emit("change");

	},

	onNumberChosen: function(numberId) {

		for (var i = 0; i < this.numbers.length; i++)
		{
			if (numberId == this.numbers[i].number_id && this.numbers[i].newCount)
			{
				this.decrementNewMessages(this.numbers[i].newCount);
				this.numbers[i].newCount = 0;				
				return;
			}
		}

		for (var i = 0; i < this.internalNumbers.length; i++)
		{
			if (numberId == this.internalNumbers[i].number_id && this.internalNumbers[i].newCount)
			{
				this.decrementNewInternalMessages(this.internalNumbers[i].newCount);
				this.internalNumbers[i].newCount = 0;				
				return;
			}
		}

		this.chosenNumberId = numberId;
		this.emit("change");

	},

	getState: function() {
		return {
			numbers: this.numbers,
			isLoadingNumbers: this.isLoadingNumbers,
			loadingNumbersError: this.loadingNumbersError,
			internalNumbers: this.internalNumbers,
			newMessages: this.newMessages,
			newInternalMessages: this.newInternalMessages
		};
	},

	_formatNumber: function(number) {
		var createdTime = moment(number.created_at)
		number.created_at_moment = createdTime;

		if (moment().isSame(createdTime, 'day'))
			number.created_at_nice = createdTime.format('h:mm a');
		else if (moment().diff(createdTime, 'days') < 7)
			number.created_at_nice = createdTime.format('ddd h:mm a');
		else
			number.created_at_nice = createdTime.format('MMM Do h:mm a');

		number.number.number = VelvetLibrary.formatNumber(number.number.number);
	},

	incrementNewMessages: function() {
		this.newMessages++;
		this.updateTitle();
		document.getElementById("bellSound").play();
		this.emit("change");
	},

	incrementNewInternalMessages: function() {
		this.newInternalMessages++;
		this.updateTitle();
		document.getElementById("bellSound").play();
		this.emit("change");
	},

	decrementNewMessages: function(count) {
		if (typeof(count) != "undefined")
			this.newMessages -= count;
		else
			this.newMessages--;
		this.updateTitle();
		this.emit("change");
	},

	decrementNewInternalMessages: function(count) {
		if (typeof(count) != "undefined")
			this.newInternalMessages -= count;
		else
			this.newInternalMessages--;
		this.updateTitle();
		this.emit("change");
	},

	updateTitle: function() {
		if (this.newInternalMessages + this.newMessages > 0)
			document.title = "(" + (this.newInternalMessages + this.newMessages) + ") Velvet";
		else
			document.title = "Velvet";
	}

});

module.exports = NumbersStore;