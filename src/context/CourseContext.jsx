import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockCourses, mockQuizzes, mockLiveClasses } from '../services/mockData';

const CourseContext = createContext(null);

export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState(() => {
    const savedCourses = localStorage.getItem('blearn_courses');
    return savedCourses ? JSON.parse(savedCourses) : mockCourses;
  });

  const [quizzes] = useState(() => {
    return mockQuizzes; // Quizzes are read-only templates
  });

  const [liveClasses, setLiveClasses] = useState(() => {
    const savedClasses = localStorage.getItem('blearn_live_classes');
    return savedClasses ? JSON.parse(savedClasses) : mockLiveClasses;
  });

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('blearn_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('blearn_live_classes', JSON.stringify(liveClasses));
  }, [liveClasses]);

  const enrollCourse = (courseId, user, updateProfile) => {
    if (!user || user.role !== 'student') return { success: false, message: "Only students can enroll in courses." };
    
    // Check if already enrolled
    if (user.enrolledCourses?.includes(courseId)) {
      return { success: false, message: "Already enrolled in this course." };
    }

    const updatedEnrolled = [...(user.enrolledCourses || []), courseId];
    updateProfile({ enrolledCourses: updatedEnrolled });

    // Update course enroll count
    setCourses(prevCourses => 
      prevCourses.map(c => 
        c.id === courseId ? { ...c, enrolledCount: (c.enrolledCount || 0) + 1 } : c
      )
    );

    return { success: true, message: "Successfully enrolled!" };
  };

  const submitQuizScore = (quizId, score, user, updateProfile) => {
    if (!user) return { success: false, message: "No active user session." };
    
    const currentScores = { ...(user.quizScores || {}) };
    const prevBest = currentScores[quizId] || 0;
    
    // Keep the highest score
    if (score > prevBest) {
      currentScores[quizId] = score;
      updateProfile({ quizScores: currentScores });
    }
    
    return { success: true, newHighScore: score > prevBest };
  };

  const createCourse = (courseData, teacher, updateProfile) => {
    if (!teacher || teacher.role !== 'teacher') {
      return { success: false, message: "Only teachers can create courses." };
    }

    const newCourse = {
      id: `course-${Date.now()}`,
      title: courseData.title,
      description: courseData.description,
      instructor: teacher.name,
      instructorAvatar: teacher.avatar,
      thumbnail: courseData.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=640",
      category: courseData.category || "Development",
      duration: courseData.duration || "4 weeks",
      rating: 5.0,
      enrolledCount: 0,
      materials: courseData.materials || [],
      videos: courseData.videos || [],
      quizzes: []
    };

    setCourses(prevCourses => [newCourse, ...prevCourses]);
    
    // Update teacher list of created courses
    const updatedCreated = [...(teacher.coursesCreated || []), newCourse.id];
    
    // Calculate new teacher stats
    const updatedStats = {
      ...teacher.stats,
      // Just keep stats as is or increment active hours/total students
    };

    updateProfile({ 
      coursesCreated: updatedCreated,
      stats: updatedStats
    });

    return { success: true, course: newCourse };
  };

  const addLiveChatMessage = (classId, senderName, messageText) => {
    setLiveClasses(prevClasses =>
      prevClasses.map(c => {
        if (c.id === classId) {
          const now = new Date();
          const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
          const newChat = {
            id: `chat-${Date.now()}`,
            sender: senderName,
            message: messageText,
            time: timeString
          };
          return {
            ...c,
            chatHistory: [...c.chatHistory, newChat]
          };
        }
        return c;
      })
    );
  };

  return (
    <CourseContext.Provider value={{ 
      courses, 
      quizzes, 
      liveClasses, 
      enrollCourse, 
      submitQuizScore, 
      createCourse, 
      addLiveChatMessage 
    }}>
      {children}
    </CourseContext.Provider>
  );
};

export const useCourse = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourse must be used within a CourseProvider');
  }
  return context;
};
