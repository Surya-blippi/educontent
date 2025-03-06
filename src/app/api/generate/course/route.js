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

    // Create prompt for generating comprehensive course material
    const prompt = `Create a detailed, comprehensive course structure and content for learning about "${topic}". 
    
    The course should include complete educational content that allows a user to learn in a structured way.
    
    Format the response as a structured JSON object with:
    {
      "title": "Full Course Title",
      "description": "A comprehensive description of what the student will learn",
      "estimatedDuration": "Estimated time to complete the course (e.g., '4 weeks')",
      "prerequisites": ["List of prerequisites or 'None' if none"],
      "learningObjectives": ["List of 3-5 key learning objectives"],
      "modules": [
        {
          "moduleTitle": "Module 1: Introduction to ${topic}",
          "moduleDescription": "Detailed description of this module covering its purpose and what students will learn",
          "estimatedHours": "Estimated hours to complete this module",
          "lessons": [
            {
              "lessonTitle": "Lesson 1.1: Title",
              "lessonDescription": "Comprehensive description of this lesson (3-4 sentences)",
              "lessonContent": "Detailed educational content for this lesson (at least 250 words). This should include explanations, examples, and relevant information that would help a student learn this topic. Include important concepts, definitions, and applications.",
              "keyPoints": ["Key point 1 with explanation", "Key point 2 with explanation", "Key point 3 with explanation"],
              "activities": ["Activity 1 with detailed instructions", "Activity 2 with detailed instructions"],
              "practiceQuestions": [
                {
                  "question": "Practice question related to the lesson content?",
                  "answer": "Detailed answer with explanation"
                },
                {
                  "question": "Another practice question?",
                  "answer": "Detailed answer with explanation"
                }
              ]
            },
            // More lessons...
          ]
        },
        // More modules...
      ],
      "assessments": [
        {
          "title": "Assessment title",
          "description": "Detailed description of the assessment",
          "type": "Type (e.g., Quiz, Project, Essay)",
          "questions": [
            {
              "question": "Assessment question?",
              "answer": "Model answer or grading criteria",
              "points": "Point value"
            },
            // More questions...
          ]
        },
        // More assessments...
      ],
      "resources": [
        {
          "title": "Resource title",
          "description": "Detailed description of the resource and how it relates to the course",
          "type": "Type (e.g., Book, Website, Video)",
          "url": "URL if applicable (or 'N/A')"
        },
        // More resources...
      ]
    }
    
    Create a well-structured course with 3-5 modules, each containing 2-4 lessons with detailed content. 
    
    Make sure each lesson includes:
    1. Comprehensive educational content that teaches the topic effectively
    2. Concrete examples that illustrate concepts
    3. Clear explanations of key principles
    4. Practical activities that reinforce learning
    5. Practice questions with detailed answers
    
    The content should be educational, accurate, comprehensive, and presented in a logical learning progression.`;

    try {
      // Make API request to Gemini
      const response = await axios.post(geminiEndpoint, {
        contents: [{
          parts: [{ text: prompt }]
        }]
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 60000 // 60 second timeout for longer content generation
      });

      // Process Gemini response
      const generatedText = response.data.candidates[0].content.parts[0].text;
      
      // Extract JSON from the text response
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const courseData = JSON.parse(jsonMatch[0]);
          
          // Return course data with a simplified structure if it's too large
          const sizeEstimate = JSON.stringify(courseData).length;
          if (sizeEstimate > 5000000) { // If over ~5MB, simplify
            const simplifiedData = simplifyLargeContent(courseData);
            return new Response(JSON.stringify(simplifiedData), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          return new Response(JSON.stringify(courseData), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (parseError) {
          console.error('JSON parse error:', parseError, 'Text:', jsonMatch[0].substring(0, 200) + '...');
          return new Response(JSON.stringify({ 
            error: 'Failed to parse course data',
            details: 'The AI generated invalid JSON'
          }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      } else {
        console.error('No valid JSON found in the response:', generatedText.substring(0, 200) + '...');
        return new Response(JSON.stringify({ 
          error: 'Failed to generate course data',
          details: 'The AI response did not contain valid JSON'
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    } catch (error) {
      console.error('API request error:', error.message);
      if (error.response) {
        console.error('API response status:', error.response.status);
        console.error('API response data:', error.response.data);
      }
      
      return new Response(JSON.stringify({ 
        error: 'Failed to generate course content',
        details: error.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('Course generation error:', error);
    return new Response(JSON.stringify({ 
      error: 'Server error',
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Helper function to reduce content size if needed
function simplifyLargeContent(courseData) {
  // Create a copy to modify
  const simplified = JSON.parse(JSON.stringify(courseData));
  
  // Trim long text content
  simplified.modules.forEach(module => {
    module.lessons.forEach(lesson => {
      if (lesson.lessonContent && lesson.lessonContent.length > 1000) {
        lesson.lessonContent = lesson.lessonContent.substring(0, 1000) + '... (content truncated)';
      }
      
      // Simplify practice questions
      if (lesson.practiceQuestions && lesson.practiceQuestions.length > 3) {
        lesson.practiceQuestions = lesson.practiceQuestions.slice(0, 3);
      }
    });
  });
  
  // Simplify assessments
  if (simplified.assessments && simplified.assessments.length > 0) {
    simplified.assessments.forEach(assessment => {
      if (assessment.questions && assessment.questions.length > 5) {
        assessment.questions = assessment.questions.slice(0, 5);
      }
    });
  }
  
  return simplified;
}