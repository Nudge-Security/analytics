/**
 *
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://nudgesecurity.com/?utm_campaign=new&utm_source=email&utm_content=read&utm_medium=always&utm_term=on" ,"referrer":"https://www.google.com/"}
 */
'use strict';
/*eslint-env browser */
import './environment.mock'
import {set_up_app} from "./environment.mock";

describe("Validate twitter conversion", () => {
    const $ = require('jquery');
    beforeAll(() => {
        document.body.innerHTML =
            '<div>' +
            '  <a  id="event-button" twitter-conversion="123-1-12-4"  href="https://nudgesecurity.io/login" ></a>' +
            '</div>';
        set_up_app()

    })
    test('Generate event on click', () =>{
        $('#event-button').click();
        expect(global.twq.mock.calls.length).toBe(1);
        expect(global.twq.mock.calls[0][0]).toBe('event');
        expect(global.twq.mock.calls[0][1]).toStrictEqual('123-1-12-4');
    })
})