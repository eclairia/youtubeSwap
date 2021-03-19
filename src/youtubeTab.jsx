import { h, Component, render } from 'preact';

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
                        this.previous(e, youtubeTab.id)
                    }}/>
                    <img src={this.props.youtubeTab.audible === true ? pauseButtonUrl : playButtonUrl} className="ytswap__svg" title={this.props.youtubeTab.audible === true ? 'Pause' : 'Play'} alt={this.props.youtubeTab.audible === true ? 'Pause' : 'Play'} onClick={(e) => {
                        this.play(e, youtubeTab.id)
                    }}/>
                    <img src={focusButtonUrl} className="ytswap__svg" title="Focus" alt="Focus" onClick={(e) => {
                        this.focus(e, youtubeTab.id)
                    }}/>
                    <img src={nextButtonUrl} className="ytswap__svg" title="Vidéo suivante" alt="Vidéo suivante" onClick={(e) => {
                        this.next(e, youtubeTab.id)
                    }}/>
                </div>
            </div>
    }

    previous(e, youtubeTabId) {
        e.preventDefault();

        chrome.runtime.sendMessage({type: "previous", tabId: youtubeTabId});
    }

    async play(e, youtubeTabId) {
        e.preventDefault();

        let audible = await new Promise((resolve, reject) => {
            chrome.storage.sync.get(['audible' + youtubeTabId], (result) => {
               resolve(result['audible' + youtubeTabId]);
            });
        });

        chrome.storage.sync.set({['audible' + youtubeTabId]: !audible});

        this.setState({['audible' + youtubeTabId]: !audible});

        chrome.runtime.sendMessage({type: "play", tabId: youtubeTabId});
    }

    focus(e, youtubeTabId) {
        e.preventDefault();

        chrome.runtime.sendMessage({type: "focus", tabId: youtubeTabId});
    }

    next(e, youtubeTabId) {
        e.preventDefault();

        chrome.runtime.sendMessage({type: "next", tabId: youtubeTabId});
    }
}