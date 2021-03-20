setInterval(() => {
    chrome.tabs.query({}, async function(tabs){
        let youtubeTabs = tabs.map((tab) => {
            if (tab.url.match('^(http|https):\\/\\/(?:www.)?(music\\.youtube|youtube)\\.com\\/watch\\?v\\=.*$')) {
                return tab;
            }
        }).filter((tab) => {
            return tab !== undefined;
        });

        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            if (tabs.length >= 1) {
                chrome.tabs.sendMessage(tabs[0].id, {text: 'youtube_tabs', youtubeTabs: youtubeTabs});
            }
        });
    });
}, 1000);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    let tabId = request.tabId;
    let tabUrl = request.tabUrl;

    if (request.type === 'get_cookie') {
        chrome.cookies.get({
            name: request.name,
            url: "https://*/*",
        }, (cookie) => {
            sendResponse({value: cookie.value});
        });
    }

    if (request.type === 'set_cookie') {
        chrome.cookies.set({
            name: request.name,
            url: "https://*/*",
            value: request.value
        }, () => {
        });
    }

    if (request.type === 'previous') {
        if (tabUrl.match('^(http|https):\\/\\/(?:www.)?music\\.youtube')) {
            chrome.tabs.executeScript(tabId, {file: 'src/injectedScripts/youtubeMusic/previous.js', runAt: 'document_end'});
        } else {
            chrome.tabs.goBack(tabId);
        }
    }

    if (request.type === 'play') {
        if (tabUrl.match('^(http|https):\\/\\/(?:www.)?music\\.youtube')) {
            chrome.tabs.executeScript(tabId, {file: 'src/injectedScripts/youtubeMusic/play.js', runAt: 'document_end'});
        } else {
            chrome.tabs.executeScript(tabId, {file: 'src/injectedScripts/youtube/play.js', runAt: 'document_end'});
        }
    }

    if (request.type === 'focus') {
        chrome.tabs.get(tabId, function(tab) {
            chrome.tabs.highlight({windowId: tab.windowId, tabs: tab.index}, () => {
                chrome.windows.update(tab.windowId, {focused: true});
            });
        });
    }

    if (request.type === 'next') {
        if (tabUrl.match('^(http|https):\\/\\/(?:www.)?music\\.youtube')) {
            chrome.tabs.executeScript(tabId, {file: 'src/injectedScripts/youtubeMusic/next.js', runAt: 'document_end'});
        } else {
            chrome.tabs.executeScript(tabId, {file: 'src/injectedScripts/youtube/next.js', runAt: 'document_end'});
        }
    }

    return true;
});