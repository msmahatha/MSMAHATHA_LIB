const API_GOOGLE = "https://www.googleapis.com/books/v1/volumes";
const API_GUTENDEX = "https://gutendex.com/books";

export const fetchFederatedBooks = async (query, page = 1) => {
  const startIndex = (page - 1) * 20;
  
  const promises = [
    // Google Books
    fetch(`${API_GOOGLE}?q=subject:${encodeURIComponent(query)}&filter=free-ebooks&startIndex=${startIndex}&maxResults=10`)
      .then(r => r.json())
      .catch(() => ({})),

    // Gutendex
    fetch(`${API_GUTENDEX}?topic=${encodeURIComponent(query)}&page=${page}`)
      .then(r => r.json())
      .catch(() => ({})),

    // Open Library
    fetch(`https://openlibrary.org/search.json?q=subject:${encodeURIComponent(query)}&page=${page}&limit=10&has_fulltext=true`)
      .then(r => r.json())
      .catch(() => ({}))
  ];

  const [googleData, gutendexData, openData] = await Promise.all(promises);
  
  let results = [];

  // Normalize Google Books
  if (googleData.items) {
    results = results.concat(googleData.items.map(item => ({
      id: item.id,
      source: 'GOOGLE',
      title: item.volumeInfo.title,
      author: item.volumeInfo.authors ? item.volumeInfo.authors[0] : 'Unknown',
      cover: item.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:'),
      raw: item
    })));
  }

  // Normalize Gutendex
  if (gutendexData.results) {
    results = results.concat(gutendexData.results.map(item => ({
      id: item.id,
      source: 'GUTENBERG',
      title: item.title,
      author: item.authors[0]?.name || 'Unknown',
      cover: item.formats['image/jpeg'],
      raw: item
    })));
  }

  // Normalize Open Library
  if (openData.docs) {
    results = results.concat(openData.docs.map(item => ({
      id: item.key,
      source: 'OPENLIB',
      title: item.title,
      author: item.author_name ? item.author_name[0] : 'Unknown',
      cover: item.cover_i ? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg` : null,
      raw: item
    })));
  }

  // Shuffle results
  results.sort(() => Math.random() - 0.5);

  // Filter out books without covers
  return results.filter(book => book.cover);
};

export const getBookContent = async (book) => {
  if (book.source === 'GOOGLE') {
    return {
      type: 'embed',
      url: `https://books.google.com/books?id=${book.id}&printsec=frontcover&output=embed`
    };
  }
  
  if (book.source === 'GUTENBERG') {
    const formats = book.raw.formats;
    const txtUrl = formats['text/plain'] || formats['text/plain; charset=utf-8'];
    
    if (txtUrl) {
      try {
        const proxy = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(txtUrl);
        const response = await fetch(proxy);
        const text = await response.text();
        const clean = text.replace(/\r\n/g, '<br>').replace(/\n/g, '<br>');
        return { type: 'text', content: clean };
      } catch (error) {
        throw new Error('PROXY FAILED');
      }
    } else {
      throw new Error('NO TEXT FORMAT AVAILABLE');
    }
  }
  
  if (book.source === 'OPENLIB') {
    const response = await fetch(`https://openlibrary.org${book.id}/editions.json?limit=10`);
    const data = await response.json();
    const readable = data.entries.find(e => e.ocaid || e.ia);
    
    if (readable) {
      const iaId = readable.ocaid || readable.ia;
      return {
        type: 'embed',
        url: `https://archive.org/embed/${iaId}&ui=embed`
      };
    } else {
      throw new Error('NO EMBED FOUND');
    }
  }
  
  throw new Error('UNKNOWN SOURCE');
};
