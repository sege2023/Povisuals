
// scripts/full-pipeline.js
// Run this with: node scripts/full-pipeline.js

import { downloadFolder, saveManifest } from './download-images.js';
import { generateImageSizes } from './generate-sizes.js';
import { uploadToR2 } from './upload-to-r2.js';
import { FOLDER_ID } from './config.js';

async function runPipeline() {
  console.log('🚀 Starting full image processing pipeline...\n');
  const startTime = Date.now();

  try {
    // Step 1: Download from Google Drive
    console.log('📥 Step 1: Downloading images from Google Drive');
    await downloadFolder(FOLDER_ID);
    saveManifest();
    console.log('✅ Download complete\n');

    // Step 2: Generate sizes with Sharp
    console.log('🖼️  Step 2: Generating responsive image sizes');
    await generateImageSizes('./public/downloaded-images');
    console.log('✅ Image sizes generated\n');

    // Step 3: Upload to Cloudflare R2 (optional)
    if (process.env.USE_R2 === 'true') {
      console.log('☁️  Step 3: Uploading to Cloudflare R2');
      await uploadToR2('./public/downloaded-images');
      console.log('✅ Upload to R2 complete\n');
    } else {
      console.log('⏭️  Step 3: Skipping R2 upload (USE_R2 not enabled)\n');
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n🎉 Pipeline complete! Took ${duration}s`);
  } catch (error) {
    console.error('\n💥 Pipeline failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

runPipeline();

// ===== scripts/generate-sizes.js =====
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const sizes = [
  { suffix: '_small', width: 600, height: 400 },
  { suffix: '_medium', width: 800, height: 600 },
  { suffix: '_large', width: 1200, height: 800 }
];

export async function generateImageSizes(baseDir) {
  const processedCount = { total: 0, created: 0, skipped: 0 };

  async function processDirectory(dir) {
    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(dir, item.name);

      if (item.isDirectory()) {
        // Recurse into subdirectories
        await processDirectory(fullPath);
      } else if (item.isFile() && /\.(jpg|jpeg|png)$/i.test(item.name)) {
        // Skip if already a sized version
        if (/_small|_medium|_large/i.test(item.name)) {
          continue;
        }

        processedCount.total++;
        const fileName = path.parse(item.name).name;
        const fileExt = path.parse(item.name).ext;

        console.log(`  Processing: ${item.name}`);

        for (const size of sizes) {
          const outputPath = path.join(dir, `${fileName}${size.suffix}${fileExt}`);

          if (fs.existsSync(outputPath)) {
            processedCount.skipped++;
            continue;
          }

          try {
            await sharp(fullPath)
              .resize(size.width, size.height, {
                fit: 'cover',
                position: 'center'
              })
              .jpeg({ quality: 85, mozjpeg: true })
              .toFile(outputPath);

            processedCount.created++;
            console.log(`    ✅ ${fileName}${size.suffix}${fileExt}`);
          } catch (error) {
            console.error(`    ❌ Error: ${error.message}`);
          }
        }
      }
    }
  }

  await processDirectory(baseDir);

  console.log(`\n📊 Processed ${processedCount.total} images`);
  console.log(`   Created: ${processedCount.created} variants`);
  console.log(`   Skipped: ${processedCount.skipped} (already exist)`);
}