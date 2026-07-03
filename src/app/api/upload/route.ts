import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { auth } from '@/auth';
import { updateProfileImage } from '@/lib/profileStore';
import { demoMutationResponse, getDemoUserId, isDemoMode } from '@/lib/demoMode';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const simulatedUserId = getDemoUserId(request);
    
    const activeUserId = session?.user?.id || simulatedUserId;

    if (!activeUserId) {
      return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
    }
    if (isDemoMode()) return demoMutationResponse();

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // 1. Validate MIME type
    const validMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validMimeTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only JPG, PNG, and WebP are allowed.' }, { status: 400 });
    }

    // 2. Validate file size (e.g., 4MB limit)
    const MAX_SIZE_MB = 4;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return NextResponse.json({ error: `File size exceeds the ${MAX_SIZE_MB}MB limit.` }, { status: 400 });
    }

    // 2.5 Verify Token exists
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    if (!blobToken || blobToken === 'blob_token' || blobToken === 'REAL_VERCEL_BLOB_READ_WRITE_TOKEN_HERE') {
      return NextResponse.json({ error: 'Upload storage is not configured. Please set BLOB_READ_WRITE_TOKEN.' }, { status: 500 });
    }

    // 3. Upload to Vercel Blob
    const blob = await put(file.name, file, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN, // Ensure this handles missing token if possible
    });

    // 4. Save the blob URL to the user's MatrimonialProfile
    const updatedProfile = await updateProfileImage(activeUserId, blob.url, null);

    if (!updatedProfile) {
       return NextResponse.json({ error: 'User profile not found. Please complete profile registration first.' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      url: blob.url,
      message: 'Profile photo uploaded successfully. Pending admin approval.' 
    });

  } catch (error) {
    console.error('Upload error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Upload failed';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
