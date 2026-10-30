import { MODEL_CONFIGS } from "../../utils/onnxModels";
import { OnnxPageProvider, useOnnxPageContext } from "./OnnxPageContext";

export default function OnnxPage() {
  return (
    <OnnxPageProvider>
      <_OnnxPage />
    </OnnxPageProvider>
  );
}

function _OnnxPage() {
  const {
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
  } = useOnnxPageContext();

  return (
    <div className="min-h-screen bg-cache-bg-main text-slate-100 flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-2xl bg-cache-bg-card border border-slate-800/80 rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-slate-800 pb-5 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-[var(--color-cache-cyan-base,#22d3ee)] animate-pulse"></span>
              ONNX Runtime Web
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Browser-side multi-model inference from cache
            </p>
          </div>

          <div>
            {isLoading ? (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Loading Model...
              </span>
            ) : session ? (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Model Ready
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                Error
              </span>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-sm">
            <p className="font-semibold mb-1">An Error Occurred:</p>
            <p className="font-mono text-xs break-all">{error}</p>
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Select ONNX Model Configuration
          </label>
          <select
            value={selectedModelId}
            onChange={(e) => setSelectedModelId(e.target.value)}
            disabled={isInferring}
            className="w-full px-4 py-2.5 rounded-lg bg-[var(--color-cache-bg-hover,#101D39)] border border-slate-700/60 text-white focus:outline-none focus:border-[var(--color-cache-cyan-base,#22d3ee)] transition disabled:opacity-50"
          >
            {MODEL_CONFIGS.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name} ({model.cacheName})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6 p-4 rounded-xl bg-[var(--color-cache-bg-hover,#101D39)] border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
          <div className="text-slate-400 mb-1">// Model Configuration Details</div>
          <div>
            <span className="text-[var(--color-cache-cyan-base,#22d3ee)]">Cache bucket:</span> {currentConfig.cacheName}
          </div>
          <div>
            <span className="text-[var(--color-cache-cyan-base,#22d3ee)]">Inputs:</span>
            <ul className="pl-4 mt-1 space-y-1">
              {currentConfig.inputs && currentConfig.inputs.length > 0 ? (
                currentConfig.inputs.map((inp, idx) => (
                  <li key={idx}>
                    <span className="text-slate-200">{inp.name}</span>: {JSON.stringify(inp.shape)} ({inp.type || 'float32'})
                  </li>
                ))
              ) : (
                <li className="text-slate-500 italic">Auto-detected from session inputs</li>
              )}
            </ul>
          </div>
        </div>

        <button
          onClick={handleRunInference}
          disabled={!session || isInferring}
          className="w-full py-3 rounded-xl font-semibold text-white bg-[var(--color-cache-blue-base,#2563eb)] hover:opacity-90 active:scale-[0.99] transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20 mb-2"
        >
          {isInferring ? 'Processing Inference...' : 'Run Inference with Random Input'}
        </button>

        {outputInfo && (
          <div className="mt-6 pt-6 border-t border-slate-800">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold text-slate-200">Output Tensor Metadata</h3>

              {inferenceTime !== null && (
                <span className="text-xs text-emerald-400 font-mono">
                  Latency: {inferenceTime} ms
                </span>
              )}
            </div>

            <div className="p-4 rounded-xl bg-[var(--color-cache-bg-hover,#101D39)] border border-slate-700/50 font-mono text-sm text-[var(--color-cache-cyan-base,#22d3ee)] space-y-1">
              <div>
                <span className="text-slate-400">Shape:</span> {JSON.stringify(outputInfo.shape)}
              </div>
              <div>
                <span className="text-slate-400">Type:</span> {outputInfo.type}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}