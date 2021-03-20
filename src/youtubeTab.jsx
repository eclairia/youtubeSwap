import { h, Component, render } from 'preact';
import _ from 'lodash';

export class YoutubeTab extends Component {
    render() {
        let previousButtonUrl = chrome.runtime.getURL('src/img/skip_previous-white-18dp.svg');
        let playButtonUrl = chrome.runtime.getURL('src/img/bouton-jouer.svg');
        let pauseButtonUrl = chrome.runtime.getURL('src/img/pause.svg');
        let focusButtonUrl = chrome.runtime.getURL('src/img/focus.svg');
        let nextButtonUrl = chrome.runtime.getURL('src/img/skip_next-white-18dp.svg');

        let youtubeTab = this.props.youtubeTab;

        return <div key={this.props.index} className="ytswap__tab">
                <span className="ytswap__title">{youtubeTab.title}</span><br/>
                <div className="ytswap__actions">
                    <img src={previousButtonUrl} className="ytswap__svg" title="Vidéo précédente" alt="Vidéo précédente" onClick={(e) => {
                        this.previous(e, youtubeTab.id, youtubeTab.url)
                    }}/>
                    <img src={youtubeTab.audible === true ? pauseButtonUrl : playButtonUrl} className="ytswap__svg" title={youtubeTab.audible === true ? 'Pause' : 'Play'} alt={youtubeTab.audible === true ? 'Pause' : 'Play'} onClick={(e) => {
                        this.play(e, youtubeTab.id, youtubeTab.url)
                    }}/>
                    <img src={focusButtonUrl} className="ytswap__svg" title="Focus" alt="Focus" onClick={(e) => {
                        this.focus(e, youtubeTab.id)
                    }}/>
                    <img src={nextButtonUrl} className="ytswap__svg" title="Vidéo suivante" alt="Vidéo suivante" onClick={(e) => {
                        this.next(e, youtubeTab.id, youtubeTab.url)
                    }}/>
                </div>
            </div>
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
    }

    previous(e, youtubeTabId, youtubeTabUrl) {
        e.preventDefault();

        chrome.runtime.sendMessage({type: "previous", tabId: youtubeTabId, tabUrl: youtubeTabUrl});
    }

    async play(e, youtubeTabId, youtubeTabUrl) {
        e.preventDefault();

        let audible = await new Promise((resolve, reject) => {
            chrome.storage.sync.get(['audible' + youtubeTabId], (result) => {
               resolve(result['audible' + youtubeTabId]);
            });
        });

        chrome.storage.sync.set({['audible' + youtubeTabId]: !audible});

        this.setState({['audible' + youtubeTabId]: !audible});

        chrome.runtime.sendMessage({type: "play", tabId: youtubeTabId, tabUrl: youtubeTabUrl});
    }

    focus(e, youtubeTabId) {
        e.preventDefault();

        chrome.runtime.sendMessage({type: "focus", tabId: youtubeTabId});
    }

    next(e, youtubeTabId, youtubeTabUrl) {
        e.preventDefault();

        chrome.runtime.sendMessage({type: "next", tabId: youtubeTabId, tabUrl: youtubeTabUrl});
    }
}