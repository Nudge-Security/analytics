/**
 *
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://nudgesecurity.com/?utm_campaign=new&utm_source=email&utm_content=read&utm_medium=always&utm_term=on" ,"referrer":"https://www.google.com/"}
 */
'use strict';
/*eslint-env browser */
import './environment.mock'
import {set_up_app} from "./environment.mock";

describe("Validate linked in conversion", () => {
    const $ = require('jquery');
    beforeAll(() => {
        document.body.innerHTML =
            '<div>' +
            '  <a  id="event-button" linkedin-conversion="what"  href="https://nudgesecurity.io/login" ></a>' +
            '  <a  id="event-button1" linkedin-conversion="what2"  href="https://nudgesecurity.io/login" ></a>' +
            '</div>';
        set_up_app()
    })
    test('Generate event on click', () =>{
        $('#event-button').click();
        expect(global.lintrk.mock.calls.length).toBe(1);
        expect(global.lintrk.mock.calls[0][0]).toBe('track');
        expect(global.lintrk.mock.calls[0][1]).toStrictEqual({'conversion_id':'what'});
        $('#event-button1').click();
        expect(global.lintrk.mock.calls.length).toBe(2);
        expect(global.lintrk.mock.calls[1][0]).toBe('track');
        expect(global.lintrk.mock.calls[1][1]).toStrictEqual({'conversion_id':'what2'});
    })
})