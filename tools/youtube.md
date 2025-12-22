---
layout: tools
title: Embedded YouTube Player
redirect_from: "/yt"
redirect_from: "/youtube/"
body_class: youtube-page
---

<div class="container" id="youtube-embed">
    <div class="input-row">
        <input type="text" id="videoId" placeholder="Paste, or enter a YouTube Video ID" autocomplete="off" onfocus="this.select()">
        <button onclick="embedVideo(videoId.value)">Play</button>
    </div>
    <div id="videoContainer"></div>
    <div id="youTubeLinkContainer">
        Watch on YouTube: <a id="videoLink" class="video-link" href="#" target="_blank"></a>
    </div>
    <div id="recentlyPlayed">Watch history</div>
    <div class="table-container">
        <table id="playedVideos">
            <tbody></tbody>
        </table>
    </div>
    <div class="table-actions">
        <a id="forgetAll" class="forget-all" onclick="forgetAll()">Forget all videos</a>
        <span class="action-separator">|</span>
        <span class="sort-label">Order by:</span>
        <a class="sort-link" onclick="sortByAdded()">date added</a>
        <span class="sort-separator">·</span>
        <a class="sort-link" onclick="sortByChannel()">channel</a>
        <span class="sort-separator sort-group-separator">·</span>
        <a id="sortByGroup" class="sort-link" onclick="sortByGroup()">group</a>
    </div>
</div>

