import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center bg-[#051a10]">
      <div className="w-20 h-20 rounded-2xl bg-amber-400/20 text-amber-400 flex items-center justify-center mb-6">
        <AlertTriangle className="w-10 h-10" />
      </div>
      <h1 className="text-5xl font-black text-white mb-3">404</h1>
      <p className="text-xl font-bold text-amber-400 mb-2">Page Not Found</p>
      <p className="text-sm text-emerald-300/80 max-w-md mb-8">
        The page you are looking for does not exist or has been moved. Explore our catalog of event equipment and graduation sashes.
      </p>
      <Link to="/">
        <button className="btn-gold text-sm py-3 px-8 flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Homepage</span>
        </button>
      </Link>
    </div>
  );
};

export default NotFound;
