
/**
 *
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://nudgesecurity.com/"}
 */
'use strict';
/*eslint-env browser */

const {process_utm_data, getURLSearchParamsForCookie} = require("../src");
describe( "Direct", () =>{
    var urlSearchParamsForCookie =null;
    beforeAll(() =>{
        process_utm_data()
        urlSearchParamsForCookie = getURLSearchParamsForCookie();

    })
    var expected = {
        "utm_campaign":"brand",
        "utm_medium":"direct",
        "utm_content":"not_provided",
        "utm_source":"direct",
        "utm_term":"not_provided",
    }
    for (const [key, value] of Object.entries(expected)) {
        test("validate  "+key, () =>{
            expect(urlSearchParamsForCookie.get(key)).toBe(value);
        })
    }
})