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
export function set_up_app(){
    const lib = require("../dist/module")
    lib.configure()
    window.analytics.ready.mock.calls[0][0]()
}
