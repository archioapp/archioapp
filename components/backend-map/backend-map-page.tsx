"use client"

import { useState } from "react"
import {
  ArrowRight,
  ChevronRight,
  Database,
  Server,
  Sparkles,
  Truck,
  MonitorSmartphone,
  X,
  CircleHelp,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LAYERS,
  FLOW,
  QCLAY,
  BUILD_ORDER,
  MONEY_FLOW,
  REVENUE_TIMELINE,
  GLOSSARY,
  STATUS_META,
  type Node,
  type Status,
  type Layer,
} from "./data"

const LAYER_ICON: Record<string, typeof Server> = {
  frontend: MonitorSmartphone,
  api: Server,
  storage: Database,
  external: Truck,
  ai: Sparkles,
}

function StatusPill({ status, className }: { status: Status; className?: string }) {
  const m = STATUS_META[status]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1",
        m.bg,
        m.text,
        m.ring,
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", m.dot)} aria-hidden />
      {m.label}
    </span>
  )
}

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-zinc-400">
      {(Object.keys(STATUS_META) as Status[]).map((s) => (
        <span key={s} className="inline-flex items-center gap-2">
          <span className={cn("size-2 rounded-full", STATUS_META[s].dot)} aria-hidden />
          <span className="text-zinc-300">{STATUS_META[s].label}</span>
          <span className="text-zinc-500">
            {s === "live" ? "· built & working" : s === "partial" ? "· free tier / demo data" : "· known gap"}
          </span>
        </span>
      ))}
    </div>
  )
}

