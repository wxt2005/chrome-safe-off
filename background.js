// 判断域名是不是google
var isGoogleSearch = function(url) {
    var hostReg = new RegExp ("^(https?:\\/\\/)([a-z1-9]{1,}\\.)?google(\\.[a-z]{1,})(\\.[a-z1-9]{1,})?\\/search\\?", "gi");
    return url.match(hostReg);
};

// 把url加上safe=off
var changeProp = function(oldUrl, name, value) {
    var newUrl = "";
    var reg = new RegExp("(^|)" + name + "=([^&]*)(|$)", "gi");
    var prop = name + "=" + value;

    if (oldUrl.match(reg)) {
        if (oldUrl.match(reg)[0] === prop) {
            return {};
        }
        newUrl = oldUrl.replace(oldUrl.match(reg)[0], prop);
    } else {
        newUrl = oldUrl + "&" + prop;
    }

    return {
        redirectUrl: newUrl
    };
};

// 判断是否显示图标
var showIcon = function(currentUrl, currentTabId, name, value) {
    var prop = name + "=" + value;

    if(currentUrl.indexOf(prop) !== -1) {
        chrome.pageAction.show(currentTabId);
    }
};

// 监听onBeforeReques事件，用于添加safe=off
chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        if (isGoogleSearch(details.url)) {
            return changeProp(details.url, "safe", "off");
        }
    },
    {
        urls: ["<all_urls>"]
    },
    ["blocking"]
);

// 监听onCompleted事件，用于显示图标
chrome.webRequest.onCompleted.addListener(
    function(details) {
        if (isGoogleSearch(details.url)) {
        showIcon(details.url, details.tabId, "safe", "off")
        }
    },
    {
        urls: ["<all_urls>"]
    }
);
