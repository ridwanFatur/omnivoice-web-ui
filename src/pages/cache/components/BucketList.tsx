import { useCachePageContext } from "../CachePageContext";

export default function BucketList() {
  const {
    buckets,
    selectedBucket,
    setSelectedBucket,
    setSelectedEntry,
    setSearch,
    loading,
  } = useCachePageContext();

  return (
    <aside className="h-fit rounded-2xl border border-blue-900/60 bg-cache-bg-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold">Buckets</h2>
        <span className="rounded-lg bg-blue-500/15 px-2 py-1 text-xs text-blue-300">
          {buckets.length}
        </span>
      </div>

      {loading && buckets.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-500">Loading caches...</p>
      ) : buckets.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-500">No cache buckets found.</p>
      ) : (
        <div className="space-y-2">
          {buckets.map((bucket) => (
            <button
              key={bucket.name}
              onClick={() => {
                setSelectedBucket(bucket.name);
                setSelectedEntry(null);
                setSearch("");
              }}
              className={`w-full cursor-pointer rounded-xl border p-3 text-left transition ${selectedBucket === bucket.name
                  ? "border-cyan-500/50 bg-blue-600/15"
                  : "border-transparent hover:border-blue-900 hover:bg-cache-bg-hover"
                }`}
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-lg text-cyan-400">▤</span>
                <div className="min-w-0 flex-1">
                  <p className="break-all text-sm font-medium">{bucket.name}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {bucket.entries.length} entries
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </aside>
  );
}