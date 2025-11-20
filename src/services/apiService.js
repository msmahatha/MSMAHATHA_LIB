const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  async handleResponse(response) {
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  }

  // Auth endpoints
  async register(username, email, password, confirmPassword) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ username, email, password, confirmPassword }),
    });

    const data = await this.handleResponse(response);
    this.setToken(data.token);
    return data;
  }

  async login(username, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ username, password }),
    });

    const data = await this.handleResponse(response);
    this.setToken(data.token);
    return data;
  }

  async getCurrentUser() {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: this.getHeaders(),
    });

    return await this.handleResponse(response);
  }

  logout() {
    this.setToken(null);
    localStorage.removeItem('user');
  }

  // User data endpoints
  async addToStash(book) {
    const response = await fetch(`${API_URL}/user/stash`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        bookId: book.id,
        title: book.volumeInfo?.title || 'Unknown',
        authors: book.volumeInfo?.authors || [],
        thumbnail: book.volumeInfo?.imageLinks?.thumbnail || '',
      }),
    });

    return await this.handleResponse(response);
  }

  async removeFromStash(bookId) {
    const response = await fetch(`${API_URL}/user/stash/${bookId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    return await this.handleResponse(response);
  }

  async addToHistory(book) {
    const response = await fetch(`${API_URL}/user/history`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        bookId: book.id,
        title: book.volumeInfo?.title || 'Unknown',
        authors: book.volumeInfo?.authors || [],
        thumbnail: book.volumeInfo?.imageLinks?.thumbnail || '',
      }),
    });

    return await this.handleResponse(response);
  }

  async removeFromHistory(bookId) {
    const response = await fetch(`${API_URL}/user/history/${bookId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    return await this.handleResponse(response);
  }

  async updateSettings(settings) {
    const response = await fetch(`${API_URL}/user/settings`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(settings),
    });

    return await this.handleResponse(response);
  }
}

const apiService = new ApiService();
export default apiService;
