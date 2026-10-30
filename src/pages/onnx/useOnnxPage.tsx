import { useState, useEffect } from 'react'
import * as ort from 'onnxruntime-web'
import { loadModelFromCache } from '../../utils/onnxUtils'
import { MODEL_CONFIGS } from '../../utils/onnxModels'
import { sessionCache } from '../../utils/onnxSessionCache'

export default function useOnnxPage() {
  const [selectedModelId, setSelectedModelId] = useState<string>(MODEL_CONFIGS[0].id)
  const [session, setSession] = useState<ort.InferenceSession | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isInferring, setIsInferring] = useState<boolean>(false)
  const [outputInfo, setOutputInfo] = useState<{ shape: readonly number[]; type: string } | null>(null)
  const [inferenceTime, setInferenceTime] = useState<number | null>(null)
  const [currentInputData, setCurrentInputData] = useState<Record<string, number[]>>({})

  const currentConfig = MODEL_CONFIGS.find((m) => m.id === selectedModelId) || MODEL_CONFIGS[0]
  const MODEL_KEY = `${window.location.origin}/__local_cache__/local-files/model.onnx`
  const MODEL_FILENAME = 'model.onnx'

  useEffect(() => {
    let cancelled = false

    async function loadOrGetSession() {
      try {
        setIsLoading(true)
        setError(null)
        setOutputInfo(null)

        if (sessionCache.has(selectedModelId)) {
          const cachedSession = sessionCache.get(selectedModelId)!
          if (!cancelled) {
            setSession(cachedSession)
            setIsLoading(false)
          }
          return
        }

        ort.env.wasm.numThreads = 1

        const modelBuffer = await loadModelFromCache(
          currentConfig.cacheName,
          MODEL_KEY,
          MODEL_FILENAME
        )

        const newSession = await ort.InferenceSession.create(new Uint8Array(modelBuffer), {
          executionProviders: ['webgpu', 'wasm'],
        })

        sessionCache.set(selectedModelId, newSession)

        if (!cancelled) {
          console.log('inputNames:', newSession.inputNames, 'outputNames:', newSession.outputNames)
          setSession(newSession)
        }
      } catch (err: any) {
        console.error('Error loading ONNX model:', err)
        if (!cancelled) setError(err.message || 'An error occurred while loading the ONNX model.')
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    loadOrGetSession()

    return () => {
      cancelled = true
    }
  }, [selectedModelId])

  const handleRunInference = async () => {
    if (!session) return

    try {
      setIsInferring(true)
      setError(null)
      setOutputInfo(null)

      const startTime = performance.now()
      const feeds: Record<string, ort.Tensor> = {}
      const newInputsData: Record<string, number[]> = {}

      const activeInputs = currentConfig.inputs.length > 0
        ? currentConfig.inputs
        : session.inputNames.map((name, idx) => ({
          name,
          shape: idx === 0 ? [1, 240, 1024] : [1, 1, 240, 240],
          type: 'float32' as const
        }))

      for (const inputConfig of activeInputs) {
        const totalElements = inputConfig.shape.reduce((acc, val) => acc * val, 1)

        let randomValues: number[]
        if (inputConfig.name.includes('mask')) {
          randomValues = Array.from({ length: totalElements }, () => 1)
        } else {
          randomValues = Array.from({ length: totalElements }, () => Math.floor(Math.random() * 10))
        }

        newInputsData[inputConfig.name] = randomValues

        if (inputConfig.type === 'int64') {
          const bigIntData = BigInt64Array.from(randomValues.map((v) => BigInt(v)))
          feeds[inputConfig.name] = new ort.Tensor('int64', bigIntData, [...inputConfig.shape])
        } else if (inputConfig.type === 'int32') {
          const int32Data = Int32Array.from(randomValues)
          feeds[inputConfig.name] = new ort.Tensor('int32', int32Data, [...inputConfig.shape])
        } else {
          const floatData = Float32Array.from(randomValues.map((v) => Number(v)))
          feeds[inputConfig.name] = new ort.Tensor('float32', floatData, [...inputConfig.shape])
        }
      }

      setCurrentInputData(newInputsData)

      const outputName = session.outputNames[0]
      const results = await session.run(feeds)
      const outputTensor = results[outputName]

      if (outputTensor) {
        setOutputInfo({
          shape: outputTensor.dims,
          type: outputTensor.type,
        })
      }

      const endTime = performance.now()
      setInferenceTime(Number((endTime - startTime).toFixed(2)))
    } catch (err: any) {
      console.error('Inference Error:', err)
      setError(`Failed to run inference: ${err.message}`)
    } finally {
      setIsInferring(false)
    }
  }

  return {
    selectedModelId,
    setSelectedModelId,
    session,
    isLoading,
    error,
    isInferring,
    outputInfo,
    inferenceTime,
    currentInputData,
    currentConfig,
    handleRunInference,
  }
}