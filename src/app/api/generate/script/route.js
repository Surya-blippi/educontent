import axios from 'axios';

export const runtime = 'edge'; // Use Edge Function runtime

export async function POST(request) {
  try {
    const { topic } = await request.json();

    if (!topic || typeof topic !== 'string') {
      return new Response(JSON.stringify({ error: 'Valid topic is required' }), { 
        status: 400, 
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if API key exists
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('Missing GEMINI_API_KEY environment variable');
      return new Response(JSON.stringify({ 
        error: 'Server configuration error: Missing API key',
        details: 'The GEMINI_API_KEY environment variable is not configured'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Gemini API endpoint
    const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    // Create prompt for generating educational content
    const prompt = `I want to create a 30-45 seconds educational video on "${topic}". 
    It should be really insightful, helping in understanding the concept.
    
    Give me a structured response with:
    1. 3-5 image prompts (one per key segment of the content)
    2. Corresponding voiceover script for each segment (15-20 seconds total)
    3. The full voiceover script combined
    
    Format the response as a JSON object with:
    {
      "imagePrompts": ["prompt1", "prompt2", ...],
      "segments": [
        {"imageIndex": 0, "voiceover": "script for first segment"},
        {"imageIndex": 1, "voiceover": "script for second segment"},
        ...
      ],
      "voiceoverScript": "full script"
    }
    
    Please maintain design consistency and flow between images. Make the prompts detailed for high-quality AI image generation. The content should be educational and accurate.`;

    try {
      // Make API request to Gemini with a timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 second timeout
      
      const response = await fetch(geminiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }
      
      // Process Gemini response
      const responseData = await response.json();
      const generatedText = responseData.candidates[0].content.parts[0].text;
      
      // Extract JSON from the text response
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const scriptData = JSON.parse(jsonMatch[0]);
          return new Response(JSON.stringify(scriptData), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          return new Response(JSON.stringify({ 
            error: 'Failed to parse script data',
            details: 'The AI generated invalid JSON'
          }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      } else {
        console.error('No valid JSON found in the response');
        return new Response(JSON.stringify({ 
          error: 'Failed to generate script data',
          details: 'The AI response did not contain valid JSON'
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    } catch (error) {
      console.error('API request error:', error.message);
      
      // Handle timeout error specifically
      if (error.name === 'AbortError') {
        return new Response(JSON.stringify({ 
          error: 'API request timed out',
          details: 'Try a simpler or shorter topic'
        }), {
          status: 504,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      return new Response(JSON.stringify({ 
        error: 'Failed to generate script',
        details: error.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('Script generation error:', error);
    return new Response(JSON.stringify({ 
      error: 'Server error',
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}