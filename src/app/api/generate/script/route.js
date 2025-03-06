import axios from 'axios';

export async function POST(request) {
  try {
    const { topic } = await request.json();

    if (!topic || typeof topic !== 'string') {
      return new Response(JSON.stringify({ error: 'Valid topic is required' }), { 
        status: 400, 
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Gemini API endpoint
    const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

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

    // Make API request to Gemini
    const response = await axios.post(geminiEndpoint, {
      contents: [{
        parts: [{ text: prompt }]
      }]
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Process Gemini response
    let scriptData;
    try {
      // Get the generated content text from the Gemini response
      const generatedText = response.data.candidates[0].content.parts[0].text;
      
      // Extract JSON from the text response
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        scriptData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No valid JSON found in the response');
      }
    } catch (error) {
      console.error('Error parsing script data:', error);
      return new Response(JSON.stringify({ 
        error: 'Failed to generate script data',
        details: error.message 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(scriptData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Script generation error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to generate script',
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}