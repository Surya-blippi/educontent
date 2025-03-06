export default function ProgressBar({ progress }) {
    return (
      <div className="w-full bg-gray-200 rounded-full h-5 shadow-inner overflow-hidden">
        <div 
          className="bg-blue-600 h-5 rounded-full transition-all duration-500 ease-in-out flex items-center justify-center text-xs text-white font-medium" 
          style={{ width: `${progress}%` }}
        >
          {progress}%
        </div>
      </div>
    );
  }