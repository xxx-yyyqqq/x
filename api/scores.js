// Vercel Serverless 函数 - 使用内存存储
let scores = [];
const submissionCache = new Map();

function setCORS(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

module.exports = async (req, res) => {
    setCORS(res);
    if (req.method === 'OPTIONS') return res.status(200).end();
    
    const path = req.url || '/';
    
    // 健康检查
    if (path === '/api/health') {
        return res.status(200).json({
            success: true,
            message: '服务器运行正常',
            timestamp: new Date().toISOString()
        });
    }
    
    // 获取排行榜
    if (req.method === 'GET' && path.startsWith('/api/scores')) {
        return res.status(200).json({
            success: true,
            scores: scores.sort((a, b) => b.score - a.score).slice(0, 10)
        });
    }
    
    // 提交分数
    if (req.method === 'POST' && path.startsWith('/api/scores')) {
        const { name, score } = req.body;
        if (!name || typeof score !== 'number' || score < 0 || score > 300) {
            return res.status(400).json({ success: false, error: '无效数据' });
        }
        
        const existingIndex = scores.findIndex(s => s.name === name);
        if (existingIndex !== -1) {
            if (score > scores[existingIndex].score) {
                scores[existingIndex].score = score;
                scores[existingIndex].date = new Date().toISOString();
            }
        } else {
            scores.push({ name, score, date: new Date().toISOString() });
        }
        
        return res.status(200).json({ success: true, message: '分数已保存' });
    }
    
    return res.status(404).json({ success: false, error: 'API不存在' });
};
