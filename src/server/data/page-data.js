'use strict';
const joi = require('joi');
const config = require('../config');

const dataSchema = joi.object({
	isProd: joi.boolean().required(),
	domainName: joi.string()
}).unknown().required();

const data = {
	isProd: config.isProd,
	domainName: process.env.APP_DOMAIN_NAME
};

const dataVars = joi.attempt(data, dataSchema)

module.exports = dataVars;
