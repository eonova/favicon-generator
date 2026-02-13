export const OG_WIDTH = 1200
export const OG_HEIGHT = 630

export type GradientDirection =
  | "to-right"
  | "to-left"
  | "to-bottom"
  | "to-top"
  | "to-br"
  | "to-bl"
  | "to-tr"
  | "to-tl"

export type BackgroundType = "solid" | "gradient" | "image"

export type TextAlign = "left" | "center" | "right"
export type TextVAlign = "top" | "center" | "bottom"
export type FontFamily = "sans-serif" | "serif" | "monospace"
export type LogoPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right"

export interface OGConfig {
  // Background
  bgType: BackgroundType
  bgColor: string
  gradientFrom: string
  gradientTo: string
  gradientDirection: GradientDirection
  bgImageUrl: string | null
  bgOverlayOpacity: number

  // Text
  title: string
  titleSize: number
  titleColor: string
  titleWeight: string
  subtitle: string
  subtitleSize: number
  subtitleColor: string
  author: string
  authorSize: number
  authorColor: string
  textAlign: TextAlign
  textVAlign: TextVAlign
  fontFamily: FontFamily

  // Style
  padding: number
  showBadge: boolean
  badgeText: string
  badgeColor: string
  accentBarHeight: number
  accentBarColor: string

  // Logo
  showLogo: boolean
  logoPosition: LogoPosition
  logoSize: number
  logoBorderRadius: number
}

export const DEFAULT_OG_CONFIG: OGConfig = {
  bgType: "gradient",
  bgColor: "#0a0a0a",
  gradientFrom: "#0f172a",
  gradientTo: "#1e3a5f",
  gradientDirection: "to-br",
  bgImageUrl: null,
  bgOverlayOpacity: 0.6,

  title: "My Blog Post Title",
  titleSize: 56,
  titleColor: "#ffffff",
  titleWeight: "bold",
  subtitle: "A short description of the blog post",
  subtitleSize: 24,
  subtitleColor: "#94a3b8",
  author: "Author Name",
  authorSize: 18,
  authorColor: "#64748b",
  textAlign: "left",
  textVAlign: "center",
  fontFamily: "sans-serif",

  padding: 80,
  showBadge: true,
  badgeText: "myblog.dev",
  badgeColor: "#22c55e",
  accentBarHeight: 6,
  accentBarColor: "#22c55e",

  showLogo: false,
  logoPosition: "bottom-right",
  logoSize: 64,
  logoBorderRadius: 12,
}

// ─── Preset Templates ──────────────────────────────────────────────
export interface OGPreset {
  name: string
  description: string
  config: Partial<OGConfig>
}

export const OG_PRESETS: OGPreset[] = [
  {
    name: "Minimal Dark",
    description: "Clean dark gradient, left-aligned",
    config: {
      bgType: "gradient",
      gradientFrom: "#0a0a0a",
      gradientTo: "#171717",
      gradientDirection: "to-br",
      titleSize: 56,
      titleColor: "#fafafa",
      titleWeight: "bold",
      subtitleColor: "#737373",
      authorColor: "#525252",
      textAlign: "left",
      textVAlign: "center",
      fontFamily: "sans-serif",
      padding: 80,
      showBadge: false,
      accentBarHeight: 0,
    },
  },
  {
    name: "Tech Blog",
    description: "Bold gradient with accent bar",
    config: {
      bgType: "gradient",
      gradientFrom: "#0f172a",
      gradientTo: "#1e3a5f",
      gradientDirection: "to-br",
      titleSize: 52,
      titleColor: "#ffffff",
      titleWeight: "bold",
      subtitleColor: "#94a3b8",
      authorColor: "#64748b",
      textAlign: "left",
      textVAlign: "center",
      fontFamily: "sans-serif",
      padding: 80,
      showBadge: true,
      badgeText: "dev.to",
      badgeColor: "#3b82f6",
      accentBarHeight: 6,
      accentBarColor: "#3b82f6",
    },
  },
  {
    name: "Warm Ember",
    description: "Warm tones with serif typography",
    config: {
      bgType: "gradient",
      gradientFrom: "#1a0a00",
      gradientTo: "#7c2d12",
      gradientDirection: "to-br",
      titleSize: 54,
      titleColor: "#fef3c7",
      titleWeight: "bold",
      subtitleColor: "#d97706",
      authorColor: "#b45309",
      textAlign: "left",
      textVAlign: "center",
      fontFamily: "serif",
      padding: 80,
      showBadge: true,
      badgeText: "blog",
      badgeColor: "#f59e0b",
      accentBarHeight: 4,
      accentBarColor: "#f59e0b",
    },
  },
  {
    name: "Forest",
    description: "Green tones, clean & calm",
    config: {
      bgType: "gradient",
      gradientFrom: "#052e16",
      gradientTo: "#166534",
      gradientDirection: "to-br",
      titleSize: 54,
      titleColor: "#ecfdf5",
      titleWeight: "bold",
      subtitleColor: "#6ee7b7",
      authorColor: "#34d399",
      textAlign: "left",
      textVAlign: "center",
      fontFamily: "sans-serif",
      padding: 80,
      showBadge: true,
      badgeText: "read",
      badgeColor: "#22c55e",
      accentBarHeight: 5,
      accentBarColor: "#22c55e",
    },
  },
  {
    name: "Centered Bold",
    description: "Center-aligned, large type",
    config: {
      bgType: "solid",
      bgColor: "#09090b",
      titleSize: 64,
      titleColor: "#fafafa",
      titleWeight: "bold",
      subtitleSize: 26,
      subtitleColor: "#71717a",
      authorColor: "#52525b",
      textAlign: "center",
      textVAlign: "center",
      fontFamily: "sans-serif",
      padding: 100,
      showBadge: false,
      accentBarHeight: 0,
    },
  },
  {
    name: "Mono Hacker",
    description: "Monospace, terminal-style look",
    config: {
      bgType: "solid",
      bgColor: "#020617",
      titleSize: 44,
      titleColor: "#22d3ee",
      titleWeight: "bold",
      subtitleSize: 22,
      subtitleColor: "#475569",
      authorSize: 16,
      authorColor: "#334155",
      textAlign: "left",
      textVAlign: "bottom",
      fontFamily: "monospace",
      padding: 80,
      showBadge: true,
      badgeText: "$ ./blog",
      badgeColor: "#22d3ee",
      accentBarHeight: 3,
      accentBarColor: "#22d3ee",
    },
  },
]

