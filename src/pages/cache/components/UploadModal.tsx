import { useRef } from "react";
import { useCachePageContext } from "../CachePageContext";
import { formatBytes } from "../utils";

export default function UploadModal() {
  const {
    uploadOpen,
    setUploadOpen,
    bucketName,
    setBucketName,
    keyPrefix,
    setKeyPrefix,
    files,
    setFiles,
    uploading,
    uploadMessage,
    uploadFiles,
  } = useCachePageContext();

  const backdropMouseDown = useRef(false);

  if (!uploadOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        backdropMouseDown.current = event.target === event.currentTarget;
      }}
      onClick={(event) => {
        if (
          backdropMouseDown.current &&
          event.target === event.currentTarget &&
          !uploading
        ) {
          setUploadOpen(false);
        }
        backdropMouseDown.current = false;
      }}
    >
      <section className="w-full max-w-xl rounded-2xl border border-blue-800/70 bg-cache-bg-card p-5 shadow-2xl sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Upload local files</h2>
            <p className="mt-1 text-sm text-slate-400">
              Save files directly into a browser Cache Storage bucket.
            </p>
          </div>
          <button
            onClick={() => setUploadOpen(false)}
            disabled={uploading}
            className="cursor-pointer rounded-lg px-2 py-1 text-slate-400 hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close upload dialog"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">Bucket name</span>
            <input
              value={bucketName}
              onChange={(event) => setBucketName(event.target.value)}
              placeholder="e.g. transformers-cache"
              className="w-full rounded-xl border border-blue-900/60 bg-cache-bg-main px-3 py-3 text-sm outline-none placeholder:text-slate-600 focus:border-cyan-500/60"
            />
            <span className="mt-1 block text-xs text-slate-500">
              Enter an existing bucket name or a new name to create one.
            </span>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">Key prefix (optional)</span>
            <input
              value={keyPrefix}
              onChange={(event) => setKeyPrefix(event.target.value)}
              placeholder="local-files/"
              className="w-full rounded-xl border border-blue-900/60 bg-cache-bg-main px-3 py-3 text-sm outline-none placeholder:text-slate-600 focus:border-cyan-500/60"
            />
            <span className="mt-1 block text-xs text-slate-500">
              Example key: /__local_cache__/local-files/model.onnx
            </span>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">Files</span>
            <input
              type="file"
              multiple
              onChange={(event) => setFiles(Array.from(event.target.files ?? []))}
              className="block w-full cursor-pointer rounded-xl border border-blue-900/60 bg-cache-bg-main p-3 text-sm text-slate-300 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-blue-600/20 file:px-3 file:py-2 file:text-sm file:font-medium file:text-blue-200 hover:file:bg-blue-600/30"
            />
          </label>

          {files.length > 0 && (
            <div className="max-h-36 space-y-2 overflow-y-auto rounded-xl border border-blue-900/60 bg-cache-bg-main p-3">
              {files.map((file, index) => (
                <div key={`${file.name}-${file.lastModified}-${index}`} className="flex justify-between gap-3 text-xs">
                  <span className="min-w-0 break-all text-slate-300">{file.name}</span>
                  <span className="shrink-0 text-slate-500">{formatBytes(file.size)}</span>
                </div>
              ))}
            </div>
          )}

          {uploadMessage && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
              {uploadMessage}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setUploadOpen(false)}
              disabled={uploading}
              className="cursor-pointer rounded-xl border border-blue-900/60 px-4 py-2.5 text-sm text-slate-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={() => void uploadFiles()}
              disabled={uploading}
              className="cursor-pointer rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading ? "Uploading..." : `Upload ${files.length || ""} file${files.length === 1 ? "" : "s"}`}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}