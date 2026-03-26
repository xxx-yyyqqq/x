// Vercel Serverless 函数 - 使用内存存储
// 注意：重启后数据会丢失，生产环境建议使用数据库

// 内存存储（临时方案）
let scores = [];

// 提交缓存（防刷分）
const submissionCache = new Map();

// CORS 处理
function setCORS(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

module.exports = async (req, res) => {
    setCORS(res);

    // 处理 OPTIONS 请求
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const path = req.url || '/';

    // 健康检查
    if (path === '/api/health') {
        return res.status(200).json({
            success: true,
            message: '服务器运行正常',
            timestamp: new Date().toISOString(),
            storage: 'memory',
            scoresCount: scores.length
        });
    }

    // 获取排行榜
    if (req.method === 'GET' && path.startsWith('/api/scores')) {
        try {
            const top10 = scores
                .sort((a, b) => b.score - a.score)
                .slice(0, 10);
            
            return res.status(200).json({
                success: true,
                scores: top10
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // 提交分数
    if (req.method === 'POST' && path.startsWith('/api/scores')) {
        try {
            const { name, score } = req.body;

            // 验证数据
            if (!name || typeof score !== 'number') {
                return res.status(400).json({
                    success: false,
                    error: '无效的数据格式'
                });
            }

            // 验证分数范围
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

            // 查找是否有该玩家的记录
            const existingIndex = scores.findIndex(s => s.name === name);

            if (existingIndex !== -1) {
                // 更新最高分
                if (score > scores[existingIndex].score) {
                    scores[existingIndex].score = score;
                    scores[existingIndex].date = new Date().toISOString();
                    console.log(`✅ 更新玩家 ${name} 的最高分: ${score}秒`);
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

            // 更新提交缓存
            submissionCache.set(name, now);

            return res.status(200).json({
                success: true,
                message: '分数已保存'
            });
        } catch (error) {
            console.error('❌ 保存分数失败:', error);
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // 404
    return res.status(404).json({
        success: false,
        error: 'API 端点不存在'
    });
};
