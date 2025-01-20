const MAX_RESULTS = 4;
const MAX_COMMENTS = 3;


async function fetchVideosAndComments() {
  // Buscar vídeos
  const videosUrl = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet&order=date&maxResults=${MAX_RESULTS}`;
  try {
    const videoResponse = await fetch(videosUrl);
    const videoData = await videoResponse.json();
    displayVideos(videoData.items);

    // Buscar comentários para o primeiro vídeo
    const videoId = videoData.items[0].id.videoId;
    const commentsUrl = `https://www.googleapis.com/youtube/v3/commentThreads?key=${API_KEY}&videoId=${videoId}&part=snippet&maxResults=50`;
    const commentsResponse = await fetch(commentsUrl);
    const commentsData = await commentsResponse.json();
    displayRandomComments(commentsData.items);
  } catch (error) {
    console.error('Erro ao buscar vídeos ou comentários:', error);
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
        <br/>
        <p>${description}</p>
      </div>
    `;

    videosContainer.innerHTML += videoElement;
  });
}

let currentIndex = 0; // Índice do grupo de comentários atual
let commentsArray = []; // Array para armazenar todos os comentários carregados

function displayRandomComments(comments) {
  const comentariosContainer = document.getElementById('comentarios-slider');
  comentariosContainer.innerHTML = ''; // Limpar o conteúdo atual

  // Embaralha e seleciona 15 comentários para preencher os grupos de 3
  const randomComments = comments.sort(() => 0.5 - Math.random()).slice(0, 15);
  
  // Armazena os comentários no array
  commentsArray = randomComments;

  // Exibe os 3 primeiros comentários no slider
  displayCommentGroup(currentIndex);

  // Navegar para o próximo grupo de comentários
  document.getElementById('nextButton').addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % (commentsArray.length / 3); // Avança para o próximo grupo
    displayCommentGroup(currentIndex);
  });

  // Navegar para o grupo de comentário anterior
  document.getElementById('prevButton').addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + commentsArray.length / 3) % (commentsArray.length / 3); // Volta para o grupo anterior
    displayCommentGroup(currentIndex);
  });

  // Função para exibir um grupo de 3 comentários
  function displayCommentGroup(index) {
    comentariosContainer.innerHTML = ''; // Limpa o conteúdo

    // Pega os 3 comentários do grupo atual
    const groupComments = commentsArray.slice(index * 3, (index + 1) * 3);

    groupComments.forEach(comment => {
      const { authorDisplayName, textOriginal, authorProfileImageUrl } = comment.snippet.topLevelComment.snippet;

      const commentElement = `
        <div class="comentario-item">
          <div class="user">
            <img src="${authorProfileImageUrl}" alt="${authorDisplayName}'s profile image" class="user-img">
            <div class="info">
              <h3>${authorDisplayName}</h3>
              <div class="stars">
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star-half-alt"></i>
              </div>
            </div>
            <i class="fas fa-quote-right"></i>
          </div>
          <p>${textOriginal}</p>
        </div>
      `;
      comentariosContainer.innerHTML += commentElement;
    });
  }
}

// Carregar vídeos e comentários ao abrir a página
fetchVideosAndComments();
