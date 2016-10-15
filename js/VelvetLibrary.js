var VelvetLibrary = {
	formatNumber: function(number) {
		var phoneRegex = /^\+?(\d{1})(\d{3})(\d{3})(\d{4})$/;

		var formattedNumber = number;
		if (phoneRegex.test(number)) {
			var matches = phoneRegex.exec(number);
			formattedNumber = (matches[1] != 1 ? matches[1] + "-" : "") + matches[2] + "-" + matches[3] + "-" + matches[4];
		}

		return formattedNumber;
	}
};

module.exports = VelvetLibrary;