import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useCourse } from '../context/CourseContext';
import { useNavigate } from 'react-router-dom';
import { Star, Users, Play, BookOpen, Clock } from 'lucide-react';

const CourseCard = ({ course }) => {
  const { user, updateProfile } = useAuth();
  const { enrollCourse } = useCourse();
  const navigate = useNavigate();

  const isTeacher = user?.role === 'teacher';
  const isEnrolled = user?.enrolledCourses?.includes(course.id);
  const isCreatedByMe = isTeacher && user?.coursesCreated?.includes(course.id);

  // Mock progress calculation
  const mockProgress = course.id === 'course-1' ? 66 : course.id === 'course-2' ? 33 : 0;

  const handleAction = (e) => {
    e.stopPropagation();
    
    if (isTeacher) {
      navigate(`/courses/${course.id}`);
      return;
    }

    if (isEnrolled) {
      navigate(`/courses/${course.id}`);
    } else {
      const res = enrollCourse(course.id, user, updateProfile);
      if (res.success) {
        alert(`Successfully enrolled in ${course.title}!`);
        navigate(`/courses/${course.id}`);
      } else {
        alert(res.message);
      }
    }
  };

  // Badges based on category
  const categoryStyles = {
    Design: 'bg-rose-50 text-rose-600 border-rose-100',
    Development: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    Business: 'bg-amber-50 text-amber-600 border-amber-100',
    Marketing: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  };

  const currentCategoryStyle = categoryStyles[course.category] || 'bg-slate-50 text-slate-600 border-slate-100';

  return (
    <div 
      onClick={() => navigate(`/courses/${course.id}`)}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-premium-lg cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider backdrop-blur-md ${currentCategoryStyle}`}>
            {course.category}
          </span>
        </div>
        {isEnrolled && (
          <div className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white shadow-premium">
            <Play className="h-4 w-4 fill-white" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-slate-700">{course.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{course.duration}</span>
          </div>
        </div>

        <h3 className="line-clamp-2 text-base font-bold text-slate-800 leading-snug group-hover:text-indigo-600 transition-colors mb-2">
          {course.title}
        </h3>

        {/* Instructor */}
        <div className="flex items-center gap-2 mb-4">
          <img
            src={course.instructorAvatar}
            alt={course.instructor}
            className="h-6 w-6 rounded-full object-cover"
          />
          <span className="text-xs text-slate-500">by {course.instructor}</span>
        </div>

        {/* Progress Bar (if enrolled) */}
        {isEnrolled && !isTeacher && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Progress</span>
              <span className="font-semibold">{mockProgress}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-100">
              <div 
                className="h-full rounded-full bg-indigo-600 transition-all duration-500" 
                style={{ width: `${mockProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Bottom Panel */}
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Users className="h-4 w-4" />
            <span>{course.enrolledCount || 0} students</span>
          </div>
          
          <button
            onClick={handleAction}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all
              ${isTeacher 
                ? 'bg-teal-50 text-teal-600 hover:bg-teal-100' 
                : isEnrolled 
                  ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-premium-sm'
              }`}
          >
            {isTeacher 
              ? 'View Details' 
              : isEnrolled 
                ? 'Continue' 
                : 'Enroll Now'
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
