import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers } from '../services/mockData';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('blearn_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const savedUsers = localStorage.getItem('blearn_registered_users');
    const mockUserList = Object.values(mockUsers);
    
    if (savedUsers) {
      let parsedUsers = JSON.parse(savedUsers);
      // Ensure all mock users are included even if returning from local storage
      mockUserList.forEach(mockUser => {
        if (!parsedUsers.find(u => u.id === mockUser.id)) {
          parsedUsers.push(mockUser);
        }
      });
      localStorage.setItem('blearn_registered_users', JSON.stringify(parsedUsers));
      return parsedUsers;
    }
    
    // Seed with mock users initially
    localStorage.setItem('blearn_registered_users', JSON.stringify(mockUserList));
    return mockUserList;
  });

  // Keep localStorage in sync with user state
  useEffect(() => {
    if (user) {
      localStorage.setItem('blearn_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('blearn_user');
    }
  }, [user]);

  const login = (userData) => {
    const { email, role } = userData;
    // Find user in registered list matching email and role
    const foundUser = registeredUsers.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.role === role
    );

    if (foundUser) {
      // For mock purposes, any login with correct email/role is successful
      setUser(foundUser);
      return { success: true, user: foundUser };
    }
    return { success: false, message: `Invalid ${role === 'teacher' ? 'Teacher' : 'Student'} credentials. Use ${role === 'teacher' ? 'sarah@blearn.com' : 'alex@blearn.com'} / password.` };
  };

  const register = (name, email, password, role) => {
    // Check if user already exists
    const userExists = registeredUsers.some(
      u => u.email.toLowerCase() === email.toLowerCase() && u.role === role
    );

    if (userExists) {
      return { success: false, message: "User with this email and role already exists." };
    }

    const newUser = {
      id: `${role === 'teacher' ? 'tch' : 'std'}-${Date.now()}`,
      name,
      email,
      role,
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`,
      bio: `Hello! I am ${name}, a new ${role} on Blearn.`,
      ...(role === 'student' ? { enrolledCourses: [], quizScores: {} } : { portalLabel: "Teacher Portal", coursesCreated: [], stats: { totalStudents: 0, averageRating: 5.0, activeHours: 0 } })
    };

    const updatedUsers = [...registeredUsers, newUser];
    setRegisteredUsers(updatedUsers);
    localStorage.setItem('blearn_registered_users', JSON.stringify(updatedUsers));
    
    // Log in immediately
    setUser(newUser);
    return { success: true, user: newUser };
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updatedData) => {
    if (!user) return { success: false, message: "No active session." };

    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);

    // Update in registeredUsers list too
    const updatedUsers = registeredUsers.map(u => u.id === user.id ? updatedUser : u);
    setRegisteredUsers(updatedUsers);
    localStorage.setItem('blearn_registered_users', JSON.stringify(updatedUsers));

    return { success: true, user: updatedUser };
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
