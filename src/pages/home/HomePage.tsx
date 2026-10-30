import {
  ArrowRight,
  AudioLines,
  AudioWaveform,
  Mic,
  Mic2,
  Sparkles,
  Volume2,
  Workflow,
} from "lucide-react";

const features = [
  {
    icon: Mic2,
    title: "Voice Cloning",
    description: "Clone a voice using reference audio and its transcription.",
    href: "/voice-clone-prompt",
    color: "text-cache-cyan-base",
    background: "bg-cache-cyan-base/10",
  },
  {
    icon: AudioWaveform,
    title: "Voice Generation",
    description: "Generate natural speech using cloned voices and custom text.",
    href: "/generate-audio",
    color: "text-blue-400",
    background: "bg-cache-blue-base/10",
  },
  {
    icon: Volume2,
    title: "Audio Library",
    description: "Upload, organize, and manage your reference audio files.",
    href: "/uploaded-audio",
    color: "text-purple-400",
    background: "bg-purple-500/10",
  },
];

export default function HomePage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cache-bg-main px-6 py-16 text-white">
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-cache-cyan-base/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-cache-blue-base/15 blur-[120px]" />

      <div className="relative z-10 mx-auto w-full max-w-5xl">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-8 flex h-24 w-24 items-center justify-center rounded-[2rem] border border-cache-cyan-base/20 bg-cache-bg-card shadow-2xl shadow-cache-blue-base/10">
            <AudioLines className="h-12 w-12 text-cache-cyan-base" />
            <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full border border-cache-bg-main bg-cache-blue-base">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
          </div>

          <div className="mb-6 flex items-center gap-2 rounded-full border border-cache-cyan-base/20 bg-cache-cyan-base/5 px-4 py-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-cache-cyan-base" />
            <span className="text-xs font-semibold tracking-widest text-cache-cyan-base">
              AI POWERED VOICE TECHNOLOGY
            </span>
          </div>

          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
            Your Voice,
            <span className="block bg-gradient-to-r from-cache-cyan-base to-cache-blue-base bg-clip-text text-transparent">
              Reimagined with AI.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
            Clone voices, generate natural-sounding speech, and
            manage your audio library in one simple workspace.
          </p>

          <a
            href="/generate-audio"
            className="group mt-9 flex items-center gap-3 rounded-xl bg-cache-blue-base px-7 py-4 text-sm font-semibold transition-all hover:bg-blue-500 hover:shadow-lg hover:shadow-cache-blue-base/25"
          >
            Start Generating
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        <div className="mt-20">
          <div className="mb-6 text-center">
            <h2 className="text-lg font-semibold">Explore Features</h2>
            <p className="mt-2 text-sm text-slate-500">
              Everything you need to work with AI-generated voices.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <a
                  key={feature.title}
                  href={feature.href}
                  className="group rounded-2xl border border-white/5 bg-cache-bg-card p-6 transition-all hover:-translate-y-1 hover:border-cache-cyan-base/20 hover:bg-cache-bg-hover"
                >
                  <div
                    className={`mb-6 flex h-12 w-12 items-center justify-center rounded-xl ${feature.background}`}
                  >
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>

                  <h3 className="flex items-center justify-between font-semibold">
                    {feature.title}
                    <ArrowRight className="h-4 w-4 text-slate-600 transition-all group-hover:translate-x-1 group-hover:text-cache-cyan-base" />
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-slate-400">
                    {feature.description}
                  </p>
                </a>
              );
            })}
          </div>
        </div>

        <div className="mt-16 flex items-center justify-center gap-2 text-xs text-slate-600">
          <Mic className="h-3.5 w-3.5" />
          <span>Powered by AI Voice Technology</span>
        </div>
      </div>
    </main>
  );
}