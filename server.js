const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const SCORES_FILE = path.join(__dirname, 'scores.json');

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // 提供静态文件服务

// 提交缓存（防刷分）
const submissionCache = new Map();

// 初始化分数文件
async function initScoresFile() {
    try {
        await fs.access(SCORES_FILE);
        console.log('✅ 分数文件已存在');
    } catch {
        await fs.writeFile(SCORES_FILE, JSON.stringify([]));
        console.log('✅ 已创建新的分数文件');
    }
}

// API：获取排行榜（Top 10）
app.get('/api/scores', async (req, res) => {
    try {
        const data = await fs.readFile(SCORES_FILE, 'utf8');
        const scores = JSON.parse(data);
        const top10 = scores
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);
        res.json({ success: true, scores: top10 });
    } catch (error) {
        console.error('❌ 读取分数失败:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// API：提交新分数
app.post('/api/scores', async (req, res) => {
    try {
        const { name, score } = req.body;
        
        // 验证数据
        if (!name || typeof score !== 'number') {
            return res.status(400).json({ 
                success: false, 
                error: '无效的数据格式' 
            });
        }

        // 验证分数合理性（0-300秒）
        if (score > 300 || score < 0) {
            return res.status(400).json({ 
                success: false, 
                error: '无效的分数范围' 
            });
        }

        // 限制提交频率（60秒内最多1次）
        const now = Date.now();
        if (submissionCache.has(name)) {
            const lastSubmit = submissionCache.get(name);
            if (now - lastSubmit < 60000) {
                return res.status(429).json({ 
                    success: false, 
                    error: '提交过于频繁，请60秒后再试' 
                });
            }
        }

        // 读取现有分数
        const data = await fs.readFile(SCORES_FILE, 'utf8');
        let scores = JSON.parse(data);

        // 查找是否有该玩家的记录
        const existingIndex = scores.findIndex(s => s.name === name);
        
        if (existingIndex !== -1) {
            // 更新最高分
            if (score > scores[existingIndex].score) {
                scores[existingIndex].score = score;
                scores[existingIndex].date = new Date().toISOString();
                console.log(`✅ 更新玩家 ${name} 的最高分: ${score}秒`);
            } else {
                console.log(`ℹ️  玩家 ${name} 的分数未超过历史最高分`);
            }
        } else {
            // 添加新记录
            scores.push({
                name: name,
                score: score,
                date: new Date().toISOString()
            });
            console.log(`✅ 新玩家 ${name} 加入排行榜: ${score}秒`);
        }

        // 保存数据
        await fs.writeFile(SCORES_FILE, JSON.stringify(scores, null, 2));
        
        // 更新提交缓存
        submissionCache.set(name, now);

        res.json({ success: true, message: '分数已保存' });
    } catch (error) {
        console.error('❌ 保存分数失败:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// 健康检查接口
app.get('/api/health', (req, res) => {
    res.json({ 
        success: true, 
        message: '服务器运行正常',
        timestamp: new Date().toISOString()
    });
});

// 启动服务器
initScoresFile().then(() => {
    app.listen(PORT, () => {
        console.log('\n🎮 ================================');
        console.log('🚀 游戏服务器已启动！');
        console.log(`📍 本地访问: http://localhost:${PORT}`);
        console.log(`📍 游戏地址: http://localhost:${PORT}/game.html`);
        console.log('🎮 ================================\n');
    });
}).catch(error => {
    console.error('❌ 服务器启动失败:', error);
    process.exit(1);
});
