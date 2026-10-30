import * as ort from 'onnxruntime-web'

export const sessionCache = new Map<string, ort.InferenceSession>()