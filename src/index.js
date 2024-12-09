import Cookies from '../node_modules/js-cookie/index.js'

export function delete_utm_cookie() {
    Cookies.remove('chocolate-chip')
}

export function get_utm_cookie() {
    let chocolate = Cookies.get('chocolate-chip')
    if (chocolate) {
        return chocolate
    }
    return null
}

export function get_hubspot_cookie() {
    return Cookies.get('hubspotutk')
}

export function setCookie(newList) {
    Cookies.set('chocolate-chip', newList, { expires: 7 })
}

export function endsWithDomain(referringHost, domains) {
    for (const domain of domains) {
        if (referringHost.toLowerCase().endsWith(domain)) {
            return true
        }
    }
    return false
}

export function setIfUnset(newList, key, defaultValue) {
    if (!newList.has(key)) {
        newList.set(key, defaultValue)
    }
}

export function getURLSearchParamsForCookie() {
    var newList = null
    var existingCookie = get_utm_cookie()
    if (existingCookie) {
        // if it exists then start from the existing values
        newList = new URLSearchParams(existingCookie)
    }
    return newList
}

const utmParameters = [
    'utm_source',
    'utm_medium',
    'utm_content',
    'utm_term',
    'gclid',
    'utm_campaign',
]
const socialDomains = [
    'facebook.com',
    'twitter.com',
    'instagram.com',
    'whatsapp.com',
    'tiktok.com',
    'reddit.com',
    'linkedin.com',
    'vk.com',
    'discord.com',
    'pinterest.com',
]
const searchDomains = [
    'google.com',
    'baidu.com',
    'yandex.ru',
    'bing.com',
    'duckduckgo.com',
    'daum.net',
    'seznam.cz',
    'sogou.com',
    'sm.cn',
    'ecosia.org',
]
const productDomains = ['nudgesecurity.io']
const fabParameterMapping = {
    utm_medium: 'fab_m',
    utm_source: 'fab_s',
    utm_content: 'fab_co',
    utm_campaign: 'fab_ca',
    utm_term: 'fab_t',
    utm_email: 'fab_e',
}

function get_encoded_parameters(url) {
    if (!(url instanceof URL)) {
        throw new Error('Parameter must be a URL object')
    }
    let params = {}
    url.searchParams.forEach((value, key) => {
        if (key != 'biscotti') {
            params[key] = value
        }
    })

    // Convert the parameters object to a JSON string
    let jsonString = JSON.stringify(params)

    return btoa(jsonString)
}

export function process_utm_data() {
    var queryString = window.location.search
    var URLSearchParams_wb = new URLSearchParams(queryString)

    var newList = new URLSearchParams()

    var existing = getURLSearchParamsForCookie()
    if (existing) {
        newList = existing
    }
    for (const utm_element of utmParameters) {
        var value = URLSearchParams_wb.get(utm_element)
        if (value) {
            newList.set(utm_element, value)
        }
    }
    if (document.referrer) {
        let referrer = new URL(document.referrer)
        var referringHost = referrer.host
        //Try to detect internal navigation
        if (endsWithDomain(referringHost, ['nudgesecurity.com'])) {
            // and bail
            return
        }
        newList.set('referring_domain', referringHost)
    }
    newList.set('landing_url', get_current_path())
    setCookie(newList)
}

export function get_current_path() {
    var current_path = new URL(window.location).pathname
    if (current_path === '/') {
        current_path = 'home'
    }
    return current_path
}

export function processHrefTrialParams(
    element,
    includeAnalytics = false,
    hub_cookie = null,
    includeConversionData = true
) {
    var href = element.getAttribute('href')
    if (href && href.startsWith('http')) {
        var url = new URL(href)
        var originalParams = new URLSearchParams(url.search)

        var utm_cookie = get_utm_cookie()
        var gclid = null
        if (utm_cookie) {
            var cached = new URLSearchParams(utm_cookie)
            for (const key of cached.keys()) {
                var value = cached.get(key)
                // Only set UTM params if they're not already in the URL
                if (!originalParams.has(key)) {
                    url.searchParams.set(key, value)
                }

                if (key === 'gclid') {
                    gclid = cached.get(key)
                }

                // Set parameter if found in look up map
                var fabKey = fabParameterMapping[key]
                if (fabKey) {
                    url.searchParams.set(fabKey, value)
                }
            }
        }
        url.searchParams.set('ajs_event', 'trial_click_io_landing')
        if (includeAnalytics && analytics) {
            let user = analytics.user()
            if (user) {
                url.searchParams.set('ajs_aid', user.anonymousId())
                url.searchParams.set('fab_seg', user.anonymousId())
            }
        }
        if (hub_cookie == null) {
            hub_cookie = get_hubspot_cookie()
        }
        if (hub_cookie && hub_cookie !== '') {
            url.searchParams.set('hub', hub_cookie)
            url.searchParams.set('fab_hsc', hub_cookie)
        }
        var current_path = get_current_path();
        url.searchParams.set('submission_url', current_path)

        const biscotti_value = get_encoded_parameters(url)
        url.searchParams.set('biscotti', biscotti_value)

        if (includeConversionData) {
            const entries = Object.entries(window.trial_conversions)
            for (const [attr, value] of entries) {
                element.setAttribute(attr, value)
            }
        }
        element.setAttribute(`data-property-submission-url`, current_path)
        if (gclid) {
            element.setAttribute(`data-property-gclid`, gclid)
        }
        element.setAttribute('href', url.href)
    }
}

export function selectAndUpdateTrialButtons() {
    $('[trial-button]').each(function () {
        processHrefTrialParams($(this)[0])
        $(this).on('click', (e) => {
            delete_utm_cookie()
            var url = e.target.getAttribute('href')
            track_event('trial_click_leaving_com', { target: url })
        })
    })
}

