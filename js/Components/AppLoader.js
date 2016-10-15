var React = require('react');
var Fluxxor = require('fluxxor');

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var AppLoader = React.createClass({

	mixins: [FluxMixin, StoreWatchMixin("UserStore")],

	getStateFromFlux: function() {

		var flux = this.getFlux();

		UserStore = flux.store("UserStore").getState();

		return {
			isLoadingSessionCheck: UserStore.isLoadingSessionCheck
		};

	},

	render: function() {

		if (!this.state.isLoadingSessionCheck)
			return <div></div>;

		return (
			<div className="app-loader">
				<div className="loader">Loading...</div>
			</div>
		);

	}
});

module.exports = AppLoader;