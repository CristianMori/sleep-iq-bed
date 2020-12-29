# SleepIQ Bed SmartThings App

This is lambda SmartApp controls Sleep IQ bed to achive atomation.

- Creating schedules and handling scheduled executions.

## Setup instructions

### Prerequisites

- An [AWS](https://www.serverless.com/framework/docs/providers/aws/guide/credentials/) account (free tier is fine).
- A [Samsung account](https://account.samsung.com/membership/index.do) and the SmartThings mobile application.
- A [Developer Workspace](https://smartthings.developer.samsung.com/workspace/) account.
- A SleepIQ bed and account

#### If testing locally (using provided webserver)
- [Node.js](https://nodejs.org) and [npm](https://npmjs.com) installed (verified with npm version 6.14.8 and Node 12.19.0).
- [ngrok](https://ngrok.com/) installed to create a secure tunnel and create a globally available URL for fast testing.

### Start

We've provided two options: the intended deployment platform for this automation (AWS Lambda) and a simple web server that can be used to run and test locally. 

Clone or download this repository and follow the desired option.

### Lambda

1. Install the dependencies for this app: `npm install`.

1. Follow the instructions to [setup AWS credentials](https://www.serverless.com/framework/docs/providers/aws/guide/credentials/) for serverless.

1. Deploy the Lambda function: `serverless deploy`.

1. Navigate to the AWS Lambda dashboard to [add an env var](https://docs.aws.amazon.com/lambda/latest/dg/configuration-envvars.html) with the values of `SLEEPIQ_EMAIL` and `SLEEPIQ_PASSWORD`.

1. Follow the steps to grant SmartThings [permission to execute your Lambda function](https://smartthings.developer.samsung.com/docs/smartapps/aws-lambda.html). **This is required for successful registration.**

### Local

1. Create a `.env` and store your SleepIQ email/password as shown in `.env.example` file.

1. Install the dependencies for this app: `npm install`.

1. Start the server: `npm start`.

1. Start ngrok (in another terminal window/tab): `ngrok http 3005`. Copy the `https:` URL to your clipboard.

### Register

1. Follow the instructions for [registering a SmartApp](https://smartthings.developer.samsung.com/docs/smartapps/app-registration.html) with the SmartThings platform.
	- The following OAuth2 scopes are required.
		- `r:devices:*`
		- `x:devices:*`

#### Local Only

A `CONFIRMATION request` log should show in the log output of the local server once registered. Navigate to this link to [verify your domain ownership](https://smartthings.developer.samsung.com/docs/smartapps/webhook-apps.html#Verify-your-domain-ownership) and enable the app to receive events. **This is required for successful installation.**

### Test

Follow the instructions for [testing a SmartApp](https://smartthings.developer.samsung.com/docs/testing/how-to-test.html).

## Troubleshooting

### Local

- When installing the SmartApp in the SmartThings mobile app, if you get an error **Something went wrong. Please try to install the SmartApp again**, then it is possible that you did not navigate to the confirmation link as specified above. If this is the case, then in the npm server terminal you will also see an error. Make sure you navigate to the URL sent with the `CONFIRMATION request` to the npm server. This can be resent by navigating to Developer Workspace `Overview` and clicking `Verify App Registration`.

## Documentation

- Documentation for developing SmartApps can be found on the [SmartThings developer portal](https://smartthings.developer.samsung.com/develop/guides/smartapps/basics.html).
- [SmartThings API reference documentation](https://smartthings.developer.samsung.com/develop/api-ref/st-api.html)
- [SmartApp API reference documentation](https://smartthings.developer.samsung.com/docs/api-ref/smartapps-v1.html)

## Credits

This app is based om the SmartThing example called  weather-color-light-smartapp-nodejs

