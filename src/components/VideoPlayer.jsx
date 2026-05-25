import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, Settings, FastForward } from 'lucide-react';

const VideoPlayer = ({ url, title }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  useEffect(() => {
    // Reset state on URL change
    setIsPlaying(false);
    setCurrentTime(0);
    setVolume(1);
    setIsMuted(false);
    setPlaybackRate(1);
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [url]);

  // Handle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(e => console.log("Video play interrupted"));
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Time formatting utility (seconds -> MM:SS)
  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return '00:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  // Scrub timeline
  const handleScrub = (e) => {
    const scrubTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = scrubTime;
      setCurrentTime(scrubTime);
    }
  };

  // Handle Volume change
  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    setIsMuted(vol === 0);
    if (videoRef.current) {
      videoRef.current.volume = vol;
      videoRef.current.muted = vol === 0;
    }
  };

  const toggleMute = () => {
    const newMute = !isMuted;
    setIsMuted(newMute);
    if (videoRef.current) {
      videoRef.current.muted = newMute;
      videoRef.current.volume = newMute ? 0 : volume;
    }
  };

  // Playback speed
  const changeSpeed = (rate) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
    setShowSpeedMenu(false);
  };

  // Fullscreen
  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      } else if (videoRef.current.msRequestFullscreen) {
        videoRef.current.msRequestFullscreen();
      }
    }
  };

  // Skip 10 seconds
  const skipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 10, duration);
    }
  };

  const rewind = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 10, 0);
    }
  };

  return (
    <div 
      className="relative w-full overflow-hidden rounded-2xl bg-black shadow-premium-lg group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => {
        setShowControls(false);
        setShowSpeedMenu(false);
      }}
    >
      {/* HTML5 Video element */}
      <video
        ref={videoRef}
        src={url}
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        className="w-full h-auto aspect-video cursor-pointer"
        playsInline
      />

      {/* Dark Overlay on Hover / Pause */}
      <div 
        className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 transition-opacity duration-300 pointer-events-none
          ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}
        `}
      />

      {/* Large Center Play/Pause Indicator (Overlay) */}
      {!isPlaying && (
        <button 
          onClick={togglePlay}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-slate-800 shadow-premium transition-transform hover:scale-105 active:scale-95"
        >
          <Play className="h-6 w-6 fill-slate-800 ml-1" />
        </button>
      )}

      {/* Title Bar */}
      {title && (
        <div 
          className={`absolute top-0 left-0 right-0 p-4 transition-transform duration-300
            ${showControls || !isPlaying ? 'translate-y-0' : '-translate-y-full'}
          `}
        >
          <h4 className="text-sm font-semibold text-white truncate drop-shadow-sm">{title}</h4>
        </div>
      )}

      {/* Custom Controls Bar */}
      <div 
        className={`absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-3 transition-transform duration-300
          ${showControls || !isPlaying ? 'translate-y-0' : 'translate-y-full'}
        `}
      >
        {/* Progress Bar (Slider) */}
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleScrub}
            className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:h-1.5 transition-all outline-none"
          />
        </div>

        {/* Buttons Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-white">
            {/* Play/Pause */}
            <button onClick={togglePlay} className="hover:text-indigo-400 transition-colors">
              {isPlaying ? <Pause className="h-5 w-5 fill-white" /> : <Play className="h-5 w-5 fill-white" />}
            </button>

            {/* Rewind / Fast Forward */}
            <button onClick={rewind} className="hover:text-indigo-400 transition-colors">
              <RotateCcw className="h-4 w-4" />
            </button>
            <button onClick={skipForward} className="hover:text-indigo-400 transition-colors">
              <FastForward className="h-4 w-4" />
            </button>

            {/* Volume controls */}
            <div className="flex items-center gap-2 group/volume">
              <button onClick={toggleMute} className="hover:text-indigo-400 transition-colors">
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-0 group-hover/volume:w-16 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-indigo-500 transition-all outline-none overflow-hidden"
              />
            </div>

            {/* Time Indicator */}
            <span className="text-xs font-medium text-slate-200">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-4 text-white relative">
            {/* Playback Speed Setting */}
            <div className="relative">
              <button 
                onClick={() => setShowSpeedMenu(!showSpeedMenu)} 
                className="flex items-center gap-1 text-xs font-semibold hover:text-indigo-400 transition-colors"
              >
                <Settings className="h-4 w-4" />
                <span>{playbackRate}x</span>
              </button>

              {/* Speed Menu Dropdown */}
              {showSpeedMenu && (
                <div className="absolute bottom-8 right-0 w-24 bg-slate-950/90 backdrop-blur border border-white/10 rounded-lg overflow-hidden flex flex-col z-50">
                  {[0.5, 1, 1.25, 1.5, 2].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => changeSpeed(rate)}
                      className={`text-left px-3 py-1.5 text-xs hover:bg-white/10 transition-colors
                        ${playbackRate === rate ? 'text-indigo-400 font-bold' : 'text-slate-200'}
                      `}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Fullscreen */}
            <button onClick={toggleFullscreen} className="hover:text-indigo-400 transition-colors">
              <Maximize className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
