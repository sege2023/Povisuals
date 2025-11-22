import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import mime from 'mime-types';

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY = process.env.R2_ACCESS_KEY;
const R2_SECRET_KEY = process.env.R2_SECRET_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'portfolio-images';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY,
    secretAccessKey: R2_SECRET_KEY,
  },
});

export async function uploadToR2(baseDir) {
  let uploadCount = 0;

  async function uploadDirectory(dir, prefix = '') {
    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      const key = prefix ? `${prefix}/${item.name}` : item.name;

      if (item.isDirectory()) {
        await uploadDirectory(fullPath, key);
      } else if (item.isFile()) {
        const fileContent = fs.readFileSync(fullPath);
        const contentType = mime.lookup(item.name) || 'application/octet-stream';

        try {
          await s3Client.send(new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: key,
            Body: fileContent,
            ContentType: contentType,
          }));

          uploadCount++;
          console.log(`  ✅ Uploaded: ${key}`);
        } catch (error) {
          console.error(`  ❌ Failed to upload ${key}:`, error.message);
        }
      }
    }
  }

  await uploadDirectory(baseDir);
  console.log(`\n📤 Uploaded ${uploadCount} files to R2`);
}