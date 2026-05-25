import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCourse } from '../context/CourseContext';
import { ArrowLeft, Check, X, Award, ChevronLeft, ChevronRight, RefreshCw, BookOpen } from 'lucide-react';

const QuizDetail = () => {
  const { id } = useParams();
  const { user, updateProfile } = useAuth();
  const { quizzes, submitQuizScore, courses } = useCourse();
  const navigate = useNavigate();

  // Find Quiz
  const quiz = quizzes[id];
  if (!quiz) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 p-8">
        <h2 className="text-xl font-bold text-slate-800">Quiz Not Found</h2>
        <p className="text-slate-500 mt-2">The quiz you are looking for does not exist.</p>
        <Link to="/quizzes" className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to quizzes
        </Link>
      </div>
    );
  }

  const course = courses.find(c => c.id === quiz.courseId);

  // Playback States
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [computedScore, setComputedScore] = useState(0);
  const [newHighScoreRecorded, setNewHighScoreRecorded] = useState(false);

  const totalQuestions = quiz.questions.length;
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const selectedOption = selectedAnswers[currentQuestion.id];

  const handleSelectOption = (optionIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.id]: optionIndex
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    // Verify all questions are answered
    if (Object.keys(selectedAnswers).length < totalQuestions) {
      alert('Please answer all questions before submitting.');
      return;
    }

    // Calculate score
    let correctCount = 0;
    quiz.questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const scorePercent = Math.round((correctCount / totalQuestions) * 100);
    setComputedScore(scorePercent);
    setIsSubmitted(true);

    // Save score in contexts (student role only)
    if (user?.role === 'student') {
      const res = submitQuizScore(quiz.id, scorePercent, user, updateProfile);
      setNewHighScoreRecorded(res.newHighScore);
    }
  };

  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setComputedScore(0);
    setNewHighScoreRecorded(false);
  };

  const progressPercent = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);

  // Layout color selection
  const isTeacher = user?.role === 'teacher';
  const borderActive = isTeacher ? 'border-teal-500' : 'border-indigo-600';
  const bgActive = isTeacher ? 'bg-teal-50/30' : 'bg-indigo-50/30';
  const radioActive = isTeacher ? 'bg-teal-600 ring-teal-100' : 'bg-indigo-600 ring-indigo-100';
  const accentColor = isTeacher ? 'bg-teal-600 hover:bg-teal-700' : 'bg-indigo-600 hover:bg-indigo-700';
  const textAccent = isTeacher ? 'text-teal-600' : 'text-indigo-600';

  // Results grading messages
  const getFeedbackMessage = (score) => {
    if (score === 100) return { title: 'Perfect Score!', desc: 'Exceptional work! You have completely mastered these concepts.', color: 'text-emerald-600' };
    if (score >= 70) return { title: 'Great Job!', desc: 'You passed! You have a solid grasp of this material.', color: 'text-indigo-600' };
    return { title: 'Keep Reviewing', desc: 'Study the course materials and try again. Practice makes perfect!', color: 'text-amber-600' };
  };

  const feedback = getFeedbackMessage(computedScore);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back button */}
      <div>
        <button 
          onClick={() => navigate('/quizzes')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to quizzes</span>
        </button>
      </div>

      {/* QUIZ RUNNER LAYOUT */}
      {!isSubmitted ? (
        <div className="rounded-2xl border border-slate-100 bg-white p-6 md:p-8 shadow-premium space-y-6">
          {/* Header */}
          <div className="border-b border-slate-50 pb-4">
            {course && (
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                {course.title}
              </span>
            )}
            <h2 className="text-xl font-extrabold text-slate-800 leading-tight">{quiz.title}</h2>
          </div>

          {/* Progress Indicator */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase">
              <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
              <span>{progressPercent}% Complete</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${isTeacher ? 'bg-teal-500' : 'bg-indigo-600'}`} 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Question Text */}
          <div className="py-2">
            <h3 className="text-base font-bold text-slate-800 leading-snug md:text-lg">
              {currentQuestion.question}
            </h3>
          </div>

          {/* MCQ Options list */}
          <div className="grid gap-3 grid-cols-1">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`flex items-start text-left gap-4 rounded-xl border p-4 text-sm transition-all outline-none cursor-pointer
                    ${isSelected 
                      ? `${borderActive} ${bgActive} font-medium` 
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }
                  `}
                >
                  {/* Custom Radio Button */}
                  <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white
                    ${isSelected ? `border-transparent ring-2 ${radioActive}` : ''}
                  `}>
                    {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white"></div>}
                  </div>
                  
                  <span>{option}</span>
                </button>
              );
            })}
          </div>

          {/* Navigation panel */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>

            {currentQuestionIndex === totalQuestions - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={selectedOption === undefined}
                className={`flex items-center gap-1.5 rounded-xl py-2.5 px-6 text-xs font-bold text-white shadow-premium-sm transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${accentColor}`}
              >
                <span>Submit Quiz</span>
                <Check className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={selectedOption === undefined}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* QUIZ RESULTS LAYOUT */
        <div className="rounded-2xl border border-slate-100 bg-white p-6 md:p-8 shadow-premium space-y-8 animate-scale-up">
          {/* Core Score Header */}
          <div className="text-center space-y-4">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-indigo-50 border-4 border-white shadow-premium">
              <Award className={`h-12 w-12 ${feedback.color} animate-float`} />
            </div>
            
            <div>
              <h2 className="text-2xl font-extrabold text-slate-800">{feedback.title}</h2>
              <p className="text-xs text-slate-400 mt-0.5">{quiz.title}</p>
              <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">{feedback.desc}</p>
            </div>

            {/* Score Percentage Ring */}
            <div className="py-2">
              <span className={`text-4xl font-extrabold tracking-tight ${feedback.color}`}>
                {computedScore}%
              </span>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Quiz Highscore</p>
              {newHighScoreRecorded && (
                <span className="inline-block mt-2 rounded-full bg-emerald-50 text-emerald-700 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider border border-emerald-100 animate-pulse-slow">
                  New Personal Record!
                </span>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4 justify-center py-2 border-y border-slate-50">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2.5 px-5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all outline-none"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Retake Quiz</span>
            </button>
            
            <button
              onClick={() => navigate('/')}
              className={`flex items-center gap-1.5 rounded-xl py-2.5 px-5 text-xs font-bold text-white shadow-premium transition-colors outline-none cursor-pointer ${accentColor}`}
            >
              <BookOpen className="h-4 w-4" />
              <span>Dashboard</span>
            </button>
          </div>

          {/* Correct / Incorrect Review details */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Review Questions</h3>
            <div className="space-y-3.5">
              {quiz.questions.map((q, qidx) => {
                const userAns = selectedAnswers[q.id];
                const isCorrect = userAns === q.correctAnswer;

                return (
                  <div 
                    key={q.id}
                    className={`rounded-xl border p-4 text-xs font-medium space-y-2
                      ${isCorrect ? 'border-emerald-100 bg-emerald-50/10' : 'border-rose-100 bg-rose-50/10'}
                    `}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h4 className="font-bold text-slate-800">
                        {qidx + 1}. {q.question}
                      </h4>
                      {isCorrect ? (
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-premium-sm">
                          <Check className="h-3 w-3" />
                        </span>
                      ) : (
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-500 text-white shadow-premium-sm">
                          <X className="h-3 w-3" />
                        </span>
                      )}
                    </div>

                    <div className="grid gap-1.5 pt-1">
                      <div className="flex gap-2">
                        <span className="text-slate-400 font-bold shrink-0">Your Answer:</span>
                        <span className={isCorrect ? 'text-emerald-700 font-semibold' : 'text-rose-700 font-semibold'}>
                          {q.options[userAns] || 'Unanswered'}
                        </span>
                      </div>
                      {!isCorrect && (
                        <div className="flex gap-2">
                          <span className="text-slate-400 font-bold shrink-0">Correct Answer:</span>
                          <span className="text-emerald-700 font-semibold">
                            {q.options[q.correctAnswer]}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizDetail;
