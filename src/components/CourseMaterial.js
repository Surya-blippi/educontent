'use client';

import { useState } from 'react';

export default function CourseMaterial({ courseData }) {
  const [expandedModules, setExpandedModules] = useState({});
  const [expandedLessons, setExpandedLessons] = useState({});
  
  // Toggle module expansion
  const toggleModule = (moduleIndex) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleIndex]: !prev[moduleIndex]
    }));
  };
  
  // Toggle lesson expansion
  const toggleLesson = (moduleIndex, lessonIndex) => {
    const key = `${moduleIndex}-${lessonIndex}`;
    setExpandedLessons(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  if (!courseData) return null;
  
  return (
    <div style={{
      background: 'white',
      borderRadius: '24px',
      boxShadow: '0 20px 60px -15px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      border: '1px solid rgba(229, 231, 235, 0.5)',
      marginBottom: '30px',
    }}>
      {/* Course Header */}
      <div style={{
        background: 'linear-gradient(135deg, #4f46e5, #7c3aed, #3b82f6)',
        padding: '30px',
        color: 'white',
      }}>
        <h2 style={{
          margin: '0 0 10px 0',
          fontSize: '28px',
          fontWeight: '700',
        }}>
          {courseData.title}
        </h2>
        
        <p style={{
          margin: '0 0 20px 0',
          fontSize: '16px',
          lineHeight: '1.6',
          opacity: '0.9',
        }}>
          {courseData.description}
        </p>
        
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          marginTop: '20px',
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.2)',
            padding: '8px 16px',
            borderRadius: '99px',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            {courseData.estimatedDuration}
          </div>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.2)',
            padding: '8px 16px',
            borderRadius: '99px',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="20" y1="8" x2="20" y2="14"></line>
              <line x1="23" y1="11" x2="17" y2="11"></line>
            </svg>
            {courseData.prerequisites && courseData.prerequisites.length > 0 ? 
              `Prerequisites: ${courseData.prerequisites.join(', ')}` : 
              'No prerequisites'
            }
          </div>
        </div>
      </div>
      
      {/* Learning Objectives */}
      <div style={{
        padding: '30px',
        borderBottom: '1px solid rgba(229, 231, 235, 0.5)',
      }}>
        <h3 style={{
          margin: '0 0 15px 0',
          fontSize: '20px',
          fontWeight: '600',
          color: '#1f2937',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          Learning Objectives
        </h3>
        
        <ul style={{
          margin: '0',
          padding: '0 0 0 10px',
          listStyle: 'none',
        }}>
          {courseData.learningObjectives.map((objective, index) => (
            <li key={index} style={{
              margin: '0 0 10px 0',
              padding: '0 0 0 30px',
              position: 'relative',
              lineHeight: '1.5',
              color: '#4b5563',
            }}>
              <div style={{
                position: 'absolute',
                left: '0',
                top: '2px',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: 'rgba(79, 70, 229, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#4f46e5',
                fontSize: '12px',
                fontWeight: '700',
              }}>
                {index + 1}
              </div>
              {objective}
            </li>
          ))}
        </ul>
      </div>
      
      {/* Course Modules */}
      <div style={{
        padding: '10px 30px 30px',
      }}>
        <h3 style={{
          margin: '20px 0 15px 0',
          fontSize: '20px',
          fontWeight: '600',
          color: '#1f2937',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
            <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
          </svg>
          Course Content
        </h3>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
        }}>
          {courseData.modules.map((module, moduleIndex) => (
            <div key={moduleIndex} style={{
              border: '1px solid rgba(229, 231, 235, 0.8)',
              borderRadius: '12px',
              overflow: 'hidden',
              background: 'white',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            }}>
              {/* Module Header */}
              <div 
                onClick={() => toggleModule(moduleIndex)}
                style={{
                  padding: '15px 20px',
                  background: expandedModules[moduleIndex] ? 
                    'linear-gradient(to right, rgba(79, 70, 229, 0.05), rgba(124, 58, 237, 0.05))' : 
                    'white',
                  borderBottom: expandedModules[moduleIndex] ? 
                    '1px solid rgba(229, 231, 235, 0.8)' : 
                    'none',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{
                  display: 'flex',
                  gap: '15px',
                  alignItems: 'center',
                }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'rgba(79, 70, 229, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#4f46e5',
                    fontSize: '14px',
                    fontWeight: '700',
                    flexShrink: 0,
                  }}>
                    {moduleIndex + 1}
                  </div>
                  
                  <div>
                    <h4 style={{
                      margin: '0 0 4px 0',
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1f2937',
                    }}>
                      {module.moduleTitle}
                    </h4>
                    
                    <div style={{
                      fontSize: '14px',
                      color: '#6b7280',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}>
                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                        </svg>
                        {module.estimatedHours}
                      </span>
                      
                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="9" y1="3" x2="9" y2="21"></line>
                        </svg>
                        {module.lessons.length} lessons
                      </span>
                    </div>
                  </div>
                </div>
                
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="#6b7280" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  style={{
                    transform: expandedModules[moduleIndex] ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',
                  }}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
              
              {/* Module Content (Lessons) */}
              {expandedModules[moduleIndex] && (
                <div style={{
                  padding: '5px 20px 15px',
                }}>
                  {module.moduleDescription && (
                    <p style={{
                      margin: '10px 0 15px 43px',
                      fontSize: '14px',
                      color: '#6b7280',
                      lineHeight: '1.5',
                    }}>
                      {module.moduleDescription}
                    </p>
                  )}
                  
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    marginLeft: '43px',
                  }}>
                    {module.lessons.map((lesson, lessonIndex) => (
                      <div key={lessonIndex} style={{
                        border: '1px solid rgba(229, 231, 235, 0.8)',
                        borderRadius: '8px',
                        overflow: 'hidden',
                      }}>
                        {/* Lesson Header */}
                        <div 
                          onClick={() => toggleLesson(moduleIndex, lessonIndex)}
                          style={{
                            padding: '12px 15px',
                            background: expandedLessons[`${moduleIndex}-${lessonIndex}`] ? 
                              'rgba(79, 70, 229, 0.03)' : 
                              'white',
                            borderBottom: expandedLessons[`${moduleIndex}-${lessonIndex}`] ? 
                              '1px solid rgba(229, 231, 235, 0.8)' : 
                              'none',
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <div style={{
                            display: 'flex',
                            gap: '10px',
                            alignItems: 'center',
                          }}>
                            <div style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '6px',
                              background: 'rgba(79, 70, 229, 0.05)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#6366f1',
                              fontSize: '12px',
                              fontWeight: '700',
                              flexShrink: 0,
                            }}>
                              {moduleIndex + 1}.{lessonIndex + 1}
                            </div>
                            
                            <h5 style={{
                              margin: '0',
                              fontSize: '15px',
                              fontWeight: '600',
                              color: '#374151',
                            }}>
                              {lesson.lessonTitle}
                            </h5>
                          </div>
                          
                          <svg 
                            width="14" 
                            height="14" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="#6b7280" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                            style={{
                              transform: expandedLessons[`${moduleIndex}-${lessonIndex}`] ? 
                                'rotate(180deg)' : 
                                'rotate(0deg)',
                              transition: 'transform 0.3s ease',
                            }}
                          >
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </div>
                        
                        {/* Lesson Content */}
                        {expandedLessons[`${moduleIndex}-${lessonIndex}`] && (
                          <div style={{
                            padding: '15px',
                          }}>
                            {lesson.lessonDescription && (
                              <p style={{
                                margin: '0 0 15px 0',
                                fontSize: '14px',
                                color: '#6b7280',
                                lineHeight: '1.5',
                              }}>
                                {lesson.lessonDescription}
                              </p>
                            )}
                            
                            {/* Lesson Content */}
                            {lesson.lessonContent && (
                              <div style={{
                                margin: '0 0 20px 0',
                                padding: '16px',
                                backgroundColor: 'rgba(249, 250, 251, 0.8)',
                                borderRadius: '8px',
                                border: '1px solid #e5e7eb',
                              }}>
                                <h6 style={{
                                  margin: '0 0 10px 0',
                                  fontSize: '14px',
                                  fontWeight: '600',
                                  color: '#374151',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                }}>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                                  </svg>
                                  Lesson Content
                                </h6>
                                <div style={{
                                  fontSize: '14px',
                                  color: '#4b5563',
                                  lineHeight: '1.6',
                                  whiteSpace: 'pre-line',
                                }}>
                                  {lesson.lessonContent}
                                </div>
                              </div>
                            )}
                            
                            {/* Key Points */}
                            {lesson.keyPoints && lesson.keyPoints.length > 0 && (
                              <div style={{
                                margin: '0 0 20px 0',
                              }}>
                                <h6 style={{
                                  margin: '0 0 10px 0',
                                  fontSize: '14px',
                                  fontWeight: '600',
                                  color: '#374151',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                }}>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"></path>
                                    <path d="M3 9h4l2 11H3"></path>
                                  </svg>
                                  Key Points
                                </h6>
                                
                                <ul style={{
                                  margin: '0',
                                  padding: '0 0 0 10px',
                                  listStyle: 'none',
                                }}>
                                  {lesson.keyPoints.map((point, pointIndex) => (
                                    <li key={pointIndex} style={{
                                      margin: '0 0 12px 0',
                                      padding: '10px 10px 10px 18px',
                                      position: 'relative',
                                      fontSize: '13px',
                                      color: '#4b5563',
                                      lineHeight: '1.5',
                                      backgroundColor: 'rgba(243, 244, 246, 0.7)',
                                      borderRadius: '6px',
                                      border: '1px solid #e5e7eb',
                                    }}>
                                      <div style={{
                                        position: 'absolute',
                                        left: '8px',
                                        top: '14px',
                                        width: '6px',
                                        height: '6px',
                                        borderRadius: '50%',
                                        background: '#6366f1',
                                      }}></div>
                                      {point}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {/* Practice Questions */}
                            {lesson.practiceQuestions && lesson.practiceQuestions.length > 0 && (
                              <div style={{
                                margin: '0 0 20px 0',
                              }}>
                                <h6 style={{
                                  margin: '0 0 10px 0',
                                  fontSize: '14px',
                                  fontWeight: '600',
                                  color: '#374151',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                }}>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                  </svg>
                                  Practice Questions
                                </h6>
                                
                                <div style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '16px',
                                }}>
                                  {lesson.practiceQuestions.map((qa, qaIndex) => (
                                    <div key={qaIndex} style={{
                                      borderRadius: '8px',
                                      overflow: 'hidden',
                                      border: '1px solid #e5e7eb',
                                    }}>
                                      <div style={{
                                        padding: '12px 15px',
                                        backgroundColor: 'rgba(79, 70, 229, 0.05)',
                                        borderBottom: '1px solid #e5e7eb',
                                        fontWeight: '600',
                                        fontSize: '13px',
                                        color: '#4b5563',
                                      }}>
                                        Q{qaIndex + 1}: {qa.question}
                                      </div>
                                      <div style={{
                                        padding: '12px 15px',
                                        fontSize: '13px',
                                        color: '#4b5563',
                                        backgroundColor: 'white',
                                      }}>
                                        <div style={{
                                          fontWeight: '500',
                                          marginBottom: '4px',
                                          color: '#059669',
                                        }}>
                                          Answer:
                                        </div>
                                        {qa.answer}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {/* Activities */}
                            {lesson.activities && lesson.activities.length > 0 && (
                              <div>
                                <h6 style={{
                                  margin: '0 0 10px 0',
                                  fontSize: '14px',
                                  fontWeight: '600',
                                  color: '#374151',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                }}>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9"></path>
                                    <path d="M13 2v7h7"></path>
                                  </svg>
                                  Learning Activities
                                </h6>
                                
                                <div style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '12px',
                                }}>
                                  {lesson.activities.map((activity, activityIndex) => (
                                    <div key={activityIndex} style={{
                                      padding: '12px 15px',
                                      backgroundColor: 'rgba(139, 92, 246, 0.05)',
                                      borderRadius: '8px',
                                      border: '1px solid rgba(139, 92, 246, 0.2)',
                                      fontSize: '13px',
                                      color: '#4b5563',
                                      lineHeight: '1.5',
                                    }}>
                                      <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        marginBottom: '8px',
                                        fontWeight: '600',
                                        color: '#7c3aed',
                                      }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                                        </svg>
                                        Activity {activityIndex + 1}
                                      </div>
                                      {activity}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Assessments & Resources */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        padding: '0 30px 30px',
      }}>
        {/* Assessments */}
        {courseData.assessments && courseData.assessments.length > 0 && (
          <div style={{
            background: 'rgba(79, 70, 229, 0.03)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(79, 70, 229, 0.1)',
          }}>
            <h3 style={{
              margin: '0 0 15px 0',
              fontSize: '18px',
              fontWeight: '600',
              color: '#1f2937',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                <path d="M9 14l2 2 4-4"></path>
              </svg>
              Assessments
            </h3>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}>
              {courseData.assessments.map((assessment, index) => (
                <div key={index} style={{
                  padding: '12px 15px',
                  background: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                  border: '1px solid rgba(229, 231, 235, 0.8)',
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px',
                  }}>
                    <h5 style={{
                      margin: '0',
                      fontSize: '15px',
                      fontWeight: '600',
                      color: '#374151',
                    }}>
                      {assessment.title}
                    </h5>
                    
                    <span style={{
                      fontSize: '12px',
                      padding: '3px 8px',
                      borderRadius: '99px',
                      background: 'rgba(79, 70, 229, 0.1)',
                      color: '#4f46e5',
                      fontWeight: '500',
                    }}>
                      {assessment.type}
                    </span>
                  </div>
                  
                  <p style={{
                    margin: '0 0 12px 0',
                    fontSize: '13px',
                    color: '#6b7280',
                    lineHeight: '1.5',
                  }}>
                    {assessment.description}
                  </p>
                  
                  {assessment.questions && assessment.questions.length > 0 && (
                    <div style={{
                      margin: '12px 0 0 0',
                    }}>
                      <div style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#4b5563',
                        padding: '4px 0',
                        borderBottom: '1px solid #e5e7eb',
                        marginBottom: '8px',
                      }}>
                        Sample Questions
                      </div>
                      
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                      }}>
                        {assessment.questions.slice(0, 2).map((question, qIndex) => (
                          <div key={qIndex} style={{
                            fontSize: '12px',
                            color: '#4b5563',
                            padding: '8px',
                            backgroundColor: 'rgba(249, 250, 251, 0.8)',
                            borderRadius: '6px',
                          }}>
                            <div style={{
                              fontWeight: '500',
                              marginBottom: '4px',
                            }}>
                              Q: {question.question}
                              {question.points && (
                                <span style={{
                                  fontSize: '11px',
                                  color: '#6366f1',
                                  marginLeft: '8px',
                                }}>
                                  ({question.points} pts)
                                </span>
                              )}
                            </div>
                            <div style={{
                              fontSize: '12px',
                              color: '#6b7280',
                              fontStyle: 'italic',
                            }}>
                              {question.answer && question.answer.length > 100 ? 
                                question.answer.substring(0, 100) + '...' : 
                                question.answer}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {assessment.questions.length > 2 && (
                        <div style={{
                          fontSize: '12px',
                          color: '#6b7280',
                          textAlign: 'center',
                          marginTop: '8px',
                          fontStyle: 'italic',
                        }}>
                          +{assessment.questions.length - 2} more questions
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Resources */}
        {courseData.resources && courseData.resources.length > 0 && (
          <div style={{
            background: 'rgba(59, 130, 246, 0.03)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(59, 130, 246, 0.1)',
          }}>
            <h3 style={{
              margin: '0 0 15px 0',
              fontSize: '18px',
              fontWeight: '600',
              color: '#1f2937',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
              Additional Resources
            </h3>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}>
              {courseData.resources.map((resource, index) => (
                <div key={index} style={{
                  padding: '12px 15px',
                  background: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                  border: '1px solid rgba(229, 231, 235, 0.8)',
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px',
                  }}>
                    <h5 style={{
                      margin: '0',
                      fontSize: '15px',
                      fontWeight: '600',
                      color: '#374151',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}>
                      {resource.type === 'Book' && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                        </svg>
                      )}
                      {resource.type === 'Website' && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="2" y1="12" x2="22" y2="12"></line>
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                        </svg>
                      )}
                      {resource.type === 'Video' && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                          <line x1="7" y1="2" x2="7" y2="22"></line>
                          <line x1="17" y1="2" x2="17" y2="22"></line>
                          <line x1="2" y1="12" x2="22" y2="12"></line>
                          <line x1="2" y1="7" x2="7" y2="7"></line>
                          <line x1="2" y1="17" x2="7" y2="17"></line>
                          <line x1="17" y1="17" x2="22" y2="17"></line>
                          <line x1="17" y1="7" x2="22" y2="7"></line>
                        </svg>
                      )}
                      {resource.type !== 'Book' && resource.type !== 'Website' && resource.type !== 'Video' && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                      )}
                      {resource.title}
                    </h5>
                    
                    <span style={{
                      fontSize: '12px',
                      padding: '3px 8px',
                      borderRadius: '99px',
                      background: 'rgba(59, 130, 246, 0.1)',
                      color: '#3b82f6',
                      fontWeight: '500',
                    }}>
                      {resource.type}
                    </span>
                  </div>
                  
                  <p style={{
                    margin: '0 0 8px 0',
                    fontSize: '13px',
                    color: '#6b7280',
                    lineHeight: '1.5',
                  }}>
                    {resource.description}
                  </p>
                  
                  {resource.url && resource.url !== 'N/A' && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      marginTop: '8px',
                    }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                      </svg>
                      <a 
                        href={resource.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{
                          fontSize: '12px',
                          color: '#3b82f6',
                          textDecoration: 'none',
                          fontWeight: '500',
                        }}
                      >
                        View Resource
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}