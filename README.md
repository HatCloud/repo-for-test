# Fitness Timer App

一款 HIIT 健身计时器应用，支持自定义训练模板、后台运行和触感反馈。

## 技术栈

- **移动端**: React Native (Expo SDK 54)
- **后端**: Node.js + Express + SQLite (sql.js)
- **容器化**: Docker + docker-compose

## 功能特性

- 可自定义运动/休息时长、轮数、组数
- 预设训练模板（经典 HIIT、Tabata、新手入门）
- 实时倒计时进度环显示
- 阶段切换触感反馈
- 训练历史记录与统计

## 快速开始

### 1. 启动后端服务

```bash
# 在项目根目录执行
docker compose up --build
```

后端将在 `http://localhost:8000` 启动，可通过以下命令验证：

```bash
curl http://localhost:8000/health
# 返回: {"status":"ok","timestamp":"..."}
```

### 2. 启动移动端 App

```bash
# 进入客户端目录
cd client

# 安装依赖
npm install

# 启动 Expo 开发服务器
npm start
```

然后按提示选择运行方式：
- 按 `i` 在 iOS 模拟器中运行
- 按 `a` 在 Android 模拟器中运行
- 扫描二维码在 Expo Go 中运行（需要真机）

### 3. 网络配置（重要）

App 会根据平台自动选择后端地址：
- **iOS 模拟器**: `http://localhost:8000`
- **Android 模拟器**: `http://10.0.2.2:8000`
- **真机调试**: 需要手动修改 `client/src/config.ts` 中的 IP 地址

**真机调试配置方法**：

编辑 `client/src/config.ts`，将 `getBaseUrl` 函数中的生产环境 URL 改为你电脑的局域网 IP：

```typescript
const getBaseUrl = () => {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:8000';
    }
    return 'http://localhost:8000';
  }
  // 生产环境 URL - 真机调试时修改这里
  return 'http://192.168.x.x:8000';  // ← 替换为你的局域网 IP
};
```

查看电脑局域网 IP：
```bash
# macOS
ifconfig | grep "inet " | grep -v 127.0.0.1

# Windows
ipconfig | findstr /i "IPv4"
```

## 项目结构

```
├── client/                 # React Native App
│   ├── App.tsx            # 应用入口
│   ├── src/
│   │   ├── screens/       # 页面组件
│   │   ├── components/    # UI 组件
│   │   ├── hooks/         # 自定义 Hooks
│   │   ├── context/       # 全局状态
│   │   ├── services/      # API 服务
│   │   └── config.ts      # 配置文件
│   └── package.json
│
├── backend/               # Node.js 后端
│   ├── src/
│   │   ├── index.ts      # 服务入口
│   │   ├── routes/       # API 路由
│   │   └── db/           # 数据库配置
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml     # Docker 编排配置
├── CHANGELOG.md          # 变更日志
└── CLAUDE.md             # AI 开发指南
```

## API 接口

所有接口需要 `X-Device-ID` 请求头。

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/health` | 健康检查 |
| GET | `/api/templates` | 获取训练模板列表 |
| POST | `/api/templates` | 创建训练模板 |
| DELETE | `/api/templates/:id` | 删除训练模板 |
| GET | `/api/records` | 获取训练记录 |
| POST | `/api/records` | 保存训练记录 |
| GET | `/api/records/stats` | 获取训练统计 |

## 开发命令

```bash
# 后端开发模式（热重载）
cd backend && npm run dev

# 后端构建
cd backend && npm run build

# 客户端启动
cd client && npm start

# Docker 构建并启动
docker compose up --build

# 查看后端日志
docker compose logs -f backend
```

## 故障排除

### App 启动崩溃
确保 `react-native-screens` 版本为 `~4.16.0`（Expo SDK 54 兼容版本）。

### 无法连接后端
1. 确认 Docker 容器正在运行：`docker compose ps`
2. 确认后端健康：`curl http://localhost:8000/health`
3. Android 模拟器使用 `10.0.2.2` 而非 `localhost`

### Metro 缓存问题
```bash
cd client && npx expo start --clear
```

## License

MIT
