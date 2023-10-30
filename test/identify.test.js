/**
 *
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://nudgesecurity.com/?utm_campaign=new&utm_source=email&utm_content=read&utm_medium=always&utm_term=on" ,"referrer":"https://www.google.com/"}
 */
'use strict';
/*eslint-env browser */
import './environment.mock'
import {anonymousId, set_up_app} from "./environment.mock";

describe("Identify validation", () => {
    const $ = require('jquery');
    beforeAll(() => {
        document.body.innerHTML =
            '<div>' +
           '</div>';
        set_up_app()
    })
    test('Identify gtag on analytics ready', () =>{
        expect(global.gtag.mock.calls.length).toBe(1);
        const config_call = global.gtag.mock.calls[0];
        expect(config_call[0]).toBe('config');
        expect(config_call[1]).toBe('G-MJ4CRTC1EM');
        expect(config_call[2]).toStrictEqual( {
            'user_id': anonymousId
        });


    })
    test('Identify FactorsAI on analytics ready', () => {
        const faitracker = global.faitracker;
        expect(faitracker.call.mock.calls.length).toBe(1);
        const identify_call = faitracker.call.mock.calls[0];
        expect(identify_call[0]).toBe('identify');
        expect(identify_call[1]).toBe(anonymousId);

    });
})