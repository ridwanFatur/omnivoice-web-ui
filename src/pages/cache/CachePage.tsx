import { CachePageProvider } from "./CachePageContext";
import CachePageHeader from "./components/CachePageHeader";
import { useCachePageContext } from "./CachePageContext";
import CacheStats from "./components/CacheStats";
import BucketList from "./components/BucketList";
import EntryList from "./components/EntryList";
import EntryDetails from "./components/EntryDetails";
import UploadModal from "./components/UploadModal";

export default function CachePage() {
  return (
    <CachePageProvider>
      <_CachePage />
    </CachePageProvider>
  );
}

function _CachePage() {
  const { error, uploadMessage, uploadOpen } = useCachePageContext();

  return (
    <main className="min-h-screen bg-cache-bg-main p-5 text-slate-100 sm:p-8">
      <div className="mx-auto max-w-7xl space-y-7">
        <CachePageHeader />

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {uploadMessage && !uploadOpen && (
          <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-4 text-sm text-cyan-200">
            {uploadMessage}
          </div>
        )}

        <CacheStats />

        <section className="grid grid-cols-1 gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
          <BucketList />

          <div className="min-w-0 space-y-4">
            <EntryList />
            <EntryDetails />
          </div>
        </section>

        <footer className="text-center text-xs text-slate-600">
          Cache Storage Inspector · Current browser origin only
        </footer>
      </div>

      <UploadModal />
    </main>
  );
}