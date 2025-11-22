import { google } from 'googleapis';
import https from 'https';
import { DRIVE_API_KEY, FOLDER_ID } from './config.js';
import fs from 'fs';
import path from 'path';

const LOCAL_DIR = './downloaded-images';

const drive = google.drive({
  version: 'v3',
  auth: DRIVE_API_KEY, 
});

async function downloadImages() {
  try {
    if (!fs.existsSync(LOCAL_DIR)) {
      fs.mkdirSync(LOCAL_DIR, { recursive: true });
    }

    const res = await drive.files.list({
      q: `'${FOLDER_ID}' in parents and mimeType contains 'image/'`,
      fields: 'files(id, name, mimeType)',
    });

    const files = res.data.files;

    if (files.length === 0) {
      console.log('No images found in the folder.');
      return;
    }

    console.log(`Downloading ${files.length} images...`);

    for (const file of files) {
      // file url not handling auth properly
      // const fileUrl = `https://drive.google.com/uc?export=download&id=${file.id}`;
      const filePath = path.join(LOCAL_DIR, file.name);
      const dest = fs.createWriteStream(filePath);


      const response = await drive.files.get(
        { fileId: file.id, alt: 'media' },
        { responseType: 'stream' }
      );

      // https.get method cannot handle large files or redirect making issues with the repsonse.pip
      response.data
        .on('end', () => {
          console.log(`Downloaded: ${file.name}`);
        })
        .on('error', (err) => {
          console.error(`Error downloading ${file.name}:`, err);
        })
        .pipe(dest);
    
      // console.log(`Downloaded: ${file.name}`);
    }

    console.log('All images downloaded successfully!');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

downloadImages();