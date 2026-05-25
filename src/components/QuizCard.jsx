import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useCourse } from '../context/CourseContext';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, CheckCircle, Award } from 'lucide-react';

const QuizCard = ({ quiz }) => {
  const { user } = useAuth();
  const { courses } = useCourse();
  const navigate = useNavigate();

  const isTeacher = user?.role === 'teacher';
  
  // Find associated course
  const course = courses.find(c => c.id === quiz.courseId);
  
  // Get score if completed
  const userScore = user?.quizScores?.[quiz.id];
  const isCompleted = userScore !== undefined;

  const handleStart = () => {
    navigate(`/quizzes/${quiz.id}`);
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 transition-all duration-300 hover:shadow-premium-lg">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          {course && (
            <span className="text-xs font-semibold text-indigo-500 uppercase tracking-wider block mb-1">
              {course.title}
            </span>
          )}
          <h3 className="text-base font-bold text-slate-800 leading-snug">
            {quiz.title}
          </h3>
        </div>

        {/* Status Badge */}
        {isCompleted ? (
          <span className="flex items-center gap-1 shrink-0 rounded-full bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
            <CheckCircle className="h-3.5 w-3.5" />
            <span>Completed</span>
          </span>
        ) : (
          <span className="flex items-center gap-1 shrink-0 rounded-full bg-slate-50 border border-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-500">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Not Started</span>
          </span>
        )}
      </div>

      <p className="text-sm text-slate-500 line-clamp-2 mb-4">
        {quiz.description}
      </p>

      {/* Stats and Action */}
      <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-slate-400">Questions</span>
          <span className="text-sm font-semibold text-slate-700">{quiz.questions?.length || 0} MCQs</span>
        </div>

        {isCompleted && (
          <div className="flex flex-col gap-0.5 text-right mr-4">
            <span className="text-xs text-slate-400">Best Score</span>
            <span className="flex items-center gap-0.5 text-sm font-bold text-emerald-600">
              <Award className="h-4 w-4" />
              {userScore}%
            </span>
          </div>
        )}

        <button
          onClick={handleStart}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all
            ${isTeacher 
              ? 'bg-teal-50 text-teal-600 hover:bg-teal-100'
              : isCompleted 
                ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-premium-sm'
            }`}
        >
          {isTeacher 
            ? 'Preview Quiz' 
            : isCompleted 
              ? 'Retake Quiz' 
              : 'Start Quiz'
          }
        </button>
      </div>
    </div>
  );
};

export default QuizCard;
