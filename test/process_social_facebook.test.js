
/**
 *
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://nudgesecurity.com/","referrer":"https://www.facebook.com/"}
 */
'use strict';
/*eslint-env browser */
import './environment.mock'

const {process_utm_data, getURLSearchParamsForCookie} = require("../dist/module");
describe( "Facebook Referral", () =>{
    var urlSearchParamsForCookie =null;
    beforeAll(() =>{
        process_utm_data()
        urlSearchParamsForCookie = getURLSearchParamsForCookie();
    })
    var expected = {
        "utm_campaign":"earned",
        "utm_medium":"organic_social",
        "utm_content":"not_provided",
        "utm_source":"www.facebook.com",
        "utm_term":"not_provided",
    }
    for (const [key, value] of Object.entries(expected)) {
        test("validate  "+key, () =>{
            expect(urlSearchParamsForCookie.get(key)).toBe(value);
        })
    }
})

