import { h, Component, render } from 'preact';

import { Popup } from './popup';

import './css/main.css';

(function () {
    const placeholder = document.createElement("div");
    document.body.appendChild(placeholder);

    render(<Popup/>, document.body, placeholder);
})();