export function selectAndUpdateLoginButtons() {
    $('[login-button]').each(function () {
        processHrefTrialParams($(this)[0], false, null, false)
        $(this).on('click', (e) => {
            delete_utm_cookie()
        })
    })
}

function track_event(event, properties = {}) {
    if (typeof analytics != 'undefined') {
        analytics.track(event, properties)
    }

    if (typeof gtag != 'undefined') {
        gtag('event', event, properties)
    }
}

function sendDataAnalyticsEvent() {
    var properties
    var event = $(this).attr('data-analytics')
    $.each(this.attributes, function (_, attribute) {
        if (attribute.name.startsWith('data-property-')) {
            if (!properties) properties = {}
            var property = attribute.name.split('data-property-')[1]
            properties[property] = attribute.value
        }
    })
    track_event(event, properties)
}

export function selectAndUpdateDataAnalytics() {
    $('[data-analytics]').on('click', function (e) {
        sendDataAnalyticsEvent.call(this)
    })
}

export function selectAndUpdateLinkedInConversion() {
    $('[lic]').on('click', function (e) {
        var conv_id = $(this).attr('lic')
        if (typeof lintrk != 'undefined') {
            lintrk('track', { conversion_id: conv_id })
        }
    })
}

export function selectAndUpdateLinkedInConversion2() {
    $('[linkedin-conversion]').on('click', function (e) {
        var conv_id = $(this).attr('linkedin-conversion')
        if (typeof lintrk != 'undefined') {
            lintrk('track', { conversion_id: conv_id })
        }
    })
}

export function selectAndUpdateRedditConversion() {
    $('[reddit-conversion]').on('click', function (e) {
        var event_name = $(this).attr('reddit-conversion')
        if (typeof rdt != 'undefined') {
            rdt('track', 'Custom', { customEventName: event_name })
        }
    })
}

export function selectAndUpdateTwitterConversion() {
    $('[twitter-conversion]').on('click', function (e) {
        var event_code = $(this).attr('twitter-conversion')
        if (typeof twq != 'undefined') {
            twq('event', event_code)
        }
    })
}
export function selectAndUpdateFactorsConversion() {
    $('[factor-conversion]').on('click', function (e) {
        var event_code = $(this).attr('factor-conversion')
        if (typeof faitracker != 'undefined') {
            faitracker.call('track', event_code)
        }
    })
}

export function updateTrialButtonAJSID() {
    $('[trial-button]').each(function () {
        processHrefTrialParams($(this)[0], true)
    })
}

export function configure() {
    process_utm_data()
    selectAndUpdateTrialButtons()
    selectAndUpdateLoginButtons()
    selectAndUpdateDataAnalytics()
    selectAndUpdateLinkedInConversion()
    selectAndUpdateLinkedInConversion2()
    selectAndUpdateRedditConversion()
    selectAndUpdateTwitterConversion()
    selectAndUpdateFactorsConversion()
    analytics.ready(function () {
        updateTrialButtonAJSID()
        let user = analytics.user()
        if (user) {
            var id = user.anonymousId()
            gtag('config', 'G-MJ4CRTC1EM', {
                user_id: id,
            })
            if (typeof faitracker != 'undefined') {
                faitracker.call('identify', id)
            }
        }
    });
}

$(document).ready(function () {
    configure()
})
window.addEventListener('message', (event) => {
    const allowedOrigins = [
        'https://challenges.cloudflare.com',
        'https://nudgesecurity-com.webflow.io',
        'https://nudgesecurity.com',
        'https://www.nudgesecurity.com',
        'http://localhost:3000',
    ]
    if (event.origin && !allowedOrigins.includes(event.origin)) {
        return
    }

    if (
        event.data.type === 'hsFormCallback' &&
        event.data.eventName === 'onFormSubmit'
    ) {
        // save track properties
        var track_properties = event.data
        if (track_properties) {
            if (track_properties.data) {
                for (const datum of track_properties.data) {
                    if ('name' in datum && datum['name'] === 'email') {
                        if (analytics) {
                            analytics.identify({ email: datum['value'] })
                        }
                    }
                }
            }
        }
    }
    if (
        event.data.type === 'hsFormCallback' &&
        event.data.eventName === 'onFormSubmitted'
    ) {
        if (window.hs_form_events) {
            const entries = Object.entries(window.hs_form_events)
            for (const [attr, value] of entries) {
                if (event.data.id === attr) {
                    track_event(value)
                }
            }
        }
    }

    if (
        event.data.type === 'hsFormCallback' &&
        event.data.eventName === 'onFormReady'
    ) {
        const fields = [
            'utm_source',
            'utm_medium',
            'utm_content',
            'utm_term',
            'utm_email',
            'utm_campaign',
            'utm_landing_url',
            'utm_referring_domain'
        ];
        const utm_cookie = get_utm_cookie()
        if (utm_cookie) {
            const cached = new URLSearchParams(utm_cookie);
            document
                .querySelectorAll(".hs-form-iframe")
                .forEach(function (iframe) {
                    for (const field of fields) {
                        const value = cached.get(field);
                        if (value) {
                            const formField = iframe.contentWindow.document.querySelector(
                                `input[name="${field}"]`
                            );
                            if (formField) {
                                formField.value = value;
                            }
                        }
                    }
                });
            for (const field of fields) {
                const value = cached.get(field);
                if (value) {
                    const formField = document.querySelector(
                        `input[name="${field}"]`
                    );
                    if (formField) {
                        formField.value = value;
                    }
                }
            }
        }
    }
})
