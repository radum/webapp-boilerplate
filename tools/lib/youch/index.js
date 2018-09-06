const Youch = require('./youch');
const youchTerminal = require('./youch-terminal');

exports.render = (error) => {
	const errJson = new Youch(error, {}).toJSONSync();

	return youchTerminal(errJson);
}
