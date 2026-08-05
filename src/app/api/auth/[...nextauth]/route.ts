import { handlers } from '@/auth';

export async function GET(req: Request) {
  try {
    return await handlers.GET(req);
  } catch (err: any) {
    console.error('[AUTH GET ERROR]', err?.message || err, err?.stack);
    return new Response(
      JSON.stringify({ error: err?.message || 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function POST(req: Request) {
  try {
    return await handlers.POST(req);
  } catch (err: any) {
    console.error('[AUTH POST ERROR]', err?.message || err, err?.stack);
    return new Response(
      JSON.stringify({ error: err?.message || 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
