var Fluxxor = require('fluxxor');
var VelvetConstants = require('../VelvetConstants');

var UserAccountStore = Fluxxor.createStore({
	initialize: function() {
		this.isLoadingLogin = false;
		this.isLoggedIn = false;
		this.isLoadingSessionCheck = true;
		this.loginError;
		this.sessionTimedOut = false;
		this.timeoutMessage;

		this.bindActions(
			VelvetConstants.LOGIN_LOADING, this.onLoginLoading,
			VelvetConstants.LOGIN_SUCCESS, this.onLoginSuccess,
			VelvetConstants.LOGIN_ERROR, this.onLoginError,
			VelvetConstants.SESSION_CHECK_LOADING, this.onSessionCheckLoading,
			VelvetConstants.SESSION_CHECK_SUCCESS, this.onSessionCheckSuccess,
			VelvetConstants.SESSION_CHECK_ERROR, this.onSessionCheckError,
			VelvetConstants.SESSION_TIMEOUT, this.onSessionTimeout
		);
	},

	onLoginLoading: function(payload) {

		this.isLoadingLogin = true;
		this.isLoggedIn = false;
		this.loginError = null;
		this.emit("change");

	},

	onLoginSuccess: function(payload) {

		this.isLoadingLogin = false;
		this.isLoggedIn = true;
		this.user = payload;
		payload.router.transitionTo('/');
		this.emit("change");

	},

	onLoginError: function(payload) {

		this.isLoadingLogin = false;
		this.loginError = payload.error;
		this.emit("change");
		
	},

	onSessionCheckLoading: function(payload) {
		this.isLoadingSessionCheck = true;
		this.emit("change");
	},

	onSessionCheckError: function(payload) {
		this.isLoadingSessionCheck = false;
		this.isLoggedIn = false;
		this.emit("change");
	},

	onSessionCheckSuccess: function(payload) {
		this.isLoadingSessionCheck = false;
		this.isLoggedIn = true;
		this.emit("change");
	},

	onSessionTimeout: function(payload) {
		this.sessionTimedOut = true;
		this.isLoggedIn = false;
		this.timeoutMessage = payload.error || "Your session has timed-out. Please login again.";
		this.emit("change");
	},

	onDismissedSessionTimeout: function(payload) {
		this.isLoggedIn = false;
		this.sessionTimedOut = false;
		this.emit("change");
	},

	getState: function() {
		return {
			isLoadingLogin: this.isLoadingLogin,
			isLoggedIn: this.isLoggedIn,
			isLoadingSessionCheck: this.isLoadingSessionCheck,
			sessionTimedOut: this.sessionTimedOut,
			timeoutMessage: this.timeoutMessage,
			loginError: this.loginError
		};
	}
});

module.exports = UserAccountStore;