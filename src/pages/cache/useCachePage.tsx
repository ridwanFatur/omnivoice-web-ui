import { useCallback, useEffect, useState } from "react";
import type { CacheBucket, CacheEntry } from "./models";

export default function useCachePage() {
  const [buckets, setBuckets] = useState<CacheBucket[]>([]);
  const [selectedBucket, setSelectedBucket] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<CacheEntry | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [bucketName, setBucketName] = useState("");
  const [keyPrefix, setKeyPrefix] = useState("local-files/");
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  const loadCaches = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      if (!("caches" in window)) {
        throw new Error("Cache Storage is not supported by this browser.");
      }

      const names = await caches.keys();
      const results = await Promise.all(
        names.map(async (name) => {
          const cache = await caches.open(name);
          const requests = await cache.keys();

          const entries: CacheEntry[] = requests.map((request): CacheEntry => {
            return {
              url: request.url,
              method: request.method,
              status: 0,
              contentType: "Unknown",
              size: null,
            };
          });

          return { name, entries };
        }),
      );

      setBuckets(results);
      setSelectedBucket((current) => {
        if (current && results.some((bucket) => bucket.name === current)) {
          return current;
        }
        return results[0]?.name ?? null;
      });
      setSelectedEntry(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load Cache Storage.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCaches();
  }, [loadCaches]);

  const currentBucket = buckets.find((bucket) => bucket.name === selectedBucket);
  const filteredEntries = (currentBucket?.entries ?? []).filter((entry) =>
    entry.url.toLowerCase().includes(search.toLowerCase()),
  );
  const totalEntries = buckets.reduce((total, bucket) => total + bucket.entries.length, 0);
  const totalSize = buckets.reduce(
    (total, bucket) =>
      total + bucket.entries.reduce((sum, entry) => sum + (entry.size ?? 0), 0),
    0,
  );

  const openUpload = () => {
    setBucketName(selectedBucket ?? "");
    setKeyPrefix("local-files/");
    setFiles([]);
    setUploadMessage("");
    setUploadOpen(true);
  };

  const uploadFiles = async () => {
    const targetBucket = bucketName.trim();
    if (!targetBucket) {
      setUploadMessage("Enter a bucket name.");
      return;
    }
    if (files.length === 0) {
      setUploadMessage("Choose at least one local file.");
      return;
    }

    setUploading(true);
    setUploadMessage("");

    try {
      const cache = await caches.open(targetBucket);
      const prefix = keyPrefix.trim().replace(/^\/+|\/+$/g, "");
      let uploaded = 0;

      for (const file of files) {
        const safeName = file.name.split("/").pop() ?? file.name;
        const relativeKey = [prefix, safeName].filter(Boolean).join("/");
        const keyUrl = new URL(
          `/__local_cache__/${relativeKey.split("/").map(encodeURIComponent).join("/")}`,
          window.location.origin,
        );
        const response = new Response(file, {
          status: 200,
          headers: {
            "Content-Type": file.type || "application/octet-stream",
            "Content-Length": String(file.size),
            "X-Local-Cache-Filename": safeName,
          },
        });

        await cache.put(keyUrl.href, response);
        uploaded += 1;
      }

      setSelectedBucket(targetBucket);
      setSelectedEntry(null);
      setSearch("");
      setUploadMessage(`${uploaded} file(s) added to "${targetBucket}".`);
      await loadCaches();
      setUploadOpen(false);
    } catch (err) {
      setUploadMessage(
        err instanceof Error
          ? `Upload failed: ${err.message}`
          : "Upload failed. Check browser storage permissions and quota.",
      );
    } finally {
      setUploading(false);
    }
  };

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      setError("Could not copy URL. Clipboard access may be blocked by the browser.");
    }
  };

  return {
    buckets,
    setBuckets,
    selectedBucket,
    setSelectedBucket,
    selectedEntry,
    setSelectedEntry,
    search,
    setSearch,
    loading,
    setLoading,
    error,
    setError,
    uploadOpen,
    setUploadOpen,
    bucketName,
    setBucketName,
    keyPrefix,
    setKeyPrefix,
    files,
    setFiles,
    uploading,
    setUploading,
    uploadMessage,
    setUploadMessage,
    currentBucket,
    filteredEntries,
    totalEntries,
    totalSize,
    loadCaches,
    openUpload,
    uploadFiles,
    copyUrl,
  };
}