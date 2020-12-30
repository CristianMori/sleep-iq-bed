const SmartApp = require('@smartthings/smartapp');
const api = require('./lib/API');

module.exports = new SmartApp()
    .configureI18n()
    .enableEventLogging(2) // logs all lifecycle event requests/responses as pretty-printed JSON. Omit in production
    .page('mainPage', (context, page, configData) => {
		page.section('sleepiq-account', section => {
			section.emailSetting('email')
	//		.description('decription')
			.required(true)
			section.passwordSetting('password')
         //   .description('description')
            .required(true)
		});
		
        page.section('bedside', section => {
            section.enumSetting('bedside')
                .options([
                    { id: "L", name: "Left" },
                    { id: "R", name: "Right" }
                ])
                .defaultValue("L")
				.required(true);
        });
		
		page.nextPageId('statusPage')
		page.complete(true)
    })
	.page('statusPage', (context, page, configData) => {
		
	})
    .updated(async ctx => {
        // clear any previous configuration
        await ctx.api.schedules.delete();
    });
