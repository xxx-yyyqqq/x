# 🎮 是男人就坚持30秒 - 在线排行榜版

## 📖 项目简介

这是一个带在线排行榜功能的 HTML5 Canvas 网页游戏。玩家可以与朋友共享全球排行榜，实时竞争最高分！

---

## 🚀 快速开始

### 方式一：本地运行（适合测试）

1. **安装 Node.js**  
   访问 [https://nodejs.org](https://nodejs.org) 下载并安装（选择 LTS 版本）

2. **安装依赖**  
   在项目目录打开终端（或命令提示符），运行：
   ```bash
   npm install
   ```

3. **启动服务器**  
   ```bash
   npm start
   ```

4. **开始游戏**  
   浏览器打开：`http://localhost:3000/game.html`

---

### 方式二：局域网多人玩（让朋友加入）

1. 按照"方式一"启动服务器

2. **查看你的局域网 IP**：
   - **Windows**: 打开 CMD，输入 `ipconfig`，找到 `IPv4 地址`（如 `192.168.1.100`）
   - **Mac/Linux**: 打开终端，输入 `ifconfig` 或 `ip addr`

3. **分享链接给朋友**：
   ```
   http://你的IP地址:3000/game.html
   例如：http://192.168.1.100:3000/game.html
   ```

4. **注意事项**：
   - 确保你和朋友在同一 WiFi 网络下
   - 关闭防火墙，或允许 3000 端口通过

---

### 方式三：云端部署（全球访问）

#### 使用 Vercel（推荐，免费且简单）

1. **安装 Vercel CLI**：
   ```bash
   npm install -g vercel
   ```

2. **登录 Vercel**：
   ```bash
   vercel login
   ```

3. **部署项目**：
   ```bash
   vercel
   ```
   按提示操作，完成后会得到一个永久域名，如：  
   `https://your-game.vercel.app`

4. **修改游戏配置**：
   打开 `game.html`，找到第 249 行，修改为：
   ```javascript
   const API_BASE_URL = 'https://your-game.vercel.app/api';
   ```

5. **重新部署**：
   ```bash
   vercel --prod
   ```

6. **分享链接**：
   ```
   https://your-game.vercel.app/game.html
   ```

---

#### 使用 Railway（备选方案）

1. 访问 [https://railway.app](https://railway.app)
2. 登录并创建新项目
3. 选择"Deploy from GitHub repo"或直接上传代码
4. Railway 会自动识别 Node.js 项目并部署
5. 获取分配的域名，修改 `game.html` 中的 `API_BASE_URL`

---

## 📁 项目结构

```
项目目录/
├── game.html          # 前端游戏（已集成在线API）
├── server.js          # 后端服务器（Express + 文件存储）
├── package.json       # 项目依赖配置
├── scores.json        # 分数存储文件（自动生成）
├── vercel.json        # Vercel 部署配置（可选）
└── README.md          # 本文档
```

---

## 🎮 游戏玩法

- **控制**：方向键（↑↓←→）或 WASD 键
- **目标**：躲避红色障碍物，坚持 30 秒达成基础目标
- **难度**：每 5 秒递增，挑战你的极限！
- **排行榜**：自动上传最高分，与全球玩家竞争

---

## 🛠️ 技术栈

- **前端**：HTML5 Canvas + 原生 JavaScript
- **后端**：Node.js + Express
- **数据库**：JSON 文件（轻量级存储）
- **通信**：RESTful API（Fetch API）

---

## 🔧 API 接口说明

### 1. 获取排行榜
```http
GET /api/scores
```

**响应示例**：
```json
{
  "success": true,
  "scores": [
    {
      "name": "玩家1",
      "score": 45.23,
      "date": "2026-03-26T10:22:17.000Z"
    }
  ]
}
```

---

### 2. 提交分数
```http
POST /api/scores
Content-Type: application/json

{
  "name": "玩家1",
  "score": 45.23
}
```

**响应示例**：
```json
{
  "success": true,
  "message": "分数已保存"
}
```

---

### 3. 健康检查
```http
GET /api/health
```

**响应示例**：
```json
{
  "success": true,
  "message": "服务器运行正常",
  "timestamp": "2026-03-26T10:22:17.000Z"
}
```

---

## 🔒 防作弊机制

- ✅ 同一玩家 60 秒内只能提交一次分数
- ✅ 分数范围验证（0-300秒）
- ✅ 数据格式验证（防止非法输入）
- ✅ 仅保存每个玩家的最高分

---

## ❓ 常见问题

### Q1: 朋友无法访问我的服务器？
**A**: 
- 确保你和朋友在同一局域网（WiFi）
- 检查防火墙是否开放 3000 端口
- 使用云端部署方案（Vercel）更稳定

### Q2: 如何修改端口号？
**A**: 修改 `server.js` 第 6 行：
```javascript
const PORT = process.env.PORT || 你的端口号;
```

### Q3: 如何切换到 MongoDB？
**A**: 
1. 安装 `npm install mongodb`
2. 修改 `server.js` 中的文件读写为数据库操作
3. 使用 MongoDB Atlas（免费云数据库）

### Q4: 如何清空排行榜？
**A**: 删除 `scores.json` 文件，服务器会自动重新创建空榜单

### Q5: 游戏支持移动端吗？
**A**: 目前仅支持键盘操作。如需移动端支持，可添加虚拟摇杆（需修改代码）

---

## 📈 后续扩展建议

- [ ] 添加用户注册/登录系统
- [ ] 支持房间模式（朋友组队）
- [ ] 实时多人对战（WebSocket）
- [ ] 游戏录像回放功能
- [ ] 移动端触屏控制
- [ ] 成就系统和徽章
- [ ] 排行榜分区（日/周/月/总榜）

---

## 📜 开源协议

MIT License - 自由使用和修改

---

## 🙏 致谢

感谢所有参与测试和提供反馈的玩家！

---

**祝你和朋友玩得开心！🎮🏆**
