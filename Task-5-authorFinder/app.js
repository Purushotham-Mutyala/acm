
const firebaseConfig = {
    apiKey: "AIzaSyBqRHrxYc6NJpzKLjPDxbY6VxiK9cRROQ0",
    authDomain: "authorfinder-aca05.firebaseapp.com",
    databaseURL: "https://authorfinder-aca05-default-rtdb.firebaseio.com",
    projectId: "authorfinder-aca05",
    storageBucket: "authorfinder-aca05.firebasestorage.app",
    messagingSenderId: "726772457893",
    appId: "1:726772457893:web:9dbd8a5557a638adc4084c",
    measurementId: "G-YHTWXL3MET"
  };


firebase.initializeApp(firebaseConfig);
const database = firebase.database();


const searchForm = document.getElementById('searchForm');
const authorInput = document.getElementById('authorInput');
const resultsDiv = document.getElementById('results');
const loadingDiv = document.getElementById('loading');


searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const authorName = authorInput.value.trim();
    
    if (authorName) {
        loadingDiv.classList.remove('hidden');
        resultsDiv.innerHTML = '';
        
        try {
            const firebaseResults = await searchFirebase(authorName);
            
            if (firebaseResults && firebaseResults.length > 0) {
                displayResults(firebaseResults, authorName, 'firebase');
            } else {
                const apiResults = await searchOpenLibrary(authorName);
                
                if (apiResults && apiResults.length > 0) {
                    displayResults(apiResults, authorName, 'open-library');
                    saveResultsToFirebase(apiResults);
                } else {
                    displayNoResults(authorName);
                }
            }
        } catch (error) {
            console.error('Search error:', error);
            resultsDiv.innerHTML = `
                <div class="error">
                    <p>An error occurred while searching. Please try again later.</p>
                </div>
            `;
        } finally {
            loadingDiv.classList.add('hidden');
        }
    }
});
function searchFirebase(author) {
    return new Promise((resolve) => {
        database.ref('books').orderByChild('author').equalTo(author).once('value')
            .then((snapshot) => {
                const books = [];
                snapshot.forEach((childSnapshot) => {
                    books.push(childSnapshot.val());
                });
                resolve(books);
            })
            .catch(() => resolve([])); 
    });
}
async function searchOpenLibrary(author) {
    try {
        const response = await fetch(`https://openlibrary.org/search.json?author=${encodeURIComponent(author)}&limit=20`);
        const data = await response.json();
        
        if (data.docs && data.docs.length > 0) {
            return data.docs.map(book => ({
                title: book.title,
                author: book.author_name ? book.author_name.join(', ') : 'Unknown Author',
                year: book.first_publish_year || 'Year unknown',
                cover: book.cover_i 
                    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` 
                    : null
            }));
        }
        return [];
    } catch (error) {
        console.error('Open Library API error:', error);
        return [];
    }
}
function saveResultsToFirebase(books) {
    const booksRef = database.ref('books');
    
    books.forEach(book => {
        booksRef.orderByChild('title').equalTo(book.title).once('value')
            .then(snapshot => {
                if (!snapshot.exists()) {
                    booksRef.push(book);
                }
            });
    });
}
function displayResults(books, author, source) {
    let html = `
        <h2>Books by ${author}</h2>
        <p class="source">Source: ${source === 'firebase' ? 'Our database' : 'Open Library'}</p>
        <ul class="book-list">
    `;
    
    books.forEach(book => {
        html += `
            <li class="book-item">
                ${book.cover ? `<img src="${book.cover}" alt="${book.title}" class="book-cover">` : ''}
                <div class="book-info">
                    <div class="book-title">${book.title}</div>
                    ${book.author ? `<div class="book-author">${book.author}</div>` : ''}
                    ${book.year ? `<div class="book-year">${book.year}</div>` : ''}
                </div>
            </li>
        `;
    });
    
    html += `</ul>`;
    resultsDiv.innerHTML = html;
}
function displayNoResults(author) {
    resultsDiv.innerHTML = `
        <div class="no-results">
            <p>No books found for author "${author}".</p>
            <p>Try a different spelling or search term.</p>
        </div>
    `;
}