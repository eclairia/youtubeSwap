import { h, Component, render } from 'preact';

import { YoutubeTab } from './youtubeTab.jsx';

export class Popup extends Component {
    render () {
        let closeButtonUrl = chrome.runtime.getURL('src/img/cancel.svg');

        return this.state.youtubeTabs.length >= 1 && <div id="ytswap__root">
             <span id="ytswap__popup_open_button" className="ytswap__popup_open_button" onClick={(e) => {
                 e.preventDefault();

                 this.openPopup();
             }}>&lt;</span>

            <div id="ytswap__root_main">
                <h1>Youtube Swap</h1>

                <img src={closeButtonUrl} className="ytswap__svg_close_cross" title="Fermer" alt="Fermer" onClick={(e) => {
                    e.preventDefault();

                    this.closePopup();
                }} />

                <div className="ytswap__tabs">
                    {this.state.youtubeTabs.map((youtubeTab, index) => {
                        return <YoutubeTab youtubeTab={youtubeTab} index={index} />
                    })}
                </div>
            </div>
        </div>
    }

    componentWillMount() {
        this.setState({youtubeTabs: []});
        chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
            if (msg.text === 'youtube_tabs') {
                this.setState({youtubeTabs: msg.youtubeTabs});
            }
        });
    }

    async componentDidUpdate() {
        let ytswapRootElement =  document.querySelector('#ytswap__root');
        let ytswapPopupOpenButton = document.querySelector('#ytswap__popup_open_button');

        if (ytswapRootElement && ytswapPopupOpenButton) {
            if (await this.getCookie('ytswap_popup_closed') === 'true') {

                if (!ytswapRootElement.classList.contains('ytswap__root_close_cookie')) {
                    ytswapRootElement.classList.remove('ytswap__root_open_animation');
                    ytswapRootElement.classList.remove('ytswap__root_open_cookie');
                    ytswapRootElement.classList.add('ytswap__root_close_cookie');

                    ytswapPopupOpenButton.style.opacity = 1;
                } else {
                    if (!ytswapRootElement.classList.contains('ytswap__root_open_cookie')) {
                        ytswapRootElement.classList.remove('ytswap__root_close_animation');
                        ytswapRootElement.classList.remove('ytswap__root_close_cookie');
                        ytswapRootElement.classList.add('ytswap__root_open_cookie');

                        ytswapPopupOpenButton.style.opacity = 0;
                    }
                }
            }
        }
    }

    openPopup() {
        let ytswapRootElement =  document.querySelector('#ytswap__root');

        ytswapRootElement.classList.add('ytswap__root_open_animation');

        if (ytswapRootElement.classList.contains('ytswap__root_close_animation')) {
            ytswapRootElement.classList.remove('ytswap__root_close_animation');
        }

        ytswapRootElement.removeEventListener("webkitAnimationEnd", this.closePopupEndListenner);

        ytswapRootElement.addEventListener("webkitAnimationEnd", this.openPopupEndListenner);

        this.setCookie('ytswap_popup_closed', 'false');
    }

    closePopup() {
        let ytswapRootElement =  document.querySelector('#ytswap__root');
        ytswapRootElement.classList.add('ytswap__root_close_animation');

        if (ytswapRootElement.classList.contains('ytswap__root_open_animation')) {
            ytswapRootElement.classList.remove('ytswap__root_open_animation');
        }

        ytswapRootElement.removeEventListener("webkitAnimationEnd", this.openPopupEndListenner);

        ytswapRootElement.addEventListener("webkitAnimationEnd", this.closePopupEndListenner);

        this.setCookie('ytswap_popup_closed', 'true');
    }

    openPopupEndListenner() {
        let ytswapPopupOpenButton = document.querySelector('#ytswap__popup_open_button');

        ytswapPopupOpenButton.style.opacity = 0;
    }

    closePopupEndListenner() {
        let ytswapPopupOpenButton = document.querySelector('#ytswap__popup_open_button');

        ytswapPopupOpenButton.style.opacity = 1;
    }

    getCookie(name) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({type: "get_cookie", name: name}, (response) => {
                resolve(response.value);
            });
        });
    }

    setCookie(name, value) {
        chrome.runtime.sendMessage({type: "set_cookie", name: name, value: value});
    }
}