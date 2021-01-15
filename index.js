'use strict';

/**
 * AWS Lambda handler configured to host ST Schema connector
 */

const connector = require('./connector')

exports.handler = async (evt, context) => {
  if (connector.accessTokenIsValid(context, null)) {
	  await connector.handleLambdaCallback(evt, context);
  }
};
