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
        const event1 = new Event("message");
        event1.id ="hsForm_4a2a5926-da9a-43cb-8a9d-efc5a5fa8f32"
        event1.data = {
            "type":"hsFormCallback",
            "eventName":"onFormSubmit",
            "data":[{"name":"email","value":"foo.com"}]
        }
        window.dispatchEvent(event1)
        expect(global.analytics.identify.mock.calls.length).toBe(1);
        expect(global.analytics.identify.mock.calls[0][0]).toStrictEqual({'email':'foo.com'});
        const event2 = new Event("message");
        event2.id ="hsForm_4a2a5926-da9a-43cb-8a9d-efc5a5fa8f32"
        event2.data = {
            "type":"hsFormCallback",
            "eventName":"onFormSubmitted",
            "data":[{"name":"email","value":"foo.com"}]
        }
        window.dispatchEvent(event2)
        expect(global.analytics.track.mock.calls.length).toBe(1);
        expect(global.analytics.track.mock.calls[0][0]).toStrictEqual("newsletter_signup");
    })
})