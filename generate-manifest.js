// const fs = require('fs');
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// const path = require('path');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the path to your image directory and the output JSON file
const imagesDirectory = path.join(__dirname, 'src','assets','downloaded-images');
const outputFilePath = path.join(__dirname, 'src','assets', 'image-manifest.json');

// The base URL for your images in production
// In this example, 'https://your-r2-url.com' would be your R2 bucket public URL
const baseUrl = '/images/'; // Use a relative path for local development

const imageUrls = [];
// what is used to read a directory?
fs.readdir(imagesDirectory, (err, files) => {
  if (err) {
    console.error('Error reading the directory:', err);
    return;
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