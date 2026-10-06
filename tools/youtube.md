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
                <button type="button" data-act="import">Import/Export library…</button><span id="ytSyncWrap" hidden>·<button type="button" data-act="sync">MantleDB sync</button></span>·<button type="button" class="danger" data-act="forget-all">Forget all videos</button>
            </div>
        </main>
    </div>
    <div class="yt-sheet-backdrop" id="ytSheetBackdrop" data-act="sheet-close" hidden></div>
    <div class="yt-sheet" id="ytSheet" role="dialog" aria-label="Video options" hidden></div>
    <div class="yt-modal-backdrop" id="ytModal" data-act="modal-close" hidden>
        <div class="yt-modal" role="dialog" aria-labelledby="ytModalTitle">
            <h3 id="ytModalTitle">Import/Export library</h3>
            <p id="ytModalText">Export copies the library to the clipboard as base64 JSON. Import reads the same format: paste an export, and videos not already here are added, tags on existing ones updated, nothing removed. <a class="yt-sync-inspect" href="#" target="_blank" rel="noopener">Decode the library in CyberChef</a>.</p>
            <p>Storage is localStorage in this browser profile on this device, plus thumbnails as blobs in IndexedDB. Other browsers, other profiles, private windows and cleared site data do not share it. Quota is about 5 MB, enough for thousands of videos. Manually export/import, or use MantleDB sync, to move saved videos between browsers.</p>
            <textarea id="ytModalData" placeholder="Paste an exported library here" spellcheck="false"></textarea>
            <div class="yt-modal-status" id="ytModalStatus"></div>
            <div class="yt-modal-actions">
                <button type="button" class="yt-btn-secondary yt-btn-left" data-act="export">Export</button>
                <button type="button" class="yt-btn-secondary" data-act="modal-close">Cancel</button>
                <button type="button" class="yt-btn-primary" id="ytModalImport" data-act="modal-import" disabled>Import</button>
            </div>
        </div>
    </div>
    <div class="yt-modal-backdrop" id="ytSync" data-act="sync-close" hidden>
        <div class="yt-modal yt-modal-sync" role="dialog" aria-labelledby="ytSyncTitle">
            <h3 id="ytSyncTitle">Sync library between browser storage with MantleDB</h3>
            <div class="yt-sync-pane" id="ytSyncOff">
                <p><a href="https://mantledb.sh/#credits" target="_blank" rel="noopener">MantleDB</a> is a free hosted JSON key-value store with no accounts: claim a namespace, receive a key, read and write over HTTPS with it. It keeps the library client-side: no backend, no sign-in, no central store. The browser talks to MantleDB directly, and only once sync is on.</p>
                <p>Sync stores one entry: the library as a JSON array of ID, title, channel, save date and tags. Thumbnails, the current video and view settings stay local. Reads and writes need the key. <a class="yt-sync-inspect" href="#" target="_blank" rel="noopener">Decode the entry in CyberChef</a>.</p>
                <p>Limits: 64 KB per entry, roughly a few hundred videos. Namespaces are deleted after 90 days without use. No uptime or durability guarantee, so this browser holds the master copy and MantleDB is a mirror. Last save wins; there is no merging between devices. While sync is on, MantleDB sees the client IP address on each visit. The key cannot be recovered.</p>
                <p>Turn on sync claims the generated namespace, stores the key in this browser and pushes the library. Every save then pushes; every page load pulls. A link and QR code carry the namespace and key: open either in another browser to connect it to the same library. The link is read once, stored in that browser and removed from the address bar. Entering an existing namespace and key connects to it instead, and the videos and tags here are merged into that library.</p>
                <div class="yt-sync-fields">
                    <label for="ytSyncNs">namespace</label>
                    <input id="ytSyncNs" type="text" autocomplete="off" spellcheck="false">
                    <label for="ytSyncKey">key</label>
                    <input id="ytSyncKey" type="text" placeholder="issued by MantleDB on claim" autocomplete="off" spellcheck="false">
                </div>
                <div class="yt-modal-actions">
                    <button type="button" class="yt-btn-primary" id="ytSyncGo" data-act="sync-on">Claim namespace from MantleDB</button>
                </div>
            </div>
            <div class="yt-sync-pane" id="ytSyncOn" hidden>
                <p>Synced with <a href="https://mantledb.sh/#credits" target="_blank" rel="noopener">MantleDB</a>. Open the link or scan the code in another browser to connect it to the same library. The link carries the namespace and key: anyone with it can read and change the library, and it is the only way to reconnect after site data is cleared, so keep a copy. Disconnect removes the key from this browser and keeps the library. <a class="yt-sync-inspect" href="#" target="_blank" rel="noopener">Decode the entry in CyberChef</a>.</p>
                <div class="yt-sync-qr" id="ytSyncQr"></div>
                <div class="yt-sync-link" id="ytSyncLink"></div>
                <div class="yt-sync-fields">
                    <label for="ytSyncNsOn">namespace</label>
                    <input id="ytSyncNsOn" type="text" disabled>
                    <label for="ytSyncKeyOn">key</label>
                    <input id="ytSyncKeyOn" type="text" disabled>
                </div>
                <div class="yt-modal-actions">
                    <button type="button" class="yt-btn-secondary danger" data-act="sync-off">Disconnect</button>
                    <button type="button" class="yt-btn-secondary" data-act="sync-copy">Copy link</button>
                    <button type="button" class="yt-btn-primary" data-act="sync-close">Done</button>
                </div>
            </div>
        </div>
    </div>
</div>

<script src="/js/youtube.js?v={{ site.time | date: '%s' }}"></script>
