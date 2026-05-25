import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useCourse } from '../context/CourseContext';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  CheckSquare, 
  Video, 
  Users, 
  Star, 
  Plus, 
  Play, 
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { courses, liveClasses } = useCourse();
  const navigate = useNavigate();

  const isTeacher = user?.role === 'teacher';
  
  // Format current date
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = new Date().toLocaleDateString('en-US', dateOptions);

  // Student specific data filtering
  const enrolledList = courses.filter(c => user?.enrolledCourses?.includes(c.id));
  const completedQuizzesCount = Object.keys(user?.quizScores || {}).length;
  
  // Teacher specific data filtering
  const createdList = courses.filter(c => user?.coursesCreated?.includes(c.id));
  
  // Next live class
  const nextLive = liveClasses.find(lc => lc.status === 'live') || liveClasses[0];

  // Colors depending on role
  const gradientClass = isTeacher ? 'bg-gradient-teacher' : 'bg-gradient-stitch';
  const accentText = isTeacher ? 'text-teal-600' : 'text-indigo-600';
  const accentBg = isTeacher ? 'bg-teal-50 text-teal-700' : 'bg-indigo-50 text-indigo-700';
  
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className={`relative overflow-hidden rounded-3xl p-8 text-white shadow-premium-lg ${gradientClass}`}>
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-white/20 blur-xl"></div>
          <div className="absolute top-1/2 -right-10 h-60 w-60 rounded-full bg-white/20 blur-2xl"></div>
        </div>
        <div className="relative z-10">
          <span className="text-xs font-bold uppercase tracking-wider text-white/80">{formattedDate}</span>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight md:text-4xl text-white">
            Welcome back, {user?.name.split(' ')[0]}!
          </h1>
          <p className="mt-2 max-w-lg text-sm text-white/90">
            {isTeacher 
              ? "Here's what is happening across your courses and live student streams today. Let's make learning interactive!" 
              : "Ready to pick up where you left off? Keep learning and finish quizzes to earn certificates."
            }
          </p>
        </div>
      </div>

      {/* Statistics Section */}
      {isTeacher ? (
        /* Teacher Stats Grid */
        <div className="grid gap-5 grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-premium transition-all hover:shadow-premium-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Students</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600"><Users className="h-5 w-5" /></div>
            </div>
            <div className="mt-4">
              <span className="text-2xl font-extrabold text-slate-800">{user?.stats?.totalStudents || 1240}</span>
              <span className="ml-1.5 text-xs text-teal-600 font-semibold flex items-center gap-0.5 mt-0.5"><TrendingUp className="h-3 w-3" />+12% this week</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-premium transition-all hover:shadow-premium-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">My Courses</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600"><BookOpen className="h-5 w-5" /></div>
            </div>
            <div className="mt-4">
              <span className="text-2xl font-extrabold text-slate-800">{createdList.length}</span>
              <p className="text-xs text-slate-400 mt-1">Active curriculum</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-premium transition-all hover:shadow-premium-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Live Sessions</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600"><Video className="h-5 w-5" /></div>
            </div>
            <div className="mt-4">
              <span className="text-2xl font-extrabold text-slate-800">1 Scheduled</span>
              <p className="text-xs text-slate-400 mt-1">Starting tomorrow</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-premium transition-all hover:shadow-premium-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Instructor Rating</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600"><Star className="h-5 w-5 fill-amber-500 text-amber-500" /></div>
            </div>
            <div className="mt-4">
              <span className="text-2xl font-extrabold text-slate-800">{user?.stats?.averageRating || '4.8'}</span>
              <p className="text-xs text-slate-400 mt-1">Based on student feedback</p>
            </div>
          </div>
        </div>
      ) : (
        /* Student Stats Grid */
        <div className="grid gap-5 grid-cols-1 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-premium transition-all hover:shadow-premium-lg flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Enrolled Courses</span>
              <p className="text-xl font-extrabold text-slate-800 mt-0.5">{enrolledList.length}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-premium transition-all hover:shadow-premium-lg flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <CheckSquare className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Quizzes Completed</span>
              <p className="text-xl font-extrabold text-slate-800 mt-0.5">{completedQuizzesCount}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-premium transition-all hover:shadow-premium-lg flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <Video className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Next Live Class</span>
              <p className="text-sm font-bold text-slate-800 mt-0.5 truncate max-w-[200px]">
                {nextLive ? nextLive.title : 'No sessions scheduled'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid Content */}
      <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
        {/* Left Column (2 cols wide on desktop) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-800">
              {isTeacher ? 'My Curriculum' : 'Continue Learning'}
            </h2>
            <button 
              onClick={() => navigate('/courses')} 
              className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${accentText}`}
            >
              <span>{isTeacher ? 'Manage all' : 'Explore more'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Role specific Course sections */}
          {isTeacher ? (
            createdList.length > 0 ? (
              <div className="grid gap-5 grid-cols-1 md:grid-cols-2">
                {createdList.slice(0, 2).map(course => (
                  <div 
                    key={course.id} 
                    onClick={() => navigate(`/courses/${course.id}`)}
                    className="group border border-slate-100 rounded-2xl bg-white p-5 shadow-premium hover:shadow-premium-lg transition-all cursor-pointer"
                  >
                    <img src={course.thumbnail} alt={course.title} className="h-28 w-full object-cover rounded-xl mb-4" />
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${accentBg}`}>{course.category}</span>
                    <h3 className="font-bold text-slate-800 text-sm mt-2 line-clamp-1 group-hover:text-teal-600 transition-colors">{course.title}</h3>
                    <div className="flex justify-between items-center text-xs text-slate-400 mt-3.5 pt-3.5 border-t border-slate-50">
                      <span>{course.enrolledCount || 0} students</span>
                      <span className="font-bold text-teal-600">Manage Course</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-8 text-center">
                <p className="text-slate-500 font-medium">You haven't created any courses yet.</p>
                <button 
                  onClick={() => navigate('/courses')}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-teal-700 shadow-premium-sm"
                >
                  <Plus className="h-4 w-4" />
                  Create Your First Course
                </button>
              </div>
            )
          ) : (
            enrolledList.length > 0 ? (
              <div className="space-y-4">
                {enrolledList.slice(0, 3).map(course => {
                  const progress = course.id === 'course-1' ? 66 : course.id === 'course-2' ? 33 : 0;
                  return (
                    <div 
                      key={course.id}
                      onClick={() => navigate(`/courses/${course.id}`)}
                      className="group flex flex-col md:flex-row gap-4 border border-slate-100 rounded-2xl bg-white p-4 shadow-premium hover:shadow-premium-lg transition-all cursor-pointer"
                    >
                      <img src={course.thumbnail} alt={course.title} className="h-20 w-full md:w-32 object-cover rounded-xl" />
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${accentBg}`}>{course.category}</span>
                          <h3 className="font-bold text-slate-800 text-sm mt-1.5 line-clamp-1 group-hover:text-indigo-600 transition-colors">{course.title}</h3>
                        </div>
                        <div className="w-full mt-3 md:mt-0">
                          <div className="flex justify-between items-center text-xs text-slate-500 mb-1">
                            <span>Progress</span>
                            <span className="font-bold">{progress}%</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-slate-100">
                            <div className="h-full rounded-full bg-indigo-600" style={{ width: `${progress}%` }}></div>
                          </div>
                        </div>
                      </div>
                      <button className="md:self-center flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                        <Play className="h-4 w-4 fill-current ml-0.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-8 text-center">
                <p className="text-slate-500 font-medium font-display text-sm">You are not enrolled in any courses yet.</p>
                <button 
                  onClick={() => navigate('/courses')}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 shadow-premium-sm"
                >
                  Explore Courses
                </button>
              </div>
            )
          )}
        </div>

        {/* Right Column (1 col wide on desktop) */}
        <div className="space-y-6">
          <h2 className="text-xl font-extrabold text-slate-800">
            {isTeacher ? 'Quick Shortcuts' : 'Live Classrooms'}
          </h2>

          {isTeacher ? (
            /* Teacher Actions Card */
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-premium space-y-3">
              <button 
                onClick={() => navigate('/courses')}
                className="flex w-full items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-left hover:bg-teal-50/30 group transition-colors"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-600 group-hover:scale-105 transition-transform"><Plus className="h-5 w-5" /></div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Create a New Course</h4>
                  <p className="text-[10px] text-slate-400">Launch standard or video lessons</p>
                </div>
              </button>

              <button 
                onClick={() => navigate('/live')}
                className="flex w-full items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-left hover:bg-violet-50/30 group transition-colors"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600 group-hover:scale-105 transition-transform"><Video className="h-5 w-5" /></div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Start Live Stream</h4>
                  <p className="text-[10px] text-slate-400">Join mock classroom stream</p>
                </div>
              </button>

              <button 
                onClick={() => navigate('/quizzes')}
                className="flex w-full items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-left hover:bg-rose-50/30 group transition-colors"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 group-hover:scale-105 transition-transform"><Award className="h-5 w-5" /></div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Review Quizzes</h4>
                  <p className="text-[10px] text-slate-400">Configure standard MCQ queries</p>
                </div>
              </button>
            </div>
          ) : (
            /* Live Class Card */
            nextLive ? (
              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-premium overflow-hidden relative">
                {nextLive.status === 'live' && (
                  <span className="absolute top-4 right-4 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                  </span>
                )}
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${nextLive.status === 'live' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-slate-100 text-slate-500'}`}>
                  {nextLive.status === 'live' ? 'Live Now' : 'Scheduled'}
                </span>
                
                <h3 className="font-bold text-slate-800 mt-3 text-sm">{nextLive.title}</h3>
                <p className="text-xs text-slate-400 mt-1">Instructor: {nextLive.instructor}</p>
                <p className="text-xs text-slate-500 mt-3 line-clamp-2 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">{nextLive.description}</p>
                
                <button
                  onClick={() => navigate('/live')}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-700 py-2.5 text-xs font-bold text-white shadow-premium-sm transition-colors"
                >
                  <Video className="h-4 w-4" />
                  <span>{nextLive.status === 'live' ? 'Join Stream' : 'View Class Detail'}</span>
                </button>
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-premium text-center py-8">
                <p className="text-xs text-slate-400">No live sessions schedule today.</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
