/**
 *
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://www.nudgesecurity.com/use-cases/find-shadow-it","referrer":"https://www.nudgesecurity.com/"}
 */
'use strict';
/*eslint-env browser */
import './environment.mock'
import {set_up_app} from "./environment.mock";

const {setCookie, getURLSearchParamsForCookie} = require("../dist/module");


describe( "Internal navigation", () =>{
    var urlSearchParamsForCookie =null;
    beforeAll(() =>{
        setCookie("utm_medium=direct&utm_source=direct&utm_content=not_provided&utm_campaign=brand&utm_term=not_provided&landing_url=/use-cases/product")
        set_up_app()
        urlSearchParamsForCookie = getURLSearchParamsForCookie();

    })
    var expected = {
        "utm_campaign":"brand",
        "utm_medium":"direct",
        "utm_content":"not_provided",
        "utm_source":"direct",
        "landing_url":"/use-cases/product",
        "utm_term":"not_provided"
    }
    for (const [key, value] of Object.entries(expected)) {
        test("validate  "+key, () =>{
            expect(urlSearchParamsForCookie.get(key)).toBe(value);
        })
    }
})