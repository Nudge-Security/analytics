/**
 *
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://nudgesecurity.com/?utm_campaign=new&utm_source=email&utm_content=read&utm_medium=always&utm_term=on" ,"referrer":"https://www.google.com/"}
 */
'use strict';
/*eslint-env browser */
import './environment.mock'
import {selectAndUpdateDataAnalytics} from "../src";

const {process_utm_data, getURLSearchParamsForCookie, selectAndUpdateTrialButtons} = require("../src");
describe("Update Trial Links", () => {
    var urlSearchParamsForCookie = null;
    const $ = require('jquery');
    beforeAll(() => {
        document.body.innerHTML =
            '<div>' +
            '  <a data-analytics="trial" id="event-button" data-property-source="what" data-property-type="foo" href="https://nudgesecurity.io/login" ></a>' +
            '</div>';
        selectAndUpdateDataAnalytics();
    })
    test('Generate event on click', () =>{
        $('#event-button').click();
        expect(global.analytics.track.mock.calls.length).toBe(1);
        expect(global.analytics.track.mock.calls[0][0]).toBe('trial');
        expect(global.analytics.track.mock.calls[0][1]).toStrictEqual({'source':'what','type':'foo'});
    })
})