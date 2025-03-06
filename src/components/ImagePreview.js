'use client';
import { useEffect, useState } from 'react';

export default function ImagePreview({ images, segments }) {
  const [error, setError] = useState(null);

  // For debugging
  useEffect(() => {
    console.log("Image URLs:", images);
  }, [images]);

  if (!images || images.length === 0) return null;

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Generated Images</h3>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded border border-red-200">
          Error loading images: {error}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {images.map((imageUrl, index) => (
          <div key={index} className="relative rounded-lg overflow-hidden shadow-md border border-gray-200">
            <img 
              src={imageUrl} 
              alt={`Generated image ${index + 1}`} 
              className="w-full aspect-video object-cover"
              onError={() => setError(`Failed to load image ${index + 1}`)}
            />
            {segments && segments[index] && (
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-3 text-sm">
                {segments[index].voiceover.substring(0, 80)}
                {segments[index].voiceover.length > 80 && '...'}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}