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

    !element.dispatchEvent(event);
}