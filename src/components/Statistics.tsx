import { useEffect, useState } from 'react';
import type { ReadingStats, ReadingSession, ReadingGoal } from '../types';
import { getStats, getAllSessions, getActiveGoal, saveGoal } from '../utils/storage';

interface StatisticsProps {
  onClose: () => void;
}

export const Statistics = ({ onClose }: StatisticsProps) => {
  const [stats, setStats] = useState<ReadingStats | null>(null);
  const [recentSessions, setRecentSessions] = useState<ReadingSession[]>([]);
  const [goal, setGoal] = useState<ReadingGoal | null>(null);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [goalPages, setGoalPages] = useState('10');
  const [goalType, setGoalType] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const loadData = async () => {
    const [loadedStats, sessions, activeGoal] = await Promise.all([
      getStats(),
      getAllSessions(),
      getActiveGoal()
    ]);
    setStats(loadedStats);
    setRecentSessions(sessions.slice(0, 10));
    setGoal(activeGoal);
  };

  useEffect(() => {
    loadData();
  }, []);

  const calculateGoalProgress = () => {
    if (!goal || recentSessions.length === 0) return 0;

    let startTime = goal.startDate;

    // Calculate the appropriate time window
    if (goal.type === 'daily') {
      startTime = new Date().setHours(0, 0, 0, 0);
    } else if (goal.type === 'weekly') {
      const today = new Date();
      const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
      startTime = firstDayOfWeek.setHours(0, 0, 0, 0);
    } else {
      const today = new Date();
      startTime = new Date(today.getFullYear(), today.getMonth(), 1).getTime();
    }

    const relevantSessions = recentSessions.filter(s => s.date >= startTime);
    const totalPages = relevantSessions.reduce((sum, s) => sum + s.pagesRead, 0);

    return Math.min(100, Math.round((totalPages / goal.targetPages) * 100));
  };

  const handleSetGoal = async () => {
    const newGoal: ReadingGoal = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: goalType,
      targetPages: parseInt(goalPages),
      startDate: Date.now(),
      active: true
    };

    await saveGoal(newGoal);
    setGoal(newGoal);
    setShowGoalForm(false);
    loadData();
  };

  if (!stats) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  const goalProgress = calculateGoalProgress();

  return (
    <div className="fixed inset-0 bg-white flex flex-col overflow-y-auto">
      {/* Header */}
      <header className="bg-white border-b px-4 py-3 flex items-center sticky top-0 z-10 shadow-sm">
        <button
          onClick={onClose}
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
        <h1 className="text-xl font-bold text-gray-900 ml-4">Reading Statistics</h1>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium opacity-90">Books Read</h3>
              <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <p className="text-4xl font-bold">{stats.totalBooksRead}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium opacity-90">Pages Read</h3>
              <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-4xl font-bold">{stats.totalPagesRead}</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium opacity-90">Current Streak</h3>
              <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              </svg>
            </div>
            <p className="text-4xl font-bold">{stats.currentStreak}</p>
            <p className="text-sm opacity-90 mt-1">days</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium opacity-90">Avg Pages/Day</h3>
              <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-4xl font-bold">{stats.averagePagesPerDay}</p>
          </div>
        </div>

        {/* Reading Goal */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Reading Goal</h2>
            <button
              onClick={() => setShowGoalForm(!showGoalForm)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              {goal ? 'Update Goal' : 'Set Goal'}
            </button>
          </div>

          {showGoalForm && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Goal Type
                  </label>
                  <select
                    value={goalType}
                    onChange={(e) => setGoalType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Pages
                  </label>
                  <input
                    type="number"
                    value={goalPages}
                    onChange={(e) => setGoalPages(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                  />
                </div>
              </div>
              <button
                onClick={handleSetGoal}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Save Goal
              </button>
            </div>
          )}

          {goal && (
            <div>
              <div className="flex items-baseline justify-between mb-2">
                <p className="text-gray-700">
                  <span className="font-semibold capitalize">{goal.type}</span> goal:{' '}
                  <span className="font-semibold">{goal.targetPages} pages</span>
                </p>
                <p className="text-sm text-gray-600">{goalProgress}% complete</p>
              </div>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
                  style={{ width: `${goalProgress}%` }}
                />
              </div>
            </div>
          )}

          {!goal && !showGoalForm && (
            <p className="text-gray-500 text-center py-4">
              Set a reading goal to track your progress
            </p>
          )}
        </div>

        {/* Recent Reading Sessions */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Reading Sessions</h2>
          {recentSessions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No reading sessions yet</p>
          ) : (
            <div className="space-y-3">
              {recentSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {session.pagesRead} pages
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(session.date).toLocaleDateString()} • {session.duration} min
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {session.duration} min
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Additional Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Total Reading Time</h3>
            <p className="text-3xl font-bold text-blue-600">
              {Math.floor(stats.totalTimeSpent / 60)} hrs {stats.totalTimeSpent % 60} min
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Longest Streak</h3>
            <p className="text-3xl font-bold text-green-600">{stats.longestStreak} days</p>
          </div>
        </div>
      </main>
    </div>
  );
};
