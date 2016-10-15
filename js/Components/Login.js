var React = require('react');
var Fluxxor = require('fluxxor');
var VelvetConfig = require('../VelvetConfig');
var socket = require('socket.io-client');
var Navigation = require('react-router').Navigation;

var AppLoader = require('./AppLoader');

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Login = React.createClass({

	mixins: [FluxMixin, StoreWatchMixin("UserStore"), Navigation],

	getInitialState: function() {
		return {
			selectedNumber: null
		};
	},

	getStateFromFlux: function() {

		var flux = this.getFlux();

		var UserStore = flux.store("UserStore")

		return {
			loginError: UserStore.loginError,
			isLoadingLogin: UserStore.isLoadingLogin,
			timeoutMessage: UserStore.timeoutMessage
		};
	},

	handleFormChange: function(e) {

		var newProperty = {};
		newProperty[e.target.name] = e.target.value;
		this.setState(newProperty);

	},

	handleLogin: function(e) {

		e.preventDefault();

		this.setState({error: ""});

		if (!this.state.email || !this.state.password) {
			this.setState({error: "Please enter an email and a password"});
		}
		else {
			this.getFlux().actions.UserActions.login(this.context.router, this.state.email, this.state.password);
		}

	},

	render: function() {

		var loginButton;
		if (this.state.isLoadingLogin)
			loginButton = <button type="submit" className="btn btn-primary btn-block" disabled>Logging In <i className="fa fa-cog fa-spin"></i></button>;
		else
			loginButton = <button type="submit" className="btn btn-primary btn-block">Login</button>;

		var errorString = this.state.error || this.state.loginError;

		return (
			<div>
				<AppLoader/>
				<div className="container">
					<div className="row">
						<div className="col-md-3"></div>
						<div className="col-md-6 login-box">
							<img src="https://tryvelvet.com/img/velvet-logo.jpg" alt="Velvet" className="img-responsive center-block"/>
							<p className="text-danger">{this.state.timeoutMessage}</p>
							<form className="form" onSubmit={this.handleLogin}>
							<div className="form-group">
								<label htmlFor="email" className="sr-only">Email</label>
								<input type="email" name="email" id="email" placeholder="Email" className="form-control" value={this.state.email} onChange={this.handleFormChange} />
							</div>
							<div className="form-group">
								<label htmlFor="password" className="sr-only">Email</label>
								<input type="password" name="password" id="password" placeholder="Password" className="form-control" value={this.state.password} onChange={this.handleFormChange} />
							</div>
							<div className="form-group">
								{loginButton}
							</div>
							<div className="form-group">
								<p className="text-danger">{errorString}</p>
							</div>
							</form>
						</div>
						<div className="col-md-3"></div>
					</div>
				</div>
			</div>
		);

	}
});

module.exports = Login;