import React from 'react';
import { useCourse } from '../context/CourseContext';
import { useAuth } from '../context/AuthContext';
import QuizCard from '../components/QuizCard';
import { Award, HelpCircle, CheckSquare } from 'lucide-react';

const Quizzes = () => {
  const { quizzes } = useCourse();
  const { user } = useAuth();

  const isTeacher = user?.role === 'teacher';
  
  // Calculate aggregate metrics
  const completedScores = Object.values(user?.quizScores || {});
  const quizzesList = Object.values(quizzes);
  const totalQuizzesCount = quizzesList.length;
  const completedCount = completedScores.length;
  
  const averageScore = completedCount > 0 
    ? Math.round(completedScores.reduce((sum, s) => sum + s, 0) / completedCount) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-800">
          Interactive Quizzes
        </h1>
        <p className="text-sm text-slate-500">
          Verify your understanding of course modules, test your developer skills, and earn score certificates.
        </p>
      </div>

      {/* Aggregate Score Panel (Student Only) */}
      {!isTeacher && completedCount > 0 && (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 bg-gradient-stitch-soft border border-indigo-100/50 rounded-2xl p-5 shadow-premium-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500 text-white shadow-premium">
              <CheckSquare className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-indigo-400">Quizzes Completed</p>
              <p className="text-base font-extrabold text-slate-800">{completedCount} / {totalQuizzesCount}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-premium">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-500">Average High Score</p>
              <p className="text-base font-extrabold text-slate-800">{averageScore}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Quizzes Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {quizzesList.map((quiz) => (
          <QuizCard key={quiz.id} quiz={quiz} />
        ))}
      </div>
    </div>
  );
};

export default Quizzes;
