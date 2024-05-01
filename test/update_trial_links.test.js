/**
 *
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://nudgesecurity.com/product/soc2?utm_campaign=new&utm_source=email&utm_content=read&utm_medium=always&utm_term=on&gclid=123" ,"referrer":"https://www.google.com/"}
 */
'use strict';
/*eslint-env browser */
import './environment.mock'
import {set_up_app} from "./environment.mock";

const {get_utm_cookie, getURLSearchParamsForCookie} = require("../dist/module");
describe("Update Trial Links", () => {
    var urlSearchParamsForCookie = null;
    const $ = require('jquery');
    beforeAll(() => {
        document.body.innerHTML =
            '<div>' +
            '  <a trial-button id="trial-button-1" href="https://nudgesecurity.io/login?utm_campaign=blah" ></a>' +
            '  <a trial-button id="trial-button-2" href="https://nudgesecurity.io/login" ></a>' +
            '  <a trial-button id="trial-button-bad" href="#login" ></a>' +
            '  <a  id="trial-button-3" href="https://nudgesecurity.io/login" ></a>' +
            '  <button id="button" />' +
            '</div>';
        urlSearchParamsForCookie = getURLSearchParamsForCookie();
        set_up_app();
    })
    var expected = {
        "ajs_aid": "15122412",
        "hub": "foo",
        "utm_source": "email",
        "utm_medium": "always",
        "utm_content": "read",
        "utm_term": "on",
        "utm_campaign": "new",
        "gclid": "123",
        "referring_domain": "www.google.com",
        "submission_url": "/product/soc2",
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
    test('Relative link', () =>{
        let attribute1 = $('#trial-button-bad')[0].getAttribute('href');
        expect(attribute1).toBe("#login")
    })
    test( 'test propagate converstions', () => {
        const entries = Object.entries(window.trial_conversions);
        for ( const [attr, val] of entries){
            let totest = $('#trial-button-1')[0].getAttribute(attr)
            expect(totest).toBe(val)
        }
    })
    test('Validate button click', () =>{
        $('#trial-button-1').click();
        expect(get_utm_cookie()).toBe(null);
        expect(global.analytics.track.mock.calls.length).toBe(2);
        expect(global.analytics.track.mock.calls[0][0]).toBe('trial_click_leaving_com');
        expect(global.analytics.track.mock.calls[0][1]).toStrictEqual({'target':'https://nudgesecurity.io/login?utm_campaign=new&utm_source=email&utm_medium=always&utm_content=read&utm_term=on&gclid=123&referring_domain=www.google.com&landing_url=%2Fproduct%2Fsoc2&ajs_event=trial_click_io_landing&hub=foo&submission_url=%2Fproduct%2Fsoc2&ajs_aid=15122412'});
        expect(global.analytics.track.mock.calls[1][0]).toBe('trial_click');
        expect(global.analytics.track.mock.calls[1][1]).toStrictEqual({'submission-url':'/product/soc2','gclid':'123'});

    })
})