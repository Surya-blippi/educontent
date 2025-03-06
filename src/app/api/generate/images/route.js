import Replicate from 'replicate';

export async function POST(request) {
  try {
    const { imagePrompts } = await request.json();

    if (!imagePrompts || !Array.isArray(imagePrompts) || imagePrompts.length === 0) {
      return new Response(JSON.stringify({ error: 'Valid image prompts are required' }), { 
        status: 400, 
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if API key exists
    const replicateKey = process.env.REPLICATE_API_TOKEN;
    if (!replicateKey) {
      console.error('Missing REPLICATE_API_TOKEN environment variable');
      return new Response(JSON.stringify({ 
        error: 'Server configuration error: Missing API key',
        details: 'The REPLICATE_API_TOKEN environment variable is not configured'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log("Processing image prompts:", imagePrompts);

    try {
      // Initialize Replicate
      const replicate = new Replicate({
        auth: replicateKey,
      });

      // Generate images for each prompt (in parallel)
      const imagePromises = imagePrompts.map(async (prompt, index) => {
        console.log(`Generating image ${index + 1}:`, prompt);
        
        try {
          const output = await replicate.run(
            "ideogram-ai/ideogram-v2a-turbo",
            {
              input: {
                prompt: prompt,
                width: 1024,
                height: 576, // 16:9 aspect ratio
                steps: 30,
                guidance_scale: 7,
                negative_prompt: "blurry, low quality, distorted, malformed, poorly rendered, low resolution"
              }
            }
          );
          
          console.log(`Image ${index + 1} generated, output:`, output);
          
          // Handle different output formats
          if (Array.isArray(output) && output.length > 0) {
            return output[0]; // If output is array, take first element
          } else if (typeof output === 'string') {
            return output; // If output is already a string URL
          } else {
            console.error(`Unexpected output format for image ${index + 1}:`, output);
            // Use a placeholder with the prompt as text to aid debugging
            return `https://placehold.co/1024x576/EEE/999?text=Image+Generation+Error:+${encodeURIComponent(prompt.substring(0, 50))}`;
          }
        } catch (error) {
          console.error(`Error generating image ${index + 1}:`, error);
          return `https://placehold.co/1024x576/EEE/999?text=Image+Generation+Error`;
        }
      });

      // Wait for all image generation to complete with a timeout
      const imageUrls = await Promise.all(
        imagePromises.map(promise => 
          Promise.race([
            promise,
            new Promise(resolve => setTimeout(() => 
              resolve(`https://placehold.co/1024x576/EEE/999?text=Timeout+Error`), 
              30000 // 30 second timeout
            ))
          ])
        )
      );
      
      // Log the final URLs
      console.log("Final image URLs:", imageUrls);

      // Ensure we always have at least one image
      if (imageUrls.length === 0) {
        imageUrls.push("https://placehold.co/1024x576/EEE/999?text=No+Valid+Images+Generated");
      }

      return new Response(JSON.stringify({ 
        images: imageUrls,
        count: imageUrls.length
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
      
    } catch (error) {
      console.error('Replicate API error:', error);
      return new Response(JSON.stringify({ 
        error: 'Error connecting to Replicate API',
        details: error.message,
        images: Array(imagePrompts.length).fill(`https://placehold.co/1024x576/EEE/999?text=API+Error`)
      }), {
        status: 200, // Return 200 with placeholder images so the app continues
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('Image generation error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to generate images',
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}