
const API_KEY = 'mBHEw05UwJhi1L5Ugw5mWRqOA8grk3ByTELdZ04v'; 
const APOD_URL = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;


const mediaContainer = document.getElementById('media-container');
const titleElement = document.getElementById('apod-title');
const dateElement = document.getElementById('apod-date');
const explanationElement = document.getElementById('apod-explanation');
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error-message');

async function fetchAPOD() {
    try {
        loadingElement.style.display = 'block';
        errorElement.style.display = 'none';
        
        const response = await fetch(APOD_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        
        titleElement.textContent = data.title;
        dateElement.textContent = new Date(data.date).toLocaleDateString();
        explanationElement.textContent = data.explanation;
        
        
        mediaContainer.innerHTML = '';
        if (data.media_type === 'image') {
            const img = document.createElement('img');
            img.src = data.url;
            img.alt = data.title;
            mediaContainer.appendChild(img);
        } else if (data.media_type === 'video') {
            const iframe = document.createElement('iframe');
            iframe.src = data.url;
            iframe.allowFullscreen = true;
            mediaContainer.appendChild(iframe);
        }
        
        loadingElement.style.display = 'none';
    } catch (error) {
        console.error('Error fetching APOD:', error);
        loadingElement.style.display = 'none';
        errorElement.style.display = 'block';
        errorElement.textContent = `Failed to load today's APOD. Please try again later. Error: ${error.message}`;
    }
}


window.addEventListener('load', fetchAPOD);
