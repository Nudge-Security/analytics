/**
 *
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://www.nudgesecurity.com/use-cases/find-shadow-it?gclid=123","referrer":"https://www.google.com/"}
 */
'use strict';
/*eslint-env browser */

import './environment.mock'

const {process_utm_data, processHrefTrialParams} = require("../dist/module");

describe("Process Href params", () => {
    var urlParams = null;
    let link;
    beforeAll(() => {
        process_utm_data()
        link = document.createElement('a');
        link.href = "https://www.nudgesecurity.io/login"
        processHrefTrialParams(link)
        var processed = new URL(link.href);
        urlParams = processed.searchParams
    })

    var expected = {
        "freeTrial": "true",
        "utm_campaign": "not_provided",
        "utm_medium": "organic_search",
        "utm_content": "not_provided",
        "utm_source": "www.google.com",
        "utm_term": "not_provided",
        "hub": "foo"
    }
    for (const [key, value] of Object.entries(expected)) {
        test("validate  " + key, () => {
            expect(urlParams.get(key)).toBe(value);
        })
    }
    test("validate data-attribute", () => {
        expect(link.getAttribute('data-analytics')).toBe("Trial Click")
        expect(link.getAttribute('data-property-submission-url')).toBe("/use-cases/find-shadow-it")
        expect(link.getAttribute('data-property-gclid')).toBe("123")
    })
    test("validate ajs_aid", () => {
        processHrefTrialParams(link, true)
        var processed = new URL(link.href);
        urlParams = processed.searchParams
        expect(urlParams.get("ajs_aid")).toBe("15122412");
    })
})