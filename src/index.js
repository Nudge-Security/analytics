import Cookies from "../node_modules/js-cookie/index.js";

export function delete_utm_cookie() {
    Cookies.remove('chocolate-chip')
}

export function get_utm_cookie() {
    let chocolate = Cookies.get('chocolate-chip');
    if(chocolate){
        return chocolate
    }
    return null
}

export function get_hubspot_cookie() {
    return Cookies.get('hubspotutk')
}

export function setCookie(newList) {
    Cookies.set('chocolate-chip',newList,{expires:7})
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
    var newList = null;
    var existingCookie = get_utm_cookie()
    if (existingCookie) {
        // if it exists then start from the existing values
        newList = new URLSearchParams(existingCookie);
    }
    return newList;
}
const utmParameters = [
    "utm_source",
    "utm_medium",
    "utm_content",
    "utm_term",
    "gclid",
    "utm_campaign"
];
const socialDomains = [
    "facebook.com",
    "twitter.com",
    "instagram.com",
    "whatsapp.com",
    "tiktok.com",
    "reddit.com",
    "linkedin.com",
    "vk.com",
    "discord.com",
    "pinterest.com"
];
const searchDomains = [
    "google.com",
    "baidu.com",
    "yandex.ru",
    "bing.com",
    "duckduckgo.com",
    "daum.net",
    "seznam.cz",
    "sogou.com",
    "sm.cn",
    "ecosia.org"
];
const productDomains = [
    "nudgesecurity.io"
]
export function process_utm_data() {
    var queryString = window.location.search;
    // ?utm_source=facebook&utm_medium=post&utm_campaign=webflow
    var URLSearchParams_wb = new URLSearchParams(queryString);



    var newList = new URLSearchParams();

    var existing = getURLSearchParamsForCookie();
    if (existing){
        newList = existing
    }
    for (const utm_element of utmParameters) {
        var value = URLSearchParams_wb.get(utm_element)
        if (value) {
            newList.set(utm_element, value)
        }
    }
    var default_utm_source = "direct"
    var default_utm_content = "not_provided"
    var default_utm_medium = 'direct'
    var default_utm_campaign = 'brand'

    var currentUrl = new URL(window.location)
    if (document.referrer) {
        //if we can't place referrer than default to referrer
        default_utm_medium = 'referral'
        default_utm_campaign = 'not_provided'
        let referrer = new URL(document.referrer);
        var referringHost = referrer.host;
        //Try to detect internal navigation
        if (endsWithDomain(referringHost,['nudgesecurity.com'])){
            // and bail
            return
        }
        newList.set('referring_domain', referringHost)
        // default content to not_provided
        default_utm_content = 'not_provided'
        // default source to referring domain
        default_utm_source = referringHost
        if (endsWithDomain(referringHost, searchDomains)) {
            default_utm_medium = 'organic_search';
            if (currentUrl.pathname === '/') {
                default_utm_campaign = 'brand'
            } else {
                default_utm_campaign = 'not_provided'
            }
        } else if (endsWithDomain(referringHost, socialDomains)) {
            default_utm_medium = 'organic_social';
            default_utm_content = 'not_provided'
            default_utm_campaign = 'earned'
        } else if (endsWithDomain(referringHost, productDomains)) {
            default_utm_medium = 'product';
            default_utm_content = 'not_provided'
            if (referringHost === 'mail.nudgesecurity.io') {
                default_utm_source = 'email'
            } else {
                default_utm_source = 'ui'
            }
        }
    }
    setIfUnset(newList, 'utm_medium', default_utm_medium)
    setIfUnset(newList, 'utm_source', default_utm_source)
    setIfUnset(newList, 'utm_content', default_utm_content)
    setIfUnset(newList, 'utm_campaign', default_utm_campaign)
    setIfUnset(newList, 'utm_term', 'not_provided')
    newList.set('landing_url', get_current_path())
    setCookie(newList);
}

