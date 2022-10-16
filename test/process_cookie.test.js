/**
 *
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://www.nudgesecurity.com/use-cases/find-shadow-it?gclid=123","referrer":"https://www.google.com/"}
 */
'use strict';
/*eslint-env browser */

const {process_utm_data, processHrefTrialParams} = require("../src");
import './environment.mock'

describe( "Process Href params", () =>{
    var urlParams =null;
    beforeAll(() =>{
        process_utm_data()
        let link = document.createElement('a');
        link.href = "https://www.nudgesecurity.io/login"
        processHrefTrialParams(link)
        var processed = new URL(link.href);
        urlParams = processed.searchParams
    })

    var expected = {
        "freeTrial":"true",
        "utm_campaign":"not_provided",
        "utm_medium":"organic_search",
        "utm_content":"not_provided",
        "utm_source":"www.google.com",
        "utm_term":"not_provided",
        "hub":"foo",
        "ajs_aid":"15122412"
    }
    for (const [key, value] of Object.entries(expected)) {
        test("validate  "+key, () =>{
            expect(urlParams.get(key)).toBe(value);
        })
    }
})