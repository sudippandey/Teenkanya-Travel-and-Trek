export const maxEnquiryRequestBodyBytes = 16_000

export type BoundedRequestBodyResult =
  | { ok: true; text: string }
  | { ok: false; reason: 'too_large' | 'invalid_content_length' | 'invalid_encoding' | 'read_error' }

async function cancelBody(body: ReadableStream<Uint8Array> | null) {
  if (!body) return

  try {
    await body.cancel()
  } catch {
    // The request may already be closed by the runtime.
  }
}

export async function readRequestBodyBounded(
  request: Request,
  maxBytes = maxEnquiryRequestBodyBytes,
): Promise<BoundedRequestBodyResult> {
  const contentLengthHeader = request.headers.get('content-length')
  if (contentLengthHeader !== null) {
    if (!/^\d+$/u.test(contentLengthHeader)) {
      await cancelBody(request.body)
      return { ok: false, reason: 'invalid_content_length' }
    }

    const contentLength = Number(contentLengthHeader)
    if (!Number.isSafeInteger(contentLength)) {
      await cancelBody(request.body)
      return { ok: false, reason: 'invalid_content_length' }
    }

    if (contentLength > maxBytes) {
      await cancelBody(request.body)
      return { ok: false, reason: 'too_large' }
    }
  }

  const reader = request.body?.getReader()
  if (!reader) return { ok: true, text: '' }

  const chunks: Uint8Array[] = []
  let totalBytes = 0

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      if (value.byteLength > maxBytes - totalBytes) {
        try {
          await reader.cancel()
        } catch {
          // The request may already be closed by the runtime.
        }
        return { ok: false, reason: 'too_large' }
      }

      chunks.push(value)
      totalBytes += value.byteLength
    }
  } catch {
    try {
      await reader.cancel()
    } catch {
      // The request may already be closed by the runtime.
    }
    return { ok: false, reason: 'read_error' }
  } finally {
    reader.releaseLock()
  }

  const bytes = new Uint8Array(totalBytes)
  let offset = 0
  for (const chunk of chunks) {
    bytes.set(chunk, offset)
    offset += chunk.byteLength
  }

  try {
    return { ok: true, text: new TextDecoder('utf-8', { fatal: true }).decode(bytes) }
  } catch {
    return { ok: false, reason: 'invalid_encoding' }
  }
}
