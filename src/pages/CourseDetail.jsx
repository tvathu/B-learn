import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCourse } from '../context/CourseContext';
import VideoPlayer from '../components/VideoPlayer';
import { 
  ArrowLeft, 
  FileText, 
  PlayCircle, 
  CheckSquare, 
  Download, 
  Clock, 
  BookOpen, 
  Award,
  Video
} from 'lucide-react';

const CourseDetail = () => {
  const { id } = useParams();
  const { user, updateProfile } = useAuth();
  const { courses, quizzes, enrollCourse } = useCourse();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('videos'); // materials, videos, quizzes
  
  // Find Course
  const course = courses.find(c => c.id === id);
  if (!course) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 p-8">
        <h2 className="text-xl font-bold text-slate-800">Course Not Found</h2>
        <p className="text-slate-500 mt-2">The course you are looking for does not exist or has been deleted.</p>
        <Link to="/courses" className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to courses
        </Link>
      </div>
    );
  }

  const isTeacher = user?.role === 'teacher';
  const isEnrolled = user?.enrolledCourses?.includes(course.id);
  const isCreatedByMe = isTeacher && user?.coursesCreated?.includes(course.id);
  const showMaterialsAndVideos = isEnrolled || isTeacher;

  // Video Playlist State
  const [activeVideo, setActiveVideo] = useState(course.videos?.[0] || null);

  // Find quizzes linked to this course
  const courseQuizzes = Object.values(quizzes).filter(q => q.courseId === course.id);

  const handleEnroll = () => {
    const res = enrollCourse(course.id, user, updateProfile);
    if (res.success) {
      alert(`Successfully enrolled in "${course.title}"!`);
    } else {
      alert(res.message);
    }
  };

  const handleDownload = (material) => {
    alert(`Downloading material "${material.title}" (${material.size})...`);
  };

  // Color styles
  const accentText = isTeacher ? 'text-teal-600' : 'text-indigo-600';
  const accentBorder = isTeacher ? 'border-teal-600 text-teal-600' : 'border-indigo-600 text-indigo-600';
  const accentBg = isTeacher ? 'bg-teal-600 hover:bg-teal-700' : 'bg-indigo-600 hover:bg-indigo-700';

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <button 
          onClick={() => navigate('/courses')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to courses</span>
        </button>
      </div>

      {/* Main Split Grid */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Left Area: Details and Tab content (2 cols wide) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cover image & main info */}
          <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-premium">
            <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
              <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
              
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="rounded-full bg-white/20 border border-white/35 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                  {course.category}
                </span>
                <h1 className="mt-2 font-display text-2xl font-extrabold tracking-tight sm:text-3xl text-white">
                  {course.title}
                </h1>
                <div className="mt-3 flex items-center gap-4 text-xs text-white/80">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Duration: {course.duration}</span>
                  </div>
                  <span>•</span>
                  <span>Instructor: {course.instructor}</span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <h2 className="text-base font-bold text-slate-800 mb-2">About This Course</h2>
              <p className="text-sm text-slate-500 leading-relaxed">{course.description}</p>
            </div>
          </div>

          {/* Locked Content Warning */}
          {!showMaterialsAndVideos && (
            <div className="rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/50 p-6 text-center shadow-premium-sm">
              <BookOpen className="mx-auto h-10 w-10 text-indigo-400 mb-2" />
              <h3 className="text-sm font-bold text-indigo-900">Course Syllabus Locked</h3>
              <p className="text-xs text-indigo-700/80 mt-1 max-w-md mx-auto">
                Enroll in this course to gain complete access to the video lessons, downloadable materials, and interactive quizzes.
              </p>
              <button 
                onClick={handleEnroll}
                className="mt-4 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white hover:bg-indigo-700 shadow-premium-sm"
              >
                Enroll Now
              </button>
            </div>
          )}

          {/* Active Syllabus Tabs */}
          {showMaterialsAndVideos && (
            <div className="space-y-4">
              {/* Tab Selector */}
              <div className="flex border-b border-slate-100">
                <button
                  onClick={() => setActiveTab('videos')}
                  className={`flex items-center gap-1.5 pb-3 px-4 text-xs font-bold border-b-2 transition-all outline-none
                    ${activeTab === 'videos' ? `${accentBorder}` : 'border-transparent text-slate-400 hover:text-slate-600'}
                  `}
                >
                  <Video className="h-4 w-4" />
                  <span>Video Lessons ({course.videos?.length || 0})</span>
                </button>

                <button
                  onClick={() => setActiveTab('materials')}
                  className={`flex items-center gap-1.5 pb-3 px-4 text-xs font-bold border-b-2 transition-all outline-none
                    ${activeTab === 'materials' ? `${accentBorder}` : 'border-transparent text-slate-400 hover:text-slate-600'}
                  `}
                >
                  <FileText className="h-4 w-4" />
                  <span>Materials ({course.materials?.length || 0})</span>
                </button>

                <button
                  onClick={() => setActiveTab('quizzes')}
                  className={`flex items-center gap-1.5 pb-3 px-4 text-xs font-bold border-b-2 transition-all outline-none
                    ${activeTab === 'quizzes' ? `${accentBorder}` : 'border-transparent text-slate-400 hover:text-slate-600'}
                  `}
                >
                  <CheckSquare className="h-4 w-4" />
                  <span>Quizzes ({courseQuizzes.length})</span>
                </button>
              </div>

              {/* Tab Contents */}
              <div className="transition-all duration-300">
                {/* 1. VIDEOS TAB */}
                {activeTab === 'videos' && (
                  <div className="space-y-6">
                    {/* Active Video Display */}
                    {activeVideo ? (
                      <div className="space-y-3">
                        <VideoPlayer url={activeVideo.url} title={activeVideo.title} />
                        <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                          <h4 className="text-sm font-bold text-slate-800">Now Playing: {activeVideo.title}</h4>
                          <span className="text-xs text-slate-400 font-semibold">{activeVideo.duration}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-8 text-center text-slate-400 text-xs font-semibold">
                        No video lessons uploaded for this course yet.
                      </div>
                    )}

                    {/* Playlist items */}
                    {course.videos && course.videos.length > 1 && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Course Playlist</h4>
                        <div className="grid gap-2 grid-cols-1">
                          {course.videos.map((vid) => (
                            <button
                              key={vid.id}
                              onClick={() => setActiveVideo(vid)}
                              className={`flex items-center justify-between text-left p-3 rounded-xl border transition-all text-xs font-medium outline-none
                                ${activeVideo?.id === vid.id
                                  ? 'border-indigo-100 bg-indigo-50/50 text-indigo-700 font-bold'
                                  : 'border-slate-100 bg-white text-slate-600 hover:bg-slate-50'
                                }
                              `}
                            >
                              <div className="flex items-center gap-2">
                                <PlayCircle className={`h-4 w-4 shrink-0 ${activeVideo?.id === vid.id ? 'text-indigo-600' : 'text-slate-400'}`} />
                                <span className="truncate">{vid.title}</span>
                              </div>
                              <span className="text-slate-400 shrink-0">{vid.duration}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. MATERIALS TAB */}
                {activeTab === 'materials' && (
                  <div className="space-y-3">
                    {course.materials && course.materials.length > 0 ? (
                      course.materials.map((mat) => (
                        <div 
                          key={mat.id}
                          className="flex items-center justify-between border border-slate-100 rounded-xl bg-white p-4 shadow-premium hover:shadow-premium-lg transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
                              <FileText className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-slate-800">{mat.title}</h4>
                              <p className="text-[10px] text-slate-400 mt-0.5">{mat.type} • {mat.size}</p>
                            </div>
                          </div>

                          <button 
                            onClick={() => handleDownload(mat)}
                            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all outline-none"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-8 text-center text-slate-400 text-xs font-semibold">
                        No resource materials available.
                      </div>
                    )}
                  </div>
                )}

                {/* 3. QUIZZES TAB */}
                {activeTab === 'quizzes' && (
                  <div className="space-y-3">
                    {courseQuizzes.length > 0 ? (
                      courseQuizzes.map((quiz) => {
                        const userScore = user?.quizScores?.[quiz.id];
                        const isCompleted = userScore !== undefined;

                        return (
                          <div 
                            key={quiz.id}
                            className="flex items-center justify-between border border-slate-100 rounded-xl bg-white p-4 shadow-premium hover:shadow-premium-lg transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
                                <CheckSquare className="h-5 w-5" />
                              </div>
                              <div>
                                <h4 className="text-sm font-bold text-slate-800">{quiz.title}</h4>
                                <p className="text-[10px] text-slate-400 mt-0.5">{quiz.questions?.length || 0} Multiple Choices</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-4">
                              {isCompleted && (
                                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                                  Score: {userScore}%
                                </span>
                              )}
                              <button 
                                onClick={() => navigate(`/quizzes/${quiz.id}`)}
                                className={`rounded-xl px-4 py-2 text-xs font-bold text-white shadow-premium-sm transition-all ${accentBg}`}
                              >
                                {isCompleted ? 'Retake' : 'Start'}
                              </button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-8 text-center text-slate-400 text-xs font-semibold">
                        No quizzes assigned for this course yet.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Area: Course Sidebar (1 col wide) */}
        <div className="space-y-6">
          {/* Enrollment / Status Card */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-premium">
            <h3 className="text-sm font-bold text-slate-800 mb-4">Course Options</h3>

            {isTeacher ? (
              <div className="space-y-3">
                <div className="rounded-xl bg-teal-50 border border-teal-100 p-3.5 text-xs text-teal-800 leading-normal font-medium">
                  {isCreatedByMe ? 'You created this course. You can manage contents, preview video lessons, and run mock client reviews.' : 'You have access to this course in Teacher View.'}
                </div>
                <div className="flex justify-between py-2 border-b border-slate-50 text-xs font-semibold text-slate-500">
                  <span>Enrolled Students</span>
                  <span className="text-slate-800">{course.enrolledCount || 0}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-50 text-xs font-semibold text-slate-500">
                  <span>Syllabus Modules</span>
                  <span className="text-slate-800">3 Lessons</span>
                </div>
              </div>
            ) : isEnrolled ? (
              <div className="space-y-4">
                <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3.5 text-xs text-emerald-800 leading-normal font-medium flex items-center gap-2">
                  <Award className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                  <span>You are enrolled in this course!</span>
                </div>
                
                <div className="flex justify-between py-2 border-b border-slate-50 text-xs font-semibold text-slate-500">
                  <span>Lessons Completed</span>
                  <span className="text-slate-800">
                    {course.id === 'course-1' ? '2 / 3' : course.id === 'course-2' ? '1 / 3' : '0 / 3'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-slate-500 leading-normal">
                  Join other students who are currently mastering these skills. Gain credentials and certification resources.
                </p>
                <button
                  onClick={handleEnroll}
                  className={`w-full rounded-xl py-3 px-4 text-xs font-bold text-white shadow-premium transition-colors cursor-pointer ${accentBg}`}
                >
                  Enroll in Course
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
