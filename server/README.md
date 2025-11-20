# MSMAHATHA_LIB Backend Server

Express.js + MongoDB backend for the MSMAHATHA_LIB digital library application.

## 🛠️ Tech Stack

- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: Database with Mongoose ODM
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: API protection

## 📁 Project Structure

```
server/
├── config/
│   └── database.js          # MongoDB connection
├── middleware/
│   └── auth.js              # JWT authentication
├── models/
│   └── User.js              # User schema
├── routes/
│   ├── auth.js              # Authentication endpoints
│   └── user.js              # User data endpoints
├── .env.example             # Environment template
├── .gitignore
├── package.json
└── server.js                # Main server file
```

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment

Create `.env` file from the example:

```bash
cp .env.example .env
```

Edit `.env` and update the values:

```env
# Replace <password> with your actual MongoDB password
MONGODB_URI=mongodb+srv://madhusudanmahatha:<password>@cluster0.vkccwze.mongodb.net/msmahatha_lib?retryWrites=true&w=majority

# Generate a secure random string for production
JWT_SECRET=your_secure_random_jwt_secret_key

# Server configuration
PORT=5000
NODE_ENV=development

# Frontend URL (update for production)
CORS_ORIGIN=http://localhost:5173
```

**Important**: Never commit `.env` file to version control!

### 3. Start Server

Development mode with auto-reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server will run on `http://localhost:5000`

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)

#### Register New User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful!",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "testuser",
    "email": "test@example.com",
    "stash": [],
    "history": [],
    "settings": {
      "soundEnabled": true,
      "crtEffect": false
    }
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <jwt_token>
```

### User Data Routes (`/api/user`)

All user routes require authentication header:
```http
Authorization: Bearer <jwt_token>
```

#### Add Book to Stash
```http
POST /api/user/stash
Content-Type: application/json

{
  "bookId": "book_id",
  "title": "Book Title",
  "authors": ["Author Name"],
  "thumbnail": "image_url"
}
```

#### Remove from Stash
```http
DELETE /api/user/stash/:bookId
```

#### Add to History
```http
POST /api/user/history
Content-Type: application/json

{
  "bookId": "book_id",
  "title": "Book Title",
  "authors": ["Author Name"],
  "thumbnail": "image_url"
}
```

#### Remove from History
```http
DELETE /api/user/history/:bookId
```

#### Update Settings
```http
PUT /api/user/settings
Content-Type: application/json

{
  "soundEnabled": false,
  "crtEffect": true
}
```

### Health Check
```http
GET /api/health
```

## 🔐 Security Features

1. **Password Hashing**: bcryptjs with salt rounds
2. **JWT Authentication**: 7-day token expiration
3. **Helmet**: Sets secure HTTP headers
4. **CORS**: Configured for frontend origin
5. **Rate Limiting**: 100 requests per 15 minutes per IP
6. **Input Validation**: Email and password requirements
7. **Error Handling**: Sanitized error messages

## 🗄️ Database Schema

### User Model

```javascript
{
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  stash: [{
    bookId: String,
    title: String,
    authors: [String],
    thumbnail: String,
    addedAt: Date
  }],
  history: [{
    bookId: String,
    title: String,
    authors: [String],
    thumbnail: String,
    viewedAt: Date
  }],
  settings: {
    soundEnabled: Boolean,
    crtEffect: Boolean
  },
  createdAt: Date,
  timestamps: true
}
```

## 🧪 Testing the API

### Using curl

```bash
# Health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

### Using Postman

1. Import the endpoints
2. Set `Authorization` header: `Bearer <your_jwt_token>`
3. Test each endpoint

## 🚨 Error Handling

All endpoints return consistent error format:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (invalid/missing token)
- `404`: Not Found
- `500`: Internal Server Error

## 🔄 MongoDB Connection String

Replace `<password>` in the connection string with your actual MongoDB password:

```
mongodb+srv://madhusudanmahatha:<msmaahtha>@cluster0.vkccwze.mongodb.net/msmahatha_lib?retryWrites=true&w=majority
```

## 📦 Dependencies

```json
{
  "express": "^4.18.2",
  "mongoose": "^8.0.3",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.2",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "express-rate-limit": "^7.1.5",
  "helmet": "^7.1.0",
  "validator": "^13.11.0"
}
```

## 🐛 Troubleshooting

### MongoDB Connection Error
- Verify MongoDB password is correct
- Check IP whitelist in MongoDB Atlas
- Ensure network access is configured

### CORS Errors
- Update `CORS_ORIGIN` in `.env` to match frontend URL
- Check browser console for specific CORS issues

### JWT Token Errors
- Ensure token is included in `Authorization` header
- Check token hasn't expired (7-day validity)
- Verify `JWT_SECRET` matches between sessions

## 🚀 Deployment

### Environment Variables for Production

```env
MONGODB_URI=<production_mongodb_uri>
JWT_SECRET=<secure_random_string>
PORT=5000
NODE_ENV=production
CORS_ORIGIN=<production_frontend_url>
```

### Recommended Platforms

- **Render**: Easy Node.js deployment
- **Railway**: PostgreSQL/MongoDB support
- **Heroku**: Classic PaaS option
- **DigitalOcean App Platform**: Scalable infrastructure

## 📝 License

MIT License - Same as parent project

## 👨‍💻 Author

**Madhusudan Mahatha**
- GitHub: [@msmahatha](https://github.com/msmahatha)
