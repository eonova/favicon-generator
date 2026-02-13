export interface AssetConfig {
  name: string
  width: number
  height: number
  format: "png" | "ico" | "webp" | "svg"
  category: "favicon" | "apple" | "android" | "social" | "ms" | "webp" | "svg"
  description: string
}

export const ASSET_CONFIGS: AssetConfig[] = [
  // Favicons
  { name: "favicon-16x16.png", width: 16, height: 16, format: "png", category: "favicon", description: "Standard favicon" },
  { name: "favicon-32x32.png", width: 32, height: 32, format: "png", category: "favicon", description: "Standard favicon" },
  { name: "favicon-48x48.png", width: 48, height: 48, format: "png", category: "favicon", description: "Standard favicon" },
  { name: "favicon.ico", width: 48, height: 48, format: "ico", category: "favicon", description: "ICO favicon" },

  // Apple Touch Icons
  { name: "apple-touch-icon.png", width: 180, height: 180, format: "png", category: "apple", description: "Apple Touch Icon" },
  { name: "apple-touch-icon-57x57.png", width: 57, height: 57, format: "png", category: "apple", description: "iPhone (iOS 6)" },
  { name: "apple-touch-icon-60x60.png", width: 60, height: 60, format: "png", category: "apple", description: "iPhone (iOS 7+)" },
  { name: "apple-touch-icon-72x72.png", width: 72, height: 72, format: "png", category: "apple", description: "iPad (iOS 6)" },
  { name: "apple-touch-icon-76x76.png", width: 76, height: 76, format: "png", category: "apple", description: "iPad (iOS 7+)" },
  { name: "apple-touch-icon-114x114.png", width: 114, height: 114, format: "png", category: "apple", description: "iPhone Retina (iOS 6)" },
  { name: "apple-touch-icon-120x120.png", width: 120, height: 120, format: "png", category: "apple", description: "iPhone Retina (iOS 7+)" },
  { name: "apple-touch-icon-144x144.png", width: 144, height: 144, format: "png", category: "apple", description: "iPad Retina (iOS 6)" },
  { name: "apple-touch-icon-152x152.png", width: 152, height: 152, format: "png", category: "apple", description: "iPad Retina (iOS 7+)" },
  { name: "apple-touch-icon-180x180.png", width: 180, height: 180, format: "png", category: "apple", description: "iPhone 6 Plus" },

  // Android Chrome
  { name: "android-chrome-192x192.png", width: 192, height: 192, format: "png", category: "android", description: "Android Chrome" },
  { name: "android-chrome-384x384.png", width: 384, height: 384, format: "png", category: "android", description: "Android Chrome HD" },
  { name: "android-chrome-512x512.png", width: 512, height: 512, format: "png", category: "android", description: "Android Chrome XHD" },

  // Social / Open Graph
  { name: "og-image.png", width: 1200, height: 630, format: "png", category: "social", description: "Open Graph (Facebook/LinkedIn)" },
  { name: "twitter-card.png", width: 1200, height: 600, format: "png", category: "social", description: "Twitter Card" },

  // Microsoft
  { name: "mstile-70x70.png", width: 70, height: 70, format: "png", category: "ms", description: "MS Tile Small" },
  { name: "mstile-144x144.png", width: 144, height: 144, format: "png", category: "ms", description: "MS Tile Medium" },
  { name: "mstile-150x150.png", width: 150, height: 150, format: "png", category: "ms", description: "MS Tile Square" },
  { name: "mstile-310x150.png", width: 310, height: 150, format: "png", category: "ms", description: "MS Tile Wide" },
  { name: "mstile-310x310.png", width: 310, height: 310, format: "png", category: "ms", description: "MS Tile Large" },

  // WebP variants
  { name: "favicon-32x32.webp", width: 32, height: 32, format: "webp", category: "webp", description: "WebP Favicon" },
  { name: "favicon-96x96.webp", width: 96, height: 96, format: "webp", category: "webp", description: "WebP Favicon HD" },
  { name: "icon-192x192.webp", width: 192, height: 192, format: "webp", category: "webp", description: "WebP Icon" },
  { name: "icon-384x384.webp", width: 384, height: 384, format: "webp", category: "webp", description: "WebP Icon HD" },
  { name: "icon-512x512.webp", width: 512, height: 512, format: "webp", category: "webp", description: "WebP Icon XHD" },
  { name: "og-image.webp", width: 1200, height: 630, format: "webp", category: "webp", description: "WebP OG Image" },
  { name: "twitter-card.webp", width: 1200, height: 600, format: "webp", category: "webp", description: "WebP Twitter Card" },
  { name: "cover-1200x800.webp", width: 1200, height: 800, format: "webp", category: "webp", description: "WebP Blog Cover" },
  { name: "thumbnail-480x320.webp", width: 480, height: 320, format: "webp", category: "webp", description: "WebP Thumbnail" },

  // SVG variants
  { name: "favicon.svg", width: 32, height: 32, format: "svg", category: "svg", description: "SVG Favicon" },
  { name: "icon.svg", width: 512, height: 512, format: "svg", category: "svg", description: "SVG Icon" },
  { name: "safari-pinned-tab.svg", width: 16, height: 16, format: "svg", category: "svg", description: "Safari Pinned Tab" },
  { name: "logo-mark.svg", width: 256, height: 256, format: "svg", category: "svg", description: "SVG Logo Mark" },
  { name: "og-image.svg", width: 1200, height: 630, format: "svg", category: "svg", description: "SVG OG Image" },
]

export const CATEGORY_LABELS: Record<string, string> = {
  favicon: "Favicon",
  apple: "Apple Touch Icon",
  android: "Android Chrome",
  social: "Social / OG Image",
  ms: "Microsoft Tile",
  webp: "WebP",
  svg: "SVG",
}

export const CATEGORY_ICONS: Record<string, string> = {
  favicon: "globe",
  apple: "smartphone",
  android: "smartphone",
  social: "share2",
  ms: "monitor",
  webp: "image",
  svg: "pen-tool",
}
