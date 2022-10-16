import * as $5OpyM$jquery from "jquery";
import $5OpyM$jscookie from "js-cookie";



function $cf838c15c8b009ba$export$dd4f9598029355d7() {
    (0, $5OpyM$jscookie).remove("chocolate-chip");
}
function $cf838c15c8b009ba$export$d757ca3bd7cea340() {
    let chocolate = (0, $5OpyM$jscookie).get("chocolate-chip");
    if (chocolate) return chocolate;
    return null;
}
function $cf838c15c8b009ba$export$94f970d626ae932c() {
    return (0, $5OpyM$jscookie).get("hubspotutk");
}
function $cf838c15c8b009ba$export$110700823644f4a6(newList) {
    (0, $5OpyM$jscookie).set("chocolate-chip", newList, {
        expires: 7
    });
}
function $cf838c15c8b009ba$export$7e922a34be86fb5(referringHost, domains) {
    for (const domain of domains){
        if (referringHost.toLowerCase().endsWith(domain)) return true;
    }
    return false;
}
function $cf838c15c8b009ba$export$9d6ab201958b766(newList, key, defaultValue) {
    if (!newList.has(key)) newList.set(key, defaultValue);
}
function $cf838c15c8b009ba$export$7118163db09ddbad() {
    var newList = null;
    var existingCookie = $cf838c15c8b009ba$export$d757ca3bd7cea340();
    if (existingCookie) // if it exists then start from the existing values
    newList = new URLSearchParams(existingCookie);
    return newList;
}
function $cf838c15c8b009ba$export$cacc776266b49a35() {
    var queryString = window.location.search;
    // ?utm_source=facebook&utm_medium=post&utm_campaign=webflow
    var URLSearchParams_wb = new URLSearchParams(queryString);
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
    ];
    var newList = new URLSearchParams();
    var existing = $cf838c15c8b009ba$export$7118163db09ddbad();
    if (existing) newList = existing;
    for (const utm_element of utmParameters){
        var value = URLSearchParams_wb.get(utm_element);
        if (value) newList.set(utm_element, value);
    }
    var default_utm_source = "direct";
    var default_utm_content = "not_provided";
    var default_utm_medium = "direct";
    var default_utm_campaign = "brand";
    var currentUrl = new URL(window.location);
    if (document.referrer) {
        //if we can't place referrer than default to referrer
        default_utm_medium = "referral";
        default_utm_campaign = "not_provided";
        let referrer = new URL(document.referrer);
        var referringHost = referrer.host;
        newList.set("referring_domain", referringHost);
        // default content to not_provided
        default_utm_content = "not_provided";
        // default source to referring domain
        default_utm_source = referringHost;
        if ($cf838c15c8b009ba$export$7e922a34be86fb5(referringHost, searchDomains)) {
            default_utm_medium = "organic_search";
            if (currentUrl.pathname === "/") default_utm_campaign = "brand";
            else default_utm_campaign = "not_provided";
        } else if ($cf838c15c8b009ba$export$7e922a34be86fb5(referringHost, socialDomains)) {
            default_utm_medium = "organic_social";
            default_utm_content = "not_provided";
            default_utm_campaign = "earned";
        } else if ($cf838c15c8b009ba$export$7e922a34be86fb5(referringHost, productDomains)) {
            default_utm_medium = "product";
            default_utm_content = "not_provided";
            if (referringHost === "mail.nudgesecurity.io") default_utm_source = "email";
            else default_utm_source = "ui";
        }
    }
    $cf838c15c8b009ba$export$9d6ab201958b766(newList, "utm_medium", default_utm_medium);
    $cf838c15c8b009ba$export$9d6ab201958b766(newList, "utm_source", default_utm_source);
    $cf838c15c8b009ba$export$9d6ab201958b766(newList, "utm_content", default_utm_content);
    $cf838c15c8b009ba$export$9d6ab201958b766(newList, "utm_campaign", default_utm_campaign);
    $cf838c15c8b009ba$export$9d6ab201958b766(newList, "utm_term", "not_provided");
    var landing_url = currentUrl.pathname;
    if (landing_url === "/") landing_url = "home";
    newList.set("landing_url", landing_url);
    $cf838c15c8b009ba$export$110700823644f4a6(newList);
}
function $cf838c15c8b009ba$export$8330960a53c897f0(element) {
    var href = element.getAttribute("href");
    if (href) {
        var url = new URL(href);
        url.searchParams.set("freeTrial", true);
        if (analytics) {
            let user = analytics.user();
            if (user) url.searchParams.set("ajs_aid", user.anonymousId());
        }
        var hub = $cf838c15c8b009ba$export$94f970d626ae932c();
        if (hub && hub !== "") url.searchParams.set("hub", hub);
        var utm_cookie = $cf838c15c8b009ba$export$d757ca3bd7cea340();
        if (utm_cookie) {
            var cached = new URLSearchParams(utm_cookie);
            for (const key of cached.keys())url.searchParams.set(key, cached.get(key));
        }
        element.setAttribute("href", url.href);
    }
}
function $cf838c15c8b009ba$export$9920b26211772ca4() {
    $5OpyM$jquery("[trial-button]").each(function() {
        $cf838c15c8b009ba$export$8330960a53c897f0($5OpyM$jquery(this)[0]);
        $5OpyM$jquery(this).on("click", ()=>{
            $cf838c15c8b009ba$export$dd4f9598029355d7();
        });
    });
}
function $cf838c15c8b009ba$export$2139ae5882b26f61() {
    $5OpyM$jquery("[data-analytics]").on("click", function(e) {
        var properties;
        var event = $5OpyM$jquery(this).attr("data-analytics");
        $5OpyM$jquery.each(this.attributes, function(_, attribute) {
            if (attribute.name.startsWith("data-property-")) {
                if (!properties) properties = {};
                var property = attribute.name.split("data-property-")[1];
                properties[property] = attribute.value;
            }
        });
        analytics.track(event, properties);
    });
}


export {$cf838c15c8b009ba$export$dd4f9598029355d7 as delete_utm_cookie, $cf838c15c8b009ba$export$d757ca3bd7cea340 as get_utm_cookie, $cf838c15c8b009ba$export$94f970d626ae932c as get_hubspot_cookie, $cf838c15c8b009ba$export$110700823644f4a6 as setCookie, $cf838c15c8b009ba$export$7e922a34be86fb5 as endsWithDomain, $cf838c15c8b009ba$export$9d6ab201958b766 as setIfUnset, $cf838c15c8b009ba$export$7118163db09ddbad as getURLSearchParamsForCookie, $cf838c15c8b009ba$export$cacc776266b49a35 as process_utm_data, $cf838c15c8b009ba$export$8330960a53c897f0 as processHrefTrialParams, $cf838c15c8b009ba$export$9920b26211772ca4 as selectAndUpdateTrialButtons, $cf838c15c8b009ba$export$2139ae5882b26f61 as selectAndUpdateDataAnalytics};
//# sourceMappingURL=module.js.map
