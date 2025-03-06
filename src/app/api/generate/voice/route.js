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

    // Initialize Replicate
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // Generate voiceover using the correct parameter structure
    // The Kokoro model expects 'text' not 'prompt'
    const output = await replicate.run(
      "jaaari/kokoro-82m:f559560eb822dc509045f3921a1921234918b91739db4bf3daab2169b71c7a13",
      {
        input: {
          text: script,
          speaker: "en_speaker_1", // Change to desired speaker
          language: "en",
          temperature: 0.7,
          speed: 1.0
        }
      }
    );

    // Return the audio URL
    return new Response(JSON.stringify({ 
      audioUrl: output 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
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