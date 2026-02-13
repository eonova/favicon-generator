"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import {
  Download,
  Type,
  Palette,
  Sparkles,
  ImageIcon,
  ChevronDown,
  ChevronUp,
  Upload,
  LayoutTemplate,
  X,
} from "lucide-react"
import {
  renderOG,
  OG_WIDTH,
  OG_HEIGHT,
  DEFAULT_OG_CONFIG,
  GRADIENT_PRESETS,
  OG_PRESETS,
  type OGConfig,
  type BackgroundType,
  type GradientDirection,
  type TextAlign,
  type TextVAlign,
  type FontFamily,
  type LogoPosition,
} from "@/lib/og-renderer"
import { canvasToBlob, generateSvgBlob } from "@/lib/image-processor"

// ─── Shared tiny UI pieces ──────────────────────────────────────────
function SectionHeader({
  icon: Icon,
  label,
  open,
  onToggle,
}: {
  icon: React.ElementType
  label: string
  open: boolean
  onToggle: () => void
}) {
  return (
    <button
      onClick={onToggle}
      className="flex w-full items-center justify-between rounded-lg bg-secondary/60 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:bg-secondary"
    >
      <span className="flex items-center gap-2">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </span>
      {open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
    </button>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      {children}
    </label>
  )
}

const inputClass =
  "w-full rounded-md border border-border bg-card px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
const btnSmall =
  "rounded-md border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
const btnSmallActive =
  "rounded-md border border-primary bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"

// ─── Main Component ─────────────────────────────────────────────────
export function OGEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [config, setConfig] = useState<OGConfig>({ ...DEFAULT_OG_CONFIG })
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null)
  const [bgImagePreview, setBgImagePreview] = useState<string | null>(null)
  const [logoImage, setLogoImage] = useState<HTMLImageElement | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  // Section toggle states
  const [openSections, setOpenSections] = useState({
    presets: true,
    background: false,
    text: true,
    style: false,
    logo: false,
  })

  const toggleSection = (key: keyof typeof openSections) =>
    setOpenSections((s) => ({ ...s, [key]: !s[key] }))

  const updateConfig = useCallback(<K extends keyof OGConfig>(key: K, value: OGConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }))
  }, [])

  // ─── Apply preset ────
  const applyPreset = useCallback((preset: typeof OG_PRESETS[number]) => {
    setConfig((prev) => ({ ...prev, ...preset.config }))
  }, [])

  // ─── Background image upload ────
  const handleBgImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      const url = URL.createObjectURL(file)
      setBgImagePreview(url)
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        setBgImage(img)
        updateConfig("bgType", "image")
        updateConfig("bgImageUrl", url)
      }
      img.src = url
    },
    [updateConfig]
  )

  // ─── Logo upload ────
  const handleLogoUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      const url = URL.createObjectURL(file)
      setLogoPreview(url)
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        setLogoImage(img)
        updateConfig("showLogo", true)
      }
      img.src = url
    },
    [updateConfig]
  )

  const clearLogo = useCallback(() => {
    if (logoPreview) URL.revokeObjectURL(logoPreview)
    setLogoImage(null)
    setLogoPreview(null)
    updateConfig("showLogo", false)
  }, [logoPreview, updateConfig])

  // ─── Re-render canvas on config change ────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    renderOG(canvas, config, bgImage, logoImage)
  }, [config, bgImage, logoImage])

  // ─── Export helpers ────
  const exportAs = useCallback(
    async (format: "png" | "webp" | "svg") => {
      const canvas = canvasRef.current
      if (!canvas) return
      renderOG(canvas, config, bgImage, logoImage)

      let blob: Blob
      if (format === "svg") {
        blob = generateSvgBlob(canvas, OG_WIDTH, OG_HEIGHT)
      } else {
        blob = await canvasToBlob(canvas, format)
      }

      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `og-image.${format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    },
    [config, bgImage, logoImage]
  )

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      {/* ─── Left: Canvas Preview ─── */}
      <div className="flex-1">
        <div className="sticky top-6">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Preview ({OG_WIDTH} x {OG_HEIGHT})
            </span>
            <div className="flex items-center gap-1.5">
              <button onClick={() => exportAs("png")} className={btnSmall} title="Download PNG">
                <span className="flex items-center gap-1">
                  <Download className="h-3 w-3" /> PNG
                </span>
              </button>
              <button onClick={() => exportAs("webp")} className={btnSmall} title="Download WebP">
                <span className="flex items-center gap-1">
                  <Download className="h-3 w-3" /> WebP
                </span>
              </button>
              <button onClick={() => exportAs("svg")} className={btnSmall} title="Download SVG">
                <span className="flex items-center gap-1">
                  <Download className="h-3 w-3" /> SVG
                </span>
              </button>
            </div>
          </div>

          {/* Canvas */}
          <div className="overflow-hidden rounded-lg border border-border bg-card">
            <canvas
              ref={canvasRef}
              width={OG_WIDTH}
              height={OG_HEIGHT}
              className="w-full"
              style={{ aspectRatio: `${OG_WIDTH}/${OG_HEIGHT}` }}
            />
          </div>

          {/* Dimension info */}
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Open Graph / Twitter Card standard: 1200 x 630px
          </p>
        </div>
      </div>

      {/* ─── Right: Controls Panel ─── */}
      <div className="w-full space-y-3 lg:w-80 xl:w-96">

        {/* ═══ PRESETS ═══ */}
        <SectionHeader
          icon={LayoutTemplate}
          label="Preset Templates"
          open={openSections.presets}
          onToggle={() => toggleSection("presets")}
        />
        {openSections.presets && (
          <div className="rounded-lg border border-border bg-card p-3">
            <div className="grid grid-cols-2 gap-2">
              {OG_PRESETS.map((preset) => {
                const bg = preset.config.bgType === "gradient"
                  ? `linear-gradient(135deg, ${preset.config.gradientFrom}, ${preset.config.gradientTo})`
                  : preset.config.bgColor || "#0a0a0a"
                return (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset)}
                    className="group flex flex-col items-start gap-1.5 rounded-lg border border-border p-2.5 text-left transition-all hover:border-primary/50 hover:bg-secondary/30"
                  >
                    <div
                      className="flex h-16 w-full items-end rounded-md p-2"
                      style={{ background: bg }}
                    >
                      <span
                        className="truncate text-[10px] font-bold leading-none"
                        style={{
                          color: preset.config.titleColor || "#fff",
                          fontFamily: preset.config.fontFamily || "sans-serif",
                        }}
                      >
                        Title Preview
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground">{preset.name}</p>
                      <p className="text-[10px] leading-snug text-muted-foreground">{preset.description}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* ═══ BACKGROUND ═══ */}
        <SectionHeader
          icon={Palette}
          label="Background"
          open={openSections.background}
          onToggle={() => toggleSection("background")}
        />
        {openSections.background && (
          <div className="space-y-4 rounded-lg border border-border bg-card p-4">
            {/* Type selector */}
            <div className="flex items-center gap-1.5">
              {(["solid", "gradient", "image"] as BackgroundType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => updateConfig("bgType", type)}
                  className={config.bgType === type ? btnSmallActive : btnSmall}
                >
                  {type === "solid" ? "Solid" : type === "gradient" ? "Gradient" : "Image"}
                </button>
              ))}
            </div>

            {/* Solid color */}
            {config.bgType === "solid" && (
              <Field label="Color">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.bgColor}
                    onChange={(e) => updateConfig("bgColor", e.target.value)}
                    className="h-8 w-8 cursor-pointer rounded border border-border bg-transparent"
                  />
                  <input
                    type="text"
                    value={config.bgColor}
                    onChange={(e) => updateConfig("bgColor", e.target.value)}
                    className={inputClass}
                  />
                </div>
              </Field>
            )}

            {/* Gradient */}
            {config.bgType === "gradient" && (
              <>
                <div className="flex items-center gap-3">
                  <Field label="From">
                    <input
                      type="color"
                      value={config.gradientFrom}
                      onChange={(e) => updateConfig("gradientFrom", e.target.value)}
                      className="h-8 w-12 cursor-pointer rounded border border-border bg-transparent"
                    />
                  </Field>
                  <Field label="To">
                    <input
                      type="color"
                      value={config.gradientTo}
                      onChange={(e) => updateConfig("gradientTo", e.target.value)}
                      className="h-8 w-12 cursor-pointer rounded border border-border bg-transparent"
                    />
                  </Field>
                  <Field label="Direction">
                    <select
                      value={config.gradientDirection}
                      onChange={(e) =>
                        updateConfig("gradientDirection", e.target.value as GradientDirection)
                      }
                      className={inputClass + " py-1.5"}
                    >
                      {(
                        [
                          ["to-right", "\u2192"],
                          ["to-left", "\u2190"],
                          ["to-bottom", "\u2193"],
                          ["to-top", "\u2191"],
                          ["to-br", "\u2198"],
                          ["to-bl", "\u2199"],
                          ["to-tr", "\u2197"],
                          ["to-tl", "\u2196"],
                        ] as [GradientDirection, string][]
                      ).map(([val, arrow]) => (
                        <option key={val} value={val}>
                          {arrow} {val}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                {/* Presets */}
                <div>
                  <span className="mb-1.5 block text-xs text-muted-foreground">Color Presets</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {GRADIENT_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => {
                          updateConfig("gradientFrom", preset.from)
                          updateConfig("gradientTo", preset.to)
                          updateConfig("gradientDirection", preset.dir)
                        }}
                        className="group flex flex-col items-center gap-1 rounded-md border border-border p-1.5 transition-colors hover:border-primary/50"
                      >
                        <div
                          className="h-6 w-full rounded"
                          style={{
                            background: `linear-gradient(135deg, ${preset.from}, ${preset.to})`,
                          }}
                        />
                        <span className="text-[10px] text-muted-foreground group-hover:text-foreground">
                          {preset.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Image */}
            {config.bgType === "image" && (
              <>
                <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border p-4 transition-colors hover:border-primary/50">
                  {bgImagePreview ? (
                    <img
                      src={bgImagePreview}
                      alt="Background preview"
                      className="h-20 w-full rounded object-cover"
                    />
                  ) : (
                    <>
                      <Upload className="h-5 w-5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Upload background image</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBgImageUpload}
                    className="sr-only"
                  />
                </label>
                <Field label={`Overlay opacity: ${Math.round(config.bgOverlayOpacity * 100)}%`}>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={config.bgOverlayOpacity}
                    onChange={(e) => updateConfig("bgOverlayOpacity", parseFloat(e.target.value))}
                    className="w-full accent-primary"
                  />
                </Field>
              </>
            )}
          </div>
        )}

        {/* ═══ TEXT ═══ */}
        <SectionHeader
          icon={Type}
          label="Text Content"
          open={openSections.text}
          onToggle={() => toggleSection("text")}
        />
        {openSections.text && (
          <div className="space-y-4 rounded-lg border border-border bg-card p-4">
            {/* Title */}
            <Field label="Title">
              <textarea
                rows={2}
                value={config.title}
                onChange={(e) => updateConfig("title", e.target.value)}
                className={inputClass + " resize-none"}
                placeholder="Enter title..."
              />
            </Field>
            <div className="flex items-center gap-3">
              <Field label={`Size: ${config.titleSize}px`}>
                <input
                  type="range"
                  min={24}
                  max={80}
                  value={config.titleSize}
                  onChange={(e) => updateConfig("titleSize", parseInt(e.target.value))}
                  className="w-full accent-primary"
                />
              </Field>
              <Field label="Color">
                <input
                  type="color"
                  value={config.titleColor}
                  onChange={(e) => updateConfig("titleColor", e.target.value)}
                  className="h-8 w-10 cursor-pointer rounded border border-border bg-transparent"
                />
              </Field>
              <Field label="Weight">
                <div className="flex gap-1">
                  <button
                    onClick={() => updateConfig("titleWeight", "normal")}
                    className={config.titleWeight === "normal" ? btnSmallActive : btnSmall}
                  >
                    Aa
                  </button>
                  <button
                    onClick={() => updateConfig("titleWeight", "bold")}
                    className={config.titleWeight === "bold" ? btnSmallActive : btnSmall}
                  >
                    <strong>Aa</strong>
                  </button>
                </div>
              </Field>
            </div>

            {/* Subtitle */}
            <Field label="Subtitle">
              <input
                type="text"
                value={config.subtitle}
                onChange={(e) => updateConfig("subtitle", e.target.value)}
                className={inputClass}
                placeholder="Subtitle or description..."
              />
            </Field>
            <div className="flex items-center gap-3">
              <Field label={`Size: ${config.subtitleSize}px`}>
                <input
                  type="range"
                  min={14}
                  max={40}
                  value={config.subtitleSize}
                  onChange={(e) => updateConfig("subtitleSize", parseInt(e.target.value))}
                  className="w-full accent-primary"
                />
              </Field>
              <Field label="Color">
                <input
                  type="color"
                  value={config.subtitleColor}
                  onChange={(e) => updateConfig("subtitleColor", e.target.value)}
                  className="h-8 w-10 cursor-pointer rounded border border-border bg-transparent"
                />
              </Field>
            </div>

            {/* Author */}
            <Field label="Author / Site">
              <input
                type="text"
                value={config.author}
                onChange={(e) => updateConfig("author", e.target.value)}
                className={inputClass}
                placeholder="Author Name"
              />
            </Field>
            <div className="flex items-center gap-3">
              <Field label={`Size: ${config.authorSize}px`}>
                <input
                  type="range"
                  min={12}
                  max={28}
                  value={config.authorSize}
                  onChange={(e) => updateConfig("authorSize", parseInt(e.target.value))}
                  className="w-full accent-primary"
                />
              </Field>
              <Field label="Color">
                <input
                  type="color"
                  value={config.authorColor}
                  onChange={(e) => updateConfig("authorColor", e.target.value)}
                  className="h-8 w-10 cursor-pointer rounded border border-border bg-transparent"
                />
              </Field>
            </div>

            {/* Alignment */}
            <div className="flex items-center gap-4">
              <Field label="Horizontal">
                <div className="flex gap-1">
                  {(["left", "center", "right"] as TextAlign[]).map((a) => (
                    <button
                      key={a}
                      onClick={() => updateConfig("textAlign", a)}
                      className={config.textAlign === a ? btnSmallActive : btnSmall}
                    >
                      {a === "left" ? "Left" : a === "center" ? "Center" : "Right"}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Vertical">
                <div className="flex gap-1">
                  {(["top", "center", "bottom"] as TextVAlign[]).map((a) => (
                    <button
                      key={a}
                      onClick={() => updateConfig("textVAlign", a)}
                      className={config.textVAlign === a ? btnSmallActive : btnSmall}
                    >
                      {a === "top" ? "Top" : a === "center" ? "Mid" : "Bot"}
                    </button>
                  ))}
                </div>
              </Field>
            </div>

            {/* Font family */}
            <Field label="Font Family">
              <div className="flex gap-1">
                {(["sans-serif", "serif", "monospace"] as FontFamily[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => updateConfig("fontFamily", f)}
                    className={config.fontFamily === f ? btnSmallActive : btnSmall}
                    style={{ fontFamily: f }}
                  >
                    {f === "sans-serif" ? "Sans" : f === "serif" ? "Serif" : "Mono"}
                  </button>
                ))}
              </div>
            </Field>
          </div>
        )}

        {/* ═══ LOGO ═══ */}
        <SectionHeader
          icon={ImageIcon}
          label="Logo / Avatar"
          open={openSections.logo}
          onToggle={() => toggleSection("logo")}
        />
        {openSections.logo && (
          <div className="space-y-4 rounded-lg border border-border bg-card p-4">
            {logoPreview ? (
              <div className="flex items-center gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-border bg-secondary">
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground">Logo uploaded</p>
                  <p className="text-[10px] text-muted-foreground">Click below to change settings</p>
                </div>
                <button
                  onClick={clearLogo}
                  className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  aria-label="Remove logo"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border p-4 transition-colors hover:border-primary/50">
                <Upload className="h-5 w-5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Upload logo or avatar</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="sr-only"
                />
              </label>
            )}

            {logoImage && (
              <>
                <Field label="Position">
                  <div className="grid grid-cols-2 gap-1">
                    {(["top-left", "top-right", "bottom-left", "bottom-right"] as LogoPosition[]).map((pos) => (
                      <button
                        key={pos}
                        onClick={() => updateConfig("logoPosition", pos)}
                        className={config.logoPosition === pos ? btnSmallActive : btnSmall}
                      >
                        {pos.replace("-", " ")}
                      </button>
                    ))}
                  </div>
                </Field>
                <Field label={`Size: ${config.logoSize}px`}>
                  <input
                    type="range"
                    min={32}
                    max={128}
                    value={config.logoSize}
                    onChange={(e) => updateConfig("logoSize", parseInt(e.target.value))}
                    className="w-full accent-primary"
                  />
                </Field>
                <Field label={`Corner radius: ${config.logoBorderRadius}px`}>
                  <input
                    type="range"
                    min={0}
                    max={64}
                    value={config.logoBorderRadius}
                    onChange={(e) => updateConfig("logoBorderRadius", parseInt(e.target.value))}
                    className="w-full accent-primary"
                  />
                </Field>
              </>
            )}
          </div>
        )}

        {/* ═══ STYLE ═══ */}
        <SectionHeader
          icon={Sparkles}
          label="Style & Decoration"
          open={openSections.style}
          onToggle={() => toggleSection("style")}
        />
        {openSections.style && (
          <div className="space-y-4 rounded-lg border border-border bg-card p-4">
            {/* Padding */}
            <Field label={`Padding: ${config.padding}px`}>
              <input
                type="range"
                min={40}
                max={140}
                value={config.padding}
                onChange={(e) => updateConfig("padding", parseInt(e.target.value))}
                className="w-full accent-primary"
              />
            </Field>

            {/* Badge */}
            <div className="flex items-center gap-2">
              <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  checked={config.showBadge}
                  onChange={(e) => updateConfig("showBadge", e.target.checked)}
                  className="accent-primary"
                />
                Show badge
              </label>
            </div>
            {config.showBadge && (
              <div className="flex items-center gap-3">
                <Field label="Badge text">
                  <input
                    type="text"
                    value={config.badgeText}
                    onChange={(e) => updateConfig("badgeText", e.target.value)}
                    className={inputClass}
                  />
                </Field>
                <Field label="Color">
                  <input
                    type="color"
                    value={config.badgeColor}
                    onChange={(e) => updateConfig("badgeColor", e.target.value)}
                    className="h-8 w-10 cursor-pointer rounded border border-border bg-transparent"
                  />
                </Field>
              </div>
            )}

            {/* Accent bar */}
            <Field label={`Accent bar: ${config.accentBarHeight}px`}>
              <input
                type="range"
                min={0}
                max={16}
                value={config.accentBarHeight}
                onChange={(e) => updateConfig("accentBarHeight", parseInt(e.target.value))}
                className="w-full accent-primary"
              />
            </Field>
            {config.accentBarHeight > 0 && (
              <Field label="Accent color">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.accentBarColor}
                    onChange={(e) => updateConfig("accentBarColor", e.target.value)}
                    className="h-8 w-8 cursor-pointer rounded border border-border bg-transparent"
                  />
                  <input
                    type="text"
                    value={config.accentBarColor}
                    onChange={(e) => updateConfig("accentBarColor", e.target.value)}
                    className={inputClass}
                  />
                </div>
              </Field>
            )}
          </div>
        )}

        {/* ═══ EXPORT ═══ */}
        <div className="space-y-2 rounded-lg border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Export</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Download your OG image in the format you need.
          </p>
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => exportAs("png")}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Download className="h-3.5 w-3.5" />
              PNG
            </button>
            <button
              onClick={() => exportAs("webp")}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              <Download className="h-3.5 w-3.5" />
              WebP
            </button>
            <button
              onClick={() => exportAs("svg")}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              <Download className="h-3.5 w-3.5" />
              SVG
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
