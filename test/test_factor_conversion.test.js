/**
 *
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://nudgesecurity.com/?utm_campaign=new&utm_source=email&utm_content=read&utm_medium=always&utm_term=on" ,"referrer":"https://www.google.com/"}
 */
'use strict';
/*eslint-env browser */
import './environment.mock'
import {set_up_app} from "./environment.mock";

describe("Validate factor conversion", () => {
    const $ = require('jquery');
    beforeAll(() => {
        document.body.innerHTML =
            '<div>' +
            '  <a  id="event-button" factor-conversion="123-1-12-4"  href="https://nudgesecurity.io/login" ></a>' +
            '</div>';
        set_up_app()

    })
    test('Generate event on click', () =>{
        $('#event-button').click();
        expect(global.faitracker.call.mock.calls.length).toBe(2);
        expect(global.faitracker.call.mock.calls[1][0]).toBe('track');
        expect(global.faitracker.call.mock.calls[1][1]).toStrictEqual('123-1-12-4');
    })
})