import { type AssetConfig } from "./asset-config"

export interface GeneratedAsset {
  config: AssetConfig
  blob: Blob
  url: string
}

function cropToCanvas(
  img: HTMLImageElement,
  width: number,
  height: number
): HTMLCanvasElement {
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Failed to get canvas context")

  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = "high"

  // Calculate cover crop dimensions
  const srcRatio = img.naturalWidth / img.naturalHeight
  const dstRatio = width / height
  let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight

  if (srcRatio > dstRatio) {
    sw = img.naturalHeight * dstRatio
    sx = (img.naturalWidth - sw) / 2
  } else {
    sh = img.naturalWidth / dstRatio
    sy = (img.naturalHeight - sh) / 2
  }

  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, width, height)
  return canvas
}

export function canvasToBlob(canvas: HTMLCanvasElement, format: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const mimeType = format === "ico" ? "image/png" : `image/${format}`
    const quality = format === "webp" ? 0.92 : 1.0
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else reject(new Error("Failed to create blob"))
      },
      mimeType,
      quality
    )
  })
}

export function generateSvgBlob(
  canvas: HTMLCanvasElement,
  width: number,
  height: number
): Blob {
  const dataUrl = canvas.toDataURL("image/png")
  const svgContent = [
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">`,
    `  <image width="${width}" height="${height}" xlink:href="${dataUrl}" />`,
    `</svg>`,
  ].join("\n")
  return new Blob([svgContent], { type: "image/svg+xml" })
}

function resizeImage(
  img: HTMLImageElement,
  width: number,
  height: number,
  format: string
): Promise<Blob> {
  const canvas = cropToCanvas(img, width, height)
  if (format === "svg") {
    return Promise.resolve(generateSvgBlob(canvas, width, height))
  }
  return canvasToBlob(canvas, format)
}

export async function generateAssets(
  imageFile: File,
  configs: AssetConfig[],
  onProgress?: (current: number, total: number) => void
): Promise<GeneratedAsset[]> {
  const img = new Image()
  img.crossOrigin = "anonymous"

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve()
    img.onerror = () => reject(new Error("Failed to load image"))
    img.src = URL.createObjectURL(imageFile)
  })

  const results: GeneratedAsset[] = []

  for (let i = 0; i < configs.length; i++) {
    const config = configs[i]
    const blob = await resizeImage(img, config.width, config.height, config.format)
    const url = URL.createObjectURL(blob)
    results.push({ config, blob, url })
    onProgress?.(i + 1, configs.length)
  }

  URL.revokeObjectURL(img.src)
  return results
}
