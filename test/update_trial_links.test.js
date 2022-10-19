/**
 *
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://nudgesecurity.com/product/soc2?utm_campaign=new&utm_source=email&utm_content=read&utm_medium=always&utm_term=on" ,"referrer":"https://www.google.com/"}
 */
'use strict';
/*eslint-env browser */
import './environment.mock'
import $ from "jquery";
import {get_utm_cookie, updateTrialButtonAJSID} from "../src";

const {process_utm_data, getURLSearchParamsForCookie, selectAndUpdateTrialButtons} = require("../dist/module");
describe("Update Trial Links", () => {
    var urlSearchParamsForCookie = null;
    const $ = require('jquery');
    beforeAll(() => {
        document.body.innerHTML =
            '<div>' +
            '  <a trial-button id="trial-button-1" href="https://nudgesecurity.io/login?utm_campaign=blah" ></a>' +
            '  <a trial-button id="trial-button-2" href="https://nudgesecurity.io/login" ></a>' +
            '  <a  id="trial-button-3" href="https://nudgesecurity.io/login" ></a>' +
            '  <button id="button" />' +
            '</div>';
        process_utm_data();
        urlSearchParamsForCookie = getURLSearchParamsForCookie();
        selectAndUpdateTrialButtons();
        updateTrialButtonAJSID();
    })
    var expected = {
        "freeTrial": "true",
        "ajs_aid": "15122412",
        "hub": "foo",
        "utm_source": "email",
        "utm_medium": "always",
        "utm_content": "read",
        "utm_term": "on",
        "utm_campaign": "new",
        "referring_domain": "www.google.com",
        "click_through_url": "/product/soc2",
        "landing_url": "/product/soc2"
    }
    var links = [
        "trial-button-1",
        "trial-button-2"
    ]
    for (const id of links) {
        for (const [key, value] of Object.entries(expected)) {
            test( `Validate ${id}-${key}`, () =>{
                let attribute = $(`#${id}`)[0].getAttribute('href');
                var url = new URL(attribute)
                expect(value).toBe(url.searchParams.get(key))
            })
        }

    }
    test('Missing attribute', () =>{
        let attribute1 = $('#trial-button-3')[0].getAttribute('href');
        expect(attribute1).toBe("https://nudgesecurity.io/login")
    })
    test('Delete cookie on click', () =>{
        $('#trial-button-1').click();
        expect(get_utm_cookie()).toBe(null);
    })
})