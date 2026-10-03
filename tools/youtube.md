---
layout: default
title: Embedded YouTube Player
description: Paste a YouTube link to play it and keep a private video library with tags, search and thumbnails, stored only in your browser.
redirect_from:
  - "/yt"
  - "/youtube/"
body_class: yt-page
app_shell: true
nav_full: true
nav_slot: youtube-paste.html
extra_scss: scss/youtube.scss
---

<div id="yt-app">
    {% include nav.html %}
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
                <div class="yt-search-box">
                    <input class="yt-search" id="ytSearch" type="text" placeholder="Search titles, channels, tags, IDs" autocomplete="off" aria-label="Search library">
                    <button type="button" class="yt-search-clear" data-act="clear-search" aria-label="Clear search" hidden>×</button>
                </div>
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
                <div class="yt-search-wrap">
                    <div class="yt-search-box">
                        <input class="yt-search" id="ytSearchMobile" type="text" placeholder="Search library" autocomplete="off" aria-label="Search library">
                        <button type="button" class="yt-search-clear" data-act="clear-search" aria-label="Clear search" hidden>×</button>
                    </div>
                </div>
                <div class="yt-mchips" id="ytChips"></div>
            </div>
            <div class="yt-groups" id="ytGroups"></div>
            <div class="yt-main-data">
                <button type="button" data-act="export">Export library</button>·<button type="button" data-act="import">Import library</button>·<button type="button" class="danger" data-act="forget-all">Forget all videos</button>
            </div>
        </main>
    </div>
    <div class="yt-sheet-backdrop" id="ytSheetBackdrop" data-act="sheet-close" hidden></div>
    <div class="yt-sheet" id="ytSheet" role="dialog" aria-label="Video options" hidden></div>
    <div class="yt-modal-backdrop" id="ytModal" data-act="modal-close" hidden>
        <div class="yt-modal" role="dialog" aria-labelledby="ytModalTitle">
            <h3 id="ytModalTitle">Import library</h3>
            <p id="ytModalText">Paste an exported library below. New videos are added to your library.</p>
            <textarea id="ytModalData" placeholder="Paste an exported library here" spellcheck="false"></textarea>
            <div class="yt-modal-status" id="ytModalStatus"></div>
            <div class="yt-modal-actions">
                <button type="button" class="yt-btn-secondary" data-act="modal-close">Cancel</button>
                <button type="button" class="yt-btn-primary" id="ytModalImport" data-act="modal-import" disabled>Import</button>
            </div>
        </div>
    </div>
</div>

<script src="/js/youtube.js?v={{ site.time | date: '%s' }}"></script>
