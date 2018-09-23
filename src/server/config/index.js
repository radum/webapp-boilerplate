const common = require('./components/common');
const logger = require('./components/logger');
// const redis = require('./components/redis');
// const redis = require('./components/rabbitmq');
const server = require('./components/server');

module.exports = Object.assign({}, common, logger, server);
