'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ZoomIn, ZoomOut, Download, Share2, Home } from 'lucide-react';
import Link from 'next/link';
import FlipbookViewer from '@/components/FlipbookViewer';
import { getFlipbookData } from '@/lib/api';
import toast from 'react-hot-toast';

interface FlipbookPage {
  page: number;
  url: string;
  thumbnailUrl?: string;
}

interface FlipbookData {
  taskId: string;
  title: string;
  totalPages: number;
  pages: FlipbookPage[];
  createdAt: string;
}

export default function FlipbookPage() {
  const params = useParams();
  const flipbookId = params?.id as string;
  
  const [flipbookData, setFlipbookData] = useState<FlipbookData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (!flipbookId) return;

    const fetchFlipbook = async () => {
      try {
        setLoading(true);
        const data = await getFlipbookData(flipbookId);
        setFlipbookData(data);
      } catch (err: any) {
        setError(err.message || '加载Flipbook失败');
      } finally {
        setLoading(false);
      }
    };

    fetchFlipbook();
  }, [flipbookId]);

  const handleShare = async () => {
    try {
      await navigator.share({
        title: flipbookData?.title || 'Flipbook',
        url: window.location.href,
      });
    } catch (err) {
      // 降级为复制链接
      navigator.clipboard.writeText(window.location.href);
      toast.success('链接已复制到剪贴板');
    }
  };

  const handleDownload = () => {
    // 下载功能实现
    toast.info('下载功能开发中...');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  if (error || !flipbookData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Flipbook未找到</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link href="/" className="btn-primary">
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* 顶部工具栏 */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
              <Home className="w-5 h-5" />
              <span>返回首页</span>
            </Link>
            <div className="h-6 w-px bg-gray-600"></div>
            <h1 className="text-xl font-semibold truncate max-w-md">
              {flipbookData.title}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* 页面导航 */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage <= 1}
                className="p-2 text-gray-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              <span className="text-sm text-gray-300 min-w-max">
                {currentPage} / {flipbookData.totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(Math.min(flipbookData.totalPages, currentPage + 1))}
                disabled={currentPage >= flipbookData.totalPages}
                className="p-2 text-gray-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div className="h-6 w-px bg-gray-600"></div>

            {/* 缩放控制 */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                className="p-2 text-gray-300 hover:text-white"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              
              <span className="text-sm text-gray-300 min-w-max">
                {Math.round(zoom * 100)}%
              </span>
              
              <button
                onClick={() => setZoom(Math.min(3, zoom + 0.1))}
                className="p-2 text-gray-300 hover:text-white"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
            </div>

            <div className="h-6 w-px bg-gray-600"></div>

            {/* 操作按钮 */}
            <button
              onClick={handleShare}
              className="p-2 text-gray-300 hover:text-white"
              title="分享"
            >
              <Share2 className="w-5 h-5" />
            </button>
            
            <button
              onClick={handleDownload}
              className="p-2 text-gray-300 hover:text-white"
              title="下载"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Flipbook 查看器 */}
      <div className="flex-1 p-4">
        <FlipbookViewer
          flipbookData={flipbookData}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          zoom={zoom}
        />
      </div>
    </div>
  );
}