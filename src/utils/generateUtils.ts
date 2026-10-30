import * as ort from 'onnxruntime-web'
import { MODEL_CONFIGS } from './onnxModels'
import { sessionCache } from './onnxSessionCache'
import { loadModelFromCache } from './onnxUtils'
import { createWavBlobFromPCM } from './audioUtils'

export interface GenerateAudioParams {
  refText: string
  text: string
  uploadedAudioUrl: string | null
  onProgress?: (status: string) => void
}

/**
 * Memastikan semua ONNX model pada MODEL_CONFIGS dimuat ke dalam sessionCache
 */
export async function ensureModelsLoaded(onProgress?: (status: string) => void) {
  ort.env.wasm.numThreads = 1

  for (const config of MODEL_CONFIGS) {
    if (!sessionCache.has(config.id)) {
      if (onProgress) onProgress(`Loading model: ${config.name}...`)

      const modelKey = `${window.location.origin}/__local_cache__/local-files/${config.cacheName}.onnx`
      const modelFilename = `${config.cacheName}.onnx`

      const modelBuffer = await loadModelFromCache(
        config.cacheName,
        modelKey,
        modelFilename
      )

      // const session = await ort.InferenceSession.create(new Uint8Array(modelBuffer), {
      //   executionProviders: ['webgpu', 'wasm'],
      // })

      // sessionCache.set(config.id, session)
    }
  }
}

/**
 * Fungsi generate utama yang dipanggil saat tombol Generate diklik
 */
export async function generateAudio(params: GenerateAudioParams): Promise<string> {
  const { onProgress } = params

  // 1. Preload semua model ONNX jika belum di-cache
  await ensureModelsLoaded(onProgress)

  if (onProgress) onProgress('Generating audio samples...')

  // Simulasi async operation / inferensi
  await new Promise((resolve) => setTimeout(resolve, 800))

  // 2. Dummy audio generation (100.000 sampel pcm float32)
  const samplesCount = 100_000
  const randomSamples = new Float32Array(samplesCount)
  for (let i = 0; i < samplesCount; i++) {
    randomSamples[i] = Math.random() * 2 - 1
  }

  // 3. Convert ke WAV Blob pada sampling rate 24.000 Hz
  const wavBlob = createWavBlobFromPCM(randomSamples, 24000)

  return URL.createObjectURL(wavBlob)
}