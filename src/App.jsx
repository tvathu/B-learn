import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CourseProvider } from './context/CourseContext';
import DashboardLayout from './layouts/DashboardLayout';
import StudentAuth from './pages/StudentAuth';
import TeacherAuth from './pages/TeacherAuth';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Quizzes from './pages/Quizzes';
import QuizDetail from './pages/QuizDetail';
import LiveClasses from './pages/LiveClasses';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <CourseProvider>
        <BrowserRouter>
          <Routes>
            {/* Auth Pages */}
            <Route path="/auth" element={<StudentAuth />} />
            <Route path="/teacher/auth" element={<TeacherAuth />} />

            {/* Dashboard Platform Pages (Protected) */}
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="courses" element={<Courses />} />
              <Route path="courses/:id" element={<CourseDetail />} />
              <Route path="quizzes" element={<Quizzes />} />
              <Route path="quizzes/:id" element={<QuizDetail />} />
              <Route path="live" element={<LiveClasses />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            {/* Default wildcard redirection */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </CourseProvider>
    </AuthProvider>
  );
}

export default App;
