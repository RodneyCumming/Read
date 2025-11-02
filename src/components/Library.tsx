import { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import ePub from 'epubjs';
import type { Book } from '../types';
import { saveBook, getAllBooks, deleteBook } from '../utils/storage';

interface LibraryProps {
  onOpenBook: (book: Book) => void;
  onOpenStats: () => void;
}

export const Library = ({ onOpenBook, onOpenStats }: LibraryProps) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);

  const loadBooks = async () => {
    const loadedBooks = await getAllBooks();
    setBooks(loadedBooks);
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setLoading(true);
    for (const file of acceptedFiles) {
      if (file.type === 'application/epub+zip' || file.name.endsWith('.epub')) {
        try {
          const arrayBuffer = await file.arrayBuffer();
          const epubBook = ePub(arrayBuffer);

          // Load metadata
          await epubBook.ready;
          const metadata = await epubBook.loaded.metadata;
          const cover = await epubBook.coverUrl();

          const book: Book = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            title: metadata.title || file.name,
            author: metadata.creator || 'Unknown Author',
            cover: cover || undefined,
            file: arrayBuffer,
            addedDate: Date.now(),
            progress: 0
          };

          await saveBook(book);
        } catch (error) {
          console.error('Error loading book:', error);
          alert(`Error loading ${file.name}`);
        }
      }
    }
    setLoading(false);
    loadBooks();
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/epub+zip': ['.epub']
    }
  });

  const handleDelete = async (e: React.MouseEvent, bookId: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this book?')) {
      await deleteBook(bookId);
      loadBooks();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">My Library</h1>
          <button
            onClick={onOpenStats}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Reading Stats
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Area */}
        <div
          {...getRootProps()}
          className={`mb-8 border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
            isDragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 bg-white hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-4">
            <svg
              className="w-16 h-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            {loading ? (
              <p className="text-lg text-gray-600">Processing books...</p>
            ) : isDragActive ? (
              <p className="text-lg text-blue-600">Drop your EPUB files here...</p>
            ) : (
              <>
                <p className="text-lg text-gray-600">
                  Drag and drop EPUB files here, or click to browse
                </p>
                <p className="text-sm text-gray-500">Support for .epub files</p>
              </>
            )}
          </div>
        </div>

        {/* Books Grid */}
        {books.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto w-24 h-24 text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <h3 className="text-xl font-medium text-gray-600 mb-2">No books yet</h3>
            <p className="text-gray-500">Add your first EPUB book to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {books.map((book) => (
              <div
                key={book.id}
                onClick={() => onOpenBook(book)}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[2/3] bg-white rounded-lg shadow-md overflow-hidden mb-3 transition-transform group-hover:scale-105">
                  {book.cover ? (
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                      <svg
                        className="w-16 h-16 text-white opacity-50"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                    </div>
                  )}

                  {/* Progress bar */}
                  {book.progress > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                      <div
                        className="h-full bg-blue-600"
                        style={{ width: `${book.progress}%` }}
                      />
                    </div>
                  )}

                  {/* Delete button */}
                  <button
                    onClick={(e) => handleDelete(e, book.id)}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <h3 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1">
                  {book.title}
                </h3>
                <p className="text-xs text-gray-600 line-clamp-1">{book.author}</p>
                {book.progress > 0 && (
                  <p className="text-xs text-blue-600 mt-1">{Math.round(book.progress)}% complete</p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
