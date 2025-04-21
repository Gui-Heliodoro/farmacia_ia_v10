import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="text-[#1e88e5] text-8xl font-bold mb-4">404</div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Page Not Found</h1>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link 
        to="/"
        className="inline-flex items-center px-4 py-2 bg-[#1e88e5] text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
      >
        <HomeIcon className="h-4 w-4 mr-2" />
        Return to Home
      </Link>
    </div>
  );
};

export default NotFound;