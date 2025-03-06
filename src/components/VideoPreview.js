'use client';

import { useState, useEffect, useRef } from 'react';

export default function VideoPreview({ videoData }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const slideshowRef = useRef(null);
  
  // Start/pause the slideshow and audio together
  const togglePlayback = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      if (slideshowRef.current) {
        clearInterval(slideshowRef.current);
        slideshowRef.current = null;
      }
    } else {
      audioRef.current?.play();
      startSlideshow();
    }
    setIsPlaying(!isPlaying);
  };
  
  // Start the slideshow
  const startSlideshow = () => {
    if (slideshowRef.current) {
      clearInterval(slideshowRef.current);
    }
    
    // Calculate total duration for all slides
    let totalDuration = 0;
    const timePoints = [0]; // Starting point
    
    videoData.slides.forEach(slide => {
      totalDuration += slide.duration;
      timePoints.push(totalDuration);
    });
    
    // Check which slide to show based on current audio time
    slideshowRef.current = setInterval(() => {
      if (!audioRef.current) return;
      
      const currentTime = audioRef.current.currentTime;
      for (let i = 0; i < timePoints.length - 1; i++) {
        if (currentTime >= timePoints[i] && currentTime < timePoints[i + 1]) {
          setCurrentSlide(i);
          break;
        }
      }
    }, 100);
  };
  
  // Handle audio end
  useEffect(() => {
    const handleAudioEnd = () => {
      setIsPlaying(false);
      setCurrentSlide(0);
      if (slideshowRef.current) {
        clearInterval(slideshowRef.current);
        slideshowRef.current = null;
      }
    };
    
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.addEventListener('ended', handleAudioEnd);
      return () => {
        audioElement.removeEventListener('ended', handleAudioEnd);
        if (slideshowRef.current) {
          clearInterval(slideshowRef.current);
        }
      };
    }
  }, []);
  
  if (!videoData) return null;
  
  return (
    <div className="w-full mt-8 bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Your Educational Video</h2>
      
      <div className="relative aspect-video w-full mb-6 bg-gray-900 rounded-lg overflow-hidden shadow-md">
        {/* Current slide image */}
        {videoData.slides && videoData.slides[currentSlide] && (
          <img 
            src={videoData.slides[currentSlide].imageUrl} 
            alt={`Slide ${currentSlide + 1}`}
            className="w-full h-full object-contain"
          />
        )}
        
        {/* Caption overlay */}
        {videoData.slides && videoData.slides[currentSlide] && (
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-4 text-lg text-center">
            {videoData.slides[currentSlide].caption}
          </div>
        )}
        
        {/* Play/pause button overlay */}
        <button 
          onClick={togglePlayback}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-90 text-black rounded-full w-16 h-16 flex items-center justify-center shadow-lg transition-all duration-200"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          )}
        </button>
        
        {/* Hidden audio element */}
        <audio 
          ref={audioRef}
          src={videoData.videoUrl} 
          className="hidden"
        />
      </div>
      
      {/* Slide thumbnails */}
      <div className="flex overflow-x-auto space-x-2 py-2 mb-4 px-2 bg-gray-100 rounded-lg">
        {videoData.slides && videoData.slides.map((slide, index) => (
          <div 
            key={index}
            onClick={() => {
              setCurrentSlide(index);
              if (audioRef.current) {
                let timePosition = 0;
                for (let i = 0; i < index; i++) {
                  timePosition += videoData.slides[i].duration;
                }
                audioRef.current.currentTime = timePosition;
                if (isPlaying) {
                  audioRef.current.play();
                }
              }
            }}
            className={`flex-shrink-0 cursor-pointer rounded-md overflow-hidden border-2 transition-all duration-200 hover:opacity-90 ${currentSlide === index ? 'border-blue-500 shadow-md' : 'border-transparent'}`}
          >
            <img 
              src={slide.imageUrl} 
              alt={`Thumbnail ${index + 1}`}
              className="w-24 h-16 object-cover"
            />
          </div>
        ))}
      </div>
      
      <div className="flex justify-center space-x-4 mt-6">
        <a
          href={videoData.videoUrl}
          download="educational-audio.mp3"
          className="px-5 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-sm transition-colors duration-200"
        >
          Download Audio
        </a>
        
        <button
          onClick={togglePlayback}
          className="px-5 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm transition-colors duration-200"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </div>
      
      <p className="text-sm text-gray-600 mt-6 text-center bg-yellow-50 p-3 rounded-md border border-yellow-200">
        Note: This is a synchronized slideshow. For a fully rendered video, you would need to download the assets and combine them with video editing software.
      </p>
    </div>
  );
}