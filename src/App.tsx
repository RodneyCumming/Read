import { useState } from 'react';
import { Library } from './components/Library';
import { Reader } from './components/Reader';
import { Statistics } from './components/Statistics';
import type { Book } from './types';

type View = 'library' | 'reader' | 'statistics';

function App() {
  const [currentView, setCurrentView] = useState<View>('library');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const handleOpenBook = (book: Book) => {
    setSelectedBook(book);
    setCurrentView('reader');
  };

  const handleCloseReader = () => {
    setCurrentView('library');
    setSelectedBook(null);
  };

  const handleOpenStats = () => {
    setCurrentView('statistics');
  };

  const handleCloseStats = () => {
    setCurrentView('library');
  };

  return (
    <>
      {currentView === 'library' && (
        <Library onOpenBook={handleOpenBook} onOpenStats={handleOpenStats} />
      )}
      {currentView === 'reader' && selectedBook && (
        <Reader book={selectedBook} onClose={handleCloseReader} />
      )}
      {currentView === 'statistics' && (
        <Statistics onClose={handleCloseStats} />
      )}
    </>
  );
}

export default App;
