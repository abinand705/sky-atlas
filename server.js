const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const PORT = process.env.PORT || 3000;
const API_KEY = "ab523d241b7a4a8e6a16e940d641f281";
if (!API_KEY) {
  console.error('Please set your OpenWeatherMap API key inside server.js.');
  process.exit(1);
}

const filePath = path.join(__dirname, 'whether.html');
const publicFile = fs.existsSync(filePath) ? filePath : null;

function sendJson(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(body);
}

function proxyOpenWeather(req, res, query) {
  const mode = query.get('mode');
  if (!mode) return sendJson(res, 400, { message: 'Missing mode parameter' });

  let targetUrl;
  switch (mode) {
    case 'weather': {
      const lat = query.get('lat');
      const lon = query.get('lon');
      if (!lat || !lon) return sendJson(res, 400, { message: 'Missing lat/lon' });
      targetUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&appid=${API_KEY}`;
      break;
    }
    case 'forecast': {
      const lat = query.get('lat');
      const lon = query.get('lon');
      if (!lat || !lon) return sendJson(res, 400, { message: 'Missing lat/lon' });
      targetUrl = `https://api.openweathermap.org/data/2.5/forecast?units=metric&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&appid=${API_KEY}`;
      break;
    }
    case 'geo': {
      const q = query.get('q');
      if (!q) return sendJson(res, 400, { message: 'Missing q parameter' });
      targetUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(q)}&limit=5&appid=${API_KEY}`;
      break;
    }
    default:
      return sendJson(res, 400, { message: 'Unsupported mode' });
  }

  https.get(targetUrl, (proxyRes) => {
    let raw = '';
    proxyRes.setEncoding('utf8');
    proxyRes.on('data', chunk => raw += chunk);
    proxyRes.on('end', () => {
      res.writeHead(proxyRes.statusCode || 502, {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(raw);
    });
  }).on('error', (err) => {
    sendJson(res, 502, { message: 'Proxy request failed', detail: err.message });
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  if (url.pathname === '/api/openweather') {
    return proxyOpenWeather(req, res, url.searchParams);
  }

  if (url.pathname === '/' || url.pathname === '/whether.html') {
    if (!publicFile) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('File not found');
    }
    const html = fs.readFileSync(publicFile, 'utf8');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(html);
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log('Using the hardcoded OpenWeatherMap API key from server.js.');
});
