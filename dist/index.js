var $gXNCa$jquery = require("jquery");
var $gXNCa$jscookie = require("js-cookie");

function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}
function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "delete_utm_cookie", () => $4fa36e821943b400$export$dd4f9598029355d7);
$parcel$export(module.exports, "get_utm_cookie", () => $4fa36e821943b400$export$d757ca3bd7cea340);
$parcel$export(module.exports, "get_hubspot_cookie", () => $4fa36e821943b400$export$94f970d626ae932c);
$parcel$export(module.exports, "setCookie", () => $4fa36e821943b400$export$110700823644f4a6);
$parcel$export(module.exports, "endsWithDomain", () => $4fa36e821943b400$export$7e922a34be86fb5);
$parcel$export(module.exports, "setIfUnset", () => $4fa36e821943b400$export$9d6ab201958b766);
$parcel$export(module.exports, "getURLSearchParamsForCookie", () => $4fa36e821943b400$export$7118163db09ddbad);
$parcel$export(module.exports, "process_utm_data", () => $4fa36e821943b400$export$cacc776266b49a35);
$parcel$export(module.exports, "processHrefTrialParams", () => $4fa36e821943b400$export$8330960a53c897f0);
$parcel$export(module.exports, "selectAndUpdateTrialButtons", () => $4fa36e821943b400$export$9920b26211772ca4);
$parcel$export(module.exports, "selectAndUpdateDataAnalytics", () => $4fa36e821943b400$export$2139ae5882b26f61);


function $4fa36e821943b400$export$dd4f9598029355d7() {
    (0, ($parcel$interopDefault($gXNCa$jscookie))).remove("chocolate-chip");
}
function $4fa36e821943b400$export$d757ca3bd7cea340() {
    let chocolate = (0, ($parcel$interopDefault($gXNCa$jscookie))).get("chocolate-chip");
    if (chocolate) return chocolate;
    return null;
}
function $4fa36e821943b400$export$94f970d626ae932c() {
    return (0, ($parcel$interopDefault($gXNCa$jscookie))).get("hubspotutk");
}
function $4fa36e821943b400$export$110700823644f4a6(newList) {
    (0, ($parcel$interopDefault($gXNCa$jscookie))).set("chocolate-chip", newList, {
        expires: 7
    });
}
function $4fa36e821943b400$export$7e922a34be86fb5(referringHost, domains) {
    for (const domain of domains){
        if (referringHost.toLowerCase().endsWith(domain)) return true;
    }
    return false;
}
function $4fa36e821943b400$export$9d6ab201958b766(newList, key, defaultValue) {
    if (!newList.has(key)) newList.set(key, defaultValue);
}
function $4fa36e821943b400$export$7118163db09ddbad() {
    var newList = null;
    var existingCookie = $4fa36e821943b400$export$d757ca3bd7cea340();
    if (existingCookie) // if it exists then start from the existing values
    newList = new URLSearchParams(existingCookie);
    return newList;
}
function $4fa36e821943b400$export$cacc776266b49a35() {
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
    var existing = $4fa36e821943b400$export$7118163db09ddbad();
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
        if ($4fa36e821943b400$export$7e922a34be86fb5(referringHost, searchDomains)) {
            default_utm_medium = "organic_search";
            if (currentUrl.pathname === "/") default_utm_campaign = "brand";
            else default_utm_campaign = "not_provided";
        } else if ($4fa36e821943b400$export$7e922a34be86fb5(referringHost, socialDomains)) {
            default_utm_medium = "organic_social";
            default_utm_content = "not_provided";
            default_utm_campaign = "earned";
        } else if ($4fa36e821943b400$export$7e922a34be86fb5(referringHost, productDomains)) {
            default_utm_medium = "product";
            default_utm_content = "not_provided";
            if (referringHost === "mail.nudgesecurity.io") default_utm_source = "email";
            else default_utm_source = "ui";
        }
    }
    $4fa36e821943b400$export$9d6ab201958b766(newList, "utm_medium", default_utm_medium);
    $4fa36e821943b400$export$9d6ab201958b766(newList, "utm_source", default_utm_source);
    $4fa36e821943b400$export$9d6ab201958b766(newList, "utm_content", default_utm_content);
    $4fa36e821943b400$export$9d6ab201958b766(newList, "utm_campaign", default_utm_campaign);
    $4fa36e821943b400$export$9d6ab201958b766(newList, "utm_term", "not_provided");
    var landing_url = currentUrl.pathname;
    if (landing_url === "/") landing_url = "home";
    newList.set("landing_url", landing_url);
    $4fa36e821943b400$export$110700823644f4a6(newList);
}
function $4fa36e821943b400$export$8330960a53c897f0(element) {
    var href = element.getAttribute("href");
    if (href) {
        var url = new URL(href);
        url.searchParams.set("freeTrial", true);
        if (analytics) {
            let user = analytics.user();
            if (user) url.searchParams.set("ajs_aid", user.anonymousId());
        }
        var hub = $4fa36e821943b400$export$94f970d626ae932c();
        if (hub && hub !== "") url.searchParams.set("hub", hub);
        var utm_cookie = $4fa36e821943b400$export$d757ca3bd7cea340();
        if (utm_cookie) {
            var cached = new URLSearchParams(utm_cookie);
            for (const key of cached.keys())url.searchParams.set(key, cached.get(key));
        }
        element.setAttribute("href", url.href);
    }
}
function $4fa36e821943b400$export$9920b26211772ca4() {
    $gXNCa$jquery("[trial-button]").each(function() {
        $4fa36e821943b400$export$8330960a53c897f0($gXNCa$jquery(this)[0]);
        $gXNCa$jquery(this).on("click", ()=>{
            $4fa36e821943b400$export$dd4f9598029355d7();
        });
    });
}
function $4fa36e821943b400$export$2139ae5882b26f61() {
    $gXNCa$jquery("[data-analytics]").on("click", function(e) {
        var properties;
        var event = $gXNCa$jquery(this).attr("data-analytics");
        $gXNCa$jquery.each(this.attributes, function(_, attribute) {
            if (attribute.name.startsWith("data-property-")) {
                if (!properties) properties = {};
                var property = attribute.name.split("data-property-")[1];
                properties[property] = attribute.value;
            }
        });
        analytics.track(event, properties);
    });
}


//# sourceMappingURL=index.js.map
