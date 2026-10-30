import { useState } from "react";
import { useCachePageContext } from "../CachePageContext";
import { formatBytes } from "../utils";

export default function EntryList() {
  const {
    currentBucket,
    filteredEntries,
    selectedEntry,
    setSelectedEntry,
    search,
    setSearch,
    loading,
    buckets,
  } = useCachePageContext();

  const [copied, setCopied] = useState(false);

  // Fungsi untuk menyalin nama bucket dan semua entry
  const handleCopyConfig = () => {
    if (!currentBucket) return;

    const configData = {
      bucketName: currentBucket.name,
      totalEntries: filteredEntries.length,
      entries: filteredEntries,
    };

    navigator.clipboard.writeText(JSON.stringify(configData, null, 2)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset teks "Copied!" setelah 2 detik
    });
  };

  return (
    <>
      <div className="rounded-2xl border border-blue-900/60 bg-cache-bg-card p-4 sm:p-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wider text-slate-500">Selected bucket</p>
            <h2 className="mt-1 break-all text-lg font-semibold">
              {currentBucket?.name ?? "No bucket selected"}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Tombol Copy Config */}
            <button
              onClick={handleCopyConfig}
              disabled={!currentBucket}
              className="flex items-center gap-1.5 rounded-lg border border-blue-900/60 bg-cache-bg-main px-3 py-1.5 text-xs text-slate-300 transition hover:bg-blue-600/20 hover:text-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              title="Copy bucket name and entries"
            >
              <span>{copied ? "✓ Copied!" : "📋 Copy Config"}</span>
            </button>

            <span className="w-fit rounded-lg border border-blue-900/60 bg-cache-bg-main px-3 py-1.5 text-xs text-slate-400">
              {filteredEntries.length} keys
            </span>
          </div>
        </div>

        <div className="relative mt-5">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">⌕</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search cache keys or URLs..."
            className="w-full rounded-xl border border-blue-900/60 bg-cache-bg-main py-3 pl-10 pr-4 text-sm outline-none placeholder:text-slate-600 focus:border-cyan-500/60"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-blue-900/60 bg-cache-bg-card">
        <div className="border-b border-blue-900/60 px-5 py-4">
          <h3 className="font-semibold">Cache Entries</h3>
          <p className="mt-1 text-xs text-slate-500">
            Select an entry to inspect its metadata.
          </p>
        </div>

        {loading && buckets.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">Reading Cache Storage...</div>
        ) : filteredEntries.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm text-slate-400">
              {search ? "No matching cache keys." : "This bucket has no entries."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-blue-950">
            {filteredEntries.map((entry, index) => (
              <button
                key={`${entry.url}-${index}`}
                onClick={() => setSelectedEntry(entry)}
                className={`w-full cursor-pointer p-4 text-left transition hover:bg-cache-bg-hover ${selectedEntry?.url === entry.url ? "bg-blue-600/10" : ""
                  }`}
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-sm text-cyan-400">
                    #
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="break-all text-sm font-medium text-slate-200">{entry.url}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                      <span className="rounded-md bg-blue-500/10 px-2 py-1 text-blue-300">
                        {entry.method}
                      </span>
                      <span
                        className={`rounded-md px-2 py-1 ${entry.status >= 200 && entry.status < 300
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-slate-700/50 text-slate-400"
                          }`}
                      >
                        HTTP {entry.status || "Unknown"}
                      </span>
                      <span className="text-slate-500">{formatBytes(entry.size)}</span>
                    </div>
                  </div>
                  <span className="text-slate-600">›</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}