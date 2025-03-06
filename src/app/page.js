'use client';

import { useState, useRef, useEffect } from 'react';
import CourseMaterial from '@/components/CourseMaterial';

// Add animation keyframes to the <head>
const animationStyles = `
  @keyframes highlightPulse {
    0% { text-shadow: 0 0 8px rgba(255,255,255,0.5), 0 2px 4px rgba(0,0,0,0.5); }
    50% { text-shadow: 0 0 12px rgba(255,255,255,0.8), 0 2px 4px rgba(0,0,0,0.5); }
    100% { text-shadow: 0 0 8px rgba(255,255,255,0.5), 0 2px 4px rgba(0,0,0,0.5); }
  }
  
  @keyframes wordAppear {
    0% { opacity: 0.3; transform: scale(0.85); }
    20% { opacity: 1; transform: scale(1.1); }
    100% { opacity: 1; transform: scale(1); }
  }
  
  @keyframes slideInUp {
    from { transform: translateY(30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @keyframes kenBurns {
    0% { transform: scale(1) translate(0, 0); }
    50% { transform: scale(1.1) translate(-1%, -1%); }
    100% { transform: scale(1.05) translate(1%, 1%); }
  }
  
  @keyframes fadeZoomIn {
    0% { transform: scale(1); opacity: 0.9; }
    50% { transform: scale(1.15); opacity: 1; }
    100% { transform: scale(1); opacity: 0.9; }
  }
  
  @keyframes slideLeft {
    0% { transform: translateX(0) scale(1.05); }
    100% { transform: translateX(-5%) scale(1.05); }
  }
  
  @keyframes slideUp {
    0% { transform: translateY(0) scale(1.05); }
    100% { transform: translateY(-5%) scale(1.05); }
  }
  
  @keyframes zoomOut {
    0% { transform: scale(1.2); }
    100% { transform: scale(1.05); }
  }
  
  @keyframes captionFadeIn {
    0% { opacity: 0; transform: translateY(20px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  @keyframes moveBackground {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  
  @keyframes morphGradient {
    0% { border-radius: 60% 40% 30% 70%/60% 30% 70% 40%; }
    50% { border-radius: 30% 60% 70% 40%/50% 60% 30% 60%; }
    100% { border-radius: 60% 40% 30% 70%/60% 30% 70% 40%; }
  }
  
  @keyframes shimmer {
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
  }
`;

// Function to generate random inspiration text
function getRandomInspiration() {
  const inspirations = [
    "Visualize complex concepts with stunning videos",
    "Transform knowledge into visual experiences",
    "Create engaging educational content in minutes",
    "Bring your educational ideas to life",
    "Turn complex topics into captivating stories"
  ];
  return inspirations[Math.floor(Math.random() * inspirations.length)];
}

