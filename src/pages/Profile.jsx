import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCourse } from '../context/CourseContext';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Shield, BookOpen, Edit, Save, X, Calendar, Award } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { courses } = useCourse();
  const navigate = useNavigate();

  const isTeacher = user?.role === 'teacher';
  
  // Edit form state
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    avatar: user?.avatar || ''
  });

  const enrolledList = courses.filter(c => user?.enrolledCourses?.includes(c.id));
  const createdList = courses.filter(c => user?.coursesCreated?.includes(c.id));

  const handleSave = (e) => {
    e.preventDefault();
    if (!profileData.name.trim()) {
      alert('Name cannot be empty.');
      return;
    }
    
    const res = updateProfile(profileData);
    if (res.success) {
      setEditMode(false);
      alert('Profile updated successfully!');
    } else {
      alert(res.message);
    }
  };

  // Color styles
  const accentColor = isTeacher ? 'text-teal-600' : 'text-indigo-600';
  const buttonBg = isTeacher ? 'bg-teal-600 hover:bg-teal-700' : 'bg-indigo-600 hover:bg-indigo-700';
  const badgeClass = isTeacher ? 'bg-teal-50 text-teal-700 border-teal-200' : 'bg-indigo-50 text-indigo-700 border-indigo-200';
  const focusBorder = isTeacher ? 'focus:border-teal-500 focus:ring-teal-100' : 'focus:border-indigo-500 focus:ring-indigo-100';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-800">
          User Settings
        </h1>
        <p className="text-sm text-slate-500">
          Manage your personal details, profile bio, and check learning credentials.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Left Card: Core profile (1 col) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-premium text-center relative overflow-hidden">
            {/* Background color blob */}
            <div className={`absolute top-0 inset-x-0 h-24 opacity-10 ${isTeacher ? 'bg-teal-600' : 'bg-indigo-600'}`}></div>

            <div className="relative pt-6 flex flex-col items-center">
              {/* Avatar */}
              <img
                src={user?.avatar}
                alt={user?.name}
                className={`h-24 w-24 rounded-full object-cover ring-4 ring-white shadow-premium-md mb-4`}
              />
              
              <h2 className="text-lg font-extrabold text-slate-800 leading-snug">
                {user?.name}
              </h2>
              
              <span className={`inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${badgeClass}`}>
                {isTeacher ? 'Teacher Portal' : 'Student Space'}
              </span>

              <p className="text-xs text-slate-400 mt-3 flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" />
                <span>{user?.email}</span>
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-50 text-left text-xs font-semibold text-slate-500 space-y-3.5">
              <div className="flex justify-between items-center">
                <span>Account Status</span>
                <span className="text-emerald-600 font-bold">Active</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Joined Blearn</span>
                <span className="text-slate-700">May 2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Editing form / Bio detail (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-premium space-y-6">
            <div className="flex items-center justify-between border-b border-slate-50 pb-4">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                {editMode ? 'Edit Profile Data' : 'About Me'}
              </h3>
              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  className={`flex items-center gap-1 text-xs font-bold transition-all cursor-pointer ${accentColor}`}
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setEditMode(false);
                    setProfileData({ name: user.name, bio: user.bio, avatar: user.avatar });
                  }}
                  className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-slate-600 transition-all outline-none"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
              )}
            </div>

            {/* Profile Display / Form */}
            {!editMode ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase">Bio / Introduction</h4>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {user?.bio || "No bio added yet. Write something about yourself!"}
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSave} className="space-y-4">
                {/* Full name input */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5" htmlFor="edit-name">
                    Full Name
                  </label>
                  <input
                    id="edit-name"
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className={`w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 text-sm text-slate-800 outline-none transition-all focus:bg-white focus:ring-4 ${focusBorder}`}
                    required
                  />
                </div>

                {/* Bio text area */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5" htmlFor="edit-bio">
                    Bio
                  </label>
                  <textarea
                    id="edit-bio"
                    rows="4"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    className={`w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 text-sm text-slate-800 outline-none transition-all focus:bg-white focus:ring-4 ${focusBorder}`}
                  />
                </div>

                {/* Avatar url */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5" htmlFor="edit-avatar">
                    Avatar Image URL
                  </label>
                  <input
                    id="edit-avatar"
                    type="url"
                    value={profileData.avatar}
                    onChange={(e) => setProfileData({ ...profileData, avatar: e.target.value })}
                    className={`w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 text-sm text-slate-800 outline-none transition-all focus:bg-white focus:ring-4 ${focusBorder}`}
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className={`flex items-center gap-1.5 rounded-xl py-2.5 px-5 text-xs font-bold text-white shadow-premium cursor-pointer ${buttonBg}`}
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Curriculum at the bottom */}
          <div className="space-y-4">
            <h3 className="text-base font-extrabold text-slate-800">
              {isTeacher ? 'My Published Syllabus' : 'My Enrolled Courses'}
            </h3>

            {isTeacher ? (
              createdList.length > 0 ? (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                  {createdList.map(course => (
                    <div 
                      key={course.id} 
                      onClick={() => navigate(`/courses/${course.id}`)}
                      className="flex items-center gap-3 border border-slate-100 rounded-xl bg-white p-3 shadow-premium hover:shadow-premium-lg transition-all cursor-pointer"
                    >
                      <img src={course.thumbnail} alt={course.title} className="h-12 w-16 object-cover rounded-lg shrink-0" />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-800 truncate">{course.title}</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">{course.enrolledCount} students enrolled</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No courses created yet.</p>
              )
            ) : (
              enrolledList.length > 0 ? (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                  {enrolledList.map(course => (
                    <div 
                      key={course.id} 
                      onClick={() => navigate(`/courses/${course.id}`)}
                      className="flex items-center gap-3 border border-slate-100 rounded-xl bg-white p-3 shadow-premium hover:shadow-premium-lg transition-all cursor-pointer"
                    >
                      <img src={course.thumbnail} alt={course.title} className="h-12 w-16 object-cover rounded-lg shrink-0" />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-800 truncate">{course.title}</h4>
                        <p className="text-[10px] text-indigo-500 font-semibold mt-0.5">Enrolled</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">You are not enrolled in any courses yet.</p>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
