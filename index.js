// scripts/script.js
document.addEventListener("DOMContentLoaded", function() {
    const clientId = '091e766389154dff834ccc831e16ae16';
    const clientSecret = '75a8be7fd33b4ccb9cfa98c36e587988';
    const playlistUrl = 'https://api.spotify.com/v1/playlists/37i9dQZEVXbMDoHDwVN2tF';
    const tracksUrl = `${playlistUrl}/tracks`;

    async function getSpotifyToken() {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`
            },
            body: 'grant_type=client_credentials'
        });
        const data = await response.json();
        return data.access_token;
    }

    async function getPlaylistTracks() {
        const token = await getSpotifyToken();
        const response = await fetch(tracksUrl, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        return data.items;
    }

    getPlaylistTracks().then(tracks => {
        const tracksList = document.getElementById('tracks-list');
        tracks.forEach((item, index) => {
            const track = item.track;
            const trackElement = document.createElement('div');
            trackElement.classList.add('track');
            trackElement.innerHTML = `
                <span class="rank">${index + 1}</span>
                <div class="album-info">
                    <img src="${track.album.images[0].url}" alt="${track.name}">
                    <div class="track-info">
                        <div class="track-name">${track.name}</div>
                        <div class="artist-name">${track.artists[0].name}</div>
                    </div>
                </div>
                <button class="info-button" data-uri="${track.external_urls.spotify}">앨범 정보</button>
            `;
            tracksList.appendChild(trackElement);
        });

        const infoButtons = document.querySelectorAll('.info-button');
        infoButtons.forEach(button => {
            button.addEventListener('click', () => {
                const uri = button.dataset.uri;
                openSpotifyTrack(uri);
            });
        });
    });

    function openSpotifyTrack(uri) {
        window.open(uri);
    }
});
