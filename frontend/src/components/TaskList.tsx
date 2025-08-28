'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, Download, RefreshCw, Clock, CheckCircle, XCircle } from 'lucide-react';
import { getTaskStatus, getUserTasks } from '@/lib/api';
import Link from 'next/link';

interface Task {
  id: string;
  originalName: string;
  status: 'uploaded' | 'processing' | 'completed' | 'failed';
  progress: number;
  flipbookUrl?: string;
  createdAt: string;
  errorMessage?: string;
}

interface TaskListProps {
  refreshTrigger: number;
}

export default function TaskList({ refreshTrigger }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const userTasks = await getUserTasks();
      setTasks(userTasks);
    } catch (error) {
      console.error('获取任务列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [refreshTrigger]);

  // 定期更新处理中的任务状态
  useEffect(() => {
    const processingTasks = tasks.filter(task => task.status === 'processing' || task.status === 'uploaded');
    
    if (processingTasks.length === 0) return;

    const interval = setInterval(async () => {
      for (const task of processingTasks) {
        try {
          const updatedTask = await getTaskStatus(task.id);
          setTasks(prev => prev.map(t => t.id === task.id ? { ...t, ...updatedTask } : t));
        } catch (error) {
          console.error(`更新任务状态失败 ${task.id}:`, error);
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [tasks]);

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'uploaded':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'processing':
        return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: Task['status']) => {
    switch (status) {
      case 'uploaded': return '已上传';
      case 'processing': return '转换中';
      case 'completed': return '已完成';
      case 'failed': return '转换失败';
      default: return '未知';
    }
  };

  if (loading) {
    return (
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">任务列表</h2>
        <div className="flex justify-center py-8">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">任务列表</h2>
        <button
          onClick={fetchTasks}
          className="btn-secondary flex items-center space-x-2"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>刷新</span>
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>暂无转换任务</p>
          <p className="text-sm mt-2">上传文档开始您的第一次转换</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(task.status)}
                  <div>
                    <h3 className="font-medium text-gray-800 truncate max-w-xs">
                      {task.originalName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {getStatusText(task.status)}
                      {task.status === 'processing' && ` (${task.progress}%)`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {task.status === 'completed' && task.flipbookUrl && (
                    <>
                      <Link href={`/flipbook/${task.id}`}>
                        <button className="btn-primary flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>预览</span>
                        </button>
                      </Link>
                      <button className="btn-secondary flex items-center space-x-1">
                        <Download className="w-4 h-4" />
                        <span>下载</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {task.status === 'processing' && (
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {task.status === 'failed' && task.errorMessage && (
                <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                  错误: {task.errorMessage}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}