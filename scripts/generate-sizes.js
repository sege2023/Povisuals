// import sharp from 'sharp';
// import fs from 'fs';
// import path from 'path';

// const sizes = [
//   { suffix: '_small', width: 600, height: 400 },
//   { suffix: '_medium', width: 800, height: 600 },
//   { suffix: '_large', width: 1200, height: 800 }
// ];

// const formats = ['webp', 'jpg'];

// export async function generateImageSizes(baseDir) {
//   const processedCount = { total: 0, created: 0, skipped: 0 };

//   async function processDirectory(dir) {
//     const items = fs.readdirSync(dir, { withFileTypes: true });

//     for (const item of items) {
//       const fullPath = path.join(dir, item.name);

//       if (item.isDirectory()) {
//         // Recurse into subdirectories
//         await processDirectory(fullPath);
//       } else if (item.isFile() && /\.(jpg|jpeg|png)$/i.test(item.name)) {
//         // Skip if already a sized version
//         if (/_small|_medium|_large/i.test(item.name)) {
//           continue;
//         }

//         processedCount.total++;
//         const fileName = path.parse(item.name).name;
//         const fileExt = path.parse(item.name).ext;

//         console.log(`  Processing: ${item.name}`);

//         // for (const size of sizes) {
//         //   const outputPath = path.join(dir, `${fileName}${size.suffix}${fileExt}`);

//         //   if (fs.existsSync(outputPath)) {
//         //     processedCount.skipped++;
//         //     continue;
//         //   }

//         //   try {
//         //     await sharp(fullPath)
//         //       .resize(size.width, size.height, {
//         //         fit: 'cover',
//         //         position: 'center'
//         //       })
//         //       .jpeg({ quality: 85, mozjpeg: true })
//         //       .toFile(outputPath);

//         //     processedCount.created++;
//         //     console.log(`    ✅ ${fileName}${size.suffix}${fileExt}`);
//         //   } catch (error) {
//         //     console.error(`    ❌ Error: ${error.message}`);
//         //   }
//         // }

//         for (const size of sizes) {
//           for (const format of formats) {
//             const outputPath = path.join(
//               dir, 
//               `${fileName}${size.suffix}.${format}`
//           );
//           if (fs.existsSync(outputPath)) {
//             processedCount.skipped++;
//             continue;
//           }

//           if (format === 'webp') {
//             await sharp(fullPath)
//               .resize(size.width, size.height, {
//                 fit: 'cover',
//                 position: 'center'
//               })
//               .webp({ quality: 85 })  // ← WebP conversion
//               .toFile(outputPath);
//           } else {
//             await sharp(fullPath)
//               .resize(size.width, size.height, {
//                 fit: 'cover',
//                 position: 'center'
//               })
//               .jpeg({ quality: 85, mozjpeg: true })
//               .toFile(outputPath);
//           }
//           }
//         }
//       }
//     }
//   }

//   await processDirectory(baseDir);

//   console.log(`\n📊 Processed ${processedCount.total} images`);
//   console.log(`   Created: ${processedCount.created} variants`);
//   console.log(`   Skipped: ${processedCount.skipped} (already exist)`);
// }


import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const sizes = [
  { suffix: '_small', width: 600},
  { suffix: '_medium', width: 800 },
  { suffix: '_large', width: 1200  }
];

const formats = ['webp', 'jpg'];

export async function generateImageSizes(baseDir) {
  // Check if directory exists before starting
  if (!fs.existsSync(baseDir)) {
    console.error(`❌ Directory not found: ${baseDir}`);
    return;
  }

  const processedCount = { total: 0, created: 0, skipped: 0, errors: 0 };

  async function processDirectory(dir) {
    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(dir, item.name);

      if (item.isDirectory()) {
        // Recurse into subdirectories
        await processDirectory(fullPath);
      } 
      // Check file type
      else if (item.isFile() && /\.(jpg|jpeg|png)$/i.test(item.name)) {
        
        // Skip if this file is ALREADY a generated size (prevents infinite loops)
        if (/_small|_medium|_large/i.test(item.name)) {
          continue;
        }

        processedCount.total++;
        const fileName = path.parse(item.name).name; 
        
        console.log(`\n📸 Processing Source: ${item.name}`);

        for (const size of sizes) {
          for (const format of formats) {
            const newFileName = `${fileName}${size.suffix}.${format}`;
            const outputPath = path.join(dir, newFileName);

            if (fs.existsSync(outputPath)) {
              processedCount.skipped++;
              continue;
            }

            try {
              // Create the Sharp instance based on the source file
              const imagePipeline = sharp(fullPath).resize({width: size.width  
              });

              if (format === 'webp') {
                await imagePipeline
                  .webp({ quality: 85 })
                  .toFile(outputPath);
              } else {
                await imagePipeline
                  .jpeg({ quality: 85, mozjpeg: true })
                  .toFile(outputPath);
              }

              processedCount.created++;
              console.log(`   ✅ Created: ${newFileName}`);
            } catch (error) {
              processedCount.errors++;
              console.error(`   ❌ Error creating ${newFileName}: ${error.message}`);
            }
          }
        }
      }
    }
  }

  console.log(`🚀 Starting image generation in: ${baseDir}`);
  await processDirectory(baseDir);

  console.log(`\n📊 Summary:`);
  console.log(`   Total Source Images: ${processedCount.total}`);
  console.log(`   Variants Created:    ${processedCount.created}`);
  console.log(`   Skipped (Existed):   ${processedCount.skipped}`);
  console.log(`   Errors:              ${processedCount.errors}`);
}

// --- EXECUTION BLOCK ---

// 1. Get the project root (where you run the command from)
const projectRoot = process.cwd(); 

// 2. Construct path to public/download-images
const targetDirectory = path.join(projectRoot, 'public', 'download-images');

// 3. Run the function
generateImageSizes(targetDirectory);