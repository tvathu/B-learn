import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCourse } from '../context/CourseContext';
import CourseCard from '../components/CourseCard';
import { Plus, X, Search, BookOpen, Layers } from 'lucide-react';

const Courses = () => {
  const { user } = useAuth();
  const { courses, createCourse } = useCourse();

  const isTeacher = user?.role === 'teacher';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filterTab, setFilterTab] = useState('all'); // all, enrolled (student), created (teacher)
  
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [newCourseData, setNewCourseData] = useState({
    title: '',
    description: '',
    category: 'Development',
    duration: '4 weeks',
    thumbnail: '',
    lessonTitle: '',
    lessonUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
  });

  const categories = ['All', 'Design', 'Development', 'Business', 'Marketing'];

  // Filter logic
  const filteredCourses = courses.filter(course => {
    // 1. Category search
    if (selectedCategory !== 'All' && course.category !== selectedCategory) return false;
    
    // 2. Keyword query
    const query = searchQuery.toLowerCase();
    const matchesKeyword = 
      course.title.toLowerCase().includes(query) || 
      course.instructor.toLowerCase().includes(query) ||
      course.description.toLowerCase().includes(query);
    
    if (!matchesKeyword) return false;

    // 3. Tab filter
    if (filterTab === 'enrolled') {
      return user?.enrolledCourses?.includes(course.id);
    }
    if (filterTab === 'created') {
      return user?.coursesCreated?.includes(course.id);
    }

    return true;
  });

  // Handle Create Course Submission
  const handleCreateCourse = (e) => {
    e.preventDefault();
    if (!newCourseData.title.trim() || !newCourseData.description.trim()) {
      alert('Please fill out Title and Description.');
      return;
    }

    // Build video lesson array
    const lessons = newCourseData.lessonTitle.trim() 
      ? [{ id: `vid-${Date.now()}-1`, title: newCourseData.lessonTitle, duration: '12:00', url: newCourseData.lessonUrl }]
      : [{ id: `vid-${Date.now()}-1`, title: 'Lesson 1: Getting Started', duration: '15:00', url: 'https://www.w3schools.com/html/mov_bbb.mp4' }];

    const materials = [
      { id: `mat-${Date.now()}-1`, title: 'Course Guide & Resources', size: '1.5 MB', type: 'PDF' }
    ];

    const coursePayload = {
      title: newCourseData.title,
      description: newCourseData.description,
      category: newCourseData.category,
      duration: newCourseData.duration,
      thumbnail: newCourseData.thumbnail || undefined,
      videos: lessons,
      materials
    };

    const res = createCourse(coursePayload, user);
    if (res.success) {
      setModalOpen(false);
      setNewCourseData({
        title: '',
        description: '',
        category: 'Development',
        duration: '4 weeks',
        thumbnail: '',
        lessonTitle: '',
        lessonUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
      });
      alert(`Course "${coursePayload.title}" created successfully!`);
    } else {
      alert(res.message);
    }
  };

  const accentColor = isTeacher ? 'bg-teal-600 hover:bg-teal-700' : 'bg-indigo-600 hover:bg-indigo-700';
  const borderActive = isTeacher ? 'border-teal-600 text-teal-600' : 'border-indigo-600 text-indigo-600';
  const categoryActive = isTeacher ? 'bg-teal-600 text-white border-teal-600' : 'bg-indigo-600 text-white border-indigo-600';
  const focusBorder = isTeacher ? 'focus:border-teal-500 focus:ring-teal-100' : 'focus:border-indigo-500 focus:ring-indigo-100';

  return (
    <div className="space-y-6">
      {/* Header and Add Course Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-800">
            {isTeacher ? 'My Curriculum' : 'Explore Courses'}
          </h1>
          <p className="text-sm text-slate-500">
            {isTeacher 
              ? 'Manage your lessons, syllabus materials, and course creation forms.' 
              : 'Browse or filter premium courses and begin learning instantly.'
            }
          </p>
        </div>

        {isTeacher && (
          <button
            onClick={() => setModalOpen(true)}
            className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-3 text-sm font-bold text-white shadow-premium transition-colors cursor-pointer ${accentColor}`}
          >
            <Plus className="h-4.5 w-4.5" />
            <span>Create Course</span>
          </button>
        )}
      </div>

      {/* Tabs & Search controls */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pt-2 border-b border-slate-100 pb-4">
        {/* Left: Tab options */}
        <div className="flex gap-4">
          <button
            onClick={() => setFilterTab('all')}
            className={`pb-3 text-sm font-bold border-b-2 transition-all outline-none
              ${filterTab === 'all' ? `${borderActive}` : 'border-transparent text-slate-400 hover:text-slate-600'}
            `}
          >
            All Courses
          </button>
          
          <button
            onClick={() => setFilterTab(isTeacher ? 'created' : 'enrolled')}
            className={`pb-3 text-sm font-bold border-b-2 transition-all outline-none
              ${filterTab === (isTeacher ? 'created' : 'enrolled') ? `${borderActive}` : 'border-transparent text-slate-400 hover:text-slate-600'}
            `}
          >
            {isTeacher ? 'Created by Me' : 'My Enrollments'}
          </button>
        </div>

        {/* Right: Search Input */}
        <div className="relative w-full max-w-xs">
          <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search title, instructor..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pr-4 pl-10 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          />
        </div>
      </div>

      {/* Categories Horizontal Scrolling */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <Layers className="h-4 w-4 text-slate-400 shrink-0 mr-1" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-full border px-4 py-1.5 text-xs font-semibold tracking-wide transition-all shrink-0 outline-none
              ${selectedCategory === cat 
                ? `${categoryActive} shadow-premium-sm` 
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Course Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
          <BookOpen className="mx-auto h-12 w-12 text-slate-300 mb-4" />
          <h3 className="text-base font-bold text-slate-700">No courses found</h3>
          <p className="text-sm text-slate-400 mt-1">Try modifying your search text, category filter, or enrollment status tab.</p>
        </div>
      )}

      {/* CREATE COURSE MODAL (Teacher only) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          {/* Backdrop Click */}
          <div className="absolute inset-0" onClick={() => setModalOpen(false)}></div>

          {/* Modal Container */}
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-premium-xl border border-slate-100 z-10 animate-scale-up max-h-[90vh] overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h3 className="text-lg font-bold text-slate-800">Add New Course</h3>
              <button 
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600 outline-none"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateCourse} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5" htmlFor="modal-title">
                  Course Title
                </label>
                <input
                  id="modal-title"
                  type="text"
                  placeholder="e.g., Intro to CSS Layouts"
                  value={newCourseData.title}
                  onChange={(e) => setNewCourseData({...newCourseData, title: e.target.value})}
                  className={`w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:bg-white focus:ring-4 ${focusBorder}`}
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5" htmlFor="modal-desc">
                  Course Description
                </label>
                <textarea
                  id="modal-desc"
                  rows="3"
                  placeholder="Summarize course goals, structure, and what students will build."
                  value={newCourseData.description}
                  onChange={(e) => setNewCourseData({...newCourseData, description: e.target.value})}
                  className={`w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:bg-white focus:ring-4 ${focusBorder}`}
                  required
                />
              </div>

              {/* Grid elements */}
              <div className="grid grid-cols-2 gap-4">
                {/* Category */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5" htmlFor="modal-cat">
                    Category
                  </label>
                  <select
                    id="modal-cat"
                    value={newCourseData.category}
                    onChange={(e) => setNewCourseData({...newCourseData, category: e.target.value})}
                    className={`w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 text-sm text-slate-800 outline-none transition-all focus:bg-white focus:ring-4 ${focusBorder}`}
                  >
                    {categories.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5" htmlFor="modal-dur">
                    Duration
                  </label>
                  <input
                    id="modal-dur"
                    type="text"
                    placeholder="e.g., 4 weeks"
                    value={newCourseData.duration}
                    onChange={(e) => setNewCourseData({...newCourseData, duration: e.target.value})}
                    className={`w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 text-sm text-slate-800 outline-none transition-all focus:bg-white focus:ring-4 ${focusBorder}`}
                  />
                </div>
              </div>

              {/* Thumbnail URL */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5" htmlFor="modal-thumb">
                  Thumbnail Image URL (Optional)
                </label>
                <input
                  id="modal-thumb"
                  type="url"
                  placeholder="https://images.unsplash.com/... (or blank for default)"
                  value={newCourseData.thumbnail}
                  onChange={(e) => setNewCourseData({...newCourseData, thumbnail: e.target.value})}
                  className={`w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:bg-white focus:ring-4 ${focusBorder}`}
                />
              </div>

              {/* Add Initial Video Lesson */}
              <div className="border-t border-slate-100 pt-4 mt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">First Video Lesson</h4>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Lesson Title (e.g. 1.1 Getting Started)"
                    value={newCourseData.lessonTitle}
                    onChange={(e) => setNewCourseData({...newCourseData, lessonTitle: e.target.value})}
                    className={`w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 px-3 text-xs text-slate-800 placeholder-slate-400 outline-none transition-all focus:bg-white focus:ring-4 ${focusBorder}`}
                  />
                  <input
                    type="url"
                    placeholder="Video MP4 URL (e.g. w3schools sample MP4)"
                    value={newCourseData.lessonUrl}
                    onChange={(e) => setNewCourseData({...newCourseData, lessonUrl: e.target.value})}
                    className={`w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 px-3 text-xs text-slate-800 placeholder-slate-400 outline-none transition-all focus:bg-white focus:ring-4 ${focusBorder}`}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl px-4 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-premium cursor-pointer ${accentColor}`}
                >
                  Create Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;
