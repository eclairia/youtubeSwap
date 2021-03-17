(function () {
    let element = document
        .querySelector('#content')
        .querySelector('#page-manager')
        .querySelector('ytd-watch-flexy')
        .querySelector('#columns')
        .querySelector('#primary')
        .querySelector('#primary-inner')
        .querySelector('#player')
        .querySelector('#player-container-inner')
        .querySelector('#player-container')
        .querySelector('#ytd-player')
        .querySelector('#container').firstElementChild
        .querySelector('.ytp-chrome-bottom')
        .querySelector('.ytp-chrome-controls')
        .querySelector('.ytp-left-controls')
        .querySelector('.ytp-play-button');

    simulateClick(element);
})();

function simulateClick(element) {
    let event = new MouseEvent('click', {
        'view': window,
        'bubbles': true,
        'cancelable': true
    });

    let canceled = !element.dispatchEvent(event);

    if (canceled) {
        //Un gestionnaire appelé preventDefault.
        console.log("canceled");
    } else {
        //Aucun gestionnaires appelé preventDefault.
        console.log("not canceled");
    }
}

// chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
//     if (msg.text === 'report_back') {
//         console.log(msg.doms);
//     }
// });

// (function () {
//     chrome.tabs.goBack(tabs[8]['id'], () => {
//         console.log('Je teste');
//     });
// })();