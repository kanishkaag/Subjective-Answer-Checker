import React from 'react';
import { Moon, Sun, GraduationCap } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { Link } from 'react-router-dom';

export function Layout({ children }: { children: React.ReactNode }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className={`min-h-screen w-screen ${isDark ? 'dark bg-gray-900' : 'bg-gray-200'}`}>
      <nav className="fixed top-0 w-full bg-white dark:bg-gray-800 shadow-md z-50">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <GraduationCap className="h-7 w-7 sm:h-8 sm:w-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-yellow-600" />
              <h1 className="ml-2 text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-yellow-600 bg-clip-text text-transparent">
                GradeIt
              </h1>
            </Link>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-6 h-6 text-yellow-500" />
              ) : (
                <Moon className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </nav>
      <main className="pt-16 pb-8 w-full overflow-x-hidden">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}