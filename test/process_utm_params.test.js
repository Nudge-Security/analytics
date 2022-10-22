
/**
 *
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://nudgesecurity.com/?utm_campaign=new&utm_source=email&utm_content=read&utm_medium=always&utm_term=on" ,"referrer":"https://www.google.com/"}
 */
'use strict';
/*eslint-env browser */
import './environment.mock'
import {set_up_app} from "./environment.mock";

const {getURLSearchParamsForCookie} = require("../dist/module");
describe( "UTM Processing", () =>{
    var urlSearchParamsForCookie =null;
    beforeAll(() =>{
        set_up_app()
        urlSearchParamsForCookie = getURLSearchParamsForCookie();
    })
    var expected = {
        "utm_campaign":"new",
        "utm_medium":"always",
        "utm_content":"read",
        "utm_source":"email",
        "utm_term":"on",
    }
    for (const [key, value] of Object.entries(expected)) {
        test("validate  "+key, () =>{
            expect(urlSearchParamsForCookie.get(key)).toBe(value);
        })
    }
})