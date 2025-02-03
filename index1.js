let menubtn = document.querySelector(".menu-btn");
let sidebar = document.querySelector(".side-bar");
let videocontainer = document.querySelector(".video-container");

menubtn.onclick = function () {
    sidebar.classList.toggle("resize-sidebar");
    videocontainer.classList.toggle("widen-video-container");
};

const API_KEY = 'AIzaSyDA3vHHbTCtsRiLj1jnIYwBw3GG-WFvYcs';
const BASE_URL = 'https://www.googleapis.com/youtube/v3/search';
const mainContent = document.querySelector('.video-container');
const searchInput = document.querySelector('.search-bar input');
const searchButton = document.querySelector('.search-btn');

async function fetchSuggestedVideos() {
    try {
        const url = `${BASE_URL}?part=snippet&chart=mostPopular&maxResults=50&regionCode=IN&relevanceLanguage=te&type=video&key=${API_KEY}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch search results');
        }
        const data = await response.json();
        if (!data.items || data.items.length === 0) {
            throw new Error("No videos found. Try again later.");
        }
        displayVideos(data.items);
    } catch (error) {
        if (error.message === 'Failed to fetch search results') {
            showErrorMessage('Network error. Please check your internet connection.');
        } else {
            showErrorMessage(error.message);
        }
        console.error("fetch error:", error);
    }
}

function getErrorMessage(status) {
    switch (status) {
        case 0:
            return "Network error. Please check your internet connection.";
        case 400:
            return "Bad request. Please check the parameters.";
        case 401:
            return "Unauthorized. API quota might be invalid.";
        case 403:
            return "Data forbidden. API quota might be exceeded.";
        case 404:
            return "Data not found.";
        case 500:
            return "Server error. Try again later.";
        default:
            return "Something went wrong. Please try again.";
    }
}

function showErrorMessage(message) {
    mainContent.innerHTML = `<div class="error-message"><p>${message}</p></div>`;
}

function displayVideos(videos) {
    mainContent.innerHTML = '';

    const videoContainer = document.createElement('div');
    videoContainer.classList.add('all-videos');

    videos.forEach(video => {
        const videoElement = document.createElement('div');
        videoElement.classList.add('single-video');
        videoElement.innerHTML = `
            <a href="https://www.youtube.com/watch?v=${video.id.videoId}" target="_self">
                <img class="thumb" src="${video.snippet.thumbnails.medium.url}" alt="${video.snippet.title}">
            </a>
            <div class="flexbox">
                <img src="${video.snippet.thumbnails.default ? video.snippet.thumbnails.default.url : 'fallback-image-url'}" class="channel-icon">
                <div class="video-details">
                    <a href="https://www.youtube.com/watch?v=${video.id.videoId}" target="_self">${video.snippet.title}</a>
                    <p>${video.snippet.channelTitle}</p>
                </div>
            </div>
        `;
        videoContainer.appendChild(videoElement);
    });
    mainContent.appendChild(videoContainer);
}

searchButton.addEventListener('click', async () => {
    const query = searchInput.value;
    if (!query) return;
    const url = `${BASE_URL}?part=snippet&q=${encodeURIComponent(query)}&maxResults=20&type=video&key=${API_KEY}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch search results');
        }
        const data = await response.json();
        if (data.items && data.items.length > 0) {
            displayVideos(data.items);
        } else {
            showErrorMessage('No videos found. Please try again later.');
        }
    } catch (error) {
        showErrorMessage(error.message);
    }
});

fetchSuggestedVideos();
