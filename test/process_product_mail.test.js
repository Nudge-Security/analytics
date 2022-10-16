
/**
 *
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://nudgesecurity.com/","referrer":"https://mail.nudgesecurity.io/"}
 */
'use strict';
/*eslint-env browser */

const {process_utm_data, getURLSearchParamsForCookie} = require("../src");
describe( "Product Referral", () =>{
    var urlSearchParamsForCookie =null;
    beforeAll(() =>{
        process_utm_data()
        urlSearchParamsForCookie = getURLSearchParamsForCookie();

    })
    var expected = {
        "utm_campaign":"not_provided",
        "utm_medium":"product",
        "utm_content":"not_provided",
        "utm_source":"email",
        "utm_term":"not_provided",
    }
    for (const [key, value] of Object.entries(expected)) {
        test("validate  "+key, () =>{
            expect(urlSearchParamsForCookie.get(key)).toBe(value);
        })
    }
})