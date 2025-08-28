import boto3
import aiofiles
import os
import asyncio
from typing import Optional
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class StorageService:
    def __init__(self):
        self.s3_client = boto3.client(
            's3',
            endpoint_url=settings.R2_ENDPOINT_URL,
            aws_access_key_id=settings.R2_ACCESS_KEY_ID,
            aws_secret_access_key=settings.R2_SECRET_ACCESS_KEY,
            region_name='auto'
        )
        self.bucket_name = settings.R2_BUCKET_NAME

    async def upload_file(self, file_path: str, object_key: str, content_type: str = None) -> str:
        """上传文件到R2存储"""
        try:
            loop = asyncio.get_event_loop()
            
            extra_args = {}
            if content_type:
                extra_args['ContentType'] = content_type
            
            await loop.run_in_executor(
                None,
                self.s3_client.upload_file,
                file_path,
                self.bucket_name,
                object_key,
                extra_args
            )
            
            # 返回CDN URL
            return f"{settings.R2_PUBLIC_URL}/{object_key}"
        except Exception as e:
            logger.error(f"Failed to upload file {file_path}: {e}")
            raise

    async def upload_file_obj(self, file_obj, object_key: str, content_type: str = None) -> str:
        """上传文件对象到R2存储"""
        try:
            loop = asyncio.get_event_loop()
            
            extra_args = {}
            if content_type:
                extra_args['ContentType'] = content_type
            
            await loop.run_in_executor(
                None,
                self.s3_client.upload_fileobj,
                file_obj,
                self.bucket_name,
                object_key,
                extra_args
            )
            
            return f"{settings.R2_PUBLIC_URL}/{object_key}"
        except Exception as e:
            logger.error(f"Failed to upload file object: {e}")
            raise

    async def download_file(self, object_key: str, file_path: str):
        """从R2存储下载文件"""
        try:
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(
                None,
                self.s3_client.download_file,
                self.bucket_name,
                object_key,
                file_path
            )
        except Exception as e:
            logger.error(f"Failed to download file {object_key}: {e}")
            raise

    async def delete_file(self, object_key: str):
        """从R2存储删除文件"""
        try:
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(
                None,
                self.s3_client.delete_object,
                Bucket=self.bucket_name,
                Key=object_key
            )
        except Exception as e:
            logger.error(f"Failed to delete file {object_key}: {e}")
            raise