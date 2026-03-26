module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.url === '/api/scores' || req.url === '/api/') {
    res.status(200).json({ success: true, scores: [] });
  } else {
    res.status(404).json({ error: 'Not found' });
  }
};
