import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

export const AuthLayout = ({ role, children }) => {
  const isTeacher = role === 'teacher';
  
  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Panel - Branding */}
      <div className={`hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center ${isTeacher ? 'bg-gradient-to-br from-teal-600 via-teal-500 to-emerald-500' : 'bg-gradient-to-br from-indigo-600 via-blue-600 to-violet-600'}`}>
        {/* Animated floating shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl animate-pulse"></div>
          <div className="absolute top-1/3 -right-16 h-80 w-80 rounded-full bg-white/10 blur-3xl" style={{animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite'}}></div>
          <div className="absolute -bottom-20 left-1/4 h-64 w-64 rounded-full bg-white/5 blur-2xl" style={{animation: 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite'}}></div>
          {/* Grid pattern overlay */}
          <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.07) 1px, transparent 0)', backgroundSize: '40px 40px'}}></div>
        </div>
        
        <div className="relative z-10 text-center px-12 max-w-lg">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <span className="font-display text-4xl font-extrabold tracking-tight text-white">
              Blearn<span className="text-white/60">.</span>
            </span>
          </div>
          
          <h2 className="text-2xl font-bold text-white/95 leading-snug">
            {isTeacher ? 'Empower Your Students' : 'Learn Without Limits'}
          </h2>
          <p className="mt-4 text-sm text-white/70 leading-relaxed max-w-sm mx-auto">
            {isTeacher 
              ? 'Create courses, host live sessions, and build an interactive classroom experience for your students.'
              : 'Access world-class courses, interactive quizzes, and live classes from expert instructors.'
            }
          </p>
          
          {/* Decorative cards floating */}
          <div className="mt-10 flex justify-center gap-4">
            <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-4 shadow-xl" style={{animation: 'float 6s ease-in-out infinite'}}>
              <div className="text-3xl font-extrabold text-white">4.9★</div>
              <div className="text-xs text-white/60 mt-1">Avg. Rating</div>
            </div>
            <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-4 shadow-xl" style={{animation: 'float 6s ease-in-out infinite 1s'}}>
              <div className="text-3xl font-extrabold text-white">1.2K+</div>
              <div className="text-xs text-white/60 mt-1">Students</div>
            </div>
            <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-4 shadow-xl" style={{animation: 'float 6s ease-in-out infinite 2s'}}>
              <div className="text-3xl font-extrabold text-white">50+</div>
              <div className="text-xs text-white/60 mt-1">Courses</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-12 lg:w-1/2 lg:px-16">
        {/* Mobile brand header */}
        <div className="lg:hidden flex items-center gap-2.5 mb-10">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-lg ${isTeacher ? 'bg-gradient-to-br from-teal-600 to-emerald-500' : 'bg-gradient-to-br from-indigo-600 to-blue-500'}`}>
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="font-display text-2xl font-bold tracking-tight text-slate-800">
            Blearn<span className={isTeacher ? 'text-teal-600' : 'text-indigo-600'}>.</span>
          </span>
        </div>

        {/* Role badge */}
        <div className="mb-6">
          <span className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border ${isTeacher ? 'bg-teal-50 text-teal-700 border-teal-200' : 'bg-indigo-50 text-indigo-700 border-indigo-200'}`}>
            {isTeacher ? '👩‍🏫 Teacher Portal' : '👨‍🎓 Student Space'}
          </span>
        </div>

        {/* Form Content */}
        {children}

        {/* Switch Portal Link */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-400">
            {isTeacher ? 'Are you a student?' : 'Are you a teacher?'}{' '}
            <Link
              to={isTeacher ? '/auth' : '/teacher/auth'}
              className={`font-semibold hover:underline ${isTeacher ? 'text-teal-600 hover:text-teal-700' : 'text-indigo-600 hover:text-indigo-700'}`}
            >
              {isTeacher ? 'Student Login →' : 'Teacher Login →'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
