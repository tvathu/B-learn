import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCourse } from '../context/CourseContext';
import VideoPlayer from '../components/VideoPlayer';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Monitor, 
  Radio, 
  Send, 
  Users, 
  LogOut, 
  ChevronRight,
  MessageSquare,
  Volume2
} from 'lucide-react';

const LiveClasses = () => {
  const { user } = useAuth();
  const { liveClasses, addLiveChatMessage } = useCourse();

  const [activeClass, setActiveClass] = useState(null); // Selected class to attend
  const [chatMessage, setChatMessage] = useState('');
  const [micActive, setMicActive] = useState(true);
  const [camActive, setCamActive] = useState(true);
  const [screenShareActive, setScreenShareActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [chatOpen, setChatOpen] = useState(true);

  const chatEndRef = useRef(null);
  const isTeacher = user?.role === 'teacher';

  // Find class from database to sync chat history
  const activeClassSynced = liveClasses.find(c => c.id === activeClass?.id);

  // Scroll chat to bottom on new messages
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeClassSynced?.chatHistory, chatOpen]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatMessage.trim() || !activeClass) return;

    addLiveChatMessage(activeClass.id, user.name, chatMessage);
    setChatMessage('');
  };

  const handleJoinClass = (lc) => {
    setActiveClass(lc);
    // Auto-message indicating joining
    addLiveChatMessage(lc.id, "System", `${user.name} joined the classroom.`);
  };

  const handleLeaveClass = () => {
    if (activeClass) {
      addLiveChatMessage(activeClass.id, "System", `${user.name} left the classroom.`);
      setActiveClass(null);
    }
  };

  // Color styles
  const accentColor = isTeacher ? 'bg-teal-600 hover:bg-teal-700' : 'bg-indigo-600 hover:bg-indigo-700';
  const textAccent = isTeacher ? 'text-teal-600' : 'text-indigo-600';
  const borderAccent = isTeacher ? 'border-teal-500' : 'border-indigo-600';

  return (
    <div className="space-y-6">
      {/* 1. SCHEDULE LIST VIEWS */}
      {!activeClass ? (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-800">
              Live Classes
            </h1>
            <p className="text-sm text-slate-500">
              Attend scheduled teacher workshops, code-alongs, and interactive webinars.
            </p>
          </div>

          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            {liveClasses.map((lc) => {
              const isLive = lc.status === 'live';
              return (
                <div 
                  key={lc.id}
                  className="group flex flex-col justify-between border border-slate-100 rounded-2xl bg-white p-6 shadow-premium hover:shadow-premium-lg transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider
                        ${isLive 
                          ? 'bg-rose-50 text-rose-600 border border-rose-100' 
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }
                      `}>
                        {isLive && <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse-slow"></span>}
                        <span>{isLive ? 'Live Now' : 'Scheduled'}</span>
                      </span>
                      
                      <span className="text-xs font-semibold text-slate-400">
                        {lc.scheduledTime}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-slate-800 leading-snug group-hover:text-indigo-600 transition-colors">
                      {lc.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">Instructor: {lc.instructor}</p>
                    
                    <p className="text-xs text-slate-500 mt-3 line-clamp-3 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100/50">
                      {lc.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Users className="h-4 w-4" />
                      <span>{isLive ? `${lc.participants?.length || 5} active` : 'Register free'}</span>
                    </div>

                    <button
                      onClick={() => handleJoinClass(lc)}
                      className={`rounded-xl px-4 py-2.5 text-xs font-bold text-white shadow-premium-sm transition-all cursor-pointer ${accentColor}`}
                    >
                      <span>{isLive ? 'Join Classroom' : 'Preview Schedule'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* 2. LIVE CLASSROOM LAYOUT */
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3 h-[calc(100vh-10rem)] max-h-[750px]">
          {/* Main Video Stream Container (2/3 width) */}
          <div className="lg:col-span-2 flex flex-col justify-between border border-slate-100 rounded-2xl bg-white p-5 shadow-premium overflow-hidden">
            
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-slate-50 pb-3.5 mb-3.5 shrink-0">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                </span>
                <h2 className="text-sm font-extrabold text-slate-800 truncate max-w-[280px] sm:max-w-md">
                  {activeClassSynced?.title}
                </h2>
              </div>
              
              <button 
                onClick={handleLeaveClass}
                className="flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-100 hover:bg-rose-100 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Leave</span>
              </button>
            </div>

            {/* Video Box */}
            <div className="flex-1 min-h-0 relative flex items-center justify-center bg-slate-900 rounded-xl overflow-hidden shadow-inner">
              {camActive ? (
                /* Mock Stream Video */
                <VideoPlayer url="https://www.w3schools.com/html/mov_bbb.mp4" title={`${activeClassSynced?.instructor} (Instructor Stream)`} />
              ) : (
                /* Cam off Placeholder */
                <div className="text-center space-y-3">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-800 text-slate-400">
                    <VideoOff className="h-8 w-8" />
                  </div>
                  <p className="text-xs font-semibold text-slate-400">Video Feed Muted</p>
                </div>
              )}

              {/* Status Watermark */}
              <div className="absolute top-4 left-4 rounded-md bg-black/60 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur flex items-center gap-1.5 border border-white/10 select-none">
                <Radio className="h-3 w-3 text-rose-500 animate-pulse-slow" />
                <span>{isTeacher ? 'Host Feed' : 'Attending'}</span>
              </div>

              {/* Recording status water mark */}
              {isRecording && (
                <div className="absolute top-4 right-4 rounded-md bg-rose-600 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white flex items-center gap-1.5 select-none animate-pulse-slow">
                  <span className="h-1.5 w-1.5 rounded-full bg-white"></span>
                  <span>REC</span>
                </div>
              )}
            </div>

            {/* Hardware Controls Panel (Mic, Cam, Screen Share, Roster Toggle) */}
            <div className="flex justify-between items-center mt-4 border-t border-slate-50 pt-4 shrink-0">
              <div className="flex items-center gap-2">
                {/* Audio mic toggle */}
                <button
                  onClick={() => setMicActive(!micActive)}
                  className={`rounded-xl p-2.5 transition-all outline-none border cursor-pointer
                    ${micActive 
                      ? 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100' 
                      : 'bg-rose-500 text-white border-transparent hover:bg-rose-600 shadow-premium-sm'
                    }`}
                  title={micActive ? 'Mute Mic' : 'Unmute Mic'}
                >
                  {micActive ? <Mic className="h-4.5 w-4.5" /> : <MicOff className="h-4.5 w-4.5" />}
                </button>

                {/* Cam toggle */}
                <button
                  onClick={() => setCamActive(!camActive)}
                  className={`rounded-xl p-2.5 transition-all outline-none border cursor-pointer
                    ${camActive 
                      ? 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100' 
                      : 'bg-rose-500 text-white border-transparent hover:bg-rose-600 shadow-premium-sm'
                    }`}
                  title={camActive ? 'Disable Camera' : 'Enable Camera'}
                >
                  {camActive ? <Video className="h-4.5 w-4.5" /> : <VideoOff className="h-4.5 w-4.5" />}
                </button>

                {/* Host controls (Screenshare & Record) */}
                {isTeacher && (
                  <>
                    <button
                      onClick={() => setScreenShareActive(!screenShareActive)}
                      className={`rounded-xl p-2.5 transition-all outline-none border cursor-pointer
                        ${screenShareActive 
                          ? 'bg-teal-50 text-teal-600 border-teal-200 hover:bg-teal-100' 
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      title={screenShareActive ? 'Stop Share' : 'Share Screen'}
                    >
                      <Monitor className="h-4.5 w-4.5" />
                    </button>
                    
                    <button
                      onClick={() => setIsRecording(!isRecording)}
                      className={`rounded-xl p-2.5 transition-all outline-none border cursor-pointer
                        ${isRecording 
                          ? 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100' 
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      title={isRecording ? 'Stop Recording' : 'Record Class'}
                    >
                      <Radio className="h-4.5 w-4.5" />
                    </button>
                  </>
                )}
              </div>

              {/* Chat open toggle on mobile/small screen */}
              <button
                onClick={() => setChatOpen(!chatOpen)}
                className={`flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50/50 py-2 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50 lg:hidden`}
              >
                <MessageSquare className="h-4 w-4 text-slate-400" />
                <span>Chat</span>
              </button>

              <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-semibold bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                <Users className="h-3.5 w-3.5" />
                <span>{activeClassSynced?.participants?.length || 5} Attending</span>
              </div>
            </div>
          </div>

          {/* Collapsible Chat Panel (1/3 width) */}
          {chatOpen && (
            <div className="border border-slate-100 rounded-2xl bg-white flex flex-col shadow-premium overflow-hidden h-full">
              {/* Header */}
              <div className="p-4 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <MessageSquare className={`h-4.5 w-4.5 ${textAccent}`} />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Classroom Chat</h3>
                </div>
                <button 
                  onClick={() => setChatOpen(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-50 lg:hidden outline-none"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Chat Feed Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50/20">
                {activeClassSynced?.chatHistory?.map((chat) => {
                  const isMe = chat.sender === user.name;
                  const isSystem = chat.sender === 'System';

                  if (isSystem) {
                    return (
                      <div key={chat.id} className="text-center py-1 text-[10px] font-semibold text-slate-400">
                        {chat.message}
                      </div>
                    );
                  }

                  return (
                    <div key={chat.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <div className="flex items-center gap-1.5 mb-1 text-[10px] text-slate-400">
                        <span className="font-bold text-slate-600">{chat.sender}</span>
                        <span>{chat.time}</span>
                      </div>
                      <div className={`rounded-2xl py-2.5 px-3.5 text-xs max-w-[85%] leading-normal
                        ${isMe 
                          ? `${isTeacher ? 'bg-teal-600' : 'bg-indigo-600'} text-white rounded-tr-none shadow-premium-sm` 
                          : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none shadow-premium-sm'
                        }
                      `}>
                        {chat.message}
                      </div>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
              </div>

              {/* Message Input Form */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 bg-white shrink-0">
                <div className="relative">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Type message here..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pr-11 pl-4 text-xs text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  />
                  <button
                    type="submit"
                    className={`absolute top-1/2 right-1.5 -translate-y-1/2 rounded-lg p-1.5 text-white shadow-premium-sm transition-colors cursor-pointer ${accentColor}`}
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LiveClasses;
