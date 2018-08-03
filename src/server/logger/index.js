const winston = require('winston');

module.exports = winston.createLogger({
	transports: [new winston.transports.Console()],
	format: winston.format.combine(
		winston.format.colorize({ all: true }),
		winston.format.simple()
	)
});
