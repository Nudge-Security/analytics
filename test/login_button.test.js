/**
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://nudgesecurity.com/product/soc2?utm_campaign=new&utm_source=email&utm_content=read&utm_medium=always&utm_term=on&gclid=123" ,"referrer":"https://www.google.com/"}
 */
'use strict';
/*eslint-env browser */
import './environment.mock'
import {set_up_app} from "./environment.mock";
import $ from "jquery";
import Cookies from 'js-cookie';

import {get_utm_cookie, delete_utm_cookie, process_utm_data, setCookie, selectAndUpdateLoginButtons} from "../dist/module";

describe("Login Button Tests", () => {
    beforeAll(() => {
        // Set up window location and document
        const baseUrl = "https://nudgesecurity.com/product/soc2";
        const mockUrl = new URL(baseUrl);

        // Mock window.location to work with URL constructor
        delete window.location;
        window.location = {
            href: mockUrl.href,
            search: "?utm_campaign=new&utm_source=email",
            pathname: mockUrl.pathname,
            host: mockUrl.host,
            hostname: mockUrl.hostname,
            protocol: mockUrl.protocol,
            origin: mockUrl.origin,
            toString: function() { return this.href; }
        };

        // Set up document with test buttons
        document.body.innerHTML = `
            <div>
                <a login-button id="login-button-1" href="https://nudgesecurity.io/login?utm_campaign=blah"></a>
                <a login-button id="login-button-2" href="https://nudgesecurity.io/login"></a>
                <a login-button id="login-button-bad" href="#login"></a>
            </div>
        `;

        // Initialize the app after DOM setup
        process_utm_data();
        selectAndUpdateLoginButtons();
        set_up_app();

        // Debug initialization
        console.log('Initial state:', {
            href: window.location.href,
            pathname: window.location.pathname,
            buttonHref: $('#login-button-1')[0].getAttribute('href')
        });
    });

    // Test URL parameters without conversion data
    test('Verify no conversion attributes', () => {
        const button = $('#login-button-1')[0];
        const conversionAttrs = [
            "linkedin-conversion",
            "twitter-conversion",
            "reddit-conversion",
            "data-analytics",
            "factor-conversion"
        ];
        for (const attr of conversionAttrs) {
            expect(button.getAttribute(attr)).toBeNull();
        }
    });

    // Test basic URL parameters
    test('Verify basic URL parameters', () => {
        const button = $('#login-button-1')[0];
        const href = button.getAttribute('href');
        const url = new URL(href);
        // Login buttons should preserve original UTM parameters
        expect(url.searchParams.get('utm_campaign')).toBe('new');
        // But should still add submission URL
        expect(url.searchParams.get('submission_url')).toBe('/product/soc2');
    });

    // Test click behavior
    test('Verify UTM cookie deletion on click', () => {
        // Clean up any existing cookies
        delete_utm_cookie();

        // Set up UTM parameters in cookie
        const params = new URLSearchParams();
        params.set('utm_source', 'test');
        setCookie(params);

        // Verify cookie exists
        expect(get_utm_cookie()).not.toBeNull();

        // Click and verify deletion
        $('#login-button-1').click();
        expect(get_utm_cookie()).toBeNull();
    });

    // Test relative URLs remain unchanged
    test('Relative link remains unchanged', () => {
        const href = $('#login-button-bad')[0].getAttribute('href');
        expect(href).toBe('#login');
    });
});
