export interface ModelInputConfig {
  name: string
  shape: number[]
  type?: 'float32' | 'int64' | 'int32'
}

export interface ModelConfig {
  id: string
  name: string
  cacheName: string
  inputs: ModelInputConfig[]
}

export const MODEL_CONFIGS: ModelConfig[] = [
  {
    id: '1',
    name: 'Simple ONNX',
    cacheName: 'simple_onnx',
    inputs: [
      { name: 'features', shape: [1, 2], type: 'float32' }
    ],
  },
  {
    id: '2',
    name: 'Audio Tokenizer - Encoder',
    cacheName: 'onnx_higgs_audio_v2_tokenizer_encoder',
    inputs: [
      { name: 'input_values', shape: [1, 1, 24000], type: 'float32' }
    ],
  },
  {
    id: '3',
    name: 'Audio Tokenizer - Decoder',
    cacheName: 'onnx_higgs_audio_v2_tokenizer_decoder',
    inputs: [
      { name: 'audio_codes', shape: [1, 8, 25], type: 'int64' }
    ],
  },
  {
    id: '4',
    name: 'Audio Embeddings',
    cacheName: 'onnx_omnivoice_audio_embeddings',
    inputs: [
      { name: 'input_ids', shape: [2, 8, 250], type: 'int64' }
    ],
  },
  {
    id: '5',
    name: 'Audio Heads',
    cacheName: 'onnx_omnivoice_audio_heads',
    inputs: [
      { name: 'hidden_states', shape: [2, 240, 1024], type: 'float32' }
    ],
  },
  {
    id: '6',
    name: 'Qwen3 Input Embeddings',
    cacheName: 'onnx_qwen3_input_embeddings',
    inputs: [
      { name: 'input_ids', shape: [2, 220], type: 'int64' }
    ],
  },
  {
    id: '7',
    name: 'Qwen3 (Multi-Input Python Equivalent)',
    cacheName: 'onnx_qwen3',
    inputs: [
      { name: 'inputs_embeds', shape: [2, 240, 1024], type: 'float32' },
      { name: 'attention_mask', shape: [2, 1, 240, 240], type: 'float32' },
    ],
  },
]