const SmartApp = require('@smartthings/smartapp');
const api = require('./lib/API');

module.exports = new SmartApp()
    .configureI18n()
    .enableEventLogging(2) // logs all lifecycle event requests/responses as pretty-printed JSON. Omit in production
    .page('mainPage', (context, page, configData) => {
        page.section('bedside', section => {
            section.enumSetting('bedside')
                .options([
                    { id: "L", name: "Left" },
                    { id: "R", name: "Right" }
                ])
                .defaultValue("L")
				.required(true);
        });
    })
    .updated(async ctx => {
        // clear any previous configuration
        await ctx.api.schedules.delete();
    });
