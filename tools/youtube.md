---
layout: tools
title: Embedded YouTube Player
redirect_from: "/yt"
redirect_from: "/youtube/"
---

<style>
    /* Container: full-width layout with padding (overrides Bootstrap) */
    body .container#youtube-embed {
        width: 100% !important;
        max-width: 100% !important;
        padding: 60px !important;
        margin: 0 auto !important;
    }

    /* Remove default padding (overrides main.scss) */
    #youtube-embed {
        padding: 0 !important;
    }

    /* Video player: maintains 16:9 aspect ratio, responsive to viewport (overrides main.scss) */
    #youtube-embed iframe {
        width: 100%;
        height: calc((100vw - 120px) * 9 / 16) !important;
        max-height: calc(100vh - 100px);
        min-height: 400px;
    }

    /* Table: fixed layout for predictable column widths */
    #youtube-embed #playedVideos {
        width: 100%;
        table-layout: fixed;
    }

    /* Timestamp and URL columns: shrink to content width */
    #youtube-embed #playedVideos td:nth-child(1),
    #youtube-embed #playedVideos td:nth-child(2) {
        width: 1px;
        white-space: nowrap;
    }

    /* Notes column: expands to fill remaining table width */
    #youtube-embed #playedVideos td:nth-child(3) {
        width: 100%;
        padding: 0;
    }

    /* Notes input: fills parent cell (overrides main.scss) */
    #youtube-embed #playedVideos td:nth-child(3) input.notes-input {
        display: block !important;
        width: 99%;
        margin: 0;
        padding: 6px 10px !important;
    }

    /* Group column: fixed width, right-aligned */
    #youtube-embed #playedVideos td:nth-child(4) {
        width: 160px;
        text-align: right;
        padding: 0 !important;
        position: relative;
    }

    /* Group input: fills parent cell */
    #youtube-embed #playedVideos td:nth-child(4) input.group-input {
        display: block !important;
        width: 200px;
        box-sizing: border-box;
        margin: 0;
        padding: 6px 10px !important;
        text-align: right;
    }

    /* Group tag badge: styled appearance when not focused */
    #youtube-embed #playedVideos .group-tag {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 8px 3px 16px;
        margin: 4px 0;
        border-radius: 12px;
        font-weight: 500;
        color: #333;
        cursor: pointer;
        transition: opacity 0.2s;
        white-space: nowrap;
    }

    #youtube-embed #playedVideos .group-tag .remove-tag {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 15px;
        height: 15px;
        border-radius: 50%;
        color: #333;
        font-size: 11px;
        line-height: 1;
        cursor: pointer;
        transition: background 0.2s;
    }

    #youtube-embed #playedVideos .group-tag .remove-tag:hover {
        background: rgba(0, 0, 0, 0.3);
    }

    /* Autocomplete dropdown */
    #youtube-embed .autocomplete-dropdown {
        position: absolute;
        background: white;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        max-height: 200px;
        overflow-y: auto;
        z-index: 1000;
        right: 0;
        top: 100%;
        min-width: 150px;
        display: none;
    }

    #youtube-embed .autocomplete-dropdown.show {
        display: block;
    }

    #youtube-embed .autocomplete-item {
        padding: 5px 12px;
        cursor: pointer;
        display: flex;
        justify-content: flex-end;
    }

    #youtube-embed .autocomplete-item:hover,
    #youtube-embed .autocomplete-item.selected {
        background-color: #f0f0f0;
    }

    #youtube-embed .autocomplete-item .group-tag {
        padding: 4px 14px 3px 12px !important;
        margin: 2px 0;
    }

    /* Forget column: fixed width, centered text */
    #youtube-embed #playedVideos td:nth-child(5) {
        width: 60px;
        text-align: center;
    }

    /* Override Bootstrap responsive breakpoints */
    @media (min-width: 768px) {
        body .container#youtube-embed {
            width: 100% !important;
            max-width: 100% !important;
        }
    }

    @media (min-width: 992px) {
        body .container#youtube-embed {
            width: 100% !important;
            max-width: 100% !important;
        }
    }

    @media (min-width: 1200px) {
        body .container#youtube-embed {
            width: 100% !important;
            max-width: 100% !important;
        }
    }