<script type="text/javascript">

    const STORAGE_KEY = 'playedVideos';
    const SORT_ORDER_KEY = 'playedVideosSortOrder';
    const SORT_BY_DATE = 'date';
    const SORT_BY_CHANNEL = 'channel';
    const SORT_BY_GROUP = 'group';
    let currentlyPlayingUrl = null;

    const videoContainer = document.getElementById('videoContainer');
    const videoLink = document.getElementById('videoLink');
    const videoId = document.getElementById('videoId');
    const youTubeLinkContainer = document.getElementById('youTubeLinkContainer');

    document.addEventListener('DOMContentLoaded', async () => {
        // Fix old non-ISO timestamps (e.g., locale-specific "12/22/2025, 3:45:00 PM")
        let playedVideos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        let fixed = false;
        playedVideos = playedVideos.map(video => {
            if (!video.timestamp || !video.timestamp.includes('T')) {
                video.timestamp = new Date().toISOString();
                fixed = true;
            }
            return video;
        });
        if (fixed) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(playedVideos));
        }

        // Check for refresh URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('refresh')) {
            await refreshAllTitles();
            // Remove the refresh parameter from URL
            urlParams.delete('refresh');
            const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
            window.history.replaceState({}, '', newUrl);
        }
        applySortOrder();
        document.getElementById('videoId').focus();
    });

    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays}d ago`;

        // Older than a week - show date
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        const currentYear = now.getFullYear();

        if (year === currentYear) {
            return `${day} ${month}`;
        }
        return `${day} ${month} ${year}`;
    }

    function sanitizeInput(input) {
        const trimmed = input.trim();

        // Direct video ID (11 characters)
        const idPattern = /^[a-zA-Z0-9_-]{11}$/;
        if (idPattern.test(trimmed)) {
            return trimmed;
        }

        // youtu.be short URL (e.g., https://youtu.be/T6dNEdAD5Hg?si=...)
        const shortUrlMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
        if (shortUrlMatch) {
            return shortUrlMatch[1];
        }

        // Standard YouTube URL (e.g., https://www.youtube.com/watch?v=...)
        const standardUrlMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
        if (standardUrlMatch) {
            return standardUrlMatch[1];
        }

        return '';
    }

    function copyVideoId(element) {
        const id = element.textContent;
        navigator.clipboard.writeText(id);

        // Show copied state
        element.classList.add('copied');
        setTimeout(() => {
            element.classList.remove('copied');
        }, 800);
    }

    function playVideo(encodedUrl) {
        embedVideo(new URL(decodeURIComponent(encodedUrl)).searchParams.get('v'));
    }

    function highlightPlayingRow(videoUrl) {
        currentlyPlayingUrl = videoUrl;
        // Remove highlight and reset icons on all rows
        document.querySelectorAll('#playedVideos .video-item').forEach(row => {
            row.classList.remove('playing');
            const icon = row.querySelector('.play-col i');
            if (icon) {
                icon.classList.remove('fa-play-circle');
                icon.classList.add('fa-play-circle-o');
            }
        });
        // Add highlight and pause icon to current row
        if (videoUrl) {
            const row = document.querySelector(`#playedVideos .video-item[data-url="${videoUrl}"]`);
            if (row) {
                row.classList.add('playing');
                const icon = row.querySelector('.play-col i');
                if (icon) {
                    icon.classList.remove('fa-play-circle-o');
                    icon.classList.add('fa-play-circle');
                }
            }
        }
    }

    async function embedVideo(id) {
        if (id) {
            const videoUrl = `https://www.youtube.com/watch?v=${id}`;
            videoContainer.innerHTML = `<iframe src="https://www.youtube.com/embed/${id}?autoplay=1" allow="autoplay" allowfullscreen></iframe>`;
            videoLink.href = videoUrl;
            videoId.value = id;
            videoLink.textContent = videoUrl;
            videoLink.style.display = 'inline';
            youTubeLinkContainer.style.display = 'block';
            await addToPlayedVideos(videoUrl);
            highlightPlayingRow(videoUrl);
            document.activeElement.blur();
        }
    }

    // Fetch video info from YouTube oEmbed API
    async function fetchVideoInfo(videoUrl) {
        try {
            const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(videoUrl)}&format=json`;
            const response = await fetch(oembedUrl);
            if (response.ok) {
                const data = await response.json();
                // Extract @handle from author_url (e.g., "https://www.youtube.com/@ChannelName" -> "@ChannelName")
                let author = '';
                if (data.author_url) {
                    const urlParts = data.author_url.split('/');
                    author = urlParts[urlParts.length - 1] || '';
                }
                const title = data.title || '';
                const authorUrl = data.author_url || '';
                console.log(`Fetched video info from ${oembedUrl}:`, { title, author, authorUrl });
                return { title, author, authorUrl };
            } else {
                console.log(`Failed to fetch video info from ${oembedUrl} - HTTP status:`, response.status, response.statusText);
            }
        } catch (error) {
            console.log(`Error fetching video info from ${oembedUrl}:`, error.message);
        }
        return { title: '', author: '', authorUrl: '' };
    }

    // For backwards compatibility - parse author from notes field
    function parseAuthorFromNotes(notes) {
        if (!notes) return { author: '', title: notes || '' };
        const match = notes.match(/^(@[^\s]+)\s*—\s*(.*)$/);
        if (match) {
            return { author: match[1], title: match[2] };
        }
        return { author: '', title: notes };
    }

    // Refresh all video info from the API
    async function refreshAllTitles() {
        console.log('Refreshing all video info...');
        let playedVideos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

        for (let i = 0; i < playedVideos.length; i++) {
            const video = playedVideos[i];
            console.log(`Refreshing ${i + 1}/${playedVideos.length}: ${video.url}`);

            const info = await fetchVideoInfo(video.url);
            if (info.title) {
                video.notes = info.title;
                video.author = info.author;
                video.authorUrl = info.authorUrl;
            }

            // Small delay to avoid hammering the API
            if (i < playedVideos.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(playedVideos));
        console.log('Finished refreshing all video info');
    }

    async function addToPlayedVideos(videoUrl) {
        const playedVideos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        if (!playedVideos.some(video => video.url === videoUrl)) {
            const timestamp = new Date().toISOString();
            const info = await fetchVideoInfo(videoUrl);
            playedVideos.push({
                url: videoUrl,
                timestamp,
                notes: info.title,
                author: info.author,
                authorUrl: info.authorUrl,
                group: '',
                groupColor: ''
            });
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

        playedVideos.forEach(video => {
            const videoItem = document.createElement('tr');
            videoItem.className = 'video-item';
            videoItem.dataset.url = video.url;

            // Initialize fields if missing (for backwards compatibility)
            if (!video.hasOwnProperty('group')) video.group = '';
            if (!video.hasOwnProperty('groupColor')) video.groupColor = '';
            // Parse author from notes for old data that doesn't have separate author field
            if (!video.hasOwnProperty('author') || !video.author) {
                const parsed = parseAuthorFromNotes(video.notes);
                video.author = parsed.author;
            }
            if (!video.hasOwnProperty('authorUrl')) video.authorUrl = '';

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

            const videoId = video.url.split('v=')[1] || video.url;
            const authorCell = video.authorUrl
                ? `<a href="${video.authorUrl}" target="_blank" class="author-link">${video.author}</a>`
                : video.author || '';
            videoItem.innerHTML = `
                <td class="play-col" onclick="playVideo('${encodeURIComponent(video.url)}')">
                    <i class="fa fa-play-circle-o"></i>
                </td>
                <td onclick="playVideo('${encodeURIComponent(video.url)}')"><span>${formatTimestamp(video.timestamp)}</span></td>
                <td>
                    <span class="video-id" onclick="copyVideoId(this)" title="Click to copy">${videoId}</span>
                    <a href="${video.url}" target="_blank" class="external-link" title="Open in YouTube">
                        <i class="fa fa-external-link"></i>
                    </a>
                </td>
                <td>${authorCell}</td>
                <td><input type="text" class="notes-input" value="${video.notes || ''}" placeholder="Add notes..." oninput="updateNotes('${encodeURIComponent(video.url)}', this.value)"></td>
                <td>${groupCellContent}</td>
                <td><a href="#" onclick="forgetVideo('${encodeURIComponent(video.url)}'); return false;" title="Forget"><i class="fa fa-trash-o"></i></a></td>
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
            document.querySelector('.table-container').style.display = 'block';
            document.querySelector('.table-actions').style.display = 'block';
        }
        else {
            document.getElementById('recentlyPlayed').style.display = 'none';
            document.querySelector('.table-container').style.display = 'none';
            document.querySelector('.table-actions').style.display = 'none';
        }

        // Re-apply highlight to currently playing video
        if (currentlyPlayingUrl) {
            const row = document.querySelector(`#playedVideos .video-item[data-url="${currentlyPlayingUrl}"]`);
            if (row) row.classList.add('playing');
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
                const groupCell = row.children[5];
                const currentGroup = video.group || '';

                groupCell.innerHTML = `<input type="text" class="group-input" value="${currentGroup}" placeholder="Add group..."
                    onfocus="showAutocomplete(this, '${encodeURIComponent(videoUrl)}')"
                    onblur="setTimeout(() => { hideAutocomplete(); displayPlayedVideos(); }, 200)"
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
        item.innerHTML = `<span class="group-tag" style="background-color: ${tag.color}; padding: 3px 12px 2px 12px; max-width: none;">${tag.displayName}</span>`;
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
            displayPlayedVideos();
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

    function sortByGroup() {
        localStorage.setItem(SORT_ORDER_KEY, SORT_BY_GROUP);
        applySortOrder();
    }

    function sortByAdded() {
        localStorage.setItem(SORT_ORDER_KEY, SORT_BY_DATE);
        applySortOrder();
    }

    function sortByChannel() {
        localStorage.setItem(SORT_ORDER_KEY, SORT_BY_CHANNEL);
        applySortOrder();
    }

    function applySortOrder() {
        const sortOrder = localStorage.getItem(SORT_ORDER_KEY) || SORT_BY_DATE;
        let playedVideos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

        if (sortOrder === SORT_BY_GROUP) {
            playedVideos.sort((a, b) => {
                const groupA = (a.group || '').toLowerCase();
                const groupB = (b.group || '').toLowerCase();
                if (groupA === groupB) return 0;
                if (groupA === '') return -1;
                if (groupB === '') return 1;
                return groupA.localeCompare(groupB);
            });
        } else if (sortOrder === SORT_BY_CHANNEL) {
            playedVideos.sort((a, b) => {
                const authorA = (a.author || '').toLowerCase();
                const authorB = (b.author || '').toLowerCase();
                if (authorA === authorB) return 0;
                if (authorA === '') return 1;
                if (authorB === '') return -1;
                return authorA.localeCompare(authorB);
            });
        } else {
            playedVideos.sort((a, b) => {
                return new Date(b.timestamp) - new Date(a.timestamp);
            });
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(playedVideos));
        displayPlayedVideos();
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

