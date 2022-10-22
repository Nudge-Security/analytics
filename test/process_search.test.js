/**
 *
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://nudgesecurity.com/","referrer":"https://www.google.com/"}
 */
'use strict';
/*eslint-env browser */


import './environment.mock'
import {set_up_app} from "./environment.mock";
const {getURLSearchParamsForCookie} = require("../dist/module");


describe( "Google Referral", () =>{
    var urlSearchParamsForCookie =null;
    beforeAll(() =>{
        set_up_app()
        urlSearchParamsForCookie = getURLSearchParamsForCookie();

    })
    var expected = {
        "utm_campaign":"brand",
        "utm_medium":"organic_search",
        "utm_content":"not_provided",
        "utm_source":"www.google.com",
        "utm_term":"not_provided",
    }
    for (const [key, value] of Object.entries(expected)) {
        test("validate  "+key, () =>{
            expect(urlSearchParamsForCookie.get(key)).toBe(value);
        })
    }
})