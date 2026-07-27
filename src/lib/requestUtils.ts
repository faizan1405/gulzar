/**
 * Utility for request body size validation.
 *
 * Usage:
 *   const body = await safeJsonBody(req, { maxSize: 100 }); // 100 KB
 *   if (!body) return; // error already sent
 */

export interface JsonBodyOptions {
  maxSizeKB: number;
  errorMessage?: string;
}

export async function safeJsonBody(
  req: Request,
  opts: JsonBodyOptions = { maxSizeKB: 100 }
): Promise<any | null> {
  const maxSizeBytes = opts.maxSizeKB * 1024;

  // Check Content-Length header if present
  const contentLength = req.headers.get('content-length');
  if (contentLength) {
    const size = parseInt(contentLength, 10);
    if (!isNaN(size) && size > maxSizeBytes) {
      return new Response(
        JSON.stringify({ error: opts.errorMessage || `Request body exceeds the maximum allowed size of ${opts.maxSizeKB}KB.` }),
        { status: 413, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  try {
    return await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid request body format.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
