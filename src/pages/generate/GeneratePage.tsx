import { UploadCloud, Loader2, Download } from "lucide-react"
import { GeneratePageProvider, useGeneratePageContext } from "./GeneratePageContext"

export default function GeneratePage() {
  return (
    <GeneratePageProvider>
      <_GeneratePage />
    </GeneratePageProvider>
  )
}

function _GeneratePage() {
  const {
    uploadedAudioUrl,
    uploadedFileName,
    refText,
    setRefText,
    text,
    setText,
    isGenerating,
    generatedAudioUrl,
    handleAudioUpload,
    handleGenerate
  } = useGeneratePageContext()

  return (
    <div className="min-h-screen bg-[var(--color-cache-bg-main)] text-slate-100 font-sans p-6">
      <div className="max-w-2xl mx-auto bg-[var(--color-cache-bg-card)] border border-slate-800 rounded-xl shadow-2xl p-6 md:p-8">

        <h2 className="text-2xl font-bold mb-6 text-[var(--color-cache-cyan-base)] tracking-wide">
          Audio Generation Dashboard
        </h2>

        <section className="mb-6">
          <label className="block mb-2 font-medium text-slate-300">
            Upload Reference Audio:
          </label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-700 border-dashed rounded-lg cursor-pointer bg-[var(--color-cache-bg-main)] hover:bg-[var(--color-cache-bg-hover)] transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                <UploadCloud className="w-8 h-8 mb-2 text-slate-400" />
                <p className="mb-1 text-sm text-slate-400">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-slate-500">Audio files (WAV, MP3, etc.)</p>
              </div>
              <input type="file" className="hidden" accept="audio/*" onChange={handleAudioUpload} />
            </label>
          </div>

          {uploadedAudioUrl && (
            <div className="mt-4 p-4 bg-[var(--color-cache-bg-main)] rounded-lg border border-slate-800">
              <p className="mb-2 text-xs text-slate-400 truncate">
                File: <span className="text-slate-200 font-medium">{uploadedFileName}</span>
              </p>
              <audio controls src={uploadedAudioUrl} className="w-full h-10 accent-[var(--color-cache-cyan-base)]" />
            </div>
          )}
        </section>

        <section className="mb-6 space-y-4">
          <div>
            <label className="block mb-1.5 font-medium text-slate-300 text-sm">
              Reference Text (ref_text):
            </label>
            <textarea
              rows={3}
              className="w-full p-3 bg-[var(--color-cache-bg-main)] border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[var(--color-cache-cyan-base)] transition-colors text-sm"
              value={refText}
              onChange={(e) => setRefText(e.target.value)}
              placeholder="Masukkan teks referensi..."
            />
          </div>

          <div>
            <label className="block mb-1.5 font-medium text-slate-300 text-sm">
              Target Text (text):
            </label>
            <textarea
              rows={3}
              className="w-full p-3 bg-[var(--color-cache-bg-main)] border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[var(--color-cache-cyan-base)] transition-colors text-sm"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Masukkan teks yang ingin digenerate..."
            />
          </div>
        </section>

        <section className="mb-6">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all shadow-md flex items-center justify-center space-x-2 ${isGenerating
              ? 'bg-slate-700 opacity-60 cursor-not-allowed'
              : 'bg-[var(--color-cache-blue-base)] hover:opacity-90 active:scale-[0.99]'
              }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                <span>Generating Audio...</span>
              </>
            ) : (
              <span>Generate</span>
            )}
          </button>
        </section>

        {generatedAudioUrl && (
          <section className="p-4 bg-[var(--color-cache-bg-main)] border border-slate-800 rounded-xl animate-fade-in">
            <h3 className="text-md font-semibold mb-3 text-[var(--color-cache-cyan-base)]">
              Generated Audio Output (24 kHz)
            </h3>
            <audio controls src={generatedAudioUrl} className="w-full h-10 mb-4 accent-[var(--color-cache-cyan-base)]" />
            <div>
              <a
                href={generatedAudioUrl}
                download="generated_audio_24k.wav"
                className="inline-flex items-center justify-center w-full py-2.5 px-4 bg-[var(--color-cache-cyan-base)] text-[var(--color-cache-bg-main)] font-bold rounded-lg hover:opacity-90 transition-opacity text-sm gap-2"
              >
                <Download className="w-4 h-4" />
                Download Audio (.wav)
              </a>
            </div>
          </section>
        )}

      </div>
    </div>
  )
}