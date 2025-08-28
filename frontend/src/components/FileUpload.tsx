'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, File, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadFile } from '@/lib/api';

interface FileUploadProps {
  onUploadSuccess: () => void;
}

export default function FileUpload({ onUploadSuccess }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    
    // 文件大小检查 (500MB)
    if (file.size > 500 * 1024 * 1024) {
      toast.error('文件大小不能超过500MB');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const progressCallback = (progress: number) => {
        setUploadProgress(progress);
      };

      const result = await uploadFile(file, progressCallback);
      
      toast.success(`文件上传成功！任务ID: ${result.taskId}`);
      onUploadSuccess();
      
    } catch (error: any) {
      toast.error(error.message || '上传失败，请重试');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive, rejectedFiles } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxFiles: 1,
    disabled: uploading,
  });

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">上传文档</h2>
      
      <motion.div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
          ${uploading ? 'cursor-not-allowed opacity-50' : ''}
        `}
        whileHover={!uploading ? { scale: 1.02 } : {}}
        whileTap={!uploading ? { scale: 0.98 } : {}}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-4">
          <Upload className={`w-12 h-12 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} />
          
          {uploading ? (
            <div className="w-full">
              <p className="text-lg font-medium text-gray-700 mb-2">上传中...</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">{uploadProgress}%</p>
            </div>
          ) : (
            <>
              <div>
                <p className="text-lg font-medium text-gray-700">
                  {isDragActive ? '拖放文件到这里' : '拖放文件或点击上传'}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  支持 PDF, PPT, PPTX, DOC, DOCX, JPG, PNG
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  最大文件大小: 500MB
                </p>
              </div>
            </>
          )}
        </div>
      </motion.div>

      {rejectedFiles.length > 0 && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700">文件格式不支持或文件过大</span>
          </div>
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {['PDF', 'PPT', 'DOC', 'IMG'].map((type) => (
          <div key={type} className="flex items-center justify-center p-3 bg-gray-50 rounded-lg">
            <File className="w-5 h-5 text-gray-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">{type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}