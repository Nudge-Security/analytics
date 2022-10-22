/**
 *
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://nudgesecurity.com/?utm_campaign=new&utm_source=email&utm_content=read&utm_medium=always&utm_term=on" ,"referrer":"https://www.google.com/"}
 */
'use strict';
/*eslint-env browser */
import './environment.mock'
import {set_up_app} from "./environment.mock";

describe("Update Trial Links", () => {
    const $ = require('jquery');
    beforeAll(() => {
        document.body.innerHTML =
            '<div>' +
            '  <a data-analytics="trial" id="event-button" data-property-source="what" data-property-type="foo" href="https://nudgesecurity.io/login" ></a>' +
            '  <a data-analytics="trial2" id="event-button2" data-property-source="what" data-property-type="foo" href="https://nudgesecurity.io/login" ></a>' +
            '</div>';
        set_up_app()
    })
    test('Generate event on click', () =>{
        $('#event-button').click();
        expect(global.analytics.track.mock.calls.length).toBe(1);
        expect(global.analytics.track.mock.calls[0][0]).toBe('trial');
        expect(global.analytics.track.mock.calls[0][1]).toStrictEqual({'source':'what','type':'foo'});
        expect(global.gtag.mock.calls.length).toBe(1)
        expect(global.gtag.mock.calls[0][0]).toBe('event');
        expect(global.gtag.mock.calls[0][1]).toBe('trial');
        expect(global.gtag.mock.calls[0][2]).toStrictEqual({'source':'what','type':'foo'});
        $('#event-button2').click();
        expect(global.analytics.track.mock.calls.length).toBe(2);
        expect(global.analytics.track.mock.calls[1][0]).toBe('trial2');
        expect(global.analytics.track.mock.calls[1][1]).toStrictEqual({'source':'what','type':'foo'});

    })
})