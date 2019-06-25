'use strict';

const isProd = process.env.NODE_ENV === 'production';

const config = {
	isProd
};

module.exports = config;
