import { useCachePageContext } from "../CachePageContext";
import { formatBytes } from "../utils";

export default function CacheStats() {
  const { buckets, totalEntries, totalSize } = useCachePageContext();

  const stats = [
    { label: "Total Buckets", value: buckets.length, icon: "▤" },
    { label: "Total Entries", value: totalEntries, icon: "⌘" },
    { label: "Response Sizes", value: formatBytes(totalSize), icon: "◈" },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-blue-900/60 bg-cache-bg-card p-5"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">{item.label}</span>
            <span className="text-xl text-cyan-400">{item.icon}</span>
          </div>
          <p className="mt-3 text-3xl font-semibold tracking-tight">{item.value}</p>
        </div>
      ))}
    </section>
  );
}