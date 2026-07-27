import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

let s3: S3Client | null = null;

function getS3Client(): S3Client {
  if (s3) return s3;

  const bucket = process.env.AWS_S3_BUCKET;
  const region = process.env.AWS_S3_REGION;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (!bucket || !region || !accessKeyId || !secretAccessKey) {
    throw new Error(
      'AWS S3 is not configured. Required: AWS_S3_BUCKET, AWS_S3_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY.'
    );
  }

  s3 = new S3Client({
    region,
    credentials: { accessKeyId, secretAccessKey },
  });

  return s3;
}

export async function uploadToS3(file: File): Promise<{ url: string }> {
  const bucket = process.env.AWS_S3_BUCKET;
  const region = process.env.AWS_S3_REGION;
  const client = getS3Client();

  const ext = file.name.split('.').pop() || 'jpg';
  const key = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const arrayBuffer = await file.arrayBuffer();

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: Buffer.from(arrayBuffer),
      ContentType: file.type,
    })
  );

  const publicUrl = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
  return { url: publicUrl };
}