export const GRADIENT_PRESETS: { name: string; from: string; to: string; dir: GradientDirection }[] = [
  { name: "Ocean", from: "#0f172a", to: "#1e3a5f", dir: "to-br" },
  { name: "Sunset", from: "#7c2d12", to: "#c2410c", dir: "to-right" },
  { name: "Forest", from: "#052e16", to: "#166534", dir: "to-br" },
  { name: "Midnight", from: "#0c0a09", to: "#1c1917", dir: "to-bottom" },
  { name: "Lavender", from: "#1e1b4b", to: "#3730a3", dir: "to-br" },
  { name: "Ember", from: "#1a0a00", to: "#9a3412", dir: "to-tr" },
]

function getGradientCoords(dir: GradientDirection, w: number, h: number): [number, number, number, number] {
  switch (dir) {
    case "to-right": return [0, 0, w, 0]
    case "to-left": return [w, 0, 0, 0]
    case "to-bottom": return [0, 0, 0, h]
    case "to-top": return [0, h, 0, 0]
    case "to-br": return [0, 0, w, h]
    case "to-bl": return [w, 0, 0, h]
    case "to-tr": return [0, h, w, 0]
    case "to-tl": return [w, h, 0, 0]
  }
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  fontSize: number,
  lineHeight: number
): string[] {
  if (!text) return []
  const words = text.split(" ")
  const lines: string[] = []
  let currentLine = ""

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word
    const metrics = ctx.measureText(testLine)
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine)
      currentLine = word
    } else {
      currentLine = testLine
    }
  }
  if (currentLine) lines.push(currentLine)

  const maxLines = Math.floor((OG_HEIGHT * 0.5) / (fontSize * lineHeight))
  if (lines.length > maxLines) {
    lines.length = maxLines
    lines[maxLines - 1] = lines[maxLines - 1].replace(/\s+\S*$/, "...")
  }

  return lines
}

