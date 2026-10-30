import { BrowserRouter, Routes, Route, NavLink } from "react-router"
import { Home, Database, Cpu, AudioLines, Bug } from "lucide-react"
import HomePage from "./pages/home/HomePage"
import CachePage from "./pages/cache/CachePage"
import OnnxPage from "./pages/onnx/OnnxPage"
import GeneratePage from "./pages/generate/GeneratePage"
import DebugPage from "./pages/debug/DebugPage"

const isDebugMode = import.meta.env.VITE_SHOW_DEBUG === "true"

const NAV_ITEMS = [
  {
    path: "/",
    label: "Home",
    icon: Home,
  },
  {
    path: "/cache",
    label: "Cache Storage",
    icon: Database,
  },
  {
    path: "/onnx",
    label: "Run ONNX",
    icon: Cpu,
  },
  {
    path: "/generate",
    label: "Generate Audio",
    icon: AudioLines,
  },
  ...(isDebugMode
    ? [
      {
        path: "/debug",
        label: "Debug Tool",
        icon: Bug,
      },
    ]
    : []),
]

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-100 text-gray-800">
        <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0 shadow-lg">
          <div className="p-5 text-xl font-bold border-b border-slate-800 tracking-wide">
            Dashboard
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`
                  }
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </NavLink>
              )
            })}
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto bg-cache-bg-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cache" element={<CachePage />} />
            <Route path="/onnx" element={<OnnxPage />} />
            <Route path="/generate" element={<GeneratePage />} />

            {isDebugMode && <Route path="/debug" element={<DebugPage />} />}
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}