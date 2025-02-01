let menubtn = document.querySelector(".menu-btn");
let sidebar =document.querySelector(".side-bar");
let videocontainer=document.querySelector(".video-container")
menubtn.onclick = function(){
    sidebar.classList.toggle("resize-sidebar")
    videocontainer.classList.toggle("widen-video-container");
}

// Updated index.js - Integrates YouTube API

const API_KEY = 'AIzaSyDA3vHHbTCtsRiLj1jnIYwBw3GG-WFvYcs'; // Replace with your actual API key
const BASE_URL = 'https://www.googleapis.com/youtube/v3/search';
const mainContent = document.querySelector('.video-container');
const searchInput = document.querySelector('.search-bar input');
const searchButton = document.querySelector('.search-btn');

// Fetch and display suggested videos on page load
async function fetchSuggestedVideos() {
    const url = `${BASE_URL}?part=snippet&chart=mostPopular&maxResults=50&regionCode=IN&relevanceLanguage=te&type=video&key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    displayVideos(data.items);
}

// Display videos in the main content section
function displayVideos(videos) {
    mainContent.innerHTML = ''; // Clear existing content

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
                <img src="${video.snippet.thumbnails.default.url}" class="channel-icon">
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

// Search function without opening a new tab
searchButton.addEventListener('click', async () => {
    const query = searchInput.value;
    if (!query) return;
    const url = `${BASE_URL}?part=snippet&q=${encodeURIComponent(query)}&maxResults=20&type=video&key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    displayVideos(data.items);
});

// Initialize with suggested videos
fetchSuggestedVideos();
