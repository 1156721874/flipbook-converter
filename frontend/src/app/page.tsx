'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import FileUpload from '@/components/FileUpload';
import TaskList from '@/components/TaskList';
import Header from '@/components/Header';

export default function Home() {
  const [refreshTasks, setRefreshTasks] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshTasks(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
            文档转
            <span className="text-blue-600">Flipbook</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            将您的PDF、PPT、Word文档转换为精美的交互式翻页书，支持在线预览和分享
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <FileUpload onUploadSuccess={handleUploadSuccess} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <TaskList refreshTrigger={refreshTasks} />
          </motion.div>
        </div>
      </main>
    </div>
  );
}