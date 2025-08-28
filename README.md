一个高性能的文档转换系统，可将PDF、PPT、Word文档转换为交互式翻页书（Flipbook）。

## 🚀 主要特性

- **多格式支持**: PDF、PPT、PPTX、DOC、DOCX、JPG、PNG
- **高质量转换**: 保持原文档清晰度和版式
- **云端存储**: 基于Cloudflare R2的可扩展存储
- **异步处理**: 支持大文件处理，转换过程异步化
- **响应式设计**: 支持桌面端和移动端
- **实时进度**: 转换进度实时显示
- **容器化部署**: Docker + Kubernetes支持

## 🏗️ 技术架构

### 前端
- **框架**: Next.js 14 + React 18
- **UI库**: Tailwind CSS + Framer Motion
- **状态管理**: React Hooks
- **文件上传**: React Dropzone

### 后端
- **框架**: FastAPI + Python 3.11
- **异步任务**: Celery + Redis
- **数据库**: SQLite / PostgreSQL
- **文件处理**: PyMuPDF, Pillow, python-pptx
- **云存储**: Cloudflare R2

### 基础设施
- **容器化**: Docker + Docker Compose
- **编排**: Kubernetes
- **反向代理**: Nginx
- **监控**: 日志聚合和健康检查

## 📋 系统要求

### 开发环境
- Node.js 18+
- Python 3.11+
- Redis 6+
- Docker + Docker Compose

### 生产环境
- 2 CPU核心, 4GB内存（最小配置）
- 50GB存储空间
- Cloudflare账户（R2存储）

## 🛠️ 快速开始

### 1. 克隆项目
```bash
git clone <repository-url>
cd flipbook-converter
```

### 2. 配置环境变量
```bash
# 复制环境变量模板
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 编辑配置文件，设置Cloudflare R2信息
# 重要：需要替换以下Mock值为真实配置
# R2_ACCESS_KEY_ID=your-real-access-key
# R2_SECRET_ACCESS_KEY=your-real-secret-key
# R2_ENDPOINT_URL=https://your-account-id.r2.cloudflarestorage.com
# R2_PUBLIC_URL=https://your-cdn.example.com
```

### 3. 开发环境启动
```bash
# 使用Docker Compose启动开发环境
make dev

# 或者手动启动
docker-compose up -d
```

### 4. 访问应用
- 前端: http://localhost:3000
- 后端API: http://localhost:8000
- API文档: http://localhost:8000/docs

## 🚀 生产环境部署

### Docker Compose部署
```bash
# 设置生产环境变量
export R2_ACCESS_KEY_ID="your-real-access-key"
export R2_SECRET_ACCESS_KEY="your-real-secret-key"
export R2_BUCKET_NAME="flipbook-storage"
export R2_ENDPOINT_URL="https://your-account-id.r2.cloudflarestorage.com"
export R2_PUBLIC_URL="https://your-cdn.example.com"

# 部署
make deploy
```

### Kubernetes部署
```bash
# 更新kubernetes/secret.yaml中的base64编码值
# 然后部署
make k8s
```

## 📊 Cloudflare服务配置

### 1. R2对象存储设置
```bash
# 登录Cloudflare Dashboard
# 创建R2存储桶: flipbook-storage
# 生成API令牌，具有读写权限
# 设置自定义域名用于CDN加速
```

### 2. Workers设置（可选）
```bash
# 创建Worker用于边缘处理
# 部署文件处理逻辑到边缘节点
# 配置触发器和路由规则
```

### 3. D1数据库（替代SQLite）
```bash
# 创建D1数据库: flipbook-db
# 运行数据库迁移脚本
# 更新DATABASE_URL配置
```

## 🔧 配置说明

### 核心配置项
- `MAX_FILE_SIZE`: 最大文件大小（默认500MB）
- `PDF_DPI`: PDF转换DPI（默认200）
- `IMAGE_MAX_WIDTH/HEIGHT`: 图片最大尺寸（1920x1080）
- `IMAGE_QUALITY`: 图片质量（85）

### 性能调优
- Celery worker并发数：根据CPU核心数调整
- Redis内存配置：根据任务队列大小设置
- Nginx缓存策略：设置静态资源长期缓存

## 📈 监控和日志

### 查看日志
```bash
# 查看所有服务日志
make logs

# 查看特定服务日志
docker-compose logs -f backend
docker-compose logs -f frontend
```

### 健康检查
- 后端健康检查: `/health`
- 前端状态: 页面加载状态
- Redis状态: 连接测试

## 🔒 安全配置

### 生产环境安全清单
- [ ] 更换默认SECRET_KEY
- [ ] 配置HTTPS证书
- [ ] 限制CORS域名
- [ ] 设置速率限制
- [ ] 配置文件类型验证
- [ ] 启用请求日志记录

## 🧪 测试

```bash
# 运行所有测试
make test

# 前端测试
cd frontend && npm test

# 后端测试
cd backend && python -m pytest
```

## 📝 API文档

### 主要端点
- `POST /api/upload` - 文件上传
- `GET /api/task/{id}/status` - 任务状态查询
- `GET /api/flipbook/{id}` - 获取Flipbook数据
- `GET /flipbook/{id}` - Flipbook预览页面

### 响应格式
```json
{
  "taskId": "uuid",
  "status": "completed",
  "progress": 100,
  "flipbookUrl": "/flipbook/uuid"
}
```

## 🚨 故障排除

### 常见问题

1. **文件上传失败**
   - 检查文件大小限制
   - 验证文件格式支持
   - 查看存储空间

2. **转换进度卡住**
   - 检查Celery worker状态
   - 查看Redis连接
   - 检查磁盘空间

3. **页面加载慢**
   - 检查CDN配置
   - 优化图片压缩设置
   - 检查网络连接

4. **Cloudflare R2连接错误**
   - 验证访问密钥配置
   - 检查存储桶权限
   - 确认端点URL正确

### 日志分析
```bash
# 查看错误日志
grep "ERROR" logs/*.log

# 查看转换任务状态
grep "task_id" logs/backend.log
```

## 🤝 贡献指南

1. Fork项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建Pull Request

## 📄 许可证

MIT License - 详见LICENSE文件

## 📞 支持

如有问题或建议，请创建Issue或联系项目维护者。

---

## 🔄 更新日志

### v1.0.0 (2024-XX-XX)
- 初始版本发布
- 支持PDF、PPT、Word转换
- 实现Cloudflare R2存储集成
- 添加Docker容器化支持
	