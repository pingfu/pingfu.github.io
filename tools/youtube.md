---
layout: default
title: Embedded YouTube Player
description: Paste a YouTube link to play it and keep a private watch history with tags, search and thumbnails, stored only in your browser.
redirect_from:
  - "/yt"
  - "/youtube/"
body_class: yt-page
app_shell: true
fonts: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&family=Oswald:wght@300&display=swap"
extra_scss: scss/youtube.scss
---

<div id="yt-app">
    <header class="yt-header">
        <div class="yt-brand-row">
            <a class="yt-wordmark" href="/">PINGFU</a>
            <button class="yt-burger" id="ytBurger" type="button" aria-label="Menu" aria-controls="ytNav" aria-expanded="false"><span></span><span></span><span></span></button>
        </div>
        <form class="yt-paste" id="ytPaste" autocomplete="off">
            <input id="ytInput" type="text" placeholder="Paste a YouTube link or video ID" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="YouTube link or video ID">
            <button class="yt-play-btn" type="submit">Play</button>
            <span class="yt-error" id="ytError" role="alert" hidden></span>
        </form>
        <nav class="yt-nav" id="ytNav">
            <a href="/">Home</a>
            <div class="yt-nav-group">
                <a href="/tools/youtube" class="active">Tools</a>
                <div class="yt-nav-menu">
                    <a href="/tools/youtube">Embedded YouTube player</a>
                    <a href="/tools/dns">DNS toolbox</a>
                    <a href="/tools/generate-passwords">Password generator</a>
                </div>
            </div>
            <div class="yt-nav-group">
                <a href="/reference/ethernet-ip-tcp-udp-icmp-protocol-header-cheatsheets">Reference</a>
                <div class="yt-nav-menu">
                    <a href="/reference/ethernet-ip-tcp-udp-icmp-protocol-header-cheatsheets">Protocol header cheatsheets</a>
                </div>
            </div>
            <a href="/code">Code</a>
        </nav>
    </header>
    <div class="yt-body" id="ytBody">
        <aside class="yt-sidebar" id="ytSidebar" aria-label="Library"></aside>
        <main class="yt-main">
            <section class="yt-now" id="ytNow" hidden>
                <div class="yt-stage">
                    <div class="yt-tab" id="ytTab"></div>
                    <div class="yt-player" id="ytPlayer"></div>
                    <div class="yt-menu" id="ytMenu" role="menu" aria-label="Video actions" hidden></div>
                </div>
                <div class="yt-now-mobile" id="ytNowMobile"></div>
            </section>
            <div class="yt-toolbar" id="ytToolbar">
                <div class="yt-heading" id="ytHeading">All videos</div>
                <div class="yt-count" id="ytCount"></div>
                <div class="yt-spacer"></div>
                <input class="yt-search" id="ytSearch" type="text" placeholder="Search titles, channels, tags, IDs" autocomplete="off" aria-label="Search history">
                <div class="yt-seg" role="group" aria-label="Arrange by">
                    <button type="button" data-act="groupby" data-value="date">By date</button>
                    <button type="button" data-act="groupby" data-value="channel">By channel</button>
                    <button type="button" data-act="groupby" data-value="tag">By tag</button>
                </div>
                <div class="yt-seg" role="group" aria-label="View">
                    <button type="button" data-act="view" data-value="grid">Grid</button>
                    <button type="button" data-act="view" data-value="list">List</button>
                </div>
            </div>
            <div class="yt-filterbar" id="ytFilterbar">
                <div class="yt-search-wrap"><input class="yt-search" id="ytSearchMobile" type="text" placeholder="Search history" autocomplete="off" aria-label="Search history"></div>
                <div class="yt-mchips" id="ytChips"></div>
            </div>
            <div class="yt-groups" id="ytGroups"></div>
            <div class="yt-main-data">
                <button type="button" data-act="export">Export list</button>·<button type="button" data-act="import">Import</button>·<button type="button" class="danger" data-act="forget-all">Forget all</button>
            </div>
        </main>
    </div>
    <div class="yt-sheet-backdrop" id="ytSheetBackdrop" data-act="sheet-close" hidden></div>
    <div class="yt-sheet" id="ytSheet" role="dialog" aria-label="Video options" hidden></div>
    <div class="yt-modal-backdrop" id="ytModal" data-act="modal-close" hidden>
        <div class="yt-modal" role="dialog" aria-labelledby="ytModalTitle">
            <h3 id="ytModalTitle">Import videos</h3>
            <p id="ytModalText">Paste an exported list below. New videos are added to your existing history.</p>
            <textarea id="ytModalData" placeholder="Paste exported data here" spellcheck="false"></textarea>
            <div class="yt-modal-status" id="ytModalStatus"></div>
            <div class="yt-modal-actions">
                <button type="button" class="yt-btn-outline" data-act="modal-close">Cancel</button>
                <button type="button" class="yt-btn-primary" id="ytModalImport" data-act="modal-import" disabled>Import</button>
            </div>
        </div>
    </div>
</div>

<script src="/js/youtube.js?v={{ site.time | date: '%s' }}"></script>
