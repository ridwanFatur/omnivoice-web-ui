import { useCachePageContext } from "../CachePageContext";

export default function CachePageHeader() {
  const { loading, openUpload, loadCaches } = useCachePageContext();

  return (
    <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
          <span className="h-2 w-2 rounded-full bg-cyan-400" />
          Browser Storage
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Cache Storage</h1>
        <p className="mt-2 text-sm text-slate-400">
          Inspect cache buckets, keys, and stored responses.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={openUpload}
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/15 px-4 py-2.5 text-sm font-medium text-cyan-200 transition hover:bg-cyan-500/25"
        >
          <span>↑</span>
          Upload local files
        </button>
        <button
          onClick={() => void loadCaches()}
          disabled={loading}
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-blue-500/30 bg-blue-600/15 px-4 py-2.5 text-sm font-medium text-blue-300 transition hover:bg-blue-600/25 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className={loading ? "animate-spin" : ""}>↻</span>
          Refresh
        </button>
      </div>
    </header>
  );
}