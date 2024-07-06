---
layout: tools
title: YouTube Embed
redirect_from: "/ty"
redirect_from: "/youtube/"
---

<div class="container" id="youtube-embed">
    <input type="text" id="videoId" placeholder="Paste, or enter a YouTube Video ID" onfocus="this.select()">
    <button onclick="embedVideo()">Play without ads</button>
    <div id="videoContainer"></div>
    <div id="youTubeLinkContainer">
        Watch on YouTube: <a id="videoLink" class="video-link" href="#" target="_blank"></a>
    </div>
</div>

<script type="text/javascript">

    function sanitizeInput(input) {
        const pattern = /^[a-zA-Z0-9_-]{11}$/;
        return pattern.test(input) ? input : '';
    }

    function embedVideo() {
        const videoId = sanitizeInput(document.getElementById('videoId').value.trim());
        const videoContainer = document.getElementById('videoContainer');
        const videoLink = document.getElementById('videoLink');
        const youTubeLinkContainer = document.getElementById('youTubeLinkContainer');

        if (videoId) {
            videoContainer.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" allow="autoplay" allowfullscreen></iframe>`;
            videoLink.href = `https://www.youtube.com/watch?v=${videoId}`;
            videoLink.textContent = `https://www.youtube.com/watch?v=${videoId}`;
            videoLink.style.display = 'inline';
            youTubeLinkContainer.style.display = 'block';
            //document.getElementById('videoId').value = '';
            document.activeElement.blur();
        } else {
            videoContainer.innerHTML = '';
            videoLink.href = '#';
            videoLink.textContent = '';
            videoLink.style.display = 'none';
            youTubeLinkContainer.style.display = 'none';
        }
    }

    document.addEventListener('paste', (event) => {
        if (document.activeElement !== document.getElementById('videoId')) {
            const paste = (event.clipboardData || window.clipboardData).getData('text');
            const input = document.getElementById('videoId');
            input.value = sanitizeInput(paste);
            embedVideo();
        }
    });

    document.getElementById('videoId').addEventListener('paste', (event) => {
        setTimeout(() => {
            embedVideo();
        }, 0);
    });

    document.getElementById('videoId').focus();

</script>

