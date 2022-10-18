export const hubspotId = "foo";
document.cookie = "hubspotutk=" + hubspotId
let analytics = Object();
let user = Object()
export const anonymousId = "15122412";
user.anonymousId = jest.fn().mockReturnValue(anonymousId)
analytics.user = jest.fn().mockReturnValue(user)
analytics.track = jest.fn()
global.analytics = analytics
// Mock existence of jquery
window.$ = require('jquery');