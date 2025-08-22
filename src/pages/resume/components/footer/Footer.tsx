import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 text-gray-800 py-20">
      <div className="container mx-auto px-4 text-center">
        <p className="text-2xl font-bold mb-4">Nguyen The Quyet</p>
        <p className="text-sm mb-6 max-w-xl mx-auto">
          I'm a software engineer with a passion for building scalable and efficient systems. I'm currently working on a project to help people learn how to code.
        </p>
        <div className="flex justify-center space-x-6 mb-6">
          <a href="#" className="hover:text-blue-500 transition-colors">
            <Facebook className="h-6 w-6" />
          </a>
          <a href="#" className="hover:text-blue-500 transition-colors">
            <Twitter className="h-6 w-6" />
          </a>
          <a href="#" className="hover:text-blue-500 transition-colors">
            <Instagram className="h-6 w-6" />
          </a>
          <a href="#" className="hover:text-blue-500 transition-colors">
            <Linkedin className="h-6 w-6" />
          </a>
        </div>
        <p className="text-sm mb-2">© 2025 Nguyen The Quyet. All rights reserved.</p>
        <p className="text-sm">No-code website by Nguyen The Quyet using Lovable, Cursor AI</p>
      </div>
    </footer>
  );
};

export default Footer; 