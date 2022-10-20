/**
 *
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://nudgesecurity.com/"}
 */
'use strict';
/*eslint-env browser */
import './environment.mock'

const {configureHubSpotPages} = require("../dist/module");
describe("Validate Hubspot landing pageContent Type", () => {
    beforeAll(() => {
        window.nudgeHbsptLandingPage = true
        configureHubSpotPages();
    })
    test('Identify landing page', () =>{
        expect(window._hsq.length).toBe(1)
        expect(window._hsq[0]).toStrictEqual(['setContentType', 'landing-page'])
    })
})