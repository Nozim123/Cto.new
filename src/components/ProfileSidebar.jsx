import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { X, User, Settings, Globe, Moon, Sun, Bell, LogOut } from 'lucide-react';

export default function ProfileSidebar({ isOpen, onClose }) {
  const { darkMode, toggleDarkMode } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [userName, setUserName] = useState('Mehmon (Guest)');

  // Close when clicking outside or escape key (simplified for now: just overlay click)
  
  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-white dark:bg-slate-900 shadow-2xl z-[70] transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-display font-bold text-navy dark:text-white">
              {t('profile')}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <X className="w-6 h-6 text-slate-500" />
            </button>
          </div>

          <div className="flex items-center gap-4 mb-8 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {userName.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-lg dark:text-white">{userName}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">user@example.com</p>
            </div>
          </div>

          <div className="space-y-6 flex-1 overflow-y-auto">
            
            {/* Settings Section */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Settings className="w-4 h-4" /> {t('settings')}
              </h4>

              {/* Language */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl space-y-3">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Globe className="w-4 h-4" /> {t('language')}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['uz', 'ru', 'en'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                        language === lang
                          ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                          : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600'
                      }`}
                    >
                      {lang.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  {t('theme')}
                </label>
                <button
                  onClick={toggleDarkMode}
                  className={`w-14 h-7 rounded-full transition-colors relative focus:outline-none ${
                    darkMode ? 'bg-slate-700' : 'bg-cyan-500'
                  }`}
                >
                  <span className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                    darkMode ? 'translate-x-7' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Notifications */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl flex items-center justify-between opacity-50 cursor-not-allowed">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Bell className="w-4 h-4" /> Notifications
                </label>
                <div className="w-14 h-7 rounded-full bg-slate-200 dark:bg-slate-700 relative">
                  <span className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
            <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors">
              <LogOut className="w-5 h-5" />
              {t('logout')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
