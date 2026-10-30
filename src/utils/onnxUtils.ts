export async function loadModelFromCache(
  cache_name: string,
  model_key: string,
  mode_filename: string
): Promise<ArrayBuffer> {
  console.log(`[Cache Loader] Checking Cache Storage availability for cache: "${cache_name}"...`)
  if (!('caches' in window)) {
    throw new Error('Cache Storage is not supported by this browser.')
  }

  console.log(`[Cache Loader] Opening cache bucket: "${cache_name}"...`)
  const cache = await caches.open(cache_name)

  console.log(`[Cache Loader] Attempting exact match for key: "${model_key}"...`)
  let response = await cache.match(model_key)

  if (!response) {
    console.log(`[Cache Loader] Exact match failed. Searching all keys in cache for filename ending with: "${mode_filename}"...`)
    const requests = await cache.keys()

    const found = requests.find((r) => {
      try {
        return decodeURIComponent(new URL(r.url).pathname).endsWith(`/${mode_filename}`)
      } catch {
        return false
      }
    })

    if (found) {
      console.log(`[Cache Loader] Found matching request URL: ${found.url}`)
      response = await cache.match(found)
    }

    if (!response) {
      const keys = requests.map((r) => r.url)
      console.warn(`[Cache Loader] Warning: "${mode_filename}" not found in bucket "${cache_name}". Available keys:`, keys)
      throw new Error(
        `"${mode_filename}" not found in bucket "${cache_name}". ` +
        `Available keys: ${keys.length ? keys.join(', ') : '(bucket is empty)'}`
      )
    }
  } else {
    console.log(`[Cache Loader] Successfully matched model using exact key: "${model_key}"`)
  }

  console.log(`[Cache Loader] Retrieving ArrayBuffer for "${mode_filename}"...`)
  const buffer = await response.arrayBuffer()
  console.log(`[Cache Loader] Model loaded successfully. Size: ${buffer.byteLength} bytes`)

  const head = new TextDecoder().decode(buffer.slice(0, 40)).trimStart()
  console.log(`[Cache Loader] File header check (first 40 chars): "${head.slice(0, 20)}..."`)

  if (head.startsWith('<')) {
    console.error(`[Cache Loader] Error: Cached content starts with '<'. It appears to be an HTML file instead of an ONNX binary.`)
    throw new Error('Cached content is HTML, not an ONNX file. Please re-upload model.onnx.')
  }

  if (buffer.byteLength < 100) {
    console.error(`[Cache Loader] Error: File is too small (${buffer.byteLength} bytes), likely corrupted.`)
    throw new Error(`File is too small (${buffer.byteLength} bytes), possibly corrupted.`)
  }

  console.log(`[Cache Loader] Validation passed. Returning ArrayBuffer.`)
  return buffer
}