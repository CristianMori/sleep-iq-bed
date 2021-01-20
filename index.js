'use strict';

const { lambda } = require("st-schema");
const SleepNumberBedSchemaConnector = require('./connector');

const connector = new SleepNumberBedSchemaConnector();

async function stateRefreshCallback(request, response) {
	return connector.stateRefreshCallback(request, response)
}

async function discoveryCallback(request, response) {
	return connector.discoveryCallback(request, response)
}

async function commandCallback(request, response) {
	return connector.commandCallback(request, response)
}

module.exports.handler = lambda({
    discoveryRequest: discoveryCallback,
    commandRequest: commandCallback,
    stateRefreshRequest: stateRefreshCallback
});
