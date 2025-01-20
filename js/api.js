const API_KEY = 'anjosnews'; // Substitua pela sua API Key
const CHANNEL_ID = '@AnjosNews-ct9ql'; // Substitua pelo ID do seu canal
const MAX_RESULTS = 5;

async function fetchVideos() {
  const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet&order=date&maxResults=${MAX_RESULTS}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    displayVideos(data.items);
  } catch (error) {
    console.error('Erro ao buscar vídeos:', error);
  }
}

function displayVideos(videos) {
  const videosContainer = document.getElementById('videos');
  videosContainer.innerHTML = '';

  videos.forEach(video => {
    const { title, description, thumbnails } = video.snippet;
    const videoId = video.id.videoId;

    const videoElement = `
      <div class="video-item">
        <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank">
          <img src="${thumbnails.medium.url}" alt="${title}" />
        </a>
        <h3>${title}</h3>
        <p>${description}</p>
      </div>
    `;

    videosContainer.innerHTML += videoElement;
  });
}

// Carregar vídeos ao abrir a página
fetchVideos();