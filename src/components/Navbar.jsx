import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, User, LogOut, BookOpen, Settings } from 'lucide-react';

const Navbar = ({ toggleSidebar, sidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate(user?.role === 'teacher' ? '/teacher/auth' : '/auth');
  };

  const isTeacher = user?.role === 'teacher';
  const accentColor = isTeacher ? 'text-teal-600' : 'text-indigo-600';
  const badgeBg = isTeacher ? 'bg-teal-50 text-teal-700 border-teal-200' : 'bg-indigo-50 text-indigo-700 border-indigo-200';

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-100 bg-white/80 px-6 backdrop-blur-md">
      {/* Left: Sidebar Toggle and Brand info */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-50 hover:text-slate-700 md:hidden"
          aria-label="Toggle Sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        
        <div className="hidden md:flex items-center gap-2">
          <span className={`text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${badgeBg}`}>
            {isTeacher ? 'Teacher Portal' : 'Student Space'}
          </span>
        </div>
      </div>

      {/* Middle: Search bar */}
      <div className="hidden max-w-md flex-1 px-4 sm:block">
        <div className="relative w-full max-w-xs">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search courses, lessons..."
            className="w-full rounded-full border border-slate-200 bg-slate-50/50 py-1.5 pr-4 pl-9 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>

      {/* Right: Actions and Profile dropdown */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative rounded-full p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors">
          <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white"></span>
          <Bell className="h-5 w-5" />
        </button>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-full p-1 text-slate-700 hover:bg-slate-50 transition-all outline-none"
          >
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256"}
              alt={user?.name || "User Avatar"}
              className={`h-8 w-8 rounded-full object-cover ring-2 ring-offset-2 ${isTeacher ? 'ring-teal-500' : 'ring-indigo-500'}`}
            />
            <span className="hidden text-sm font-medium text-slate-700 md:block max-w-[120px] truncate">
              {user?.name || 'Guest User'}
            </span>
          </button>

          {/* Profile Dropdown */}
          {dropdownOpen && (
            <>
              {/* Overlay to click off */}
              <div className="fixed inset-0 z-30" onClick={() => setDropdownOpen(false)}></div>
              
              <div className="absolute right-0 mt-2.5 w-56 origin-top-right rounded-2xl border border-slate-100 bg-white p-2 shadow-premium-lg ring-1 ring-black/5 focus:outline-none z-40 transition-all">
                <div className="px-3 py-2">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Signed in as</p>
                  <p className="truncate text-sm font-semibold text-slate-800">{user?.name}</p>
                  <p className="truncate text-xs text-slate-500">{user?.email}</p>
                </div>
                
                <div className="my-1 border-t border-slate-50"></div>
                
                <Link
                  to="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  <User className="h-4 w-4 text-slate-400" />
                  My Profile
                </Link>

                <Link
                  to="/"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  <BookOpen className="h-4 w-4 text-slate-400" />
                  Dashboard
                </Link>

                <div className="my-1 border-t border-slate-50"></div>
                
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    handleLogout();
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                >
                  <LogOut className="h-4 w-4 text-rose-500" />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
