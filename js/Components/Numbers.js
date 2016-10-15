var React = require('react');
var Fluxxor = require('fluxxor');

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Numbers = React.createClass({

	mixins: [FluxMixin, StoreWatchMixin("NumbersStore")],

	getInitialState: function() {
		return {
			numbersView: 'external'
		};
	},

	getStateFromFlux: function() {

		var NumbersStore = this.getFlux().store("NumbersStore").getState();

		return {
			isLoadingNumbers: NumbersStore.isLoadingNumbers,
			numbers: NumbersStore.numbers,
			internalNumbers: NumbersStore.internalNumbers,
			loadingNumbersError: NumbersStore.loadingNumbersError,
			newMessages: NumbersStore.newMessages,
			newInternalMessages: NumbersStore.newInternalMessages
		};
	},

	componentDidMount: function() {

		this.getFlux().actions.NumbersActions.loadNumbers();

	},

	handleNumberClick: function(numberId, e) {

		this.props.onChooseNumber(numberId);

	},

	getNumberRow: function(index, number) {

		var activeClass = this.props.selectedNumber == number.number_id ? "active" : "";
		var userName = number.number.name ? <span>{number.number.name} <small>{number.number.number}</small></span> : number.number.number;
		var newIcon = number.newCount ? <span className="new"><span>{number.newCount}</span></span> : null;

		return (
			<li onClick={this.handleNumberClick.bind(this, number.number_id)} key={index} className={activeClass}><span className="number">{userName}</span><span className="time">{number.created_at_nice}</span><span className="clearfix"></span><span className="message">{number.text_message}</span>{newIcon}</li>
		);

	},

	changeTab: function(tab, e) {

		this.setState({numbersView: tab});

	},

	render: function() {

		var loadingIcon = this.state.isLoadingNumbers ? <span>Loading...</span> : null;

		var numbers = [];
		var internalNumbers = [];

		$.each(this.state.numbers, function(index, number) {			
			numbers.push(this.getNumberRow(index, number));
		}.bind(this));

		$.each(this.state.internalNumbers, function(index, number) {			
			internalNumbers.push(this.getNumberRow(index, number));
		}.bind(this));

		var tabs;
		if (!this.state.isLoadingNumbers) {
			var newExternalCount = this.state.newMessages > 0 ? (<span className="new-messages">({this.state.newMessages})</span>) : null;
			var newInternalCount = this.state.newInternalMessages > 0 ? (<span className="new-messages">({this.state.newInternalMessages})</span>) : null;

			tabs = (
				<ul className="numbers-tabs">
					<li><a onClick={this.changeTab.bind(this, 'external')} className={this.state.numbersView == 'external' ? 'active' : null}>Clients{newExternalCount}</a></li>
					<li><a onClick={this.changeTab.bind(this, 'internal')} className={this.state.numbersView == 'internal' ? 'active' : null}>RMTs{newInternalCount}</a></li>
				</ul>
			);
		}

		return (
			<div className="numbers-container">
				{loadingIcon}
				{tabs}
				<div className="clearfix"></div>
				<ul className="numbers-list">
					{this.state.numbersView == 'external' ? numbers : internalNumbers}
				</ul>
			</div>
		);

	}

});

module.exports = Numbers;