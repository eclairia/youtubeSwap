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

    componentDidUpdate() {
        if (this.getCookie('ytswap_popup_closed') === 'true') {
            let ytswapRootElement =  document.querySelector('#ytswap__root');
            let ytswapPopupOpenButton = document.querySelector('#ytswap__popup_open_button');


            if (ytswapRootElement) {
                ytswapRootElement.classList.add('ytswap__root_close_cookie');
            }

            if (ytswapPopupOpenButton) {
                ytswapPopupOpenButton.style.opacity = 1;
            }
        }
    }

    openPopup() {
        let ytswapRootElement =  document.querySelector('#ytswap__root');

        if (ytswapRootElement.classList.contains('ytswap__root_close_animation')) {
            ytswapRootElement.classList.remove('ytswap__root_close_animation');
        }

        ytswapRootElement.classList.add('ytswap__root_open_animation');

        ytswapRootElement.removeEventListener("webkitAnimationEnd", this.closePopupEndListenner);

        ytswapRootElement.addEventListener("webkitAnimationEnd", this.openPopupEndListenner);

        document.cookie = "ytswap_popup_closed=false"
    }

    closePopup() {
        let ytswapRootElement =  document.querySelector('#ytswap__root');
        ytswapRootElement.classList.add('ytswap__root_close_animation');

        if (ytswapRootElement.classList.contains('ytswap__root_open_animation')) {
            ytswapRootElement.classList.remove('ytswap__root_open_animation');
        }

        ytswapRootElement.removeEventListener("webkitAnimationEnd", this.openPopupEndListenner);

        ytswapRootElement.addEventListener("webkitAnimationEnd", this.closePopupEndListenner);

        document.cookie = "ytswap_popup_closed=true";
    }

    openPopupEndListenner() {
        let ytswapPopupOpenButton = document.querySelector('#ytswap__popup_open_button');

        ytswapPopupOpenButton.style.opacity = 0;
    }

    closePopupEndListenner() {
        let ytswapPopupOpenButton = document.querySelector('#ytswap__popup_open_button');

        ytswapPopupOpenButton.style.opacity = 1;
    }

    getCookie(cname) {
        let name = cname + '=';
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return '';
    }
}