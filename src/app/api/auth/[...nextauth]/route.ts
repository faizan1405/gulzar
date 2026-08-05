import { NextRequest, NextResponse } from 'next/server';
import { handlers } from '@/auth';

export async function GET(req: NextRequest) {
  try {
    return await handlers.GET(req);
  } catch (err: any) {
    console.error('[AUTH GET ERROR]', err?.message || err, err?.stack);
    return NextResponse.json({ error: err?.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    return await handlers.POST(req as NextRequest);
  } catch (err: any) {
    console.error('[AUTH POST ERROR]', err?.message || err, err?.stack);
    return NextResponse.json({ error: err?.message || 'Internal Server Error' }, { status: 500 });
  }
}
