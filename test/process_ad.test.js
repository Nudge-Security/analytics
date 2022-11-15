/**
 *
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://www.nudgesecurity.com/use-cases/find-shadow-it?gclid=123","referrer":"https://www.google.com/"}
 */
'use strict';
/*eslint-env browser */

import {set_up_app} from "./environment.mock";

const {getURLSearchParamsForCookie} = require("../dist/module");
import './environment.mock'


describe( "Google Referral - Ad Landing Page", () =>{
    var urlSearchParamsForCookie =null;
    beforeAll(() =>{
        set_up_app()
        urlSearchParamsForCookie = getURLSearchParamsForCookie();

    })
    var expected = {
        "landing_url":"/use-cases/find-shadow-it",
        "gclid":"123"
    }
    for (const [key, value] of Object.entries(expected)) {
        test("validate  "+key, () =>{
            expect(urlSearchParamsForCookie.get(key)).toBe(value);
        })
    }
})