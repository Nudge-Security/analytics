/**
 *
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://nudgesecurity.com/"}
 */
'use strict';
/*eslint-env browser */
import './environment.mock'
import {set_up_app} from "./environment.mock";
describe("Validate Hubspot landing pageContent Type", () => {
    beforeAll(() => {
        window.nudgeHbsptLandingPage = true
        set_up_app()

    })
    test('Identify landing page', () =>{
        expect(window._hsq.length).toBe(1)
        expect(window._hsq[0]).toStrictEqual(['setContentType', 'landing-page'])
    })
})