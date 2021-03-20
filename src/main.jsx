import { h, Component, render } from 'preact';

import { Popup } from './popup';

import './css/main.css';

(function () {
    const placeholder = document.createElement("div");
    document.body.appendChild(placeholder);

    let closeButtonUrl = chrome.runtime.getURL('src/img/cancel.svg');

    render(<Popup closeButtonUrl={closeButtonUrl} />, document.body, placeholder);
})();