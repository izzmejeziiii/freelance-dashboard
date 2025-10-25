'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon, Monitor } from 'lucide-react';

export default function ThemeSettings() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { id: 'light', name: 'Light', icon: Sun, description: 'Clean and bright interface' },
    { id: 'dark', name: 'Dark', icon: Moon, description: 'Easy on the eyes in low light' },
  ];

  return (
    <div className="bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-700 p-6">
      <h3 className="text-lg font-semibold text-stone-900 dark:text-white mb-6">Theme Settings</h3>
      
      <div className="space-y-4">
        {themes.map((themeOption) => {
          const Icon = themeOption.icon;
          const isSelected = theme === themeOption.id;
          
          return (
            <button
              key={themeOption.id}
              onClick={() => setTheme(themeOption.id as 'light' | 'dark')}
              className={`w-full p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-stone-900 dark:border-white bg-stone-50 dark:bg-stone-800'
                  : 'border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg ${
                  isSelected 
                    ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900' 
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-stone-900 dark:text-white">
                    {themeOption.name}
                  </div>
                  <div className="text-sm text-stone-600 dark:text-stone-400">
                    {themeOption.description}
                  </div>
                </div>
                {isSelected && (
                  <div className="w-2 h-2 bg-stone-900 dark:bg-white rounded-full"></div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-stone-50 dark:bg-stone-800 rounded-lg">
        <div className="flex items-start space-x-3">
          <Monitor className="w-5 h-5 text-stone-600 dark:text-stone-400 mt-0.5" />
          <div>
            <h4 className="font-medium text-stone-900 dark:text-white text-sm">System Preference</h4>
            <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
              Your theme preference will be saved and applied across all your devices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