/* ── The universal request chain ──────────────────────────────────────────── */
function RequestFlow() {
  const [open, setOpen] = useState<string | null>(FLOW[0].id)
  return (
    <section aria-labelledby="flow-heading" className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 id="flow-heading" className="text-lg font-semibold text-zinc-100">
          How one request travels
        </h2>
        <p className="text-sm text-zinc-400 text-pretty">
          Every feature runs this same six-step chain. Learn it once and the whole backend stops being scary.
        </p>
      </div>

      <ol className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
        {FLOW.map((step) => {
          const isOpen = open === step.id
          return (
            <li key={step.id}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : step.id)}
                aria-expanded={isOpen}
                className={cn(
                  "group flex h-full w-full flex-col gap-2 rounded-xl border p-4 text-left transition-colors",
                  isOpen
                    ? "border-amber-400/40 bg-amber-400/[0.06]"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs uppercase tracking-wide text-zinc-400">{step.title}</span>
                  <ChevronRight
                    className={cn(
                      "size-4 shrink-0 text-zinc-500 transition-transform",
                      isOpen && "rotate-90 text-amber-300",
                    )}
                    aria-hidden
                  />
                </div>
                <p className="text-sm leading-relaxed text-zinc-200">{step.plain}</p>
                {isOpen && (
                  <p className="rounded-lg bg-black/30 px-3 py-2 font-mono text-xs leading-relaxed text-zinc-400">
                    {step.tech}
                  </p>
                )}
              </button>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

/* ── The layered system map ───────────────────────────────────────────────── */
function LayerBlock({ layer, onSelect }: { layer: Layer; onSelect: (n: Node) => void }) {
  const Icon = LAYER_ICON[layer.id] ?? Server
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
      <div className="flex items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-amber-300 ring-1 ring-white/10">
          <Icon className="size-4" aria-hidden />
        </span>
        <div className="flex flex-col">
          <h3 className="text-sm font-semibold text-zinc-100">{layer.title}</h3>
          <p className="text-xs text-zinc-500">{layer.subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {layer.nodes.map((node) => (
          <button
            key={node.id}
            type="button"
            onClick={() => onSelect(node)}
            className="group flex items-start justify-between gap-2 rounded-xl border border-white/10 bg-black/20 p-3 text-left transition-colors hover:border-amber-400/40 hover:bg-amber-400/[0.05]"
          >
            <span className="flex flex-col gap-1.5">
              <span className="flex items-center gap-2">
                <span className={cn("size-2 rounded-full", STATUS_META[node.status].dot)} aria-hidden />
                <span className="text-sm font-medium text-zinc-100">{node.name}</span>
              </span>
              <span className="text-xs leading-relaxed text-zinc-400">{node.plain}</span>
              <span className="font-mono text-[10px] uppercase tracking-wide text-zinc-500">{node.rentBuild}</span>
            </span>
            <ChevronRight
              className="mt-0.5 size-4 shrink-0 text-zinc-600 transition-colors group-hover:text-amber-300"
              aria-hidden
            />
          </button>
        ))}
      </div>
    </div>
  )
}

function DetailPanel({ node, onClose }: { node: Node; onClose: () => void }) {
  return (
    <div
      role="dialog"
      aria-label={`${node.name} details`}
      className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-xl rounded-t-2xl border border-white/10 bg-[#111119] p-5 shadow-2xl md:inset-y-0 md:right-0 md:left-auto md:h-full md:max-w-md md:rounded-none md:rounded-l-2xl"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className={cn("size-2.5 rounded-full", STATUS_META[node.status].dot)} aria-hidden />
            <h3 className="text-lg font-semibold text-zinc-100">{node.name}</h3>
          </div>
          <div className="flex items-center gap-2">
            <StatusPill status={node.status} />
            <span className="rounded-full bg-white/[0.04] px-2 py-0.5 font-mono text-[11px] uppercase tracking-wide text-zinc-400 ring-1 ring-white/10">
              {node.rentBuild}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-white/[0.06] hover:text-zinc-100"
          aria-label="Close details"
        >
          <X className="size-4" aria-hidden />
        </button>
      </div>

      <div className="mt-5 flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-[11px] uppercase tracking-wide text-zinc-500">In plain English</span>
          <p className="text-sm leading-relaxed text-zinc-200">{node.plain}</p>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-[11px] uppercase tracking-wide text-zinc-500">How it works</span>
          <p className="text-sm leading-relaxed text-zinc-300">{node.tech}</p>
        </div>
        {node.evidence && (
          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-[11px] uppercase tracking-wide text-zinc-500">Where it lives</span>
            <code className="rounded-lg bg-black/40 px-3 py-2 font-mono text-xs text-amber-200/90">{node.evidence}</code>
          </div>
        )}
      </div>
    </div>
  )
}

function SystemMap() {
  const [selected, setSelected] = useState<Node | null>(null)
  return (
    <section aria-labelledby="map-heading" className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 id="map-heading" className="text-lg font-semibold text-zinc-100">
          The system, top to bottom
        </h2>
        <p className="text-sm text-zinc-400 text-pretty">
          Tap any block to see what it is, how it works, and whether it&apos;s built. Read it as a stack: your screen
          at the top, the intelligence at the bottom.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {LAYERS.map((layer, i) => (
          <div key={layer.id} className="flex flex-col gap-3">
            <LayerBlock layer={layer} onSelect={setSelected} />
            {i < LAYERS.length - 1 && (
              <div className="flex justify-center" aria-hidden>
                <ArrowRight className="size-4 rotate-90 text-zinc-600" />
              </div>
            )}
          </div>
        ))}
      </div>

      {selected && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setSelected(null)} aria-hidden />
          <DetailPanel node={selected} onClose={() => setSelected(null)} />
        </>
      )}
    </section>
  )
}

/* ── Bottom tabs: QClay answers / build order / glossary ──────────────────── */
function InfoTabs() {
  return (
    <section aria-label="Decisions and reference" className="flex flex-col gap-4">
      <Tabs defaultValue="qclay" className="w-full">
        <TabsList className="w-full justify-start gap-1 rounded-xl border border-white/10 bg-white/[0.02] p-1">
          <TabsTrigger value="qclay">QClay&apos;s 3 questions</TabsTrigger>
          <TabsTrigger value="money">How money moves</TabsTrigger>
          <TabsTrigger value="order">Build order</TabsTrigger>
          <TabsTrigger value="glossary">Glossary</TabsTrigger>
        </TabsList>

        <TabsContent value="qclay" className="mt-4 flex flex-col gap-3">
          {QCLAY.map((a) => (
            <div key={a.q} className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <h3 className="text-sm font-semibold text-zinc-100">{a.q}</h3>
              <p className="text-sm leading-relaxed text-amber-200/90 text-pretty">{a.short}</p>
              <ul className="flex flex-col gap-2">
                {a.points.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm leading-relaxed text-zinc-300">
                    <ChevronRight className="mt-0.5 size-4 shrink-0 text-zinc-600" aria-hidden />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="money" className="mt-4 flex flex-col gap-5">
          <div className="flex flex-col gap-2 rounded-2xl border border-amber-400/20 bg-amber-400/[0.05] p-5">
            <span className="font-mono text-[11px] uppercase tracking-wide text-amber-300">Working hypothesis</span>
            <h3 className="text-base font-semibold text-zinc-100">Free network. Paid intelligence. Shared commerce.</h3>
            <p className="text-sm leading-relaxed text-zinc-300 text-pretty">
              Keep entry useful and low-friction. Charge after ARCHIO proves personal or business value. Share money only
              when attributable revenue actually moves. This is a model to test with founders and customers, not a locked
              price sheet.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
            {MONEY_FLOW.map((item) => (
              <article key={item.actor} className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <h3 className="text-sm font-semibold text-zinc-100">{item.actor}</h3>
                <dl className="flex flex-col gap-2 text-sm leading-relaxed">
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-wide text-zinc-500">Gives</dt>
                    <dd className="text-zinc-300">{item.gives}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-wide text-zinc-500">Gets</dt>
                    <dd className="text-zinc-300">{item.gets}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-wide text-zinc-500">Payment logic</dt>
                    <dd className="text-amber-200/90">{item.pays}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>

          <ol className="flex flex-col gap-2">
            {REVENUE_TIMELINE.map((item) => (
              <li key={item.stage} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <span className="shrink-0 rounded-full bg-white/[0.05] px-2.5 py-1 font-mono text-[11px] text-amber-300 ring-1 ring-white/10">
                  {item.stage}
                </span>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-zinc-100">{item.engine}</span>
                  <span className="text-sm leading-relaxed text-zinc-400">{item.why}</span>
                </div>
              </li>
            ))}
          </ol>
        </TabsContent>

        <TabsContent value="order" className="mt-4">
          <ol className="flex flex-col gap-2">
            {BUILD_ORDER.map((step) => (
              <li
                key={step.n}
                className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-amber-400/10 font-mono text-sm font-semibold text-amber-300 ring-1 ring-amber-400/30">
                  {step.n}
                </span>
                <div className="flex flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-zinc-100">{step.title}</span>
                    <StatusPill status={step.status} />
                  </div>
                  <p className="text-sm leading-relaxed text-zinc-400">{step.why}</p>
                </div>
              </li>
            ))}
          </ol>
        </TabsContent>

        <TabsContent value="glossary" className="mt-4">
          <dl className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {GLOSSARY.map((g) => (
              <div key={g.term} className="flex flex-col gap-1 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <dt className="text-sm font-semibold text-zinc-100">{g.term}</dt>
                <dd className="text-sm leading-relaxed text-zinc-400">{g.def}</dd>
              </div>
            ))}
          </dl>
        </TabsContent>
      </Tabs>
    </section>
  )
}

export function BackendMapPage() {
  return (
    <main className="min-h-screen w-full bg-[#0c0c10] text-zinc-100">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-5 py-12 md:px-8 md:py-16">
        {/* Header */}
        <header className="flex flex-col gap-4">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-zinc-400">
            <CircleHelp className="size-3.5 text-amber-300" aria-hidden />
            Internal · Backend Map
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-balance md:text-4xl">
            How ARCHIO&apos;s backend actually works
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-zinc-400 text-pretty">
            A plain-English map of every moving part — what we&apos;ve built, what we rent, and what&apos;s still to
            come. Built to walk into the QClay conversation and lead it.
          </p>
          <div className="mt-1">
            <Legend />
          </div>
        </header>

        <RequestFlow />
        <SystemMap />
        <InfoTabs />

        <footer className="border-t border-white/10 pt-6 text-xs text-zinc-500">
          Every status on this page is grounded in the real codebase. Companion documents live in{" "}
          <code className="font-mono text-zinc-400">/docs</code>: the partner backend brief, monetization strategy,
          decision packet, learning workshop, and send-ready QClay reply.
        </footer>
      </div>
    </main>
  )
}