export function renderOG(
  canvas: HTMLCanvasElement,
  config: OGConfig,
  bgImage?: HTMLImageElement | null,
  logoImage?: HTMLImageElement | null
): void {
  canvas.width = OG_WIDTH
  canvas.height = OG_HEIGHT
  const ctx = canvas.getContext("2d")
  if (!ctx) return

  // === Background ===
  if (config.bgType === "solid") {
    ctx.fillStyle = config.bgColor
    ctx.fillRect(0, 0, OG_WIDTH, OG_HEIGHT)
  } else if (config.bgType === "gradient") {
    const [x0, y0, x1, y1] = getGradientCoords(config.gradientDirection, OG_WIDTH, OG_HEIGHT)
    const grad = ctx.createLinearGradient(x0, y0, x1, y1)
    grad.addColorStop(0, config.gradientFrom)
    grad.addColorStop(1, config.gradientTo)
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, OG_WIDTH, OG_HEIGHT)
  } else if (config.bgType === "image" && bgImage) {
    const imgRatio = bgImage.naturalWidth / bgImage.naturalHeight
    const canvasRatio = OG_WIDTH / OG_HEIGHT
    let sx = 0, sy = 0, sw = bgImage.naturalWidth, sh = bgImage.naturalHeight
    if (imgRatio > canvasRatio) {
      sw = bgImage.naturalHeight * canvasRatio
      sx = (bgImage.naturalWidth - sw) / 2
    } else {
      sh = bgImage.naturalWidth / canvasRatio
      sy = (bgImage.naturalHeight - sh) / 2
    }
    ctx.drawImage(bgImage, sx, sy, sw, sh, 0, 0, OG_WIDTH, OG_HEIGHT)
    ctx.fillStyle = `rgba(0, 0, 0, ${config.bgOverlayOpacity})`
    ctx.fillRect(0, 0, OG_WIDTH, OG_HEIGHT)
  }

  // === Accent Bar (bottom) ===
  if (config.accentBarHeight > 0) {
    ctx.fillStyle = config.accentBarColor
    ctx.fillRect(0, OG_HEIGHT - config.accentBarHeight, OG_WIDTH, config.accentBarHeight)
  }

  // === Badge (top-right) ===
  if (config.showBadge && config.badgeText) {
    const badgeFontSize = 16
    ctx.font = `600 ${badgeFontSize}px ${config.fontFamily}`
    const badgeMetrics = ctx.measureText(config.badgeText)
    const badgePadX = 16
    const badgePadY = 8
    const badgeW = badgeMetrics.width + badgePadX * 2
    const badgeH = badgeFontSize + badgePadY * 2
    const badgeX = OG_WIDTH - config.padding - badgeW
    const badgeY = config.padding

    ctx.fillStyle = config.badgeColor
    const radius = badgeH / 2
    ctx.beginPath()
    ctx.roundRect(badgeX, badgeY, badgeW, badgeH, radius)
    ctx.fill()

    ctx.fillStyle = "#000000"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(config.badgeText, badgeX + badgeW / 2, badgeY + badgeH / 2 + 1)
  }

  // === Logo ===
  if (config.showLogo && logoImage) {
    const s = config.logoSize
    const p = config.padding
    let lx: number, ly: number
    switch (config.logoPosition) {
      case "top-left":    lx = p; ly = p; break
      case "top-right":   lx = OG_WIDTH - p - s; ly = p; break
      case "bottom-left": lx = p; ly = OG_HEIGHT - p - s - config.accentBarHeight; break
      case "bottom-right":
      default:            lx = OG_WIDTH - p - s; ly = OG_HEIGHT - p - s - config.accentBarHeight; break
    }

    ctx.save()
    const r = config.logoBorderRadius
    ctx.beginPath()
    ctx.roundRect(lx, ly, s, s, r)
    ctx.clip()
    ctx.drawImage(logoImage, lx, ly, s, s)
    ctx.restore()

    // subtle border
    ctx.strokeStyle = "rgba(255,255,255,0.15)"
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.roundRect(lx, ly, s, s, r)
    ctx.stroke()
  }

  // === Text Area ===
  const pad = config.padding
  const reservedRight = config.showBadge ? 200 : 0
  const reservedLogo = config.showLogo && logoImage ? config.logoSize + 24 : 0
  const maxTextWidth = OG_WIDTH - pad * 2 - Math.max(reservedRight, reservedLogo)
  const lineHeight = 1.3

  ctx.font = `${config.titleWeight === "bold" ? "700" : "400"} ${config.titleSize}px ${config.fontFamily}`
  const titleLines = wrapText(ctx, config.title, maxTextWidth, config.titleSize, lineHeight)

  ctx.font = `400 ${config.subtitleSize}px ${config.fontFamily}`
  const subtitleLines = wrapText(ctx, config.subtitle, maxTextWidth, config.subtitleSize, lineHeight)

  const titleBlockH = titleLines.length * config.titleSize * lineHeight
  const subtitleBlockH = subtitleLines.length * config.subtitleSize * lineHeight
  const authorBlockH = config.author ? config.authorSize * lineHeight : 0
  const gap = 20
  const totalTextH =
    titleBlockH +
    (subtitleBlockH > 0 ? gap + subtitleBlockH : 0) +
    (authorBlockH > 0 ? gap * 1.5 + authorBlockH : 0)

  let textY: number
  if (config.textVAlign === "top") {
    textY = pad
  } else if (config.textVAlign === "bottom") {
    textY = OG_HEIGHT - pad - totalTextH - config.accentBarHeight
  } else {
    textY = (OG_HEIGHT - config.accentBarHeight - totalTextH) / 2
  }

  let textX: number
  ctx.textAlign = config.textAlign
  if (config.textAlign === "left") textX = pad
  else if (config.textAlign === "right") textX = OG_WIDTH - pad
  else textX = OG_WIDTH / 2

  ctx.textBaseline = "top"

  // Draw title
  ctx.font = `${config.titleWeight === "bold" ? "700" : "400"} ${config.titleSize}px ${config.fontFamily}`
  ctx.fillStyle = config.titleColor
  for (const line of titleLines) {
    ctx.fillText(line, textX, textY)
    textY += config.titleSize * lineHeight
  }

  // Draw subtitle
  if (subtitleLines.length > 0) {
    textY += gap
    ctx.font = `400 ${config.subtitleSize}px ${config.fontFamily}`
    ctx.fillStyle = config.subtitleColor
    for (const line of subtitleLines) {
      ctx.fillText(line, textX, textY)
      textY += config.subtitleSize * lineHeight
    }
  }

  // Draw author
  if (config.author) {
    textY += gap * 1.5
    ctx.font = `500 ${config.authorSize}px ${config.fontFamily}`
    ctx.fillStyle = config.authorColor
    ctx.fillText(config.author, textX, textY)
  }
}
