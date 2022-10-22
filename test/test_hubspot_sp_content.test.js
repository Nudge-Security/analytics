/**
 *
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://nudgesecurity.com/product"}
 */
'use strict';
/*eslint-env browser */
import './environment.mock'
import {set_up_app} from "./environment.mock";

const {configureHubSpotPages} = require("../dist/module");
describe("Validate Hubspot standard pageContent Type", () => {
    beforeAll(() => {
        set_up_app()
    })
    test('Identify landing page', () =>{
        expect(window._hsq.length).toBe(1)
        expect(window._hsq[0]).toStrictEqual(['setContentType', 'standard-page'])
    })
})