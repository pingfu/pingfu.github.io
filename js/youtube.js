/*
 * Pingfu watch history (/tools/youtube)
 *
 * Everything lives in the browser. YouTube is contacted only when a video is
 * first played: one oEmbed call for the title and channel, and one fetch of the
 * thumbnail, which is stored as a blob in IndexedDB. Later visits read the
 * list from localStorage and the thumbnails from IndexedDB; nothing is
 * refetched unless the user removes it or explicitly asks for a refresh.
 *
 * Pasting a link plays the video as an unsaved draft. It only enters the
 * history when the user marks it as saved in the player's status tab.
 */
(() => {
    'use strict';

    const KEY = 'pingfu.history.v2';
    const LEGACY_KEY = 'playedVideos';
    const PREFS_KEY = 'pingfu.history.prefs';
    const DB_NAME = 'pingfu-history';
    const DB_STORE = 'thumbs';
    const ID_RE = /^[\w-]{11}$/;
    const URL_RE = /(?:v=|youtu\.be\/|shorts\/|embed\/|live\/)([\w-]{11})/;
    const ERR_INVALID = 'Not a YouTube link or 11-character ID';
    const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const NET_LIMIT = 4;

    const mql = window.matchMedia('(max-width: 899px)');
    const isMobile = () => mql.matches;
    const el = id => document.getElementById(id);
    const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    const app = el('yt-app');
    const inputEl = el('ytInput');
    const errorEl = el('ytError');
    const navEl = el('ytNav');
    const burgerEl = el('ytBurger');
    const bodyEl = el('ytBody');
    const mainEl = app.querySelector('.yt-main');
    const sidebarEl = el('ytSidebar');
    const nowEl = el('ytNow');
    const tabEl = el('ytTab');
    const playerEl = el('ytPlayer');
    const menuEl = el('ytMenu');
    const nowMobileEl = el('ytNowMobile');
    const headingEl = el('ytHeading');
    const countEl = el('ytCount');
    const searchEl = el('ytSearch');
    const searchMobileEl = el('ytSearchMobile');
    const chipsEl = el('ytChips');
    const groupsEl = el('ytGroups');
    const sheetEl = el('ytSheet');
    const sheetBackdropEl = el('ytSheetBackdrop');
    const modalEl = el('ytModal');
    const modalTitleEl = el('ytModalTitle');
    const modalTextEl = el('ytModalText');
    const modalDataEl = el('ytModalData');
    const modalStatusEl = el('ytModalStatus');
    const modalImportEl = el('ytModalImport');

    // ------------------------------------------------------------------ state
    const state = {
        videos: [],
        currentId: null,
        draft: null,           // unsaved video currently playing (not in videos / localStorage)
        filter: null,          // null | {kind:'tag', value} | {kind:'untagged'} | {kind:'channel', value}
        query: '',
        view: 'grid',          // 'grid' | 'list'
        groupBy: 'date',       // 'date' | 'channel' | 'tag'
        sheetVideoId: null,
        menu: null             // null | { target: 'player' | videoId, view: 'main' | 'group' }
    };
    const metaPending = new Set();
    let importParsed = null;
    let playerId = null;
    let autoplayNext = false;   // true only for a freshly pasted video or one named in the URL
    let toastTimer = null;
    let copiedTimer = null;

    // ------------------------------------------------------------------ parsing and labels
    function parseId(raw) {
        const s = (raw || '').trim();
        const m = s.match(URL_RE);
        if (m) return m[1];
        return ID_RE.test(s) ? s : null;
    }

    function isoOrNow(value) {
        const d = new Date(value);
        return isNaN(d) ? new Date().toISOString() : d.toISOString();
    }

    function normalise(v) {
        if (!v || typeof v.id !== 'string' || !ID_RE.test(v.id)) return null;
        const tags = Array.isArray(v.tags) ? v.tags.filter(t => typeof t === 'string' && t.trim()).map(t => t.trim()).slice(0, 1) : [];
        return {
            id: v.id,
            title: typeof v.title === 'string' ? v.title : '',
            channel: typeof v.channel === 'string' ? v.channel : '',
            channelUrl: typeof v.channelUrl === 'string' ? v.channelUrl : '',
            date: isoOrNow(v.date),
            tags
        };
    }

    // Old format: { url, timestamp, notes, author, authorUrl, group, groupColor }
    function fromLegacy(v) {
        if (!v || typeof v !== 'object') return null;
        const id = parseId(v.url || '');
        if (!id) return null;
        const group = typeof v.group === 'string' ? v.group.trim() : '';
        return {
            id,
            title: typeof v.notes === 'string' ? v.notes : '',
            channel: typeof v.author === 'string' ? v.author.replace(/^@/, '') : '',
            channelUrl: typeof v.authorUrl === 'string' ? v.authorUrl : '',
            date: isoOrNow(v.timestamp),
            tags: group ? [group] : []
        };
    }

    function parseAny(item) {
        return item && typeof item === 'object' && 'url' in item && !('id' in item) ? fromLegacy(item) : normalise(item);
    }

    function dedupe(list) {
        const seen = new Set();
        return list.filter(v => v && !seen.has(v.id) && seen.add(v.id));
    }

    function byDateDesc(a, b) {
        return new Date(b.date) - new Date(a.date);
    }

    function titleOf(v) {
        return v.title || (metaPending.has(v.id) ? 'Fetching title…' : 'Untitled video');
    }

    function chLabel(v) {
        if (!v.channel) return '';
        return (v.channelUrl && v.channelUrl.indexOf('/@') !== -1 ? '@' : '') + v.channel;
    }

    function countLabel(n) {
        return n + (n === 1 ? ' video' : ' videos');
    }

    function dateLabel(iso) {
        const d = new Date(iso), now = new Date();
        const days = Math.floor((now - d) / 864e5);
        if (days < 1) return 'today';
        if (days < 7) return days + 'd ago';
        return d.getDate() + ' ' + MONTHS_SHORT[d.getMonth()] + (d.getFullYear() !== now.getFullYear() ? ' ' + d.getFullYear() : '');
    }

    function bucket(iso) {
        const d = new Date(iso), now = new Date();
        if ((now - d) / 864e5 < 7) return 'This week';
        return MONTHS_LONG[d.getMonth()] + (d.getFullYear() !== now.getFullYear() ? ' ' + d.getFullYear() : '');
    }

    function chipColor(name) {
        let h = 0;
        for (const c of name) h = (h * 31 + c.charCodeAt(0)) % 360;
        return { bg: `oklch(0.93 0.05 ${h})`, fg: `oklch(0.38 0.09 ${h})`, dot: `oklch(0.62 0.13 ${h})` };
    }

    function matches(v, q) {
        return [v.title, v.channel, v.id].concat(v.tags).join(' ').toLowerCase().indexOf(q) !== -1;
    }

    // ------------------------------------------------------------------ list storage (localStorage)
    function loadVideos() {
        try {
            const raw = localStorage.getItem(KEY);
            if (raw !== null) {
                const list = JSON.parse(raw);
                return Array.isArray(list) ? dedupe(list.map(normalise)) : [];
            }
        } catch (e) { /* fall through to migration */ }
        return migrateLegacy();
    }

    function migrateLegacy() {
        try {
            const raw = localStorage.getItem(LEGACY_KEY);
            if (!raw) return [];
            const old = JSON.parse(raw);
            if (!Array.isArray(old)) return [];
            const list = dedupe(old.map(fromLegacy)).sort(byDateDesc);
            localStorage.setItem(KEY, JSON.stringify(list));
            return list;
        } catch (e) {
            return [];
        }
    }

    function saveVideos() {
        try {
            localStorage.setItem(KEY, JSON.stringify(state.videos));
        } catch (e) {
            toast('Could not save: browser storage is full or blocked');
        }
    }

    function loadPrefs() {
        try {
            const p = JSON.parse(localStorage.getItem(PREFS_KEY)) || {};
            if (p.view === 'grid' || p.view === 'list') state.view = p.view;
            if (['date', 'channel', 'tag'].indexOf(p.groupBy) !== -1) state.groupBy = p.groupBy;
        } catch (e) { /* defaults */ }
    }

    function savePrefs() {
        try {
            localStorage.setItem(PREFS_KEY, JSON.stringify({ view: state.view, groupBy: state.groupBy }));
        } catch (e) { /* ignore */ }
    }

    // ------------------------------------------------------------------ thumbnail storage (IndexedDB)
    let dbPromise = null;

    function openDb() {
        if (dbPromise) return dbPromise;
        dbPromise = new Promise((resolve, reject) => {
            if (!window.indexedDB) return reject(new Error('IndexedDB unavailable'));
            const req = indexedDB.open(DB_NAME, 1);
            req.onupgradeneeded = () => req.result.createObjectStore(DB_STORE, { keyPath: 'id' });
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
            req.onblocked = () => reject(new Error('IndexedDB blocked'));
        });
        dbPromise.catch(() => { dbPromise = null; });
        return dbPromise;
    }

    function dbRequest(mode, fn) {
        return openDb().then(db => new Promise((resolve, reject) => {
            const tx = db.transaction(DB_STORE, mode);
            const req = fn(tx.objectStore(DB_STORE));
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        }));
    }

    const dbGet = id => dbRequest('readonly', store => store.get(id));
    const dbPut = rec => dbRequest('readwrite', store => store.put(rec));
    const dbDelete = id => dbRequest('readwrite', store => store.delete(id));
    const dbClear = () => dbRequest('readwrite', store => store.clear());
    const dbKeys = () => dbRequest('readonly', store => store.getAllKeys());

    const thumbUrls = new Map();
    const thumbBusy = new Set();
    const thumbFailed = new Set();
    const netQueue = [];
    let netActive = 0;

    function ensureThumb(id) {
        if (!id || thumbUrls.has(id) || thumbBusy.has(id) || thumbFailed.has(id)) return;
        thumbBusy.add(id);
        dbGet(id).catch(() => null)
            .then(rec => (rec && rec.blob) ? rec.blob : fetchThumb(id))
            .then(blob => {
                thumbUrls.set(id, URL.createObjectURL(blob));
                applyThumb(id);
            })
            .catch(() => thumbFailed.add(id))
            .then(() => thumbBusy.delete(id));
    }

    function fetchThumb(id) {
        return new Promise((resolve, reject) => {
            netQueue.push({ id, resolve, reject });
            pumpNet();
        });
    }

    function pumpNet() {
        while (netActive < NET_LIMIT && netQueue.length) {
            const job = netQueue.shift();
            netActive++;
            fetch(`https://i.ytimg.com/vi/${job.id}/mqdefault.jpg`)
                .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.blob(); })
                .then(blob => {
                    dbPut({ id: job.id, blob, fetched: Date.now() }).catch(() => { /* still usable this session */ });
                    job.resolve(blob);
                }, job.reject)
                .then(() => { netActive--; pumpNet(); });
        }
    }

    function applyThumb(id) {
        const url = thumbUrls.get(id);
        if (!url) return;
        app.querySelectorAll(`img[data-thumb="${id}"]`).forEach(img => {
            img.src = url;
            img.classList.add('loaded');
        });
    }

    function releaseThumb(id) {
        const url = thumbUrls.get(id);
        if (url) URL.revokeObjectURL(url);
        thumbUrls.delete(id);
        thumbFailed.delete(id);
    }

    // Drop cached thumbnails for videos that are no longer in the history (e.g. discarded drafts).
    function pruneThumbs() {
        const keep = new Set(state.videos.map(v => v.id));
        if (state.currentId) keep.add(state.currentId);
        dbKeys().then(keys => keys.forEach(k => { if (!keep.has(k)) dbDelete(k).catch(() => { /* ignore */ }); })).catch(() => { /* ignore */ });
    }

    const io = 'IntersectionObserver' in window
        ? new IntersectionObserver(entries => {
            entries.forEach(en => {
                if (!en.isIntersecting) return;
                io.unobserve(en.target);
                ensureThumb(en.target.dataset.thumb);
            });
        }, { rootMargin: '240px' })
        : null;

    function observeThumbs() {
        app.querySelectorAll('img[data-thumb]:not(.loaded)').forEach(img => {
            if (io) io.observe(img); else ensureThumb(img.dataset.thumb);
        });
    }

    // ------------------------------------------------------------------ metadata (one oEmbed call per new video)
    function fetchMeta(id) {
        if (metaPending.has(id)) return Promise.resolve();
        metaPending.add(id);
        const url = 'https://www.youtube.com/oembed?url=' + encodeURIComponent('https://www.youtube.com/watch?v=' + id) + '&format=json';
        return fetch(url)
            .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
            .then(j => {
                const handle = (j.author_url || '').split('/@')[1];
                const channel = (handle ? decodeURIComponent(handle) : (j.author_name || '')).replace(/\/$/, '');
                const patch = { title: j.title || '', channel, channelUrl: j.author_url || '' };
                const v = findVideo(id);
                if (v) {
                    Object.assign(v, patch);
                    saveVideos();
                }
                if (state.draft && state.draft.id === id) Object.assign(state.draft, patch);
            })
            .catch(() => { /* leave the entry untitled; retried next time it is played */ })
            .then(() => { metaPending.delete(id); render(); });
    }

    async function refreshAllMeta() {
        for (let i = 0; i < state.videos.length; i++) {
            await fetchMeta(state.videos[i].id);
            if (i < state.videos.length - 1) await new Promise(r => setTimeout(r, 500));
        }
        toast('Refreshed ' + countLabel(state.videos.length));
    }

    // ------------------------------------------------------------------ lookups and mutations
    const findVideo = id => state.videos.find(v => v.id === id);
    const isDraft = id => !!state.draft && state.draft.id === id;
    // Saved video or the draft, by id.
    const videoById = id => (isDraft(id) ? state.draft : findVideo(id)) || null;
    const currentVideo = () => (state.currentId ? videoById(state.currentId) : null);

    const allTags = () => {
        const counts = {};
        state.videos.forEach(v => v.tags.forEach(t => { counts[t] = (counts[t] || 0) + 1; }));
        return Object.keys(counts).sort((a, b) => a.localeCompare(b));
    };

    function canonicalTag(name) {
        const lower = name.toLowerCase();
        return allTags().find(t => t.toLowerCase() === lower) || name;
    }

    function setGroup(id, name) {
        const v = videoById(id);
        if (!v) return;
        name = (name || '').trim();
        v.tags = name ? [canonicalTag(name)] : [];
        if (!isDraft(id)) saveVideos();
        render();
    }

    function setCurrent(id) {
        state.currentId = id;
        state.menu = null;
        if (id) {
            history.replaceState(null, '', '#' + id);
        } else {
            state.draft = null;
            if (location.hash) history.replaceState(null, '', location.pathname + location.search);
        }
    }

    // Play a saved video from the list: no reorder, no date change. Autoplays only on an explicit Play action.
    function play(id, autoplay) {
        const v = findVideo(id);
        if (!v) return;
        state.draft = null;
        autoplayNext = !!autoplay;
        setCurrent(id);
        if (!v.title) fetchMeta(id);
        render();
        scrollToTop();
    }

    // Jump straight to the player. Desktop scrolls .yt-main, mobile scrolls .yt-body.
    function scrollToTop() {
        mainEl.scrollTop = 0;
        bodyEl.scrollTop = 0;
    }

    // Paste or Play: never saves. Known ids just play; new ids become an in-memory draft.
    function submit(raw) {
        const id = parseId(raw);
        if (!id) {
            showError(ERR_INVALID);
            return false;
        }
        state.query = '';
        state.filter = null;
        inputEl.value = '';
        searchEl.value = '';
        searchMobileEl.value = '';
        showError('');
        if (findVideo(id)) {
            state.draft = null;
        } else {
            if (!isDraft(id)) state.draft = { id, title: '', channel: '', channelUrl: '', date: new Date().toISOString(), tags: [] };
            if (!state.draft.title) fetchMeta(id);
        }
        autoplayNext = true;
        setCurrent(id);
        if (findVideo(id) && !findVideo(id).title) fetchMeta(id);
        render();
        if (!isMobile()) inputEl.blur();
        scrollToTop();
        return true;
    }

    // Status tab: Not saved -> Saved writes the draft to history; Saved -> Not saved removes it but keeps it playing.
    function toggleSaved() {
        const v = currentVideo();
        if (!v) return;
        if (isDraft(v.id)) {
            state.videos = [Object.assign({}, v, { date: new Date().toISOString() })].concat(state.videos.filter(x => x.id !== v.id));
            state.draft = null;
        } else {
            state.videos = state.videos.filter(x => x.id !== v.id);
            state.draft = v;
        }
        saveVideos();
        render();
    }

    function removeVideo(id) {
        state.videos = state.videos.filter(v => v.id !== id);
        if (state.currentId === id) setCurrent(null);
        if (state.sheetVideoId === id) state.sheetVideoId = null;
        if (state.menu && state.menu.target === id) state.menu = null;
        if (isDraft(id)) state.draft = null;
        saveVideos();
        dbDelete(id).catch(() => { /* ignore */ });
        releaseThumb(id);
        render();
    }

    function discardDraft() {
        const id = state.currentId;
        state.draft = null;
        if (state.sheetVideoId === id) state.sheetVideoId = null;
        setCurrent(null);
        if (id && !findVideo(id)) {
            dbDelete(id).catch(() => { /* ignore */ });
            releaseThumb(id);
        }
        render();
    }

    function forgetAll() {
        const n = state.videos.length;
        if (!n) return;
        if (!window.confirm('Forget all ' + countLabel(n) + '? This clears your watch history and cached thumbnails in this browser.')) return;
        state.videos.forEach(v => releaseThumb(v.id));
        state.videos = [];
        state.filter = null;
        state.sheetVideoId = null;
        setCurrent(null);
        saveVideos();
        dbClear().catch(() => { /* ignore */ });
        render();
    }

    function setFilter(filter) {
        state.filter = filter;
        render();
    }

    function copyId(id, itemEl) {
        const done = () => {
            if (itemEl) {
                itemEl.textContent = 'Copied ✓';
                clearTimeout(copiedTimer);
                copiedTimer = setTimeout(closeMenu, 900);
            } else {
                toast('Copied ' + id);
            }
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(id).then(done, () => toast('Could not copy. The ID is ' + id));
        } else {
            toast('Could not copy. The ID is ' + id);
        }
    }

    // ------------------------------------------------------------------ export and import
    function encodeList(list) {
        return btoa(unescape(encodeURIComponent(JSON.stringify(list))));
    }

    function decodeList(text) {
        const json = decodeURIComponent(escape(atob(text.trim())));
        const data = JSON.parse(json);
        if (!Array.isArray(data)) throw new Error('Not a list');
        return dedupe(data.map(parseAny));
    }

    function exportList() {
        if (!state.videos.length) {
            toast('Nothing to export');
            return;
        }
        const text = encodeList(state.videos);
        const done = () => toast('Copied ' + countLabel(state.videos.length) + ' to the clipboard');
        const fallback = () => openModal('export', text);
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(done, fallback);
        } else {
            fallback();
        }
    }

    function openModal(mode, text) {
        modalEl.hidden = false;
        importParsed = null;
        modalDataEl.value = text || '';
        modalStatusEl.textContent = '';
        modalStatusEl.className = 'yt-modal-status';
        if (mode === 'export') {
            modalTitleEl.textContent = 'Export videos';
            modalTextEl.textContent = 'Copy the text below and keep it somewhere safe. Paste it into Import on another browser or device.';
            modalDataEl.readOnly = true;
            modalImportEl.hidden = true;
            modalDataEl.focus();
            modalDataEl.select();
        } else {
            modalTitleEl.textContent = 'Import videos';
            modalTextEl.textContent = 'Paste an exported list below. New videos are added to your existing history.';
            modalDataEl.readOnly = false;
            modalImportEl.hidden = false;
            modalImportEl.disabled = true;
            modalDataEl.focus();
        }
    }

    function closeModal() {
        modalEl.hidden = true;
        importParsed = null;
    }

    function validateImport() {
        const text = modalDataEl.value.trim();
        modalImportEl.disabled = true;
        importParsed = null;
        if (!text || modalDataEl.readOnly) {
            modalStatusEl.textContent = '';
            modalStatusEl.className = 'yt-modal-status';
            return;
        }
        try {
            const list = decodeList(text);
            const existing = new Set(state.videos.map(v => v.id));
            const fresh = list.filter(v => !existing.has(v.id));
            importParsed = fresh;
            modalStatusEl.className = 'yt-modal-status ok';
            modalStatusEl.textContent = fresh.length
                ? fresh.length + ' new ' + (fresh.length === 1 ? 'video' : 'videos') + ' to add'
                : 'All ' + countLabel(list.length) + ' already in your history';
            modalImportEl.disabled = fresh.length === 0;
        } catch (e) {
            modalStatusEl.className = 'yt-modal-status bad';
            modalStatusEl.textContent = 'That does not look like an exported list';
        }
    }

    function importList() {
        if (!importParsed || !importParsed.length) return;
        state.videos = state.videos.concat(importParsed).sort(byDateDesc);
        if (state.draft && findVideo(state.draft.id)) state.draft = null;
        saveVideos();
        const n = importParsed.length;
        closeModal();
        render();
        toast('Added ' + countLabel(n));
    }

    // ------------------------------------------------------------------ rendering
    function thumbHtml(id, isCurrent, ring, more) {
        const url = thumbUrls.get(id);
        return `<div class="yt-thumb${isCurrent && ring ? ' current' : ''}">` +
            (url ? `<img data-thumb="${id}" src="${url}" alt="" class="loaded">` : `<img data-thumb="${id}" alt="">`) +
            (isCurrent ? '<span class="yt-badge">PLAYING</span>' : '') +
            (more ? '<div class="yt-card-actions">' +
                `<button type="button" class="yt-card-btn" data-act="card-play" data-id="${id}" aria-label="Play" title="Play"><svg viewBox="0 0 10 10" width="10" height="10" aria-hidden="true"><path d="M2.5 1.2v7.6L8.4 5z" fill="currentColor"/></svg></button>` +
                `<button type="button" class="yt-card-btn" data-act="menu-group" data-id="${id}" aria-haspopup="menu" aria-expanded="${menuOpenFor(id) ? 'true' : 'false'}" aria-label="Tag" title="Tag"><svg viewBox="0 0 10 10" width="11" height="11" aria-hidden="true"><path d="M1.3 1.3h3.9l3.9 3.9-3.9 3.9-3.9-3.9z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><circle cx="3.4" cy="3.4" r=".9" fill="currentColor"/></svg></button>` +
                `<button type="button" class="yt-card-btn yt-card-btn-x" data-act="remove" data-id="${id}" aria-label="Forget this video" title="Forget"><svg viewBox="0 0 10 10" width="10" height="10" aria-hidden="true"><path d="M1.8 1.8l6.4 6.4M8.2 1.8l-6.4 6.4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" fill="none"/></svg></button>` +
                '</div>' : '') +
            '</div>';
    }

    function chipHtml(name, withDot) {
        const c = chipColor(name);
        return `<span class="yt-chip" style="background:${c.bg};color:${c.fg}">` +
            (withDot ? `<span class="yt-dot" style="background:${c.dot}"></span>` : '') + `${esc(name)}</span>`;
    }

    function visibleVideos() {
        const f = state.filter;
        let list = state.videos.filter(v => {
            if (!f) return true;
            if (f.kind === 'tag') return v.tags.indexOf(f.value) !== -1;
            if (f.kind === 'untagged') return v.tags.length === 0;
            if (f.kind === 'channel') return v.channel === f.value;
            return true;
        });
        const q = state.query.trim().toLowerCase();
        if (q) list = list.filter(v => matches(v, q));
        return list;
    }

    function groupVideos(list, mode) {
        const map = new Map();
        const ordered = mode === 'date' ? list.slice().sort(byDateDesc) : list;
        ordered.forEach(v => {
            const k = mode === 'channel' ? (v.channel ? chLabel(v) : 'Unknown channel')
                : mode === 'tag' ? (v.tags[0] || 'Untagged')
                : bucket(v.date);
            if (!map.has(k)) map.set(k, []);
            map.get(k).push(v);
        });
        const groups = Array.from(map, ([label, items]) => ({ label, items }));
        if (mode === 'channel') groups.sort((a, b) => b.items.length - a.items.length);
        if (mode === 'tag') groups.sort((a, b) => (a.label === 'Untagged') - (b.label === 'Untagged') || a.label.localeCompare(b.label));
        return groups;
    }

    function renderSidebar() {
        const f = state.filter;
        const isF = (kind, value) => !!f && f.kind === kind && (value === undefined || f.value === value);
        const row = (label, active, kind, value, count, dot) =>
            `<button type="button" class="yt-side-row${active ? ' active' : ''}" data-act="filter" data-kind="${kind}" data-value="${esc(value)}">` +
            (dot ? `<span class="yt-dot" style="background:${dot}"></span>` : '') +
            `<span class="yt-side-text">${esc(label)}</span><span class="yt-side-count">${count}</span></button>`;

        const tagCounts = {};
        const chCounts = {};
        state.videos.forEach(v => {
            v.tags.forEach(t => { tagCounts[t] = (tagCounts[t] || 0) + 1; });
            if (v.channel) chCounts[v.channel] = (chCounts[v.channel] || 0) + 1;
        });
        const tags = Object.keys(tagCounts).sort((a, b) => a.localeCompare(b));
        const channels = Object.keys(chCounts).sort((a, b) => chCounts[b] - chCounts[a]).slice(0, 8);
        const untagged = state.videos.filter(v => !v.tags.length).length;

        let html = '<div class="yt-label">Library</div>' +
            row('All videos', !f, 'all', '', state.videos.length, '#c9c6c0') +
            row('Untagged', isF('untagged'), 'untagged', '', untagged, '#c9c6c0');
        if (tags.length) {
            html += '<div class="yt-label">Tags</div>' +
                tags.map(t => row(t, isF('tag', t), 'tag', t, tagCounts[t], chipColor(t).dot)).join('');
        }
        if (channels.length) {
            html += '<div class="yt-label">Top channels</div>' +
                channels.map(c => row(chLabel(state.videos.find(v => v.channel === c)), isF('channel', c), 'channel', c, chCounts[c])).join('');
        }
        html += '<div class="yt-side-data"><div class="yt-label">Data</div>' +
            '<button type="button" class="yt-side-row" data-act="export"><span class="yt-side-text">Export list</span></button>' +
            '<button type="button" class="yt-side-row" data-act="import"><span class="yt-side-text">Import</span></button>' +
            '<button type="button" class="yt-side-row danger" data-act="forget-all"><span class="yt-side-text">Forget all videos</span></button></div>';
        sidebarEl.innerHTML = html;
    }

    function setPlayer(id) {
        if (id === playerId) return;
        playerId = id;
        playerEl.innerHTML = id
            ? `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=${autoplayNext ? 1 : 0}&rel=0" title="YouTube player" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`
            : '';
    }

    function renderNow() {
        const v = currentVideo();
        nowEl.hidden = !v;
        if (!v) {
            setPlayer(null);
            tabEl.innerHTML = '';
            nowMobileEl.innerHTML = '';
            renderMenu();
            return;
        }
        setPlayer(v.id);
        const saved = !isDraft(v.id);
        const cur = v.tags[0];
        const label = chLabel(v);

        tabEl.innerHTML =
            `<button type="button" class="yt-status" data-act="toggle-save" aria-pressed="${saved}" aria-label="Saved to history">` +
            (saved ? '<span class="yt-status-check">✓</span><span>Saved</span>' + (cur ? chipHtml(cur) : '')
                   : '<span class="yt-status-ring"></span><span>Not saved</span>') +
            '</button><span class="yt-tab-div"></span>' +
            `<button type="button" class="yt-more-btn" data-act="more-tab" data-id="${v.id}" aria-haspopup="menu" aria-label="More actions" aria-expanded="${state.menu ? 'true' : 'false'}"><span></span><span></span><span></span></button>`;

        nowMobileEl.innerHTML =
            `<div class="yt-now-title">${esc(titleOf(v))}</div>` +
            `<div class="yt-now-sub">${esc(label)}${label ? ' · ' : ''}${saved ? dateLabel(v.date) : 'not in history'}</div>`;

        renderMenu();
    }

    // Menus: one for the player tab (target 'player') and one per video in the grid/list (target = video id).
    const menuItem = (act, inner, cls, extra) => `<button type="button" role="menuitem" class="yt-menu-item${cls ? ' ' + cls : ''}" data-act="${act}"${extra || ''}>${inner}</button>`;
    const menuOpenFor = (target, view) => !!state.menu && state.menu.target === target && (!view || state.menu.view === view);

    const groupRowHtml = v => menuItem('menu-group',
        '<span class="yt-menu-grow">Tag</span>' + (v.tags[0] ? chipHtml(v.tags[0], true) : '<span class="yt-menu-hint">Add…</span>'),
        '', ` data-id="${v.id}"`);

    function groupPickerHtml(v) {
        const cur = v.tags[0];
        const tags = allTags();
        if (cur && tags.indexOf(cur) === -1) tags.push(cur);
        return tags.map(t => {
            const c = chipColor(t), on = t === cur;
            return menuItem('pick-group', `<span class="yt-dot" style="background:${c.dot}"></span><span class="yt-menu-grow">${esc(t)}</span>${on ? '<span class="yt-check">✓</span>' : ''}`, '', ` data-id="${v.id}" data-value="${esc(t)}"${on ? ' aria-checked="true"' : ''}`);
        }).join('') +
            (tags.length ? '<div class="yt-menu-div"></div>' : '') +
            `<form class="yt-menu-new" data-id="${v.id}"><input type="text" placeholder="+ New tag" autocomplete="off" aria-label="New tag"></form>`;
    }

    // Per-video menu in the grid/list: Play, Group, Forget.
    // Per-video tag picker in the grid/list, opened from the Tag button on the thumbnail.
    function cardMenuHtml(v) {
        if (!menuOpenFor(v.id)) return '';
        return `<div class="yt-menu yt-card-menu" role="menu">${groupPickerHtml(v)}</div>`;
    }

    function renderMenu() {
        const v = currentVideo();
        const open = !!v && menuOpenFor('player') && !isMobile();
        menuEl.hidden = !open;
        const btn = tabEl.querySelector('.yt-more-btn');
        if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (!open) {
            menuEl.innerHTML = '';
            return;
        }
        if (state.menu.view === 'group') {
            menuEl.innerHTML = groupPickerHtml(v);
            return;
        }
        menuEl.innerHTML =
            `<a role="menuitem" class="yt-menu-item" href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener" data-act="menu-link">Open on YouTube ↗</a>` +
            menuItem('copy-id', 'Copy video ID', '', ` data-id="${v.id}"`) +
            groupRowHtml(v) +
            '<div class="yt-menu-div"></div>' +
            (isDraft(v.id)
                ? menuItem('discard', 'Discard', 'danger')
                : menuItem('remove', 'Remove from history', 'danger', ` data-id="${v.id}"`));
    }

    function focusMenuInput() {
        const input = app.querySelector('.yt-menu .yt-menu-new input');
        if (input) input.focus();
    }

    function openMenu(target, view) {
        state.menu = { target, view: view || 'main' };
        if (target === 'player') renderMenu(); else renderGroups();
        focusMenuInput();
    }

    function closeMenu() {
        if (!state.menu) return;
        const wasPlayer = state.menu.target === 'player';
        state.menu = null;
        clearTimeout(copiedTimer);
        if (wasPlayer) renderMenu(); else renderGroups();
    }

    function renderToolbar() {
        const f = state.filter;
        headingEl.textContent = !f ? 'All videos' : f.kind === 'untagged' ? 'Untagged' : f.kind === 'tag' ? f.value : f.label;
        const shown = visibleVideos().length;
        const q = state.query.trim();
        countEl.textContent = q ? `${shown} of ${countLabel(state.videos.length)} match “${q}”` : countLabel(shown);
        app.querySelectorAll('[data-act="groupby"]').forEach(b => b.classList.toggle('active', b.dataset.value === state.groupBy));
        app.querySelectorAll('[data-act="view"]').forEach(b => b.classList.toggle('active', b.dataset.value === state.view));
    }

    function renderChips() {
        const f = state.filter;
        const chip = (name, value, dot, active) =>
            `<button type="button" class="yt-mchip${active ? ' active' : ''}" data-act="mchip" data-value="${esc(value)}">` +
            `<span class="yt-dot"${dot ? ` style="background:${dot}"` : ''}></span><span class="yt-mchip-text">${esc(name)}</span></button>`;
        chipsEl.innerHTML = chip('All', '', '', !f) +
            allTags().map(t => chip(t, t, (f && f.kind === 'tag' && f.value === t) ? '' : chipColor(t).dot, f && f.kind === 'tag' && f.value === t)).join('');
    }

    function cardHtml(v) {
        const cur = v.id === state.currentId;
        const label = chLabel(v);
        return `<div class="yt-card" data-id="${v.id}"><div class="yt-thumb-wrap">${thumbHtml(v.id, cur, true, true)}${cardMenuHtml(v)}</div>` +
            `<div class="yt-card-title">${esc(titleOf(v))}</div>` +
            '<div class="yt-card-meta">' + (label ? `<span class="yt-channel">${esc(label)}</span><span class="yt-date">· ${dateLabel(v.date)}</span>` : `<span class="yt-date">${dateLabel(v.date)}</span>`) + '</div>' +
            (v.tags.length ? `<div class="yt-chip-row">${chipHtml(v.tags[0])}</div>` : '') +
            '</div>';
    }

    function rowHtml(v) {
        const cur = v.id === state.currentId;
        return `<div class="yt-row${cur ? ' current' : ''}" data-id="${v.id}"><div class="yt-thumb-wrap">${thumbHtml(v.id, cur, true, true)}${cardMenuHtml(v)}</div>` +
            `<div class="yt-row-text"><div class="yt-row-title">${esc(titleOf(v))}</div><div class="yt-row-meta"><span>${esc(chLabel(v))}</span></div></div>` +
            `<div class="yt-row-tags">${v.tags.length ? chipHtml(v.tags[0]) : ''}</div>` +
            `<div class="yt-row-date">${dateLabel(v.date)}</div></div>`;
    }

    function mobileRowHtml(v) {
        const cur = v.id === state.currentId;
        const label = chLabel(v);
        return `<div class="yt-mrow${cur ? ' current' : ''}" data-act="play" data-id="${v.id}">${thumbHtml(v.id, cur, false)}` +
            `<div class="yt-mrow-text"><div class="yt-mrow-title">${esc(titleOf(v))}</div>` +
            `<div class="yt-mrow-meta">${esc(label)}${label ? ' · ' : ''}${dateLabel(v.date)}</div>` +
            (v.tags.length ? `<div class="yt-chip-row">${chipHtml(v.tags[0])}</div>` : '') +
            '</div>' +
            `<button type="button" class="yt-more" data-act="more" data-id="${v.id}" aria-label="More options"><span></span><span></span><span></span></button></div>`;
    }

    function renderGroups() {
        const list = visibleVideos();
        if (!list.length) {
            groupsEl.innerHTML = `<div class="yt-empty">${state.videos.length ? 'Nothing matches. Try a different search or tag.' : 'Paste a YouTube link above to play it. Mark it as saved to start your watch history.'}</div>`;
            return;
        }
        if (isMobile()) {
            groupsEl.innerHTML = groupVideos(list, 'date').map(g =>
                `<div class="yt-mgroup"><div class="yt-mgroup-head"><span class="yt-group-label">${esc(g.label)}</span><span class="yt-group-count">${countLabel(g.items.length)}</span></div>` +
                g.items.map(mobileRowHtml).join('') + '</div>'
            ).join('');
        } else {
            groupsEl.innerHTML = groupVideos(list, state.groupBy).map(g =>
                `<div class="yt-group"><div class="yt-group-head"><span class="yt-group-label">${esc(g.label)}</span><span class="yt-group-count">${countLabel(g.items.length)}</span><span class="yt-rule"></span></div>` +
                (state.view === 'grid'
                    ? `<div class="yt-grid">${g.items.map(cardHtml).join('')}</div>`
                    : `<div class="yt-list">${g.items.map(rowHtml).join('')}</div>`) +
                '</div>'
            ).join('');
        }
        observeThumbs();
    }

    function renderSheet() {
        const v = state.sheetVideoId ? videoById(state.sheetVideoId) : null;
        sheetEl.hidden = !v;
        sheetBackdropEl.hidden = !v;
        if (!v) {
            sheetEl.innerHTML = '';
            return;
        }
        const draft = isDraft(v.id);
        const cur = v.tags[0];
        const tags = allTags();
        if (cur && tags.indexOf(cur) === -1) tags.push(cur);
        const label = chLabel(v);
        sheetEl.innerHTML =
            '<div class="yt-grabber"></div>' +
            `<div class="yt-sheet-head">${thumbHtml(v.id, false, false)}<div><div class="yt-sheet-title">${esc(titleOf(v))}</div>` +
            `<div class="yt-sheet-meta">${esc(label)}${label ? ' · ' : ''}<span class="yt-mono">${v.id}</span></div></div></div>` +
            '<div class="yt-sheet-group"><div class="yt-label">Tag</div>' +
            (tags.length ? '<div class="yt-sheet-chips">' + tags.map(t => {
                const on = t === cur, c = chipColor(t);
                return `<button type="button" class="yt-sheet-chip" data-act="sheet-tag" data-value="${esc(t)}"${on ? ` style="background:${c.bg};color:${c.fg};border-color:${c.dot}"` : ''}>` +
                    `<span class="yt-mark">${on ? '✓' : '+'}</span><span class="yt-sheet-chip-text">${esc(t)}</span></button>`;
            }).join('') + '</div>' : '') +
            '<form class="yt-sheet-new" id="ytSheetForm"><input id="ytSheetInput" type="text" placeholder="New tag" autocomplete="off"><button type="submit">Add</button></form></div>' +
            '<div class="yt-sheet-actions">' +
            (v.id === state.currentId ? '' : `<button type="button" data-act="sheet-play" data-id="${v.id}">Play</button>`) +
            `<a href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener">Open on YouTube ↗</a>` +
            `<button type="button" data-act="copy-id" data-id="${v.id}">Copy video ID</button>` +
            (draft ? '<button type="button" class="danger" data-act="discard">Discard</button>'
                   : `<button type="button" class="danger" data-act="remove" data-id="${v.id}">Remove from history</button>`) +
            '</div>';
        observeThumbs();
    }

    function render() {
        renderSidebar();
        renderNow();
        renderToolbar();
        renderChips();
        renderGroups();
        renderSheet();
    }

    // ------------------------------------------------------------------ small UI helpers
    function showError(msg) {
        errorEl.textContent = msg;
        errorEl.hidden = !msg;
    }

    function toast(msg) {
        let t = el('ytToast');
        if (!t) {
            t = document.createElement('div');
            t.id = 'ytToast';
            t.className = 'yt-toast';
            app.appendChild(t);
        }
        t.textContent = msg;
        t.hidden = false;
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => { t.hidden = true; }, 2200);
    }

    function openSheet(id) {
        state.sheetVideoId = id;
        renderSheet();
    }

    function closeSheet() {
        state.sheetVideoId = null;
        renderSheet();
    }

    function applyMode() {
        inputEl.placeholder = isMobile() ? 'Paste link or video ID' : 'Paste a YouTube link or video ID';
        if (isMobile() && state.filter && state.filter.kind !== 'tag') state.filter = null;
        if (isMobile()) {
            state.menu = null;
        } else {
            closeSheet();
            navEl.classList.remove('open');
            burgerEl.setAttribute('aria-expanded', 'false');
        }
    }

    // ------------------------------------------------------------------ events
    app.addEventListener('click', e => {
        const t = e.target.closest('[data-act]');
        if (!t) return;
        const act = t.dataset.act;
        const id = t.dataset.id;
        const value = t.dataset.value;
        switch (act) {
            case 'play':
                play(id);
                break;
            case 'more':
                e.preventDefault();
                e.stopPropagation();
                openSheet(id);
                break;
            case 'more-tab':
                if (isMobile()) openSheet(id);
                else if (menuOpenFor('player')) closeMenu();
                else { closeMenu(); openMenu('player'); }
                break;
            case 'card-play':
                closeMenu();
                play(id, true);
                break;
            case 'toggle-save':
                toggleSaved();
                break;
            case 'menu-link':
                closeMenu();
                break;
            case 'copy-id':
                copyId(id, t.classList.contains('yt-menu-item') ? t : null);
                if (!t.classList.contains('yt-menu-item')) closeSheet();
                break;
            case 'menu-group':
                if (menuOpenFor(id, 'group')) closeMenu();
                else openMenu(menuOpenFor('player') ? 'player' : id, 'group');
                break;
            case 'pick-group': {
                const v = videoById(id);
                state.menu = null;
                if (v) setGroup(id, v.tags[0] === value ? '' : value); else render();
                break;
            }
            case 'discard':
                discardDraft();
                break;
            case 'remove':
                removeVideo(id);
                break;
            case 'filter':
                setFilter(t.dataset.kind === 'all' ? null
                    : t.dataset.kind === 'untagged' ? { kind: 'untagged' }
                    : { kind: t.dataset.kind, value, label: t.querySelector('.yt-side-text').textContent });
                break;
            case 'mchip':
                setFilter(value ? { kind: 'tag', value } : null);
                break;
            case 'groupby':
                state.groupBy = value;
                savePrefs();
                render();
                break;
            case 'view':
                state.view = value;
                savePrefs();
                render();
                break;
            case 'sheet-close':
                if (e.target === t) closeSheet();
                break;
            case 'sheet-tag': {
                const v = videoById(state.sheetVideoId);
                if (v) setGroup(v.id, v.tags[0] === value ? '' : value);
                break;
            }
            case 'sheet-play':
                closeSheet();
                play(id, true);
                break;
            case 'export':
                exportList();
                break;
            case 'import':
                openModal('import');
                break;
            case 'forget-all':
                forgetAll();
                break;
            case 'modal-close':
                if (e.target === t) closeModal();
                break;
            case 'modal-import':
                importList();
                break;
            default:
                break;
        }
    });

    // Close the ⋯ menu on any click outside it or its button.
    document.addEventListener('click', e => {
        if (!state.menu) return;
        // composedPath is fixed at dispatch time, so it still holds the menu even if the click re-rendered it.
        const path = e.composedPath ? e.composedPath() : [];
        if (path.some(n => n && n.classList && n.classList.contains('yt-menu')) || e.target.closest('[data-act="more-tab"], [data-act="menu-group"]')) return;
        closeMenu();
    });

    app.addEventListener('submit', e => {
        if (e.target.id === 'ytPaste') {
            e.preventDefault();
            submit(inputEl.value);
        } else if (e.target.id === 'ytSheetForm') {
            e.preventDefault();
            const input = el('ytSheetInput');
            if (state.sheetVideoId && input.value.trim()) setGroup(state.sheetVideoId, input.value);
        } else if (e.target.classList.contains('yt-menu-new')) {
            e.preventDefault();
            const input = e.target.querySelector('input');
            const id = e.target.dataset.id;
            if (id && input.value.trim()) {
                state.menu = null;
                setGroup(id, input.value);
            }
        }
    });

    inputEl.addEventListener('input', () => showError(''));

    inputEl.addEventListener('paste', e => {
        const text = (e.clipboardData || window.clipboardData).getData('text');
        if (parseId(text)) {
            e.preventDefault();
            submit(text);
        }
    });

    document.addEventListener('paste', e => {
        const a = document.activeElement;
        if (a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA' || a.isContentEditable)) return;
        if (!modalEl.hidden) return;
        const text = (e.clipboardData || window.clipboardData).getData('text');
        if (parseId(text)) submit(text);
    });

    const onSearch = e => {
        state.query = e.target.value;
        if (e.target === searchEl) searchMobileEl.value = state.query; else searchEl.value = state.query;
        renderToolbar();
        renderGroups();
    };
    searchEl.addEventListener('input', onSearch);
    searchMobileEl.addEventListener('input', onSearch);

    modalDataEl.addEventListener('input', validateImport);

    burgerEl.addEventListener('click', () => {
        const open = navEl.classList.toggle('open');
        burgerEl.setAttribute('aria-expanded', String(open));
    });

    document.addEventListener('keydown', e => {
        if (e.key !== 'Escape') return;
        if (!modalEl.hidden) closeModal();
        else if (state.menu) closeMenu();
        else if (!sheetEl.hidden) closeSheet();
        else if (navEl.classList.contains('open')) burgerEl.click();
    });

    mql.addEventListener('change', () => {
        applyMode();
        render();
    });

    window.addEventListener('beforeunload', () => {
        if (state.draft && !findVideo(state.draft.id)) dbDelete(state.draft.id).catch(() => { /* ignore */ });
    });

    // ------------------------------------------------------------------ boot
    state.videos = loadVideos();
    loadPrefs();
    applyMode();

    const params = new URLSearchParams(location.search);
    const hashId = parseId(location.hash.slice(1));
    if (hashId) submit(hashId); else render();
    pruneThumbs();

    if (params.has('refresh')) {
        params.delete('refresh');
        history.replaceState(null, '', location.pathname + (params.toString() ? '?' + params : '') + location.hash);
        refreshAllMeta();
    }

    if (!isMobile()) inputEl.focus();
})();
