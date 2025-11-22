import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { DRIVE_API_KEY, FOLDER_ID } from '../api/config.js';

const LOCAL_DIR = './public/download-images';

const drive = google.drive({
  version: 'v3',
  auth: DRIVE_API_KEY,
});

const imageManifest = {
  
};

/**
 * Recursively download images from Google Drive folder and subfolders
 */
async function downloadFolder(folderId, localPath = LOCAL_DIR, category = 'uncategorized') {
  try {
    // Create local directory if it doesn't exist
    if (!fs.existsSync(localPath)) {
      fs.mkdirSync(localPath, { recursive: true });
    }

    // List all files and folders in current folder
    const res = await drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      fields: 'files(id, name, mimeType)',
      orderBy: 'name',
    });

    const items = res.data.files;

    if (!items || items.length === 0) {
      console.log(`No items found in folder: ${localPath}`);
      return;
    }

    console.log(`\n📁 Processing folder: ${localPath}`);
    console.log(`Found ${items.length} items`);

    for (const item of items) {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (item.mimeType === 'application/vnd.google-apps.folder') {
        const subfolderPath = path.join(localPath, item.name);
        const subCategory = item.name.toLowerCase().replace(/\s+/g, '-');
        
        console.log(`\n📂 Entering subfolder: ${item.name}`);
        
        // Initialize category in manifest if it doesn't exist
        if (!imageManifest[subCategory]) {
          imageManifest[subCategory] = [];
        }
        
        await downloadFolder(item.id, subfolderPath, subCategory);
      }
      // If it's an image, download it
      else if (item.mimeType.startsWith('image/')) {
        const filePath = path.join(localPath, item.name);
        
        // Skip if file already exists
        if (fs.existsSync(filePath)) {
          console.log(`⏭️  Skipping (already exists): ${item.name}`);
          
          // Still add to manifest
          const relativePath = filePath.replace('public', '').replace(/\\/g, '/');
          if (!imageManifest[category].includes(relativePath)) {
            imageManifest[category].push(relativePath);
          }
          continue;
        }

        await downloadImage(item.id, item.name, filePath, category);
      }
    }
  } catch (error) {
    console.error(`❌ Error processing folder:`, error.message);
  }
}

/**
 * Download a single image from Google Drive
 */
async function downloadImage(fileId, fileName, filePath, category) {
  return new Promise((resolve, reject) => {
    const dest = fs.createWriteStream(filePath);

    drive.files.get(
      { fileId: fileId, alt: 'media' },
      { responseType: 'stream' }
    )
      .then(response => {
        response.data
          .on('end', () => {
            console.log(`✅ Downloaded: ${fileName}`);
            
            // Add to manifest with path relative to public folder
            const relativePath = filePath.replace('public', '').replace(/\\/g, '/');
            if (!imageManifest[category].includes(relativePath)) {
              imageManifest[category].push(relativePath);
            }
            
            resolve();
          })
          .on('error', (err) => {
            console.error(`❌ Error downloading ${fileName}:`, err.message);
            reject(err);
          })
          .pipe(dest);
      })
      .catch(reject);
  });
}

/**
 * Save the image manifest to JSON
 */
function saveManifest() {
  const manifestPath = './src/assets/images-manifest.json';
  
  // Ensure directory exists
  const manifestDir = path.dirname(manifestPath);
  if (!fs.existsSync(manifestDir)) {
    fs.mkdirSync(manifestDir, { recursive: true });
  }

  // Sort arrays for consistency
  Object.keys(imageManifest).forEach(category => {
    imageManifest[category].sort();
  });

  fs.writeFileSync(
    manifestPath,
    JSON.stringify(imageManifest, null, 2),
    'utf-8'
  );
  
  console.log(`\n📝 Manifest saved to: ${manifestPath}`);
  
  // Print summary
  console.log('\n📊 Summary:');
  Object.entries(imageManifest).forEach(([category, images]) => {
    console.log(`  ${category}: ${images.length} images`);
  });
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting image download from Google Drive...\n');
  
  const startTime = Date.now();
  
  try {
    await downloadFolder(FOLDER_ID);
    saveManifest();
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n✨ All done! Completed in ${duration}s`);
  } catch (error) {
    console.error('\n💥 Fatal error:', error.message);
    process.exit(1);
  }
}

main();