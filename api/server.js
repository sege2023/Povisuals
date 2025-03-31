import { DRIVE_API_KEY, FOLDER_ID } from './config.js';
import { createServer } from 'http';
import { google } from 'googleapis';
import https from 'https';

const drive = google.drive({
  version: 'v3',
  auth: DRIVE_API_KEY
});

const PORT = 3001;

const imageServer = createServer(async (req, res) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  
  const urlObj = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = urlObj.pathname;
  
  if (pathname === '/api/getImages') {
    try {
      const response = await drive.files.list({
        q: `'${FOLDER_ID}' in parents and mimeType contains 'image/'`,
        fields: 'files(id, name, mimeType)'
      });
      
      const files = response.data.files || [];
      const images = files.map(file => ({
        name: file.name,
        id: file.id,
        url: `/api/image/${file.id}`,
        type: file.mimeType
      }));
      
      res.writeHead(200, {
        "Content-Type": 'application/json',
        "Access-Control-Allow-Origin": '*',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      
      console.log("Sending image list:", images); 
      res.end(JSON.stringify(images));
    }
    catch(error) {
      console.error('API Error:', error);
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Failed to fetch images', details: error.message }));
    }
  } 
  else if (pathname.startsWith('/api/image/')) {
    const fileId = pathname.replace('/api/image/', '');
    
    try {
      console.log(`Fetching image with ID: ${fileId}`);
      
      const response = await drive.files.get(
        {
          fileId: fileId,
          alt: 'media'
        },
        { responseType: 'arraybuffer' }
      );
      
      const contentType = response.headers['content-type'] || 'image/jpeg';
      
      res.writeHead(200, {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600'
      });

      response.data.on('error', error => {
        console.error('Stream error:', error);
        // If not sent headers yet
        if (!res.headersSent) {
          res.writeHead(500);
          res.end(JSON.stringify({ error: 'Image streaming error' }));
        } else {
          res.end();
        }
      });
      
      response.data.pipe(res);
    } catch (error) {
      console.error('Image Fetch Error:', error);
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Failed to fetch image', details: error.message }));
    }
  }
  else {
    res.writeHead(404);
    res.end('Not Founddd');
  }
});

imageServer.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});