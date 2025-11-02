import localforage from 'localforage';
import type { Book, ReadingSession, ReadingGoal, ReadingStats } from '../types';

// Initialize stores
const booksStore = localforage.createInstance({
  name: 'epub-reader',
  storeName: 'books'
});

const sessionsStore = localforage.createInstance({
  name: 'epub-reader',
  storeName: 'sessions'
});

const goalsStore = localforage.createInstance({
  name: 'epub-reader',
  storeName: 'goals'
});

const statsStore = localforage.createInstance({
  name: 'epub-reader',
  storeName: 'stats'
});

// Books operations
export const saveBook = async (book: Book): Promise<void> => {
  await booksStore.setItem(book.id, book);
};

export const getBook = async (id: string): Promise<Book | null> => {
  return await booksStore.getItem(id);
};

export const getAllBooks = async (): Promise<Book[]> => {
  const books: Book[] = [];
  await booksStore.iterate((value: Book) => {
    books.push(value);
  });
  return books.sort((a, b) => (b.lastReadDate || b.addedDate) - (a.lastReadDate || a.addedDate));
};

export const deleteBook = async (id: string): Promise<void> => {
  await booksStore.removeItem(id);
  // Also delete associated sessions
  const sessions = await getAllSessions();
  for (const session of sessions.filter(s => s.bookId === id)) {
    await deleteSession(session.id);
  }
};

export const updateBookProgress = async (
  id: string,
  location: string,
  progress: number
): Promise<void> => {
  const book = await getBook(id);
  if (book) {
    book.currentLocation = location;
    book.progress = progress;
    book.lastReadDate = Date.now();
    await saveBook(book);
  }
};

// Reading sessions operations
export const saveSession = async (session: ReadingSession): Promise<void> => {
  await sessionsStore.setItem(session.id, session);
  await updateStats();
};

export const getAllSessions = async (): Promise<ReadingSession[]> => {
  const sessions: ReadingSession[] = [];
  await sessionsStore.iterate((value: ReadingSession) => {
    sessions.push(value);
  });
  return sessions.sort((a, b) => b.date - a.date);
};

export const getSessionsByBookId = async (bookId: string): Promise<ReadingSession[]> => {
  const allSessions = await getAllSessions();
  return allSessions.filter(s => s.bookId === bookId);
};

export const deleteSession = async (id: string): Promise<void> => {
  await sessionsStore.removeItem(id);
  await updateStats();
};

// Reading goals operations
export const saveGoal = async (goal: ReadingGoal): Promise<void> => {
  await goalsStore.setItem(goal.id, goal);
};

export const getAllGoals = async (): Promise<ReadingGoal[]> => {
  const goals: ReadingGoal[] = [];
  await goalsStore.iterate((value: ReadingGoal) => {
    goals.push(value);
  });
  return goals;
};

export const getActiveGoal = async (): Promise<ReadingGoal | null> => {
  const goals = await getAllGoals();
  return goals.find(g => g.active) || null;
};

export const deleteGoal = async (id: string): Promise<void> => {
  await goalsStore.removeItem(id);
};

// Stats operations
export const getStats = async (): Promise<ReadingStats> => {
  const stats = await statsStore.getItem<ReadingStats>('stats');
  if (!stats) {
    const defaultStats: ReadingStats = {
      totalBooksRead: 0,
      totalPagesRead: 0,
      totalTimeSpent: 0,
      currentStreak: 0,
      longestStreak: 0,
      averagePagesPerDay: 0
    };
    await statsStore.setItem('stats', defaultStats);
    return defaultStats;
  }
  return stats;
};

export const updateStats = async (): Promise<void> => {
  const sessions = await getAllSessions();
  const books = await getAllBooks();

  // Calculate total pages and time
  const totalPagesRead = sessions.reduce((sum, s) => sum + s.pagesRead, 0);
  const totalTimeSpent = sessions.reduce((sum, s) => sum + s.duration, 0);

  // Calculate streaks
  const { currentStreak, longestStreak } = calculateStreaks(sessions);

  // Calculate average pages per day
  const daysSinceStart = calculateDaysSinceFirstSession(sessions);
  const averagePagesPerDay = daysSinceStart > 0 ? totalPagesRead / daysSinceStart : 0;

  // Count completed books (progress >= 95%)
  const totalBooksRead = books.filter(b => b.progress >= 95).length;

  const stats: ReadingStats = {
    totalBooksRead,
    totalPagesRead,
    totalTimeSpent,
    currentStreak,
    longestStreak,
    averagePagesPerDay: Math.round(averagePagesPerDay * 10) / 10
  };

  await statsStore.setItem('stats', stats);
};

// Helper functions
const calculateStreaks = (sessions: ReadingSession[]): { currentStreak: number; longestStreak: number } => {
  if (sessions.length === 0) return { currentStreak: 0, longestStreak: 0 };

  // Get unique reading days (YYYY-MM-DD format)
  const readingDays = new Set(
    sessions.map(s => new Date(s.date).toISOString().split('T')[0])
  );

  const sortedDays = Array.from(readingDays).sort();

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 1;

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  // Calculate current streak
  if (sortedDays.includes(today) || sortedDays.includes(yesterday)) {
    currentStreak = 1;
    for (let i = sortedDays.length - 2; i >= 0; i--) {
      const currentDay = new Date(sortedDays[i + 1]);
      const prevDay = new Date(sortedDays[i]);
      const diffDays = Math.floor((currentDay.getTime() - prevDay.getTime()) / 86400000);

      if (diffDays === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  // Calculate longest streak
  for (let i = 1; i < sortedDays.length; i++) {
    const currentDay = new Date(sortedDays[i]);
    const prevDay = new Date(sortedDays[i - 1]);
    const diffDays = Math.floor((currentDay.getTime() - prevDay.getTime()) / 86400000);

    if (diffDays === 1) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }

  longestStreak = Math.max(longestStreak, tempStreak, currentStreak);

  return { currentStreak, longestStreak };
};

const calculateDaysSinceFirstSession = (sessions: ReadingSession[]): number => {
  if (sessions.length === 0) return 0;

  const oldestSession = sessions.reduce((oldest, s) =>
    s.date < oldest.date ? s : oldest
  );

  const daysDiff = Math.floor((Date.now() - oldestSession.date) / 86400000);
  return Math.max(daysDiff, 1);
};
