// Mock existence of jquery
window.$ = require('jquery');

export const hubspotId = "foo";
document.cookie = "hubspotutk=" + hubspotId
let analytics = Object();
let user = Object()
export const anonymousId = "15122412";
user.anonymousId = jest.fn().mockReturnValue(anonymousId)
user.id = jest.fn().mockReturnValue(null)
analytics.user = jest.fn().mockReturnValue(user)
analytics.track = jest.fn()
analytics.ready = jest.fn()
global.analytics = analytics
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
export function set_up_app(){
    const lib = require("../dist/module")
    lib.configure()
    window.analytics.ready.mock.calls[0][0]()
}
