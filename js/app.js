var Fluxxor = require('fluxxor');
var React = require('react');
var Router = require("react-router");
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;

var NumbersStore = require('./Stores/NumbersStore');
var NumbersActions = require('./Actions/NumbersActions');

var UserStore = require('./Stores/UserStore');
var UserActions = require('./Actions/UserActions');

var ConversationStore = require('./Stores/ConversationStore');
var ConversationActions = require('./Actions/ConversationActions');

var Messaging = require('./Components/Messaging');
var Login = require('./Components/Login');

var routes = (
	<Route name="home" path="/">
		<DefaultRoute handler={Messaging} />
		<Route name="login" path="login" handler={Login}/>
	</Route>
);

var stores = {
	NumbersStore: new NumbersStore(),
	ConversationStore: new ConversationStore(),
	UserStore: new UserStore()
};

var actions = {
	NumbersActions: NumbersActions,
	ConversationActions: ConversationActions,
	UserActions: UserActions
};

var flux = new Fluxxor.Flux(stores, actions);

flux.on("dispatch", function(type, payload) {
	if (console && console.log) {
		console.log("[Dispatch]", type, payload);
	}
});

// check for session
flux.actions.UserActions.checkForSession();

// keep checking session
var sessionCheckInterval = setInterval(function() { 
	if (flux.store('UserStore').getState().isLoggedIn)
		flux.actions.UserActions.checkForSession(true);
}, 60 * 1000);

Router.run(routes, function(Handler) {
	React.render(
    	<Handler flux={flux} />,
    	document.getElementById("app")
  	);
});