function get_current_path() {
    var current_path = new URL(window.location).pathname
    if (current_path === '/') {
        current_path = 'home'
    }
    return current_path;
}

export function processHrefTrialParams(element, includeAnalytics=false, hub_cookie=null) {
    var href = element.getAttribute('href');
    if (href && href.startsWith("http")) {
        var url = new URL(href);

        var utm_cookie = get_utm_cookie()
        var gclid = null;
        if (utm_cookie) {
            var cached = new URLSearchParams(utm_cookie);
            for (const key of cached.keys()) {
                url.searchParams.set(key, cached.get(key))
                if (key === 'gclid'){
                    gclid = cached.get(key)
                }
            }
        }
        url.searchParams.set("freeTrial", true);
        if (includeAnalytics && analytics) {
            let user = analytics.user();
            if (user) {
                url.searchParams.set("ajs_aid", user.anonymousId());
                url.searchParams.set("ajs_event", "Trial Signup Landing");
            }
        }
        if(hub_cookie == null){
            hub_cookie = get_hubspot_cookie()
        }
        if (hub_cookie && hub_cookie !== '') {
            url.searchParams.set("hub", hub_cookie);
        } else{
            console.log(`No hub cookie hub_cookie ${hub_cookie} - ${get_hubspot_cookie()}`)
        }
        var current_path = get_current_path();
        url.searchParams.set('submission_url',current_path)
        element.setAttribute('data-analytics','trial_click')
        element.setAttribute(`data-property-submission-url`,current_path)
        if (gclid){
            element.setAttribute(`data-property-gclid`,gclid)
        }
        element.setAttribute('lic',10010068 )
        element.setAttribute('href', url.href);
    }
}

export function selectAndUpdateTrialButtons() {
    $('[trial-button]').each(function() {
        processHrefTrialParams($(this)[0]);
        $(this).on('click', (e) => {
            delete_utm_cookie();
        })
    });
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
    if (analytics) {
        analytics.track(event, properties)
    }
    if (gtag){
        gtag('event', event, properties);
    }
}

export function selectAndUpdateDataAnalytics(){
    $('[data-analytics]').on('click', function(e) {
        sendDataAnalyticsEvent.call(this);
    });
}
export function selectAndUpdateLinkedInConversion(){
    $('[lic]').on('click', function(e) {
        var conv_id = $(this).attr('lic')
        if (lintrk){
            lintrk('track', {conversion_id:conv_id});
        }
    });
}

export function updateTrialButtonAJSID() {
    $('[trial-button]').each(function() {
        processHrefTrialParams($(this)[0], true);
    });
}
export function updateTrialButtonHub(hub_cookie) {
    $('[trial-button]').each(function() {
        processHrefTrialParams($(this)[0], true,hub_cookie );
    });
}

export function configureHubSpotPages() {

    var _hsq = window._hsq = window._hsq || [];
    if (window.location.pathname.includes("post")) {
        _hsq.push(['setContentType', 'blog-post']);
    } else if (window.nudgeHbsptLandingPage === true) {
        _hsq.push(['setContentType', 'landing-page']);
    } else {
        _hsq.push(['setContentType', 'standard-page']);
    }
}

export function configure() {
    process_utm_data();
    selectAndUpdateTrialButtons();
    selectAndUpdateDataAnalytics();
    selectAndUpdateLinkedInConversion();
    configureHubSpotPages();
    analytics.ready(function () {
        updateTrialButtonAJSID();
    });
    _hsq.push(['addIdentityListener', function(hstc, hssc, hsfp) {
        console.log('identify listener')
        // Add these query parameters to any links that point to a separate tracked domain
        if (hstc){
            var segments = hstc.split('.')
            if (segments.length >=2){
                var hub_cookie = segments[1];
                updateTrialButtonHub(hub_cookie)
            }
        }
    }]);
}

$(document).ready(function() {
    configure();
})