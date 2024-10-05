import React from 'react';
import { Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#1a1a1a] to-[#333333] text-white py-10 mt-8 border-t border-[#444444] shadow-lg">
      <div className="container mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0 md:space-x-12">

          {/* GitHub Link */}
          <div className="flex flex-col items-center md:items-start">
            <a
              href="https://github.com/harikeshpandey/Landsat-Reflection-Data"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-[#ccde2c] hover:text-[#bfd012] transition-colors transform hover:scale-105 duration-200 ease-in-out"
            >
              <Github className="h-6 w-6 mr-3" />
              <span className="text-xl font-medium">GitHub Repository</span>
            </a>
            <p className="text-sm text-gray-400 mt-2">Explore the code and contribute to our project.</p>
          </div>

          {/* Team Members */}
          <div className="text-center md:text-right">
            <h4 className="text-2xl font-semibold mb-4 text-[#ccde2c]">Hackathon Team Members</h4>
            <ul className="space-y-2">
              <li className="text-lg flex items-center justify-center md:justify-end">
                <span className="inline-block w-2 h-2 rounded-full bg-[#ccde2c] mr-2"></span>Pranjay Dwivedi
              </li>
              <li className="text-lg flex items-center justify-center md:justify-end">
                <span className="inline-block w-2 h-2 rounded-full bg-[#ccde2c] mr-2"></span>Harikesh Pandey
              </li>
              <li className="text-lg flex items-center justify-center md:justify-end">
                <span className="inline-block w-2 h-2 rounded-full bg-[#ccde2c] mr-2"></span>Rachit Pandey
              </li>
              <li className="text-lg flex items-center justify-center md:justify-end">
                <span className="inline-block w-2 h-2 rounded-full bg-[#ccde2c] mr-2"></span>Naman Agarwal
              </li>
              <li className="text-lg flex items-center justify-center md:justify-end">
                <span className="inline-block w-2 h-2 rounded-full bg-[#ccde2c] mr-2"></span>Arunansh Bisht
              </li>
              <li className="text-lg flex items-center justify-center md:justify-end">
                <span className="inline-block w-2 h-2 rounded-full bg-[#ccde2c] mr-2"></span>Lokesh Bhatt
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="mt-10 border-t border-[#444444] pt-4 text-center text-sm text-gray-500">
          © 2024 Hackathon Team. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
