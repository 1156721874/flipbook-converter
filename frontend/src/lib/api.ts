const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface UploadResponse {
  taskId: string;
  status: string;
  message: string;
}

export interface TaskStatus {
  taskId: string;
  status: 'uploaded' | 'processing' | 'completed' | 'failed';
  progress: number;
  flipbookUrl?: string;
  error?: string;
}

export interface FlipbookData {
  taskId: string;
  title: string;
  totalPages: number;
  pages: Array<{
    page: number;
    url: string;
    thumbnailUrl?: string;
  }>;
  createdAt: string;
}

// 上传文件
export async function uploadFile(
  file: File, 
  onProgress?: (progress: number) => void
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        const progress = Math.round((event.loaded / event.total) * 100);
        onProgress(progress);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } catch (error) {
          reject(new Error('Invalid response format'));
        }
      } else {
        try {
          const error = JSON.parse(xhr.responseText);
          reject(new Error(error.message || `Upload failed with status ${xhr.status}`));
        } catch {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Network error during upload'));
    });

    xhr.open('POST', `${API_BASE_URL}/api/upload`);
    xhr.send(formData);
  });
}

// 获取任务状态
export async function getTaskStatus(taskId: string): Promise<TaskStatus> {
  const response = await fetch(`${API_BASE_URL}/api/task/${taskId}/status`);
  
  if (!response.ok) {
    throw new Error(`Failed to get task status: ${response.status}`);
  }
  
  return response.json();
}

// 获取用户任务列表
export async function getUserTasks(): Promise<TaskStatus[]> {
  // 从localStorage获取任务ID列表（简化实现）
  const taskIds = JSON.parse(localStorage.getItem('userTasks') || '[]');
  
  const tasks = await Promise.all(
    taskIds.map((taskId: string) => getTaskStatus(taskId).catch(() => null))
  );
  
  return tasks.filter(Boolean) as TaskStatus[];
}

// 保存任务ID到localStorage
export function saveTaskId(taskId: string) {
  const taskIds = JSON.parse(localStorage.getItem('userTasks') || '[]');
  if (!taskIds.includes(taskId)) {
    taskIds.push(taskId);
    localStorage.setItem('userTasks', JSON.stringify(taskIds));
  }
}

// 获取Flipbook数据
export async function getFlipbookData(taskId: string): Promise<FlipbookData> {
  const response = await fetch(`${API_BASE_URL}/api/flipbook/${taskId}`);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Flipbook not found or not ready');
    }
    throw new Error(`Failed to get flipbook data: ${response.status}`);
  }
  
  return response.json();
}

// src/lib/utils.ts
export function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ');
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function formatDate(timestamp: string | number): string {
  const date = new Date(typeof timestamp === 'string' ? parseInt(timestamp) : timestamp);
  return date.toLocaleString('zh-CN');
}