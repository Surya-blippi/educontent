import Replicate from 'replicate';

export async function POST(request) {
  try {
    const { script } = await request.json();

    if (!script || typeof script !== 'string') {
      return new Response(JSON.stringify({ error: 'Valid script is required' }), { 
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

    try {
      // Initialize Replicate
      const replicate = new Replicate({
        auth: replicateKey,
      });

      // Generate voiceover
      console.log("Generating voiceover for script:", script.substring(0, 100) + "...");
      
      // Trim script if it's too long (some TTS models have length limits)
      const trimmedScript = script.length > 1000 ? script.substring(0, 1000) + "..." : script;
      
      const output = await replicate.run(
        "jaaari/kokoro-82m:f559560eb822dc509045f3921a1921234918b91739db4bf3daab2169b71c7a13",
        {
          input: {
            text: trimmedScript,
            speaker: "en_speaker_1", // Change to desired speaker
            language: "en",
            temperature: 0.7,
            speed: 1.0
          }
        }
      );

      console.log("Voiceover generated, output type:", typeof output);
      
      // Check if output is a valid URL
      let audioUrl = output;
      if (!output || typeof output !== 'string' || !output.startsWith('http')) {
        console.error("Invalid audio URL returned:", output);
        // Provide a fallback audio URL
        audioUrl = "https://audio-samples.github.io/samples/mp3/blizzard_biased/sample-1.mp3";
      }

      // Return the audio URL
      return new Response(JSON.stringify({ 
        audioUrl: audioUrl 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Voice generation error:', error);
      
      // Return a fallback audio to allow the app to continue
      return new Response(JSON.stringify({ 
        error: 'Failed to generate voiceover',
        details: error.message,
        audioUrl: "https://audio-samples.github.io/samples/mp3/blizzard_biased/sample-1.mp3" // Fallback audio
      }), {
        status: 200, // Return 200 with fallback so the app continues
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('Voice generation error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to generate voiceover',
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}