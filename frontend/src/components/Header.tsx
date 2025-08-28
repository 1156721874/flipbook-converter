'use client';

import { BookOpen } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-800">FlipbookPro</span>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">首页</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">功能</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">定价</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">帮助</a>
          </nav>
        </div>
      </div>
    </header>
  );
}