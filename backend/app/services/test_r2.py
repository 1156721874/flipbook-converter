# test_r2.py
import boto3
from app.core.config import settings

client = boto3.client(
    's3',
    endpoint_url=settings.R2_ENDPOINT_URL,
    aws_access_key_id=settings.R2_ACCESS_KEY_ID,
    aws_secret_access_key=settings.R2_SECRET_ACCESS_KEY,
    region_name='auto'
)

try:
    response = client.list_objects_v2(Bucket='flipbook-storage', MaxKeys=1)
    print("✅ R2 连接成功！", response.get('Contents', []))
except Exception as e:
    print("❌ 连接失败:", e)