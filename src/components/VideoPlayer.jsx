import { useEffect, useRef } from 'react';
import useVideoPlayer from '../hooks/useVideoPlayer';
import {
  FaPlay,
  FaPause,
  FaStop,
  FaExpand,
  FaCompress,
  FaVolumeUp,
  FaVolumeMute,
  FaSpinner,
} from 'react-icons/fa';
import { PlayerButton } from './UIComponent';
import { formatDuration } from '../utils/Utils';

const VideoPlayer = ({ src, thumbnail, playNext }) => {
  const videoRef = useRef(null);
  const videoContainerRef = useRef(null);
  const timelineContainerRef = useRef(null);
  const {
    isPlaying,
    isFullScreen,
    progress,
    previewProgress,
    volume,
    isMuted,
    isWaiting,
    currentTime,
    duration,

    togglePlayPause,
    startProgressLoop,
    stopProgressLoop,
    stopVideo,
    onWaiting,
    onLoadedData,
    handleVideoEnd,
    toggleMute,
    handleVolumeChange,
    changePlaybackSpeed,
    toggleFullScreen,
  } = useVideoPlayer(videoRef, videoContainerRef, timelineContainerRef);

  // console.log(isPlaying);

  return (
    <div
      ref={videoContainerRef}
      className=" h-full w-full relative flex justify-center  group rounded-md group bg-black "
    >
      {/* buffer spinner */}
      {isWaiting && (
        <div className="absolute size-10 flex top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <FaSpinner className=" w-full h-full animate-spin" />
        </div>
      )}
      <video
        className=" w-full"
        ref={videoRef}
        src={src}
        poster={thumbnail}
        onClick={togglePlayPause}
        onPlay={startProgressLoop}
        onPause={stopProgressLoop}
        onWaiting={onWaiting}
        onPlaying={onLoadedData}
        onEnded={() => handleVideoEnd(playNext)}
        autoPlay
        autoFocus
      />

      {/* controls */}
      <div
        className={`pb-1 flex flex-col absolute bottom-0 w-full flex-wrap rounded-md z-10 text-white opacity-0  transition-opacity ease-in-out duration-150 group-hover:opacity-100 group-focus-within:opacity-100 ${
          !isPlaying ? ' opacity-100' : 'opacity-0'
        } before:bg-gradient-to-t before:from-[#000000bf] before:to-transparent before:w-full before:aspect-[3/1] before:-z-10 before:pointer-events-none before:absolute before:bottom-0`}
      >
        <div
          className="px-1 h-2 flex  cursor-pointer items-center group/timeline"
          ref={timelineContainerRef}
        >
          <div
            style={{
              '--progress-position': Math.round(progress * 100) / 100 + '%',
              '--preview-position':
                Math.round(previewProgress * 100) / 100 + '%',
            }}
            className={`timeline bg-neutral-400/50 h-1 w-full relative hover:h-2
             before:absolute before:left-0 before:bottom-0 before:top-0 before:bg-slate-300 before:hidden hover:before:block
             after:absolute after:left-0 after:top-0 after:bottom-0 after:bg-red-600 
             
        `}
          >
            <div className="thumb-indicator absolute bg-red-600 -top-1/2 h-[200%] rounded-full  scale-0 group-hover/timeline:scale-100 -translate-x-2/4 aspect-square transition-all ease-in-out duration-75"></div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 px-4">
          <PlayerButton onClick={togglePlayPause}>
            {isPlaying ? <FaPause /> : <FaPlay />}
          </PlayerButton>
          <PlayerButton onClick={stopVideo}>
            <FaStop />
          </PlayerButton>
          <div className="flex gap-1 flex-grow">
            {formatDuration(currentTime)}
            {'/'}
            {formatDuration(duration)}
          </div>

          <div className="flex gap-2 group/vol items-center">
            <input
              className=" w-[0] origin-right scale-x-0  group-hover/vol:translate-x-1  group-hover/vol:w-24 group-focus-within/vol:w-24 group-focus-within/vol:scale-100 group-hover/vol:scale-100 transition-all"
              type="range"
              min="0"
              max="1"
              step="any"
              value={volume}
              onChange={handleVolumeChange}
            />
            <PlayerButton onClick={toggleMute}>
              {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
            </PlayerButton>
          </div>
          <PlayerButton
            className=" font-extralight text-sm w-10"
            onClick={changePlaybackSpeed}
          >
            1x
          </PlayerButton>
          <PlayerButton onClick={toggleFullScreen}>
            {isFullScreen ? <FaCompress /> : <FaExpand />}
          </PlayerButton>
        </div>
      </div>
    </div>
  );
};
export default VideoPlayer;
