var VelvetConstants = require('../VelvetConstants');

var NumbersActions = {
	loadNumbers: function() {

		this.dispatch(VelvetConstants.LOADING_NUMBERS, {});

		$.ajax({
			url: '/api/numbers',
			type: 'get',
			success: function(external) {
				$.ajax({
					url: '/api/numbers/internal',
					type: 'get',
					success:function(internal) {
						this.dispatch(VelvetConstants.LOADING_NUMBERS_SUCCESS, {external: external, internal: internal});
					}.bind(this),
					error: function(xhr) {
						this.dispatch(VelvetConstants.LOADING_NUMBERS_FAILURE, {error: 'Something went wrong.'});
					}.bind(this)
				});				
			}.bind(this),
			error: function(xhr) {
				this.dispatch(VelvetConstants.LOADING_NUMBERS_FAILURE, {error: 'Something went wrong.'});
			}.bind(this)
		});

	},

	newMessage: function(message) {

		this.dispatch(VelvetConstants.NEW_MESSAGE, message);

	},

	newName: function(number) {

		this.dispatch(VelvetConstants.NEW_NAME, number);

	},

	numberChosen: function(numberId) {

		this.dispatch(VelvetConstants.NUMBER_CHOSEN, numberId);

	}
};

module.exports = NumbersActions;