// const fs = require('fs');
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// const path = require('path');
// console.log('Script directory:', __dirname);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesDirectory = path.join(__dirname, 'public','downloaded-images');
console.log('Resolved path:', imagesDirectory);

if (!fs.existsSync(imagesDirectory)) {
  console.error('Directory does not exist:', imagesDirectory);
  process.exit(1);
}
const outputFilePath = path.join(__dirname, 'src','assets', 'image-manifest.json');


const baseUrl = '/downloaded-images/'; 

const imageUrls = [];
fs.readdir(imagesDirectory, (err, files) => {
  if (err) {
    console.error('Error reading the directory:', err);
    process.exit(1);
  }

  files.forEach(file => {
    if (file.match(/\.(png|jpe?g|svg|gif)$/i)) {
      const url = `${baseUrl}${file}`;
      imageUrls.push(url);
    }
  });

  const manifest = {
    imageUrls: imageUrls
  };

  fs.writeFile(outputFilePath, JSON.stringify(manifest, null, 2), err => {
    if (err) {
      console.error('Error writing JSON file:', err);
    } else {
      console.log('Successfully generated image-manifest.json');
    }
  });
});