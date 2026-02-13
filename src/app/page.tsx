"use client"

import { useState } from "react"
import { FaviconGenerator } from "@/components/favicon-generator"
import { OGEditor } from "@/components/og-editor"
import { ImageIcon, Layers, PenTool, Shield } from "lucide-react"

type Tab = "favicon" | "og"

export default function Page() {
  const [activeTab, setActiveTab] = useState<Tab>("favicon")

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <ImageIcon className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-foreground">Favicon Generator</h1>
              <p className="text-xs text-muted-foreground">Blog & Social Assets</p>
            </div>
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
          >
            GitHub
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-border bg-card/30">
        <div className="mx-auto max-w-6xl px-6 py-14 text-center">
          <div className="mx-auto mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-xs font-medium text-primary">All-in-One Generator</span>
          </div>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Upload once, get everything
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-pretty text-sm leading-relaxed text-muted-foreground">
            Generate 37+ favicon, icon, and social media assets from a single image.
            Design custom OG images with live preview, preset templates, and logo overlay.
          </p>

          {/* Feature highlights */}
          <div className="mx-auto mt-8 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-left">
              <Layers className="h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="text-xs font-semibold text-foreground">37+ Assets</p>
                <p className="text-[11px] leading-snug text-muted-foreground">
                  Favicon, Apple, Android, WebP, SVG, MS Tile, OG
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-left">
              <PenTool className="h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="text-xs font-semibold text-foreground">OG Editor</p>
                <p className="text-[11px] leading-snug text-muted-foreground">
                  Templates, logo, gradient, live canvas preview
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-left">
              <Shield className="h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="text-xs font-semibold text-foreground">100% Private</p>
                <p className="text-[11px] leading-snug text-muted-foreground">
                  All processing in-browser, no server uploads
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <div className="border-b border-border bg-background sticky top-0 z-10">
        <div className="mx-auto flex max-w-6xl items-center gap-0 px-6">
          <button
            onClick={() => setActiveTab("favicon")}
            className={`relative flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-colors ${
              activeTab === "favicon"
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Layers className="h-4 w-4" />
            Favicon Assets
            {activeTab === "favicon" && (
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("og")}
            className={`relative flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-colors ${
              activeTab === "og"
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <PenTool className="h-4 w-4" />
            OG Image Editor
            {activeTab === "og" && (
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary" />
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-6 py-10">
        {activeTab === "favicon" ? <FaviconGenerator /> : <OGEditor />}
      </main>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <p className="text-center text-xs text-muted-foreground">
            All processing happens in your browser. No images are uploaded to any server.
          </p>
        </div>
      </footer>
    </div>
  )
}
