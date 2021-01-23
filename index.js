'use strict';

const { lambda } = require("st-schema");
const SleepNumberBedSchemaConnector = require('./connector');

const connector = new SleepNumberBedSchemaConnector();

async function stateRefreshCallback(event, response) {
	const {headers, authentication, devices} = event;

	return connector.stateRefreshCallback(authentication.token, response)
}

async function discoveryCallback(event, response) {
	const {headers, authentication, devices} = event;

	return connector.discoveryCallback(authentication.token, response)
}

async function commandCallback(event, response) {
	const {headers, authentication, devices} = event;

	return connector.commandCallback(authentication.token, response, devices)
}

module.exports.handler = lambda({
    discoveryRequest: discoveryCallback,
    commandRequest: commandCallback,
    stateRefreshRequest: stateRefreshCallback
});
