/**
 *
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://nudgesecurity.com/post/foo"}
 */
'use strict';
/*eslint-env browser */
import './environment.mock'

const {configureHubSpotPages} = require("../dist/module");
describe("Validate Hubspot Content Type", () => {
    beforeAll(() => {
        configureHubSpotPages();
    })
    test('Identify blog post', () =>{
        expect(window._hsq.length).toBe(1)
        expect(window._hsq[0]).toStrictEqual(['setContentType', 'blog-post'])
    })
})