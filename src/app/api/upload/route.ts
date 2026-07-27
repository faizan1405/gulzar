import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { uploadToS3 } from '@/lib/upload';
import { checkRateLimit } from '@/lib/rateLimit';

// Maximum file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication Required' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Rate limit per user
    const ip = (req as any).ip || req.headers.get('x-forwarded-for') || 'anonymous';
    if (checkRateLimit(`upload:${session.user.id}:${ip}`, 5, 60 * 1000)) {
      return NextResponse.json({ error: 'Too many uploads. Please try again later.' }, { status: 429 });
    }

    // Upload to S3
    const result = await uploadToS3(file);

    return NextResponse.json({ url: result.url });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 });
  }
}
