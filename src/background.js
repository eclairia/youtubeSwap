setInterval(() => {
    chrome.tabs.query({}, async function(tabs){
        let youtubeTabs = tabs.map((tab) => {
            if (tab.url.match('^(http|https):\\/\\/www.youtube.com\\/watch\\?v\\=.*$')) {
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

    if (request.type === 'previous') {
        chrome.tabs.goBack(tabId);
    }

    if (request.type === 'play') {
        chrome.tabs.executeScript(tabId, {file: 'src/injectedScripts/play.js'});
    }

    if (request.type === 'focus') {
        chrome.tabs.get(tabId, function(tab) {
            chrome.tabs.highlight({'tabs': tab.index});
        });
    }

    if (request.type === 'next') {
        chrome.tabs.executeScript(tabId, {file: 'src/injectedScripts/next.js', runAt: 'document_end'});
    }

    return true;
});