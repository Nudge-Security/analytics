// Mock existence of jquery
window.$ = require('jquery');

export const hubspotId = "foo";
document.cookie = "hubspotutk=" + hubspotId
let analytics = Object();
let user = Object()
let hsscript = Object()
export const anonymousId = "15122412";
user.anonymousId = jest.fn().mockReturnValue(anonymousId)
user.id = jest.fn().mockReturnValue(null)
analytics.user = jest.fn().mockReturnValue(user)
analytics.track = jest.fn()
analytics.ready = jest.fn()
analytics.identify = jest.fn()
hsscript.identify = jest.fn()
global.analytics = analytics
global.HockeyStack = hsscript
window._hsq = []
window.gtag = jest.fn()
window.lintrk = jest.fn()
window.rdt = jest.fn()
window.twq = jest.fn()
window.trial_conversions = {
    "linkedin-conversion": "10088868",
    "twitter-conversion": "tw-odiwa-oe23k",
    "reddit-conversion": "trial_click",
    "data-analytics": "trial_click"
}
window.hs_form_events = {
    "4a2a5926-da9a-43cb-8a9d-efc5a5fa8f32":"newsletter_signup"
}
export function set_up_app(){
    const lib = require("../dist/module")
    lib.configure()
    window.analytics.ready.mock.calls[0][0]()
}
