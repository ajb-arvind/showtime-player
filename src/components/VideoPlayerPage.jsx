import VideoPlayer from './VideoPlayer';
import PlayList from './PlayList';
import { mediaJSON } from '../data/videoData';
import { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

const VideoPlayerPage = () => {
  const [videos, setVideos] = useState(mediaJSON?.categories[0]?.videos);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const video = videos[currentVideoIndex];

  const selectVideo = (id) => {
    setCurrentVideoIndex(id);
    
  };

  const handleNextVideoPlay = () => {
    if (currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex((prevIndex) => +prevIndex + 1);
    } else {
      setCurrentVideoIndex(0);
    }
  };

  function handleOnDragEnd(result) {
    if (!result.destination) return;

    const items = Array.from(videos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    if (currentVideoIndex === result.source.index) {
      setCurrentVideoIndex(result.destination.index);
    } else if (
      currentVideoIndex > result.source.index &&
      currentVideoIndex <= result.destination.index
    ) {
      setCurrentVideoIndex(+currentVideoIndex - 1);
    } else if (
      currentVideoIndex < result.source.index &&
      currentVideoIndex >= result.destination.index
    ) {
      setCurrentVideoIndex(+currentVideoIndex + 1);
    }

    setVideos(items);
  }

  return (
    <div className="flex justify-center flex-row h-[calc(100%-56px)]">
      <div className="w-full max-w-[1280px] flex flex-col lg:flex-row">
        <div className="flex flex-col lg:w-[calc(100%-400px)] xl:w-[calc(100%-400px)] px-4 py-3 lg:py-6 overflow-y-auto">
          <div className="h-[200px] md:h-[400px] lg:h-[400px] xl:h-[550px] ml-[-16px] lg:ml-0 mr-[-16px] lg:mr-0">
            <VideoPlayer
              src={video?.sources}
              thumbnail={video?.thumb}
              title={video.title}
              playNext={handleNextVideoPlay}
            />
          </div>
          <div className="flex gap-2 flex-col px-2 md:px-4">
            <div className="text-black font-bold text-base md:text-xl mt-4 line-clamp-2">
              {video?.title}
            </div>
            <div className="text-black/[0.7] text-sm">{video?.subtitle}</div>
            <div className="text-black text-xs md:text-base  bg-slate-100 rounded-xl px-4 py-2">
              {video?.description}
            </div>
          </div>
        </div>

        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="video">
            {(provided) => (
              <ul
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex flex-col py-6 px-4 overflow-y-auto lg:w-[350px] xl:w-[400px]"
              >
                {videos.map((video, index) => {
                  return (
                    <Draggable
                      key={video.id}
                      draggableId={video.id}
                      index={index}
                    >
                      {(provided) => (
                        <PlayList
                          ref={provided.innerRef}
                          draggableProps={provided.draggableProps}
                          dragHandleProps={provided.dragHandleProps}
                          video={video}
                          onclick={() => selectVideo(video.id)}
                          currentVideoIndex={currentVideoIndex}
                          index={index}
                        />
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};
export default VideoPlayerPage;