</style>

<div class="container" id="youtube-embed">
    <input type="text" id="videoId" placeholder="Paste, or enter a YouTube Video ID" onfocus="this.select()">
    <button onclick="embedVideo(videoId.value)">Play</button>
    <div id="videoContainer"></div>
    <div id="youTubeLinkContainer">
        Watch on YouTube: <a id="videoLink" class="video-link" href="#" target="_blank"></a>
    </div>
    <div id="recentlyPlayed">Recently Played</div>
    <table id="playedVideos">
        <tbody></tbody>
    </table>
    <div>
        <a id="forgetAll" class="forget-all" onclick="forgetAll()">Forget all videos</a>
    </div>
</div>

<script type="text/javascript">

    const STORAGE_KEY = 'playedVideos';

    const videoContainer = document.getElementById('videoContainer');
    const videoLink = document.getElementById('videoLink');
    const videoId = document.getElementById('videoId');
    const youTubeLinkContainer = document.getElementById('youTubeLinkContainer');

    document.addEventListener('DOMContentLoaded', () => {
        displayPlayedVideos();
        document.getElementById('videoId').focus();
    });

    function sanitizeInput(input) {
        const pattern = /^[a-zA-Z0-9_-]{11}$/;
        return pattern.test(input.trim()) ? input.trim() : '';
    }

    function playVideo(encodedUrl) {
        embedVideo(new URL(decodeURIComponent(encodedUrl)).searchParams.get('v'));
    }

    function embedVideo(id) {
        if (id) {
            const videoUrl = `https://www.youtube.com/watch?v=${id}`;
            videoContainer.innerHTML = `<iframe src="https://www.youtube.com/embed/${id}?autoplay=1" allow="autoplay" allowfullscreen></iframe>`;
            videoLink.href = videoUrl;
            videoId.value = id;
            videoLink.textContent = videoUrl;
            videoLink.style.display = 'inline';
            youTubeLinkContainer.style.display = 'block';
            addToPlayedVideos(videoUrl);
            document.activeElement.blur();
        }
    }

    // Fetch video title from YouTube oEmbed API
    async function fetchVideoTitle(videoUrl) {
        try {
            const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(videoUrl)}&format=json`;
            const response = await fetch(oembedUrl);
            if (response.ok) {
                const data = await response.json();
                console.log(`Fetched video title from ${oembedUrl}:`, data.title);
                return data.title || '';
            } else {
                console.log(`Failed to fetch video title from ${oembedUrl} - HTTP status:`, response.status, response.statusText);
            }
        } catch (error) {
            console.log(`Error fetching video title from ${oembedUrl}:`, error.message);
        }
        return '';
    }

    async function addToPlayedVideos(videoUrl) {
        const playedVideos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        if (!playedVideos.some(video => video.url === videoUrl)) {
            const timestamp = new Date().toLocaleString();
            const title = await fetchVideoTitle(videoUrl);
            playedVideos.push({ url: videoUrl, timestamp, notes: title, group: '', groupColor: '' });
            localStorage.setItem(STORAGE_KEY, JSON.stringify(playedVideos));
            displayPlayedVideos();
        }
    }

    // Generate consistent pastel color based on tag name
    function generatePastelColor(tagName) {
        // Simple hash function to get consistent color for same tag
        let hash = 0;
        for (let i = 0; i < tagName.length; i++) {
            hash = tagName.toLowerCase().charCodeAt(i) + ((hash << 5) - hash);
        }

        // Generate pastel colors (high lightness, medium saturation)
        const hue = Math.abs(hash % 360);
        const saturation = 50 + (Math.abs(hash) % 20); // 50-70%
        const lightness = 80 + (Math.abs(hash) % 10);  // 80-90%

        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }

    // Get all unique tags with their colors
    function getAllTags() {
        const playedVideos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        const tagMap = new Map();

        playedVideos.forEach(video => {
            if (video.group && video.group.trim()) {
                const tagLower = video.group.toLowerCase();
                if (!tagMap.has(tagLower)) {
                    tagMap.set(tagLower, {
                        displayName: video.group,
                        color: video.groupColor || generatePastelColor(video.group)
                    });
                }
            }
        });

        return Array.from(tagMap.values());
    }

    function displayPlayedVideos(focusUrl = null) {
        const playedVideos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        const playedVideosContainer = document.querySelector('#playedVideos tbody');
        playedVideosContainer.innerHTML = '';

        // Sort: untagged first (by timestamp desc), then by group, then by timestamp within groups
        playedVideos.sort((a, b) => {
            const aHasGroup = a.group && a.group.trim();
            const bHasGroup = b.group && b.group.trim();

            // Untagged videos first
            if (!aHasGroup && bHasGroup) return -1;
            if (aHasGroup && !bHasGroup) return 1;

            // Both untagged or both tagged
            if (!aHasGroup && !bHasGroup) {
                // Sort by timestamp descending
                return new Date(b.timestamp) - new Date(a.timestamp);
            }

            // Both tagged - sort by group name
            const groupCompare = a.group.toLowerCase().localeCompare(b.group.toLowerCase());
            if (groupCompare !== 0) return groupCompare;

            // Same group - sort by timestamp descending
            return new Date(b.timestamp) - new Date(a.timestamp);
        });

        playedVideos.forEach(video => {
            const videoItem = document.createElement('tr');
            videoItem.className = 'video-item';
            videoItem.dataset.url = video.url;

            // Initialize group and groupColor if missing (for backwards compatibility)
            if (!video.hasOwnProperty('group')) video.group = '';
            if (!video.hasOwnProperty('groupColor')) video.groupColor = '';

            const groupCellContent = video.group && video.group.trim()
                ? `<span class="group-tag" style="background-color: ${video.groupColor}" onclick="showGroupInput('${encodeURIComponent(video.url)}')">
                    <span>${video.group}</span>
                    <span class="remove-tag" onclick="event.stopPropagation(); removeTag('${encodeURIComponent(video.url)}')">×</span>
                </span>`
                : `<input type="text" class="group-input" value="" placeholder="Add group..."
                    onfocus="showAutocomplete(this, '${encodeURIComponent(video.url)}')"
                    onblur="setTimeout(() => hideAutocomplete(), 200)"
                    oninput="filterAutocomplete(this, '${encodeURIComponent(video.url)}')"
                    onkeydown="handleGroupKeydown(event, '${encodeURIComponent(video.url)}')">`;

            videoItem.innerHTML = `
                <td>${video.timestamp}</td>
                <td>
                    <a href="#" onclick="playVideo('${encodeURIComponent(video.url)}'); return false;">${video.url}</a>
                    <a href="${video.url}" target="_blank" class="youtube-icon" title="Open in YouTube">
                        <i class="fas fa-external-link-alt"></i>
                    </a>
                </td>
                <td><input type="text" class="notes-input" value="${video.notes || ''}" placeholder="Add notes..." oninput="updateNotes('${encodeURIComponent(video.url)}', this.value)"></td>
                <td>${groupCellContent}</td>
                <td><a href="#" onclick="forgetVideo('${encodeURIComponent(video.url)}'); return false;">Forget</a></td>
            `;
            playedVideosContainer.appendChild(videoItem);

            // Restore focus if this was the focused row
            if (focusUrl && video.url === focusUrl) {
                const groupInput = videoItem.querySelector('.group-input');
                if (groupInput) {
                    setTimeout(() => {
                        groupInput.focus();
                        groupInput.style.boxShadow = '0 0 0 2px #4CAF50';
                        setTimeout(() => {
                            groupInput.style.boxShadow = '';
                        }, 800);
                    }, 50);
                }
            }
        });

        if (playedVideos.length > 0)
        {
            document.getElementById('recentlyPlayed').style.display = 'block';
            document.getElementById('playedVideos').style.display = 'inline-block';
            document.getElementById('forgetAll').style.display = 'inline-block';
        }
        else {
            document.getElementById('recentlyPlayed').style.display = 'none';
            document.getElementById('playedVideos').style.display = 'none';
            document.getElementById('forgetAll').style.display = 'none';
        }
    }

    function updateNotes(encodedUrl, notes) {
        const videoUrl = decodeURIComponent(encodedUrl);
        let playedVideos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        playedVideos = playedVideos.map(video => {
            if (video.url === videoUrl) {
                video.notes = notes;
            }
            return video;
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(playedVideos));
    }

    // Update group tag for a video
    function updateGroup(encodedUrl, groupName, restoreFocus = true) {
        const videoUrl = decodeURIComponent(encodedUrl);
        let playedVideos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

        // Find existing tag with same name (case-insensitive) to get its color and canonical name
        let existingTag = null;
        if (groupName && groupName.trim()) {
            const lowerGroupName = groupName.toLowerCase();
            playedVideos.forEach(video => {
                if (video.group && video.group.toLowerCase() === lowerGroupName) {
                    existingTag = { name: video.group, color: video.groupColor };
                }
            });
        }

        playedVideos = playedVideos.map(video => {
            if (video.url === videoUrl) {
                if (groupName && groupName.trim()) {
                    if (existingTag) {
                        // Use existing tag's canonical name and color
                        video.group = existingTag.name;
                        video.groupColor = existingTag.color;
                    } else {
                        // New tag - use provided name and generate color
                        video.group = groupName.trim();
                        video.groupColor = generatePastelColor(groupName.trim());
                    }
                } else {
                    // Clear the tag
                    video.group = '';
                    video.groupColor = '';
                }
            }
            return video;
        });

        localStorage.setItem(STORAGE_KEY, JSON.stringify(playedVideos));
        displayPlayedVideos(restoreFocus ? videoUrl : null);
    }

    // Remove tag with single click on X button
    function removeTag(encodedUrl) {
        updateGroup(encodedUrl, '', false);
    }

    // Show input when clicking on tag badge
    function showGroupInput(encodedUrl) {
        const videoUrl = decodeURIComponent(encodedUrl);
        const playedVideos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        const video = playedVideos.find(v => v.url === videoUrl);

        if (video) {
            const row = document.querySelector(`tr[data-url="${CSS.escape(videoUrl)}"]`);
            if (row) {
                const groupCell = row.children[3];
                const currentGroup = video.group || '';

                groupCell.innerHTML = `<input type="text" class="group-input" value="${currentGroup}" placeholder="Add group..."
                    onfocus="showAutocomplete(this, '${encodeURIComponent(videoUrl)}')"
                    onblur="setTimeout(() => hideAutocomplete(), 200)"
                    oninput="filterAutocomplete(this, '${encodeURIComponent(videoUrl)}')"
                    onkeydown="handleGroupKeydown(event, '${encodeURIComponent(videoUrl)}')">`;

                const input = groupCell.querySelector('.group-input');
                input.focus();
                input.select();
            }
        }
    }

    // Autocomplete state
    let currentAutocomplete = null;
    let selectedAutocompleteIndex = -1;
    let autocompleteJustOpened = false;

    // Create autocomplete item element
    function createAutocompleteItem(tag, index, encodedUrl) {
        const item = document.createElement('div');
        item.className = 'autocomplete-item';
        item.dataset.index = index;
        item.innerHTML = `<span class="group-tag" style="background-color: ${tag.color}">${tag.displayName}</span>`;
        item.addEventListener('mousedown', (e) => {
            e.preventDefault();
            updateGroup(encodedUrl, tag.displayName, true);
        });
        return item;
    }

    // Show autocomplete dropdown
    function showAutocomplete(input, encodedUrl) {
        hideAutocomplete();

        const cell = input.parentElement;
        const dropdown = document.createElement('div');
        dropdown.className = 'autocomplete-dropdown show';

        const tags = getAllTags();
        tags.forEach((tag, index) => {
            dropdown.appendChild(createAutocompleteItem(tag, index, encodedUrl));
        });

        if (tags.length > 0) {
            cell.appendChild(dropdown);
            currentAutocomplete = dropdown;
            autocompleteJustOpened = true;
            setTimeout(() => { autocompleteJustOpened = false; }, 300);
        }
    }

    // Filter autocomplete based on input
    function filterAutocomplete(input, encodedUrl) {
        hideAutocomplete();

        const searchTerm = input.value.toLowerCase().trim();
        const cell = input.parentElement;
        const dropdown = document.createElement('div');
        dropdown.className = 'autocomplete-dropdown show';

        const tags = getAllTags();
        const filtered = searchTerm
            ? tags.filter(tag => tag.displayName.toLowerCase().includes(searchTerm))
            : tags;

        filtered.forEach((tag, index) => {
            dropdown.appendChild(createAutocompleteItem(tag, index, encodedUrl));
        });

        if (filtered.length > 0) {
            cell.appendChild(dropdown);
            currentAutocomplete = dropdown;
            selectedAutocompleteIndex = -1;
        }
    }

    // Hide autocomplete dropdown
    function hideAutocomplete() {
        if (autocompleteJustOpened) {
            return; // Don't hide if we just opened it
        }
        if (currentAutocomplete) {
            currentAutocomplete.remove();
            currentAutocomplete = null;
            selectedAutocompleteIndex = -1;
        }
    }

    // Handle keyboard navigation in group input
    function handleGroupKeydown(event, encodedUrl) {
        const input = event.target;

        if (event.key === 'Enter') {
            event.preventDefault();

            if (currentAutocomplete && selectedAutocompleteIndex >= 0) {
                // Select highlighted autocomplete item
                const items = currentAutocomplete.querySelectorAll('.autocomplete-item');
                if (items[selectedAutocompleteIndex]) {
                    const tagSpan = items[selectedAutocompleteIndex].querySelector('.group-tag');
                    updateGroup(encodedUrl, tagSpan.textContent);
                }
            } else {
                // Use typed value
                const value = input.value.trim();
                if (!value) {
                    // Clearing the tag - don't restore focus
                    updateGroup(encodedUrl, '', false);
                } else {
                    updateGroup(encodedUrl, value);
                }
            }
        } else if (event.key === 'Escape') {
            event.preventDefault();
            hideAutocomplete();
            input.blur();
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();

            if (currentAutocomplete) {
                const items = currentAutocomplete.querySelectorAll('.autocomplete-item');
                if (items.length > 0) {
                    if (selectedAutocompleteIndex >= 0) {
                        items[selectedAutocompleteIndex].classList.remove('selected');
                    }
                    selectedAutocompleteIndex = (selectedAutocompleteIndex + 1) % items.length;
                    items[selectedAutocompleteIndex].classList.add('selected');
                    items[selectedAutocompleteIndex].scrollIntoView({ block: 'nearest' });
                }
            }
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();

            if (currentAutocomplete) {
                const items = currentAutocomplete.querySelectorAll('.autocomplete-item');
                if (items.length > 0) {
                    if (selectedAutocompleteIndex >= 0) {
                        items[selectedAutocompleteIndex].classList.remove('selected');
                    }
                    selectedAutocompleteIndex = selectedAutocompleteIndex <= 0
                        ? items.length - 1
                        : selectedAutocompleteIndex - 1;
                    items[selectedAutocompleteIndex].classList.add('selected');
                    items[selectedAutocompleteIndex].scrollIntoView({ block: 'nearest' });
                }
            }
        }
    }

    function forgetVideo(encodedUrl) {
        const videoUrl = decodeURIComponent(encodedUrl);
        let playedVideos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        playedVideos = playedVideos.filter(video => video.url !== videoUrl);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(playedVideos));
        displayPlayedVideos();
    }

    function forgetAll() {
        localStorage.removeItem(STORAGE_KEY);
        displayPlayedVideos();
        document.getElementById('recentlyPlayed').style.display = 'none';
    }

    // paste on page
    document.addEventListener('paste', (event) => {
        if (document.activeElement !== videoId) {
            const paste = (event.clipboardData || window.clipboardData).getData('text');
            const id = sanitizeInput(paste);
            embedVideo(id);
        }
    });

    // paste into videoId input
    videoId.addEventListener('paste', (event) => {
        const paste = (event.clipboardData || window.clipboardData).getData('text');
        const id = sanitizeInput(paste);
        embedVideo(id);
    });

</script>

