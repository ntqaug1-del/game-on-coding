import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-6 bg-white/80 backdrop-blur-md border-t border-orange-100">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-orange-900 text-sm">
            Developed with ❤️ by <span className="font-semibold">Quyet NT</span> + <span className="font-semibold">LLMS</span>
          </p>
          <p className="text-orange-700 text-xs mt-1">
            A collection of useful utilities for your daily needs
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 