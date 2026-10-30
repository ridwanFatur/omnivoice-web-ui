export type CacheEntry = {
  url: string;
  method: string;
  status: number;
  contentType: string;
  size: number | null;
};

export type CacheBucket = {
  name: string;
  entries: CacheEntry[];
};