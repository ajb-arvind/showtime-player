import { useRef, useState, useEffect } from 'react';
import screenfull from 'screenfull';

const useVideoPlayer = (videoRef, videoContainerRef, timelineContainerRef) => {
  const intervalRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewProgress, setPreviewProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  let currentTime = 0;
  let duration = 0;
  if (videoRef.current) {
    currentTime = videoRef.current.currentTime;
    duration = videoRef.current.duration;
  }

  const updateProgress = () => {
    if (videoRef.current) {
      const value =
        (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(value);
    }
  };

  //progress loop
  const startProgressLoop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      updateProgress();
    }, 100);
  };

  const stopProgressLoop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // play pause
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
        startProgressLoop();
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
        stopProgressLoop();
      }
    }
  };

  // buffering
  const onWaiting = (e) => {
    setIsWaiting(true);
  };

  const onLoadedData = (e) => {
    setIsPlaying(true);
    setIsWaiting(false);
  };

  // play next video
  const handleVideoEnd = (playNext) => {
    playNext();
    setIsPlaying(true);
    setProgress(0);
    startProgressLoop();
  };

  const startVideo = () => {
    if (videoRef.current) {
      videoRef.current.play();
      videoRef.current.currentTime = 0;
      setIsPlaying(true);
      setProgress(0);
    }
  };

  const stopVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
      setProgress(0);
    }
  };

  // scrubbing
  let wasPaused;
  useEffect(() => {
    const timelineContainer = timelineContainerRef.current;

    let isScrubbing;

    const toggleScrubbing = (e) => {
      const rect = timelineContainer.getBoundingClientRect();
      const percent =
        (Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width) * 100;

      const seekTo = (percent / 100) * videoRef.current.duration;
      isScrubbing = (e.buttons & 1) === 1;

      if (isScrubbing) {
        wasPaused = videoRef.current.paused;
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.currentTime = seekTo;
        if (!wasPaused) {
          videoRef.current.play();
          setIsPlaying(true);
        }
      }
      handleTimelineUpdate(e);
    };

    const handleTimelineUpdate = (e) => {
      const rect = timelineContainer.getBoundingClientRect();
      const percent =
        (Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width) * 100;

      const seekTo = (percent / 100) * videoRef.current.duration;
      setPreviewProgress((p) => percent);
      if (isScrubbing) {
        e.preventDefault();
        setProgress((p) => percent);
      }
    };

    if (timelineContainer) {
      timelineContainer.addEventListener('mousedown', toggleScrubbing);
      timelineContainer.addEventListener('mousemove', handleTimelineUpdate);
    }

    document.addEventListener('mouseup', (e) => {
      if (isScrubbing) {
        toggleScrubbing(e);
      }
    });

    document.addEventListener('mousemove', (e) => {
      if (isScrubbing) {
        handleTimelineUpdate(e);
      }
    });

    return () => {
      if (timelineContainer) {
        timelineContainer.removeEventListener('mousedown', toggleScrubbing);
        timelineContainer.removeEventListener(
          'mousemove',
          handleTimelineUpdate
        );
      }

      document.removeEventListener('mouseup', (e) => {
        if (isScrubbing) {
          toggleScrubbing(e);
        }
      });

      document.removeEventListener('mousemove', (e) => {
        if (isScrubbing) {
          handleTimelineUpdate(e);
        }
      });
    };
  }, []);

  // mute
  const toggleMute = () => {
    const currentVolume = videoRef.current.volume;
    if (currentVolume > 0) {
      videoRef.current.volume = 0;
      setVolume(0);
      setIsMuted(true);
    } else {
      videoRef.current.volume = 1;
      setVolume(1);
      setIsMuted(false);
    }
  };

  // volume
  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    videoRef.current.volume = newVolume;
    setVolume(newVolume);

    setIsMuted(+newVolume === 0);
  };

  // playback speed
  const changePlaybackSpeed = (e) => {
    if (videoRef.current) {
      let newPlaybackRate = videoRef.current.playbackRate + 0.25;
      if (newPlaybackRate > 2) newPlaybackRate = 0.25;
      videoRef.current.playbackRate = newPlaybackRate;
      e.target.innerHTML = `${newPlaybackRate}x`;
    }
  };

  //fullscreen
  const toggleFullScreen = () => {
    screenfull.toggle(videoContainerRef.current);
    setIsFullScreen(!isFullScreen);
  };

  return {
    isPlaying,
    isFullScreen,
    progress,
    previewProgress,
    volume,
    isMuted,
    currentTime,
    duration,
    isWaiting,
    setIsPlaying,
    togglePlayPause,
    startProgressLoop,
    stopProgressLoop,
    startVideo,
    stopVideo,
    onWaiting,
    onLoadedData,
    handleVideoEnd,
    toggleMute,
    handleVolumeChange,
    toggleFullScreen,
    changePlaybackSpeed,
  };
};
export default useVideoPlayer;
