import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, 
  LayoutDashboard, 
  BookOpen, 
  CheckSquare, 
  Video, 
  User, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  RefreshCw
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleCollapse, isCollapsed, setIsOpen }) => {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(user?.role === 'teacher' ? '/teacher/auth' : '/auth');
  };

  const toggleRole = () => {
    const newRole = user?.role === 'teacher' ? 'student' : 'teacher';
    updateProfile({ role: newRole });
    navigate('/');
    if (setIsOpen) setIsOpen(false); // Close mobile menu if open
  };

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Courses', path: '/courses', icon: BookOpen },
    { name: 'Quizzes', path: '/quizzes', icon: CheckSquare },
    { name: 'Live Classes', path: '/live', icon: Video },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const isTeacher = user?.role === 'teacher';
  
  // Theme styling based on role
  const activeClass = isTeacher 
    ? 'bg-teal-50 text-teal-600 border-r-4 border-teal-600 font-semibold' 
    : 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600 font-semibold';
  
  const hoverClass = isTeacher 
    ? 'hover:bg-teal-50/50 hover:text-teal-600' 
    : 'hover:bg-indigo-50/50 hover:text-indigo-600';

  const brandColor = isTeacher ? 'text-teal-600' : 'text-indigo-600';
  const brandGradient = isTeacher ? 'bg-gradient-teacher' : 'bg-gradient-stitch';

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-100 bg-white transition-all duration-300 ease-in-out md:static
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${isCollapsed ? 'w-20' : 'w-64'}
        `}
      >
        {/* Header/Brand logo */}
        <div className="relative flex h-16 items-center justify-between px-6 border-b border-slate-100">
          <Link to="/" className="flex items-center gap-2.5" onClick={() => setIsOpen && setIsOpen(false)}>
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-premium ${brandGradient}`}>
              <GraduationCap className="h-5 w-5" />
            </div>
            {!isCollapsed && (
              <span className="font-display text-xl font-bold tracking-tight text-slate-800">
                Blearn<span className={brandColor}>.</span>
              </span>
            )}
          </Link>

          {/* Desktop Collapse Button */}
          <button
            onClick={toggleCollapse}
            className="hidden absolute top-1/2 -right-3 h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-slate-100 bg-white text-slate-400 hover:text-slate-600 hover:shadow-premium-sm md:flex"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 space-y-1 py-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen && setIsOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-3.5 px-6 py-3.5 text-sm font-medium text-slate-500 transition-all ${hoverClass}
                  ${isActive ? activeClass : ''}
                  ${isCollapsed ? 'justify-center px-0' : ''}
                `}
                title={isCollapsed ? item.name : ''}
              >
                <Icon className={`h-5 w-5 ${isCollapsed ? '' : 'shrink-0'}`} />
                {!isCollapsed && <span>{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="border-t border-slate-100 p-4 space-y-2">
          {/* Quick Role Toggle */}
          {!isCollapsed && (
            <button
              onClick={toggleRole}
              className={`flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-2.5 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors`}
            >
              <RefreshCw className="h-3.5 w-3.5 text-slate-400 animate-pulse-slow" />
              Switch to {isTeacher ? 'Student View' : 'Teacher View'}
            </button>
          )}

          {/* Log Out */}
          <button
            onClick={handleLogout}
            className={`flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors
              ${isCollapsed ? 'justify-center px-0' : ''}
            `}
            title={isCollapsed ? 'Sign Out' : ''}
          >
            <LogOut className="h-5 w-5 text-slate-400 hover:text-rose-500 shrink-0" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
