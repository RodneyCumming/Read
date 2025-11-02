# EPUB Reader - Your Digital Library

A modern, feature-rich EPUB reader web application built with React, TypeScript, and epub.js. Read your favorite books, track your reading progress, and build healthy reading habits.

## Features

### 📚 Library Management
- **Drag & Drop Upload**: Simply drag and drop EPUB files to add them to your library
- **Beautiful Book Grid**: View all your books with cover images in an organized grid
- **Progress Tracking**: See at a glance how much of each book you've read
- **Easy Organization**: Books are automatically sorted by recently read

### 📖 Reading Experience
- **Paginated Reading**: Consistent page sizes across all books for a uniform reading experience
- **Progress Persistence**: Your reading location is automatically saved
- **Keyboard Navigation**: Use arrow keys to navigate (→ next page, ← previous page)
- **Clean Interface**: Distraction-free reading with intuitive controls
- **Visual Progress**: Progress bar shows exactly how far you've read

### 📊 Reading Statistics & Habits
- **Comprehensive Stats Dashboard**:
  - Total books read
  - Total pages read
  - Current reading streak
  - Average pages per day
  - Total reading time
  - Longest streak

- **Reading Goals**: Set daily, weekly, or monthly reading goals and track your progress

- **Session Tracking**: Automatic logging of:
  - Pages read per session
  - Reading duration
  - Session history

- **Streak Tracking**: Build and maintain reading streaks to develop consistent habits

## Technology Stack

- **React 19** - Modern UI framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **epub.js** - EPUB parsing and rendering
- **Tailwind CSS** - Utility-first styling
- **LocalForage** - Client-side storage for books and data
- **react-dropzone** - Drag and drop file upload

## Getting Started

### Prerequisites
- Node.js 16 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Read
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/RodneyCumming/Read)

The easiest way to deploy:

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Click Deploy

See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed instructions.

## Usage

### Adding Books
1. From the library view, drag and drop EPUB files onto the upload area
2. Or click the upload area to browse and select files
3. Books will be automatically processed and added to your library

### Reading Books
1. Click on any book cover in the library to open it
2. Use the on-screen arrows or keyboard arrow keys to navigate pages
3. Your progress is automatically saved
4. Click the back arrow to return to the library

### Tracking Reading Habits
1. Click the "Reading Stats" button in the library header
2. View your comprehensive reading statistics
3. Set reading goals (daily, weekly, or monthly)
4. Track your progress toward goals
5. View recent reading sessions

## Data Storage

All data is stored locally in your browser using IndexedDB via LocalForage:
- EPUB book files
- Reading progress and locations
- Reading sessions and statistics
- Reading goals

Your data never leaves your device and is private to you.

## Features in Detail

### Consistent Pagination
The app uses epub.js locations to provide consistent pagination across books. Each "page" represents approximately 1600 characters, ensuring a uniform reading experience regardless of the book's original formatting.

### Progress Tracking
- Real-time progress calculation as you read
- Visual progress indicators on book covers
- Percentage completion displayed in the reader
- Automatic saving of your current location

### Reading Sessions
Every time you read, the app tracks:
- How many pages you read
- How long you spent reading
- When the session occurred

This data is used to calculate streaks, averages, and other statistics.

### Streaks
The app tracks consecutive days of reading:
- **Current Streak**: How many days in a row you've read (including today)
- **Longest Streak**: Your personal best streak
- Streaks help motivate consistent reading habits

## Browser Compatibility

Works in all modern browsers that support:
- ES6+
- IndexedDB
- Web Workers (used by epub.js)

Recommended browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
