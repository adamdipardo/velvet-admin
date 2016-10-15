var VelvetConstants = require('../VelvetConstants');

var UserActions = {
	checkForSession: function(isSilent) {
		if (!isSilent)
			this.dispatch(VelvetConstants.SESSION_CHECK_LOADING, {});

		$.ajax({
			url: '/api/session-check',
			type: 'post',
			success: function(result) {
				if (!isSilent)
					this.dispatch(VelvetConstants.SESSION_CHECK_SUCCESS, result);
			}.bind(this),
			error: function(xhr) {
				if (!isSilent)
					this.dispatch(VelvetConstants.SESSION_CHECK_ERROR, {error: JSON.parse(xhr.responseText).error});
				else
					this.dispatch(VelvetConstants.SESSION_TIMEOUT, {});
			}.bind(this)
		});
	},
	login: function(router, email, password) {
		this.dispatch(VelvetConstants.LOGIN_LOADING, {});
		
		$.ajax({
			url: '/api/login',
			type: 'post',
			data: {email: email, password: password},
			success: function(result) {
				result.router = router;
				this.dispatch(VelvetConstants.LOGIN_SUCCESS, result);
			}.bind(this),
			error: function(xhr) {
				var errorStr;
				try {
					errorStr = $.parseJson(xhr.responseText).error;
				}
				catch (e) {
					errorStr = "Sorry, there was an error. Please try again later."
				}
				this.dispatch(VelvetConstants.LOGIN_ERROR, {error: errorStr || "Sorry, there was an error. Please try again later."});
			}.bind(this)
		});	
	}
};

module.exports = UserActions;