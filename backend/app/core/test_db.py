# test_db.py
from app.core.database import engine

try:
    with engine.connect() as conn:
        print("✅ 成功连接到 Supabase 数据库！")
except Exception as e:
    print("❌ 连接失败：", e)