'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

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
}

interface FlipbookViewerProps {
  flipbookData: FlipbookData;
  currentPage: number;
  onPageChange: (page: number) => void;
  zoom: number;
}

export default function FlipbookViewer({ 
  flipbookData, 
  currentPage, 
  onPageChange, 
  zoom 
}: FlipbookViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [imagesLoaded, setImagesLoaded] = useState<Set<number>>(new Set());
  const [isDragging, setIsDragging] = useState(false);

  // 预加载图片
  useEffect(() => {
    const loadImages = async () => {
      const loadPromises = flipbookData.pages.map((page) => {
        return new Promise<number>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(page.page);
          img.onerror = () => reject(new Error(`Failed to load page ${page.page}`));
          img.src = page.url;
        });
      });

      try {
        const loaded = await Promise.all(loadPromises);
        setImagesLoaded(new Set(loaded));
      } catch (error) {
        console.error('Error loading images:', error);
      }
    };

    loadImages();
  }, [flipbookData.pages]);

  const handlePageClick = (pageNumber: number) => {
    if (!isDragging) {
      onPageChange(pageNumber);
    }
  };

  const handleMouseDown = () => {
    setIsDragging(false);
  };

  const handleMouseMove = () => {
    setIsDragging(true);
  };

  return (
    <div className="flex justify-center items-center h-full">
      <div 
        ref={containerRef}
        className="relative bg-white shadow-2xl rounded-lg overflow-hidden"
        style={{ 
          transform: `scale(${zoom})`,
          transformOrigin: 'center',
        }}
      >
        {/* 左页面 */}
        {currentPage > 1 && (
          <motion.div
            initial={{ rotateY: -15 }}
            animate={{ rotateY: 0 }}
            className="absolute left-0 top-0 w-96 h-full bg-white border-r shadow-lg cursor-pointer"
            onClick={() => handlePageClick(currentPage - 1)}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
          >
            {imagesLoaded.has(currentPage - 1) && (
              <img
                src={flipbookData.pages[currentPage - 2]?.url}
                alt={`Page ${currentPage - 1}`}
                className="w-full h-full object-contain"
                draggable={false}
              />
            )}
            {!imagesLoaded.has(currentPage - 1) && (
              <div className="w-full h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
              </div>
            )}
          </motion.div>
        )}

        {/* 右页面 */}
        <motion.div
          key={currentPage}
          initial={{ rotateY: 15 }}
          animate={{ rotateY: 0 }}
          className="w-96 h-[600px] bg-white shadow-lg cursor-pointer relative"
          style={{ marginLeft: currentPage > 1 ? '384px' : '0' }}
          onClick={() => handlePageClick(Math.min(flipbookData.totalPages, currentPage + 1))}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
        >
          {imagesLoaded.has(currentPage) && (
            <img
              src={flipbookData.pages[currentPage - 1]?.url}
              alt={`Page ${currentPage}`}
              className="w-full h-full object-contain"
              draggable={false}
            />
          )}
          {!imagesLoaded.has(currentPage) && (
            <div className="w-full h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
            </div>
          )}

          {/* 页码显示 */}
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
            {currentPage}
          </div>
        </motion.div>

        {/* 翻页动画效果 */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-0 w-px h-full bg-gray-300 shadow-sm"></div>
        </div>
      </div>
    </div>
  );
}