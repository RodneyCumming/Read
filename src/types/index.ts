export interface Book {
  id: string;
  title: string;
  author: string;
  cover?: string;
  file: ArrayBuffer;
  addedDate: number;
  lastReadDate?: number;
  currentLocation?: string;
  progress: number; // 0-100
  totalPages?: number;
}

export interface ReadingSession {
  id: string;
  bookId: string;
  date: number; // timestamp
  pagesRead: number;
  duration: number; // in minutes
}

export interface ReadingGoal {
  id: string;
  type: 'daily' | 'weekly' | 'monthly';
  targetPages: number;
  startDate: number;
  active: boolean;
}

export interface ReadingStats {
  totalBooksRead: number;
  totalPagesRead: number;
  totalTimeSpent: number; // in minutes
  currentStreak: number; // consecutive days
  longestStreak: number;
  averagePagesPerDay: number;
}
