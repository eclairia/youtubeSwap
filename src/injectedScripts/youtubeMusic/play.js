(function () {
    let element = document
        .querySelector('ytmusic-app')
        .querySelector('ytmusic-app-layout')
        .querySelector('ytmusic-player-bar')
        .querySelector('.left-controls')
        .querySelector('.left-controls-buttons')
        .querySelector('#play-pause-button');

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