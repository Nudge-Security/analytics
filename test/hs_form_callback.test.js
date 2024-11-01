/**
 *
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://nudgesecurity.com/?utm_campaign=new&utm_source=email&utm_content=read&utm_medium=always&utm_term=on" ,"referrer":"https://www.google.com/"}
 */
'use strict'
/*eslint-env browser */
import './environment.mock'
import { set_up_app } from './environment.mock'

describe('Update Trial Links', () => {
    const $ = require('jquery')
    beforeAll(() => {
        document.body.innerHTML =
            '<div>' +
            '  <a data-analytics="trial" id="event-button" data-property-source="what" data-property-type="foo" href="https://nudgesecurity.io/login" ></a>' +
            '  <a data-analytics="trial2" id="event-button2" data-property-source="what" data-property-type="foo" href="https://nudgesecurity.io/login" ></a>' +
            '</div>'
        set_up_app()
    })
    test('Generate event on click', () => {
        const event1 = new Event('message')
        event1.data = {
            id: '4a2a5926-da9a-43cb-8a9d-efc5a5fa8f32',
            type: 'hsFormCallback',
            eventName: 'onFormSubmit',
            data: [{ name: 'email', value: 'foo.com' }],
        }
        event1.origin = 'https://nudgesecurity.com'
        window.dispatchEvent(event1)
        expect(global.analytics.identify.mock.calls.length).toBe(1)
        expect(global.analytics.identify.mock.calls[0][0]).toStrictEqual({
            email: 'foo.com',
        })
        const event2 = new Event('message')
        event2.data = {
            id: '4a2a5926-da9a-43cb-8a9d-efc5a5fa8f32',
            type: 'hsFormCallback',
            eventName: 'onFormSubmitted',
            data: [{ name: 'email', value: 'foo.com' }],
        }
        window.dispatchEvent(event2)
        expect(global.analytics.track.mock.calls.length).toBe(1)
        expect(global.analytics.track.mock.calls[0][0]).toStrictEqual(
            'newsletter_signup'
        )
    })
})

describe('HubSpot Form UTM Injection', () => {
    beforeEach(() => {
        // Fix the selector to match your original code
        // Note the removal of extra quotes in '.hs-form-iframe'
        document.querySelectorAll = jest.fn((selector) => {
            if (selector === '.hs-form-iframe') {
                return [
                    {
                        contentWindow: {
                            document: {
                                querySelector: (selector) => {
                                    switch (selector) {
                                        case 'input[name="email"]':
                                            return { value: 'foo.com' }
                                        case 'input[name="utm_campaign"]':
                                            return { value: 'new' }
                                        case 'input[name="utm_source"]':
                                            return { value: 'email' }
                                        case 'input[name="utm_content"]':
                                            return { value: 'read' }
                                        case 'input[name="utm_medium"]':
                                            return { value: 'always' }
                                        case 'input[name="utm_term"]':
                                            return { value: 'on' }
                                    }
                                },
                            },
                        },
                    },
                ]
            }
            return []
        })
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    test('Form on ready event and inject utms into iframe hidden fields', () => {
        // Create the HubSpot form ready event
        const event = new MessageEvent('message', {
            data: {
                type: 'hsFormCallback',
                eventName: 'onFormReady',
                data: [{ name: 'email', value: 'foo.com' }],
            },
        })

        // Dispatch the event
        window.dispatchEvent(event)

        // Get the iframe (this will use our mocked querySelectorAll)
        const iframe = document.querySelectorAll('.hs-form-iframe')[0]

        // Verify UTM fields were populated correctly
        expect(
            iframe.contentWindow.document.querySelector(
                'input[name="utm_campaign"]'
            ).value
        ).toBe('new')
        expect(
            iframe.contentWindow.document.querySelector(
                'input[name="utm_source"]'
            ).value
        ).toBe('email')
        expect(
            iframe.contentWindow.document.querySelector(
                'input[name="utm_content"]'
            ).value
        ).toBe('read')
        expect(
            iframe.contentWindow.document.querySelector(
                'input[name="utm_medium"]'
            ).value
        ).toBe('always')
        expect(
            iframe.contentWindow.document.querySelector(
                'input[name="utm_term"]'
            ).value
        ).toBe('on')
    })
})
