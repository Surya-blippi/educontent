import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { images, audio, script, segments } = await request.json();
    
    console.log("Video API received:", {
      imageCount: images?.length,
      audioUrl: audio,
      segmentCount: segments?.length
    });
    
    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json({ error: 'Valid images are required' }, { status: 400 });
    }
    
    if (!audio || typeof audio !== 'string') {
      return NextResponse.json({ error: 'Valid audio URL is required' }, { status: 400 });
    }

    // Create a simpler data structure for the slideshow
    const slides = images.map((imageUrl, index) => {
      return {
        imageUrl,
        caption: segments && segments[index] ? segments[index].voiceover : "",
        duration: segments && segments.length > 0 
          ? Math.floor(30 / segments.length) // Distribute time evenly
          : 5 // Default 5 seconds per slide
      };
    });

    // Return data for the client to render as a slideshow
    return NextResponse.json({
      videoUrl: audio, // Audio track URL
      thumbnailUrl: images[0], // First image as thumbnail
      images: images, // All images in sequence
      slides: slides, // Slide data with captions and timing
    });
    
  } catch (error) {
    console.error('Video generation error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate video',
      details: error.message
    }, { status: 500 });
  }
}