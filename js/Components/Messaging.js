var React = require('react');
var Fluxxor = require('fluxxor');
var VelvetConfig = require('../VelvetConfig');
var socket = require('socket.io-client');
var Navigation = require('react-router').Navigation;
var io;

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Numbers = require('./Numbers');
var Conversation = require('./Conversation');
var AppLoader = require('./AppLoader');

var Messaging = React.createClass({

	mixins: [FluxMixin, StoreWatchMixin("UserStore"), Navigation],

	getInitialState: function() {
		return {
			selectedNumber: null
		};
	},

	getStateFromFlux: function() {

		var flux = this.getFlux();

		var UserStore = flux.store("UserStore").getState();

		return {
			isLoggedIn: UserStore.isLoggedIn,
			isLoadingSessionCheck: UserStore.isLoadingSessionCheck
		};
	},

	handleChooseNumber: function(numberId) {

		this.getFlux().actions.NumbersActions.numberChosen(numberId);
		this.getFlux().actions.ConversationActions.loadConversation(numberId);
		this.setState({selectedNumber: numberId});

	},

	componentDidMount: function() {

		io = socket(VelvetConfig.socketURL, {path: "/api/socket.io"});

		io.on('new message', function(data) {
			this.getFlux().actions.NumbersActions.newMessage(data);
		}.bind(this));

		io.on('new name', function(data) {
			this.getFlux().actions.NumbersActions.newName(data);
		}.bind(this));

		// request notification permission...
		Notification.requestPermission(function (permission) {
			// 
		});

	},

	componentWillUnmount: function() {

		io.disconnect();

	},

	render: function() {

		if (!this.state.isLoggedIn && !this.state.isLoadingSessionCheck)
			this.context.router.transitionTo('/login');

		return (
			<div>
				<AppLoader/>
				<div className="container-fluid">
					<div className="row">
						<div className="col-md-4">
							<Numbers onChooseNumber={this.handleChooseNumber} selectedNumber={this.state.selectedNumber}/>
						</div>
						<div className="col-md-8 messages-container">
							<Conversation />
						</div>
					</div>
				</div>
				<audio src="audio/bell.mp3" id="bellSound"></audio>
			</div>
		);

	}

});

module.exports = Messaging;