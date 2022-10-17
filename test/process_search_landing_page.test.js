/**
 *
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://www.nudgesecurity.com/use-cases/find-shadow-it","referrer":"https://www.google.com/"}
 */
'use strict';
/*eslint-env browser */

const {process_utm_data, getURLSearchParamsForCookie} = require("../src");
import './environment.mock'


describe( "Google Referral - Landing Page", () =>{
    var urlSearchParamsForCookie =null;
    beforeAll(() =>{
        process_utm_data()
        urlSearchParamsForCookie = getURLSearchParamsForCookie();

    })
    var expected = {
        "utm_campaign":"not_provided",
        "utm_medium":"organic_search",
        "utm_content":"not_provided",
        "utm_source":"www.google.com",
        "landing_url":"/use-cases/find-shadow-it",
        "utm_term":"not_provided"
    }
    for (const [key, value] of Object.entries(expected)) {
        test("validate  "+key, () =>{
            expect(urlSearchParamsForCookie.get(key)).toBe(value);
        })
    }
})