/**
 *
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://nudgesecurity.com/product/soc2?utm_campaign=new&utm_source=email&utm_content=read&utm_medium=always&utm_term=on&gclid=123" ,"referrer":"https://www.google.com/"}
 */
'use strict';
/*eslint-env browser */
import './environment.mock'
import {set_up_app} from "./environment.mock";
import $ from "jquery";

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
    const expected = {
        utm_campaign: 'new',
        utm_source: 'email',
        fab_s: 'email',
        utm_medium: 'always',
        fab_m: 'always',
        utm_content: 'read',
        fab_co: 'read',
        utm_term: 'on',
        fab_t: 'on',
        gclid: '123',
        fab_ca: 'new',
        referring_domain: 'www.google.com',
        landing_url: '/product/soc2',
        ajs_event: 'trial_click_io_landing',
        hub: 'foo',
        fab_hsc: 'foo',
        submission_url: '/product/soc2',
        ajs_aid: '15122412',
        fab_seg: '15122412'
    };

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
    test( 'test propagate conversions', () => {
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
        expect(global.analytics.track.mock.calls[0][1]).toStrictEqual({'target':'https://nudgesecurity.io/login?utm_campaign=new&utm_source=email&fab_s=email&utm_medium=always&fab_m=always&utm_content=read&fab_co=read&utm_term=on&fab_t=on&gclid=123&fab_ca=new&referring_domain=www.google.com&landing_url=%2Fproduct%2Fsoc2&ajs_event=trial_click_io_landing&hub=foo&fab_hsc=foo&submission_url=%2Fproduct%2Fsoc2&biscotti=eyJ1dG1fY2FtcGFpZ24iOiJuZXciLCJ1dG1fc291cmNlIjoiZW1haWwiLCJmYWJfcyI6ImVtYWlsIiwidXRtX21lZGl1bSI6ImFsd2F5cyIsImZhYl9tIjoiYWx3YXlzIiwidXRtX2NvbnRlbnQiOiJyZWFkIiwiZmFiX2NvIjoicmVhZCIsInV0bV90ZXJtIjoib24iLCJmYWJfdCI6Im9uIiwiZ2NsaWQiOiIxMjMiLCJmYWJfY2EiOiJuZXciLCJyZWZlcnJpbmdfZG9tYWluIjoid3d3Lmdvb2dsZS5jb20iLCJsYW5kaW5nX3VybCI6Ii9wcm9kdWN0L3NvYzIiLCJhanNfZXZlbnQiOiJ0cmlhbF9jbGlja19pb19sYW5kaW5nIiwiaHViIjoiZm9vIiwiZmFiX2hzYyI6ImZvbyIsInN1Ym1pc3Npb25fdXJsIjoiL3Byb2R1Y3Qvc29jMiIsImFqc19haWQiOiIxNTEyMjQxMiIsImZhYl9zZWciOiIxNTEyMjQxMiJ9&ajs_aid=15122412&fab_seg=15122412'});
        expect(global.analytics.track.mock.calls[1][0]).toBe('trial_click');
        expect(global.analytics.track.mock.calls[1][1]).toStrictEqual({'submission-url':'/product/soc2','gclid':'123'});

    })
    test('Validate biscotti parameter', () => {
        let href_value = $('#trial-button-1')[0].getAttribute('href');
        let test_url = new URL(href_value);
        let biscotti_encoded_parameter = test_url.searchParams.get('biscotti');
        let biscotti_string = atob(biscotti_encoded_parameter);
        let biscotti =  JSON.parse(biscotti_string);
        for (const [key, value] of Object.entries(expected)) {
            expect(value).toBe(biscotti[key]);
        }
    })
})