export default function Home() {
  const [topic, setTopic] = useState('');
  const [contentType, setContentType] = useState('video'); // Options: 'video', 'course', 'both'
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');
  const [videoData, setVideoData] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const [showInspiration, setShowInspiration] = useState(true);
  const [inspirationText, setInspirationText] = useState("Transform knowledge into visual experiences");
  const [mounted, setMounted] = useState(false);
  const [audioTime, setAudioTime] = useState(0);
  
  const audioRef = useRef(null);
  const slideshowRef = useRef(null);
  const videoContainerRef = useRef(null);
  const wordAnimationRef = useRef(null);

  // Add animation styles to head on component mount
  useEffect(() => {
    // Mark as mounted to avoid hydration errors
    setMounted(true);
    
    // Start rotating inspiration text only after component is mounted
    setInspirationText(getRandomInspiration());
    const inspirationInterval = setInterval(() => {
      setInspirationText(getRandomInspiration());
    }, 5000);
    
    // Add animation styles to head
    const styleElement = document.createElement('style');
    styleElement.innerHTML = animationStyles;
    document.head.appendChild(styleElement);
    
    // Set up inspiration text rotation
    const createParticles = () => {
      if (!videoContainerRef.current) return;
      
      const container = videoContainerRef.current;
      const numParticles = 15;
      
      // Clear existing particles
      const existingParticles = container.querySelectorAll('.particle');
      existingParticles.forEach(p => p.remove());
      
      for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random size, position and opacity
        const size = Math.random() * 10 + 5;
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const opacity = Math.random() * 0.3 + 0.1;
        const animationDuration = Math.random() * 20 + 10;
        const animationDelay = Math.random() * 5;
        
        particle.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          background-color: white;
          border-radius: 50%;
          opacity: ${opacity};
          left: ${left}%;
          top: ${top}%;
          animation: float ${animationDuration}s ease-in-out ${animationDelay}s infinite;
          pointer-events: none;
          z-index: 1;
        `;
        
        container.appendChild(particle);
      }
    };
    
    createParticles();
    const particleInterval = setInterval(createParticles, 20000);
    
    // Clean up on unmount
    return () => {
      document.head.removeChild(styleElement);
      clearInterval(inspirationInterval);
      clearInterval(particleInterval);
    };
  }, []);

  // Add audio time tracking
  useEffect(() => {
    if (!audioRef.current || !isPlaying) return;
    
    const updateTime = () => {
      setAudioTime(audioRef.current.currentTime);
      wordAnimationRef.current = requestAnimationFrame(updateTime);
    };
    
    wordAnimationRef.current = requestAnimationFrame(updateTime);
    
    return () => {
      if (wordAnimationRef.current) {
        cancelAnimationFrame(wordAnimationRef.current);
      }
    };
  }, [isPlaying]);

  // Handle audio end
  const handleAudioEnd = () => {
    setIsPlaying(false);
    setCurrentSlide(0);
    if (slideshowRef.current) {
      clearInterval(slideshowRef.current);
      slideshowRef.current = null;
    }
  };

  // Track which images have loaded successfully
  const handleImageLoad = (index) => {
    console.log(`Image ${index} loaded successfully`);
    setImagesLoaded(prev => ({...prev, [index]: true}));
  };

  const handleImageError = (index) => {
    console.error(`Image ${index} failed to load`);
    setImagesLoaded(prev => ({...prev, [index]: false}));
  };

  // Handle play/pause
  const togglePlayback = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      if (slideshowRef.current) {
        clearInterval(slideshowRef.current);
        slideshowRef.current = null;
      }
    } else {
      audioRef.current.play()
        .then(() => {
          console.log("Audio playback started");
          startSlideshow();
        })
        .catch(err => {
          console.error("Audio playback error:", err);
          setError("Failed to play audio: " + err.message);
        });
    }
    setIsPlaying(!isPlaying);
  };

  // Start slideshow
  const startSlideshow = () => {
    if (slideshowRef.current) {
      clearInterval(slideshowRef.current);
    }
    
    // Calculate slide timing based on audio duration
    const slideDuration = audioRef.current.duration / (videoData.slides.length || 1);
    
    slideshowRef.current = setInterval(() => {
      if (!audioRef.current) return;
      
      const currentTime = audioRef.current.currentTime;
      const slideIndex = Math.min(
        Math.floor(currentTime / slideDuration),
        videoData.slides.length - 1
      );
      
      if (slideIndex >= 0 && slideIndex !== currentSlide) {
        console.log(`Changing to slide ${slideIndex}`);
        setCurrentSlide(slideIndex);
      }
      
      // Force re-render to update word highlighting
      // This is a small hack to make sure the component re-renders
      // to update the word highlighting based on current audio time
      setProgress(prev => {
        if (isPlaying) {
          return prev === 99 ? 99.1 : 99;
        }
        return prev;
      });
    }, 100);
  };

  // Support direct slide selection
  const selectSlide = (index) => {
    if (!audioRef.current || !videoData || !videoData.slides) return;
    
    setCurrentSlide(index);
    
    // Calculate position in audio
    const slideDuration = audioRef.current.duration / videoData.slides.length;
    audioRef.current.currentTime = index * slideDuration;
    
    if (isPlaying) {
      audioRef.current.play().catch(err => console.error("Error playing audio:", err));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setProgress(0);
    setProgressText('Planning your educational content...');
    setVideoData(null);
    setCourseData(null);
    setError(null);
    setShowInspiration(false);

    try {
      // Generate content based on selected type
      if (contentType === 'course' || contentType === 'both') {
        // Step 1: Generate course material
        setProgress(contentType === 'both' ? 10 : 20);
        setProgressText('Creating comprehensive course structure...');
        const courseResponse = await fetch('/api/generate/course', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic }),
        });

        if (!courseResponse.ok) {
          const errorData = await courseResponse.json();
          throw new Error(errorData.error || 'Failed to generate course material');
        }
        
        const courseData = await courseResponse.json();
        console.log("Course data:", courseData);
        setCourseData(courseData);
      }
      
      if (contentType === 'video' || contentType === 'both') {
        // Generate script
        setProgress(contentType === 'both' ? 25 : 30);
        setProgressText('Crafting educational narrative...');
        const scriptResponse = await fetch('/api/generate/script', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic }),
        });

        if (!scriptResponse.ok) {
          const errorData = await scriptResponse.json();
          throw new Error(errorData.error || 'Failed to generate script');
        }
        
        const scriptData = await scriptResponse.json();
        console.log("Script data:", scriptData);
        
        // Generate images
        setProgress(contentType === 'both' ? 40 : 50);
        setProgressText('Creating visual masterpieces...');
        const imageResponse = await fetch('/api/generate/images', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imagePrompts: scriptData.imagePrompts }),
        });

        if (!imageResponse.ok) {
          const errorData = await imageResponse.json();
          throw new Error(errorData.error || 'Failed to generate images');
        }
        
        const imageData = await imageResponse.json();
        console.log("Image data:", imageData);
        
        // Generate voice
        setProgress(contentType === 'both' ? 65 : 75);
        setProgressText('Perfecting voice narration...');
        const voiceResponse = await fetch('/api/generate/voice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ script: scriptData.voiceoverScript }),
        });

        if (!voiceResponse.ok) {
          const errorData = await voiceResponse.json();
          throw new Error(errorData.error || 'Failed to generate voiceover');
        }
        
        const voiceData = await voiceResponse.json();
        console.log("Voice data:", voiceData);
        
        // Combine everything
        setProgress(contentType === 'both' ? 85 : 90);
        setProgressText('Composing cinematic experience...');
        
        // Create video data structure
        const finalVideoData = {
          videoUrl: voiceData.audioUrl,
          slides: imageData.images.map((imageUrl, index) => ({
            imageUrl,
            caption: scriptData.segments[index]?.voiceover || ""
          }))
        };
        
        console.log("Final video data:", finalVideoData);
        setVideoData(finalVideoData);
        setCurrentSlide(0);
      }
      
      setProgress(100);
      setProgressText(
        contentType === 'video' ? 'Your masterpiece is ready!' :
        contentType === 'course' ? 'Your course material is ready!' :
        'Your comprehensive learning package is ready!'
      );
    } catch (error) {
      console.error('Error generating content:', error);
      setError(error.message);
      setProgressText(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      background: 'linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%)',
      minHeight: '100vh',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 2
      }}>
        {/* Decorative Elements */}
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '10%',
          width: '200px',
          height: '200px',
          background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)',
          borderRadius: '60% 40% 30% 70%/60% 30% 70% 40%',
          animation: 'morphGradient 15s ease-in-out infinite, float 10s ease-in-out infinite',
          zIndex: -1
        }}></div>
        
        <div style={{
          position: 'absolute',
          bottom: '15%',
          left: '5%',
          width: '150px',
          height: '150px',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
          borderRadius: '30% 60% 70% 40%/50% 60% 30% 60%',
          animation: 'morphGradient 20s ease-in-out infinite reverse, float 12s ease-in-out 2s infinite',
          zIndex: -1
        }}></div>
      
        {/* Header Section */}
        <header style={{
          textAlign: 'center',
          marginBottom: '30px',
          position: 'relative'
        }}>
          <div style={{
            display: 'inline-block',
            animation: 'slideInUp 0.8s ease-out forwards'
          }}>
            <h1 style={{
              fontSize: '2.75rem',
              fontWeight: '800',
              margin: '0 0 10px 0',
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed, #3b82f6)',
              backgroundSize: '300% 300%',
              animation: 'gradientMove 10s ease infinite',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 10px rgba(99, 102, 241, 0.2)',
              letterSpacing: '-0.02em'
            }}>
              Cinematic Education Studio
            </h1>
            
            <p style={{
              fontSize: '1.25rem',
              color: '#4b5563',
              margin: '0',
              fontWeight: '500',
              maxWidth: '600px',
              margin: '0 auto',
              animation: 'fadeIn 2s forwards',
              opacity: 0,
              animationDelay: '0.3s'
            }}>
              {inspirationText}
            </p>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '10px',
            gap: '8px',
            animation: 'fadeIn 2s forwards',
            opacity: 0,
            animationDelay: '0.8s'
          }}>
            <div className="dot" style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#6366f1',
              animation: 'pulse 1.5s ease-in-out infinite'
            }}></div>
            <span style={{
              fontSize: '14px',
              color: '#6366f1',
              fontWeight: '600'
            }}>
              AI-powered • Visually stunning • Professionally narrated
            </span>
          </div>
        </header>
        
        {/* Input Form */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '24px',
          padding: '30px',
          boxShadow: '0 20px 60px -15px rgba(0, 0, 0, 0.1), 0 -2px 6px 0 rgba(255, 255, 255, 0.7) inset',
          marginBottom: '30px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.7)',
          transition: 'all 0.3s ease',
          transform: loading ? 'scale(0.98)' : 'scale(1)',
          position: 'relative',
          overflow: 'visible',
          display: 'block',
          width: '100%',
          zIndex: 10
        }}>
          <form onSubmit={handleSubmit} style={{ width: '100%', display: 'block' }}>
            <div style={{
              marginBottom: '24px'
            }}>
              <label 
                htmlFor="topic" 
                style={{
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '600',
                  color: '#1f2937',
                  fontSize: '1.1rem',
                  position: 'relative',
                }}
              >
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                  </svg>
                  What educational topic would you like to explore?
                </span>
              </label>
              
              <input
                id="topic"
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Quantum Physics, Photosynthesis, French Revolution"
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '16px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(4px)',
                  outline: topic ? '2px solid #6366f1' : 'none',
                  outlineOffset: '2px',
                  color: '#1f2937'
                }}
                disabled={loading}
                required
              />
              
              <div style={{
                position: 'absolute',
                bottom: '-22px',
                left: '12px',
                fontSize: '13px',
                color: '#6b7280',
                fontWeight: '500',
                opacity: topic.length > 0 ? 1 : 0,
                transform: topic.length > 0 ? 'translateY(0)' : 'translateY(-10px)',
                transition: 'all 0.3s ease'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                  Be specific for better results
                </div>
              </div>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block', 
                marginBottom: '12px', 
                fontWeight: '600',
                color: '#1f2937',
                fontSize: '1.1rem',
              }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  What would you like to generate?
                </span>
              </label>
              
              <div style={{ 
                display: 'flex', 
                gap: '10px',
                flexWrap: 'wrap'
              }}>
                <div 
                  onClick={() => setContentType('video')}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '2px solid',
                    borderColor: contentType === 'video' ? '#6366f1' : '#e5e7eb',
                    background: contentType === 'video' ? 'rgba(99, 102, 241, 0.05)' : 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    color: contentType === 'video' ? '#4f46e5' : '#374151',
                    flex: '1',
                    minWidth: '180px',
                  }}
                >
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: contentType === 'video' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(229, 231, 235, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '15px' }}>Educational Video</div>
                    <div style={{ fontSize: '13px', opacity: '0.8' }}>Visual learning experience</div>
                  </div>
                </div>
                
                <div 
                  onClick={() => setContentType('course')}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '2px solid',
                    borderColor: contentType === 'course' ? '#6366f1' : '#e5e7eb',
                    background: contentType === 'course' ? 'rgba(99, 102, 241, 0.05)' : 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    color: contentType === 'course' ? '#4f46e5' : '#374151',
                    flex: '1',
                    minWidth: '180px',
                  }}
                >
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: contentType === 'course' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(229, 231, 235, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '15px' }}>Course Material</div>
                    <div style={{ fontSize: '13px', opacity: '0.8' }}>Structured learning content</div>
                  </div>
                </div>
                
                <div 
                  onClick={() => setContentType('both')}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '2px solid',
                    borderColor: contentType === 'both' ? '#6366f1' : '#e5e7eb',
                    background: contentType === 'both' ? 'rgba(99, 102, 241, 0.05)' : 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    color: contentType === 'both' ? '#4f46e5' : '#374151',
                    flex: '1',
                    minWidth: '180px',
                  }}
                >
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: contentType === 'both' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(229, 231, 235, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '15px' }}>Complete Package</div>
                    <div style={{ fontSize: '13px', opacity: '0.8' }}>Video + course material</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '30px',
              width: '100%',
              display: 'flex'
            }}>
              <button
                type="submit"
                disabled={loading || !topic.trim()}
                style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  color: '#fff',
                  background: loading 
                    ? 'linear-gradient(135deg, #a5b4fc 0%, #a78bfa 100%)' 
                    : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  boxShadow: '0 6px 15px -3px rgba(124, 58, 237, 0.3)',
                  opacity: loading || !topic.trim() ? 0.7 : 1
                }}
              >
                {loading ? (
                  <span style={{ marginRight: '8px', display: 'inline-flex' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'rotate 2s linear infinite' }}>
                      <line x1="12" y1="2" x2="12" y2="6"></line>
                      <line x1="12" y1="18" x2="12" y2="22"></line>
                      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                      <line x1="2" y1="12" x2="6" y2="12"></line>
                      <line x1="18" y1="12" x2="22" y2="12"></line>
                      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                    </svg>
                  </span>
                ) : (
                  <span style={{ marginRight: '8px', display: 'inline-flex' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14"></path>
                      <path d="M12 5l7 7-7 7"></path>
                    </svg>
                  </span>
                )}
                {loading ? 'Creating Your Video...' : 'Generate Cinematic Video'}
              </button>
            </div>
          </form>
        </div>
        
        {/* Progress Indicator */}
        {loading && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '24px',
            padding: '30px',
            boxShadow: '0 20px 60px -15px rgba(0, 0, 0, 0.1)',
            marginBottom: '30px',
            border: '1px solid rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(10px)',
            animation: 'fadeIn 0.5s forwards'
          }}>
            <div style={{
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ fontWeight: '600', color: '#4b5563' }}>Progress</div>
              <div style={{ fontWeight: '600', color: '#6366f1' }}>{progress}%</div>
            </div>
            
            <div style={{
              position: 'relative',
              height: '8px',
              borderRadius: '99px',
              backgroundColor: '#e5e7eb',
              overflow: 'hidden',
              marginBottom: '20px'
            }}>
              <div 
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: '100%',
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #7c3aed)',
                  backgroundSize: '200% 200%',
                  animation: 'gradientMove 3s ease infinite',
                  borderRadius: '99px',
                  transition: 'width 0.5s ease'
                }}
              ></div>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '14px'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'pulse 2s infinite' }}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              
              <div style={{
                fontSize: '16px',
                color: '#4b5563',
                fontWeight: '500',
                letterSpacing: '0.01em'
              }}>
                {progressText}
              </div>
            </div>
            
            {progress < 100 && progress > 10 && (
              <div style={{
                marginTop: '20px',
                padding: '14px',
                borderRadius: '12px',
                backgroundColor: 'rgba(124, 58, 237, 0.08)',
                border: '1px solid rgba(124, 58, 237, 0.2)',
                fontSize: '14px',
                color: '#6b7280',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>
                  Creating high-quality educational content takes a moment. Your {contentType === 'video' ? 'video' : contentType === 'course' ? 'course material' : 'learning package'} is being crafted with care.
                </span>
              </div>
            )}
          </div>
        )}
        
        {/* Error Display */}
        {error && (
          <div style={{
            background: 'rgba(254, 226, 226, 0.9)',
            borderRadius: '24px',
            padding: '20px',
            boxShadow: '0 20px 60px -15px rgba(0, 0, 0, 0.1)',
            marginBottom: '30px',
            border: '1px solid rgba(248, 113, 113, 0.4)',
            backdropFilter: 'blur(10px)',
            animation: 'slideInUp 0.5s ease-out forwards',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}>
            <div style={{
              minWidth: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            
            <div>
              <h3 style={{ margin: '0 0 4px 0', color: '#b91c1c', fontWeight: '600' }}>Oops! Something went wrong</h3>
              <p style={{ margin: '0', color: '#7f1d1d', fontSize: '14px' }}>{error}</p>
            </div>
          </div>
        )}
        
        {/* Course Material - Only shown if course or both was selected */}
        {courseData && (contentType === 'course' || contentType === 'both') && (
          <CourseMaterial courseData={courseData} />
        )}
        
        {/* Video Player - Only shown if video or both was selected */}
        {videoData && videoData.slides && videoData.slides.length > 0 && (contentType === 'video' || contentType === 'both') && (
          <div ref={videoContainerRef} style={{
            background: 'rgba(17, 24, 39, 0.95)',
            borderRadius: '24px',
            padding: '30px',
            boxShadow: '0 25px 70px -15px rgba(0, 0, 0, 0.3)',
            marginBottom: '30px',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid rgba(55, 65, 81, 0.7)',
            backdropFilter: 'blur(10px)',
            animation: 'fadeZoomIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            transformOrigin: 'center'
          }}>
            {/* Video Title Bar */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              padding: '0 10px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                  </svg>
                </div>
                
                <div>
                  <h2 style={{
                    margin: '0',
                    color: 'white',
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    lineHeight: '1.2'
                  }}>
                    {topic.charAt(0).toUpperCase() + topic.slice(1)}
                  </h2>
                  <div style={{
                    fontSize: '0.85rem',
                    color: 'rgba(255, 255, 255, 0.7)',
                    marginTop: '2px'
                  }}>
                    {videoData.slides.length} scenes • {Math.floor(Math.random() * 21) + 30} seconds
                  </div>
                </div>
              </div>
              
              <div style={{
                display: 'flex',
                gap: '10px'
              }}>
                <button 
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                    <polyline points="16 6 12 2 8 6"></polyline>
                    <line x1="12" y1="2" x2="12" y2="15"></line>
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Video Player Container */}
            <div style={{
              position: 'relative',
              aspectRatio: '16/9',
              width: '100%',
              borderRadius: '16px',
              overflow: 'hidden',
              backgroundColor: '#111827',
              boxShadow: '0 0 30px rgba(0, 0, 0, 0.3) inset',
              border: '1px solid rgba(55, 65, 81, 0.5)'
            }}>
              {/* Display debug info about current slide */}
              <div style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                backgroundColor: 'rgba(0,0,0,0.5)',
                color: 'white',
                padding: '4px 10px',
                borderRadius: '99px',
                fontSize: '12px',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: isPlaying ? '#10b981' : '#6b7280',
                  transition: 'background-color 0.3s ease'
                }}></div>
                Scene {currentSlide + 1} of {videoData.slides.length}
              </div>
              
              {/* Show all slides with animations and effects */}
              {videoData.slides.map((slide, index) => {
                // Generate random animation parameters for each slide
                const animations = [
                  'kenBurns', 'fadeZoomIn', 'slideLeft', 'slideUp', 'zoomOut'
                ];
                const randomAnimation = animations[index % animations.length];
                
                // Define animation keyframes for this slide
                let animationStyle = {};
                
                // Different animation for each slide
                switch(randomAnimation) {
                  case 'kenBurns':
                    // Ken Burns effect - slow pan and zoom
                    animationStyle = {
                      animation: isPlaying && currentSlide === index ? 
                        'kenBurns 20s ease-in-out infinite alternate' : 'none',
                    };
                    break;
                  case 'fadeZoomIn':
                    // Fade and zoom in
                    animationStyle = {
                      animation: isPlaying && currentSlide === index ? 
                        'fadeZoomIn 16s ease-in-out infinite' : 'none',
                    };
                    break;
                  case 'slideLeft':
                    // Slide from right to left
                    animationStyle = {
                      animation: isPlaying && currentSlide === index ? 
                        'slideLeft 25s linear infinite' : 'none',
                    };
                    break;
                  case 'slideUp':
                    // Slide from bottom to top
                    animationStyle = {
                      animation: isPlaying && currentSlide === index ? 
                        'slideUp 20s linear infinite' : 'none',
                    };
                    break;
                  case 'zoomOut':
                    // Slow zoom out
                    animationStyle = {
                      animation: isPlaying && currentSlide === index ? 
                        'zoomOut 18s ease-in-out infinite' : 'none',
                    };
                    break;
                  default:
                    // No animation
                    animationStyle = {};
                }
                
                // Slide transition effect
                const slideTransitionStyle = {
                  opacity: currentSlide === index ? 1 : 0,
                  transform: `scale(${currentSlide === index ? 1 : 1.05})`,
                  transition: 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1)',
                };
                
                return (
                  <div 
                    key={index}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      overflow: 'hidden',
                      ...slideTransitionStyle
                    }}
                  >
                    {/* Image with animation effect */}
                    <div style={{
                      width: '100%',
                      height: '100%',
                      overflow: 'hidden',
                    }}>
                      <img 
                        src={slide.imageUrl}
                        alt={`Slide ${index + 1}`}
                        onLoad={() => handleImageLoad(index)}
                        onError={() => handleImageError(index)}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          ...animationStyle
                        }}
                      />
                    </div>
                    
                    {/* Fallback for broken images */}
                    {imagesLoaded[index] === false && (
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#1f2937',
                        color: 'white',
                        fontSize: '18px'
                      }}>
                        <div>
                          <p style={{textAlign: 'center', marginBottom: '8px'}}>Image could not be loaded</p>
                          <p style={{textAlign: 'center', fontSize: '14px'}}>{slide.imageUrl.substring(0, 50)}...</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Animated Word-by-Word Caption */}
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.7) 60%, transparent 100%)',
                      color: 'white',
                      padding: '40px 30px 24px',
                      textAlign: 'center',
                      animation: currentSlide === index ? 'captionFadeIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'none',
                      opacity: currentSlide === index ? 1 : 0, // Start invisible for the animation
                      transform: currentSlide === index ? 'translateY(0)' : 'translateY(20px)', // Start slightly below for the animation
                      fontSize: '1.15rem',
                      fontWeight: '500',
                      letterSpacing: '0.01em',
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                      transition: 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}>
                      {slide.caption.split(' ').map((word, wordIndex) => {
                        // Calculate timing for word display
                        // Only active when playing and on current slide
                        const isCurrentSlide = currentSlide === index;
                        const audioDuration = audioRef.current?.duration || 0;
                        const totalSlides = videoData.slides.length;
                        const slideDuration = audioDuration / totalSlides;
                        const slideStartTime = currentSlide * slideDuration;
                        const slideElapsedTime = audioTime - slideStartTime;
                        
                        // Estimate words per slide
                        const wordsInCaption = slide.caption.split(' ').length;
                        const timePerWord = slideDuration / (wordsInCaption + 2); // +2 for margin
                        
                        // Determine if word should be visible based on audio progress
                        const shouldBeVisible = isPlaying && isCurrentSlide && 
                          (slideElapsedTime >= timePerWord * wordIndex);
                          
                        const wordJustAppeared = isPlaying && isCurrentSlide && 
                          Math.abs(slideElapsedTime - (timePerWord * wordIndex)) < 0.2;
                        
                        // Word appearance style
                        return (
                          <span 
                            key={wordIndex}
                            style={{
                              display: 'inline-block',
                              margin: '0 4px',
                              opacity: shouldBeVisible ? 1 : 0.3,
                              transform: shouldBeVisible ? 'scale(1)' : 'scale(0.95)',
                              transition: 'opacity 0.3s ease, transform 0.3s ease',
                              color: shouldBeVisible ? 'white' : 'rgba(255,255,255,0.6)',
                              fontWeight: shouldBeVisible ? '600' : '400',
                              textShadow: shouldBeVisible ? 
                                '0 0 8px rgba(255,255,255,0.5), 0 2px 4px rgba(0,0,0,0.5)' : 'none',
                              animation: wordJustAppeared ? 'wordAppear 0.6s forwards, highlightPulse 2s infinite' : 'none'
                            }}
                          >
                            {word}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              
              {/* Play button */}
              <button 
                onClick={togglePlayback}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255,255,255,0.5)',
                  borderRadius: '50%',
                  width: '80px',
                  height: '80px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 50,
                  transition: 'all 0.3s ease',
                  boxShadow: '0 0 30px rgba(0,0,0,0.3)'
                }}
              >
                {isPlaying ? (
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="6" y="4" width="4" height="16" fill="white"/>
                    <rect x="14" y="4" width="4" height="16" fill="white"/>
                  </svg>
                ) : (
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{
                    marginLeft: '5px'
                  }}>
                    <polygon points="5,3 19,12 5,21" fill="white"/>
                  </svg>
                )}
              </button>
              
              {/* Hidden audio element */}
              <audio 
                ref={audioRef}
                src={videoData.videoUrl}
                onEnded={handleAudioEnd}
                style={{display: 'none'}}
                controls
              />
              
              {/* Progress bar */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '4px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: audioRef.current ? `${(audioRef.current.currentTime / audioRef.current.duration) * 100}%` : '0%',
                  background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                  transition: 'width 0.1s linear'
                }}></div>
              </div>
            </div>
            
            {/* Video Controls */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              margin: '30px 0 15px'
            }}>
              <button
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.currentTime = 0;
                    setCurrentSlide(0);
                    if (isPlaying) {
                      audioRef.current.play().catch(err => console.error("Error playing audio:", err));
                    }
                  }
                }}
                style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  color: '#fff',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
                  boxShadow: '0 6px 15px -3px rgba(59, 130, 246, 0.3)',
                }}
              >
                <span style={{ marginRight: '8px', display: 'inline-flex' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="19 20 9 12 19 4 19 20"></polygon>
                    <line x1="5" y1="19" x2="5" y2="5"></line>
                  </svg>
                </span>
                Restart
              </button>
              
              <button
                onClick={togglePlayback}
                style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  color: '#fff',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  boxShadow: '0 6px 15px -3px rgba(124, 58, 237, 0.3)',
                }}
              >
                <span style={{ marginRight: '8px', display: 'inline-flex' }}>
                  {isPlaying ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="6" y="4" width="4" height="16"/>
                      <rect x="14" y="4" width="4" height="16"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="5,3 19,12 5,21"/>
                    </svg>
                  )}
                </span>
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              
              <button
                onClick={() => {
                  const downloadLink = document.createElement('a');
                  downloadLink.href = videoData.videoUrl;
                  downloadLink.download = `${topic.replace(/\s+/g, '_')}_audio.mp3`;
                  document.body.appendChild(downloadLink);
                  downloadLink.click();
                  document.body.removeChild(downloadLink);
                }}
                style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  color: '#fff',
                  background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                  boxShadow: '0 6px 15px -3px rgba(16, 185, 129, 0.3)',
                }}
              >
                <span style={{ marginRight: '8px', display: 'inline-flex' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                </span>
                Download Audio
              </button>
            </div>
            
            {/* Thumbnails */}
            <div style={{
              marginTop: '20px',
              padding: '10px 0',
              overflow: 'hidden'
            }}>
              <div style={{
                display: 'flex',
                overflowX: 'auto',
                gap: '8px',
                paddingBottom: '10px',
                maskImage: 'linear-gradient(to right, transparent, black 10px, black calc(100% - 10px), transparent)',
                WebkitMaskImage: 'linear-gradient(to right, transparent, black 10px, black calc(100% - 10px), transparent)',
                scrollbarWidth: 'none',  // Firefox
                scrollbarColor: 'rgba(255,255,255,0.2) transparent', // Firefox
                msOverflowStyle: 'none',  // IE/Edge
              }}>
                {videoData.slides.map((slide, index) => (
                  <button
                    key={index}
                    onClick={() => selectSlide(index)}
                    style={{
                      flexShrink: 0,
                      width: '140px',
                      height: '80px',
                      border: 'none',
                      padding: 0,
                      background: 'none',
                      cursor: 'pointer',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      position: 'relative',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div style={{
                      position: 'absolute',
                      top: '0',
                      left: '0',
                      right: '0',
                      bottom: '0',
                      border: currentSlide === index ? '3px solid #6366f1' : '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '8px',
                      boxShadow: currentSlide === index ? '0 0 0 3px rgba(99,102,241,0.3)' : 'none',
                      transition: 'all 0.3s ease',
                      zIndex: 2
                    }}></div>
                    
                    <img 
                      src={slide.imageUrl}
                      alt={`Thumbnail ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        filter: currentSlide !== index ? 'brightness(0.7)' : 'brightness(1)',
                        transition: 'all 0.3s ease'
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="140" height="80" viewBox="0 0 140 80"%3E%3Crect width="140" height="80" fill="%23374151"/%3E%3Ctext x="70" y="40" font-family="system-ui" font-size="12" text-anchor="middle" alignment-baseline="middle" fill="%236b7280"%3EThumbnail %3C/text%3E%3C/svg%3E';
                      }}
                    />
                    
                    <div style={{
                      position: 'absolute',
                      bottom: '5px',
                      left: '0',
                      right: '0',
                      textAlign: 'center',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: '600',
                      textShadow: '0 1px 3px rgba(0,0,0,0.7)',
                      zIndex: 1
                    }}>
                      {index + 1}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Floating Particles */}
            <div className="particles-container"></div>
          </div>
        )}
        
        {/* Inspiration Panel */}
        {showInspiration && !videoData && !loading && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.5)',
            borderRadius: '24px',
            padding: '30px',
            boxShadow: '0 20px 60px -15px rgba(0, 0, 0, 0.05)',
            marginBottom: '30px',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(10px)',
            animation: 'fadeIn 1s forwards',
            animationDelay: '0.5s',
            opacity: 0
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '20px'
            }}>
              <div style={{
                minWidth: '50px',
                height: '50px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
              </div>
              
              <div>
                <h3 style={{
                  margin: '0 0 10px 0',
                  color: '#1f2937',
                  fontSize: '1.25rem',
                  fontWeight: '600'
                }}>
                  Ready to create your first educational video?
                </h3>
                <p style={{
                  margin: '0 0 15px 0',
                  color: '#4b5563',
                  fontSize: '15px',
                  lineHeight: '1.6'
                }}>
                  Enter any educational topic above and watch as AI transforms it into a cinematic experience 
                  with stunning visuals, professional narration, and engaging animations.
                </p>
                <div style={{
                  display: 'flex',
                  gap: '15px',
                  flexWrap: 'wrap'
                }}>
                  {["Quantum Physics", "French Revolution", "Photosynthesis", "Climate Change", "Machine Learning"].map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setTopic(suggestion);
                        // Scroll to form
                        document.querySelector('form').scrollIntoView({ behavior: 'smooth' });
                      }}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '99px',
                        fontSize: '14px',
                        fontWeight: '500',
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        color: '#4f46e5',
                        border: '1px solid rgba(99, 102, 241, 0.2)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Footer */}
        <footer style={{
          textAlign: 'center',
          marginTop: '40px',
          padding: '20px',
          color: '#6b7280',
          fontSize: '14px',
          animation: 'fadeIn 1s forwards',
          animationDelay: '1s',
          opacity: 0
        }}>
          <p>
            Cinematic Education Studio • AI-Powered Video Creation
          </p>
        </footer>
      </div>
    </div>
  );
}