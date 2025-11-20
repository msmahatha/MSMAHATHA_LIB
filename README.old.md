# MSMAHATHA Library - Universal Archive

A modern React application for browsing and reading books from multiple federated sources (Google Books, Gutendex, Open Library).

## 🚀 Project Structure

```
MSMAHATHA_LIB/
├── src/
│   ├── components/           # React components
│   │   ├── modals/          # Modal components
│   │   │   ├── ReaderModal.jsx
│   │   │   ├── AuthModal.jsx
│   │   │   └── SettingsModal.jsx
│   │   ├── BookCard.jsx     # Individual book card
│   │   ├── BookGrid.jsx     # Book grid layout
│   │   ├── Footer.jsx       # Footer with marquee
│   │   ├── GateLayer.jsx    # Entry gate animation
│   │   ├── MainLayout.jsx   # Main app layout
│   │   ├── Navbar.jsx       # Navigation bar
│   │   └── Terminal.jsx     # Terminal interface
│   ├── context/
│   │   └── AppContext.jsx   # Global app state
│   ├── hooks/
│   │   └── useSoundEffects.js  # Sound effects hook
│   ├── services/
│   │   └── bookService.js   # API calls for books
│   ├── constants/
│   │   └── categories.js    # Book categories
│   ├── App.jsx              # Main App component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── index.html               # HTML template
├── package.json             # Dependencies
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS config
└── postcss.config.js        # PostCSS config

```

## 🛠️ Technologies Used

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Context API** - State management
- **LocalStorage** - Persistent data storage

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## ✨ Features

- **Federated Search**: Search across multiple book sources
- **User Authentication**: Simple username-based login
- **Stash System**: Save favorite books
- **Reading History**: Track recently viewed books
- **Book Reader**: Integrated book reading experience
- **Terminal Interface**: AI assistant for advanced features
- **Sound Effects**: Interactive audio feedback
- **CRT Effect**: Retro display styling
- **Responsive Design**: Mobile and desktop support

## 🎨 Component Architecture

### Context & State Management
- `AppContext` provides global state for user, stash, history, and settings
- Persistent storage using localStorage
- Centralized state updates

### Main Components
- **GateLayer**: Animated entry screen
- **MainLayout**: Main application shell
- **Navbar**: Navigation with categories and user status
- **BookGrid**: Displays books in grid layout with infinite scroll
- **BookCard**: Individual book display card
- **ReaderModal**: Book reading interface
- **Terminal**: AI assistant interface

### Hooks
- `useSoundEffects`: Provides audio feedback system
- `useApp`: Access to global app context

### Services
- `bookService`: Handles API calls to Google Books, Gutendex, and Open Library
- Normalizes data from different sources

## 🎯 Key Features Implementation

### Federated Book Search
The app searches three APIs simultaneously:
1. Google Books API
2. Gutendex (Project Gutenberg)
3. Open Library

Results are normalized and shuffled for diverse content.

### Book Reader
Supports multiple formats:
- Google Books embed
- Plain text (Gutendex)
- Internet Archive embed (Open Library)

### State Persistence
- User credentials
- Saved books (stash)
- Reading history
- Settings preferences

## 🚀 Getting Started

1. Clone the repository
2. Run `npm install`
3. Run `npm run dev`
4. Open http://localhost:3000

## 📱 Browser Support

- Modern browsers with ES6+ support
- Chrome, Firefox, Safari, Edge

## 🔧 Configuration

Customize colors and theme in `tailwind.config.js`:
- Neo-themed color palette
- Custom shadows and borders
- Typography settings

## 📝 License

This project is for educational purposes.
