import { useCachePageContext } from "../CachePageContext";
import { formatBytes } from "../utils";

export default function EntryDetails() {
  const { selectedEntry, setSelectedEntry, selectedBucket, copyUrl } = useCachePageContext();

  if (!selectedEntry) return null;

  const details = [
    ["Bucket", selectedBucket ?? "-"],
    ["Request URL", selectedEntry.url],
    ["Method", selectedEntry.method],
    ["HTTP Status", String(selectedEntry.status)],
    ["Content-Type", selectedEntry.contentType],
    ["Response Size", formatBytes(selectedEntry.size)],
  ];

  return (
    <div className="rounded-2xl border border-cyan-500/30 bg-cache-bg-card p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="font-semibold">Entry Details</h3>
        <button
          onClick={() => setSelectedEntry(null)}
          className="cursor-pointer rounded-lg px-2 py-1 text-sm text-slate-400 hover:bg-white/5 hover:text-white"
        >
          Close
        </button>
      </div>

      <dl className="space-y-4 text-sm">
        {details.map(([label, value]) => (
          <div
            key={label}
            className="grid grid-cols-1 gap-1 sm:grid-cols-[130px_minmax(0,1fr)]"
          >
            <dt className="text-slate-500">{label}</dt>
            <dd className="break-all text-slate-200">{value}</dd>
          </div>
        ))}
      </dl>

      <button
        onClick={() => void copyUrl(selectedEntry.url)}
        className="mt-5 cursor-pointer rounded-xl border border-blue-800/70 bg-blue-600/15 px-4 py-2 text-sm text-blue-300 hover:bg-blue-600/25"
      >
        Copy URL
      </button>
    </div>
  );
}