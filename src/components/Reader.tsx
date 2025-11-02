import { useEffect, useRef, useState } from 'react';
import ePub from 'epubjs';
import type { Book as EpubBook, Rendition } from 'epubjs';
import type { Book } from '../types';
import { updateBookProgress, saveSession } from '../utils/storage';

interface ReaderProps {
  book: Book;
  onClose: () => void;
}

export const Reader = ({ book, onClose }: ReaderProps) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const epubBookRef = useRef<EpubBook | null>(null);
  const renditionRef = useRef<Rendition | null>(null);
  const [progress, setProgress] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const sessionStartRef = useRef<number>(Date.now());
  const sessionPagesRef = useRef<number>(0);

  useEffect(() => {
    if (!viewerRef.current) return;

    const initBook = async () => {
      try {
        setLoading(true);
        setError(null);

        // Validate book file
        if (!book.file) {
          throw new Error('Book file is missing. Please try uploading the book again.');
        }

        console.log('Loading book:', book.title);
        console.log('Book file size:', book.file.byteLength, 'bytes');

        // Initialize epub book
        const epubBook = ePub(book.file);
        epubBookRef.current = epubBook;

        console.log('EPUB initialized');

        // Get actual dimensions of the container
        const container = viewerRef.current!;
        const width = container.offsetWidth || window.innerWidth;
        const height = container.offsetHeight || window.innerHeight - 150; // Account for header/footer

        console.log('Container dimensions:', { width, height });

        // Create rendition with explicit sizing
        const rendition = epubBook.renderTo(container, {
          width: width,
          height: height,
          spread: 'none',
          flow: 'paginated'
        });

        renditionRef.current = rendition;

      // Set font size for consistency
      rendition.themes.fontSize('18px');

      // Display book - go to saved location or start
      if (book.currentLocation) {
        await rendition.display(book.currentLocation);
      } else {
        await rendition.display();
      }

      // Track location changes
      rendition.on('relocated', (location: any) => {
        const cfi = location.start.cfi;

        // Calculate progress
        const percentage = epubBook.locations.percentageFromCfi(cfi);
        const progressPercent = Math.round(percentage * 100);
        setProgress(progressPercent);

        // Update current page
        if (typeof epubBook.locations?.length === 'function' && epubBook.locations.length() > 0) {
          const currentLoc = epubBook.locations.locationFromCfi(cfi);
          if (typeof currentLoc === 'number') {
            setCurrentPage(currentLoc);
          }
        }

        // Save progress
        updateBookProgress(book.id, cfi, progressPercent);
      });

      // Generate locations for pagination
      await epubBook.ready;
      const stored = localStorage.getItem(`locations-${book.id}`);

      if (stored) {
        epubBook.locations.load(stored);
        setTotalPages(epubBook.locations.length());
      } else {
        // Generate locations (this might take a moment)
        await epubBook.locations.generate(1600); // ~1600 chars per page
        setTotalPages(epubBook.locations.length());
        localStorage.setItem(`locations-${book.id}`, epubBook.locations.save());
      }

      // Keyboard navigation
      const handleKeyPress = (e: KeyboardEvent) => {
        if (e.key === 'ArrowRight') {
          rendition.next();
          sessionPagesRef.current++;
        } else if (e.key === 'ArrowLeft') {
          rendition.prev();
        }
      };

      document.addEventListener('keydown', handleKeyPress);

        // Handle window resize
        const handleResize = () => {
          if (renditionRef.current && viewerRef.current) {
            const container = viewerRef.current;
            const width = container.offsetWidth;
            const height = container.offsetHeight;
            renditionRef.current.resize(width, height);
          }
        };

        window.addEventListener('resize', handleResize);

        setLoading(false);
        console.log('Book loaded successfully');

      return () => {
        document.removeEventListener('keydown', handleKeyPress);
        window.removeEventListener('resize', handleResize);
      };
      } catch (err) {
        console.error('Error loading book:', err);
        setError(err instanceof Error ? err.message : 'Failed to load book. Please try again.');
        setLoading(false);
      }
    };

    initBook();

    // Cleanup
    return () => {
      if (renditionRef.current) {
        renditionRef.current.destroy();
      }
    };
  }, [book]);

  // Save reading session on unmount
  useEffect(() => {
    return () => {
      const duration = Math.floor((Date.now() - sessionStartRef.current) / 60000);
      if (sessionPagesRef.current > 0 && duration > 0) {
        saveSession({
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          bookId: book.id,
          date: Date.now(),
          pagesRead: sessionPagesRef.current,
          duration
        });
      }
    };
  }, [book.id]);

  const goToNextPage = () => {
    renditionRef.current?.next();
    sessionPagesRef.current++;
  };

  const goToPrevPage = () => {
    renditionRef.current?.prev();
  };

  const handleClose = () => {
    // Save session before closing
    const duration = Math.floor((Date.now() - sessionStartRef.current) / 60000);
    if (sessionPagesRef.current > 0 && duration > 0) {
      saveSession({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        bookId: book.id,
        date: Date.now(),
        pagesRead: sessionPagesRef.current,
        duration
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col">
      {/* Header */}
      <header className="bg-white border-b px-4 py-3 flex items-center justify-between shadow-sm">
        <button
          onClick={handleClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </button>

        <div className="flex-1 text-center">
          <h2 className="font-medium text-gray-900 truncate max-w-md mx-auto">
            {book.title}
          </h2>
          <p className="text-sm text-gray-600">{book.author}</p>
        </div>

        <div className="w-10"></div>
      </header>

      {/* Reader Content */}
      <div className="flex-1 relative overflow-hidden bg-gray-50">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading book...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-white p-8 z-10">
            <div className="text-center max-w-md">
              <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Error Loading Book</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go Back to Library
              </button>
            </div>
          </div>
        )}

        <div
          ref={viewerRef}
          className="w-full h-full bg-white"
          style={{
            minHeight: '100%',
            position: 'relative'
          }}
        />

        {/* Navigation Arrows */}
        {!loading && !error && (
          <>
            <button
              onClick={goToPrevPage}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all opacity-50 hover:opacity-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={goToNextPage}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all opacity-50 hover:opacity-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {totalPages > 0 && (
              <span>
                Page {currentPage} of {totalPages}
              </span>
            )}
          </div>

          {/* Progress Bar */}
          <div className="flex-1 mx-8">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="text-sm text-gray-600">{progress}%</div>
        </div>
      </footer>
    </div>
  );
};
