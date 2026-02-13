"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import type { GeneratedAsset } from "@/lib/image-processor"

interface CodePreviewProps {
  assets: GeneratedAsset[]
}

function generateHeadCode(assets: GeneratedAsset[]): string {
  const lines: string[] = ["<!-- Favicon -->"]

  const favicons = assets.filter((a) => a.config.category === "favicon")
  for (const a of favicons) {
    if (a.config.name.endsWith(".ico")) {
      lines.push(`<link rel="icon" href="/${a.config.name}" />`)
    } else {
      lines.push(
        `<link rel="icon" type="image/png" sizes="${a.config.width}x${a.config.height}" href="/${a.config.name}" />`
      )
    }
  }

  const apples = assets.filter((a) => a.config.category === "apple")
  if (apples.length > 0) {
    lines.push("")
    lines.push("<!-- Apple Touch Icon -->")
    for (const a of apples) {
      if (a.config.name === "apple-touch-icon.png") {
        lines.push(`<link rel="apple-touch-icon" href="/${a.config.name}" />`)
      } else {
        lines.push(
          `<link rel="apple-touch-icon" sizes="${a.config.width}x${a.config.height}" href="/${a.config.name}" />`
        )
      }
    }
  }

  const socials = assets.filter((a) => a.config.category === "social")
  if (socials.length > 0) {
    lines.push("")
    lines.push("<!-- Open Graph / Social -->")
    const og = socials.find((a) => a.config.name === "og-image.png")
    if (og) {
      lines.push(`<meta property="og:image" content="/og-image.png" />`)
      lines.push(`<meta property="og:image:width" content="1200" />`)
      lines.push(`<meta property="og:image:height" content="630" />`)
    }
    const tw = socials.find((a) => a.config.name === "twitter-card.png")
    if (tw) {
      lines.push(`<meta name="twitter:card" content="summary_large_image" />`)
      lines.push(`<meta name="twitter:image" content="/twitter-card.png" />`)
    }
  }

  const androids = assets.filter((a) => a.config.category === "android")
  if (androids.length > 0) {
    lines.push("")
    lines.push("<!-- Web App Manifest -->")
    lines.push(`<link rel="manifest" href="/site.webmanifest" />`)
  }

  const webps = assets.filter((a) => a.config.category === "webp")
  if (webps.length > 0) {
    lines.push("")
    lines.push("<!-- WebP Icons (modern browsers) -->")
    const webpFavicons = webps.filter((a) => a.config.name.startsWith("favicon-"))
    for (const a of webpFavicons) {
      lines.push(
        `<link rel="icon" type="image/webp" sizes="${a.config.width}x${a.config.height}" href="/${a.config.name}" />`
      )
    }
    const webpOg = webps.find((a) => a.config.name === "og-image.webp")
    if (webpOg) {
      lines.push(`<meta property="og:image" content="/og-image.webp" />`)
      lines.push(`<meta property="og:image:type" content="image/webp" />`)
    }
  }

  const svgs = assets.filter((a) => a.config.category === "svg")
  if (svgs.length > 0) {
    lines.push("")
    lines.push("<!-- SVG Icons -->")
    const svgFavicon = svgs.find((a) => a.config.name === "favicon.svg")
    if (svgFavicon) {
      lines.push(`<link rel="icon" type="image/svg+xml" href="/favicon.svg" />`)
    }
    const safariTab = svgs.find((a) => a.config.name === "safari-pinned-tab.svg")
    if (safariTab) {
      lines.push(`<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#000000" />`)
    }
  }

  return lines.join("\n")
}

function generateManifest(assets: GeneratedAsset[]): string {
  const androids = assets.filter((a) => a.config.category === "android")
  const icons = androids.map((a) => ({
    src: `/${a.config.name}`,
    sizes: `${a.config.width}x${a.config.height}`,
    type: "image/png",
  }))

  return JSON.stringify(
    {
      name: "My Blog",
      short_name: "Blog",
      icons,
      theme_color: "#ffffff",
      background_color: "#ffffff",
      display: "standalone",
    },
    null,
    2
  )
}

export function CodePreview({ assets }: CodePreviewProps) {
  const [activeTab, setActiveTab] = useState<"html" | "manifest">("html")
  const [copied, setCopied] = useState(false)

  const code = activeTab === "html" ? generateHeadCode(assets) : generateManifest(assets)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab("html")}
            className={`rounded-md px-3 py-1.5 text-xs font-mono font-medium transition-colors ${
              activeTab === "html"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {"<head>"}
          </button>
          <button
            onClick={() => setActiveTab("manifest")}
            className={`rounded-md px-3 py-1.5 text-xs font-mono font-medium transition-colors ${
              activeTab === "manifest"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            site.webmanifest
          </button>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-primary" />
              <span className="text-primary">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-xs leading-relaxed font-mono text-muted-foreground">
        <code>{code}</code>
      </pre>
    </div>
  )
}
