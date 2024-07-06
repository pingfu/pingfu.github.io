---
layout: tools
title: Embedded YouTube Player
redirect_from: "/yt"
redirect_from: "/youtube/"
---

<div class="container" id="youtube-embed">
    <input type="text" id="videoId" placeholder="Paste, or enter a YouTube Video ID" onfocus="this.select()">
    <button onclick="embedVideo(videoId.value)">Play without ads</button>
    <div id="videoContainer"></div>
    <div id="youTubeLinkContainer">
        Watch on YouTube: <a id="videoLink" class="video-link" href="#" target="_blank"></a>
    </div>
    <div id="recentlyPlayed">Recently Played</div>
    <table id="playedVideos">
        <tbody></tbody>
    </table>
    <div>
        <a id="forgetAll" class="forget-all" onclick="forgetAll()">Forget all recently played videos</a>
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

    function addToPlayedVideos(videoUrl) {
        const playedVideos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        if (!playedVideos.some(video => video.url === videoUrl)) {
            const timestamp = new Date().toLocaleString();
            playedVideos.push({ url: videoUrl, timestamp, notes: '' });
            localStorage.setItem(STORAGE_KEY, JSON.stringify(playedVideos));
            displayPlayedVideos();
        }
    }

    function displayPlayedVideos() {
        const playedVideos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        const playedVideosContainer = document.querySelector('#playedVideos tbody');
        playedVideosContainer.innerHTML = '';

        // Sort videos by timestamp in descending order
        playedVideos.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        playedVideos.forEach(video => {
            const videoItem = document.createElement('tr');
            videoItem.className = 'video-item';
            videoItem.innerHTML = `
                <td>${video.timestamp}</td>
                <td>
                    <a href="#" onclick="playVideo('${encodeURIComponent(video.url)}'); return false;">${video.url}</a>
                    <a href="${video.url}" target="_blank" class="youtube-icon" title="Open in YouTube">
                        <i class="fas fa-external-link-alt"></i>
                    </a>
                </td>
                <td><input type="text" class="notes-input" value="${video.notes}" placeholder="Add notes..." oninput="updateNotes('${encodeURIComponent(video.url)}', this.value)"></td>
                <td><a href="#" onclick="forgetVideo('${encodeURIComponent(video.url)}'); return false;">Forget</a></td>
            `;
            playedVideosContainer.appendChild(videoItem);
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

