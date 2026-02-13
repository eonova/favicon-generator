"use client"

import { Download, Globe, Smartphone, Share2, Monitor, ImageIcon, PenTool, Check } from "lucide-react"
import { CATEGORY_LABELS } from "@/lib/asset-config"
import type { GeneratedAsset } from "@/lib/image-processor"
import { cn } from "@/lib/utils"

const CATEGORY_ICON_MAP: Record<string, React.ElementType> = {
  favicon: Globe,
  apple: Smartphone,
  android: Smartphone,
  social: Share2,
  ms: Monitor,
  webp: ImageIcon,
  svg: PenTool,
}

interface AssetGridProps {
  assets: GeneratedAsset[]
  selectedAssets?: Set<string>
  onToggleSelect?: (name: string) => void
}

export function AssetGrid({ assets, selectedAssets, onToggleSelect }: AssetGridProps) {
  const grouped = assets.reduce<Record<string, GeneratedAsset[]>>((acc, asset) => {
    const cat = asset.config.category
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(asset)
    return acc
  }, {})

  const handleDownload = (asset: GeneratedAsset) => {
    const a = document.createElement("a")
    a.href = asset.url
    a.download = asset.config.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const selectable = !!onToggleSelect

  return (
    <div className="space-y-8">
      {Object.entries(grouped).map(([category, categoryAssets]) => {
        const Icon = CATEGORY_ICON_MAP[category] || Globe
        return (
          <div key={category}>
            <div className="mb-4 flex items-center gap-2">
              <Icon className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold tracking-wide uppercase text-foreground">
                {CATEGORY_LABELS[category] || category}
              </h3>
              <span className="ml-1 text-xs text-muted-foreground">
                ({categoryAssets.length})
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {categoryAssets.map((asset) => (
                <AssetCard
                  key={asset.config.name}
                  asset={asset}
                  onDownload={handleDownload}
                  selected={selectedAssets?.has(asset.config.name) ?? false}
                  selectable={selectable}
                  onToggleSelect={onToggleSelect}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function AssetCard({
  asset,
  onDownload,
  selected,
  selectable,
  onToggleSelect,
}: {
  asset: GeneratedAsset
  onDownload: (asset: GeneratedAsset) => void
  selected: boolean
  selectable: boolean
  onToggleSelect?: (name: string) => void
}) {
  const { config } = asset
  const isSmall = config.width <= 48

  return (
    <div
      className={cn(
        "group relative flex flex-col items-center gap-3 rounded-xl border bg-card p-4",
        "transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        selected
          ? "border-primary/50 bg-primary/5 shadow-md shadow-primary/10"
          : "border-border hover:border-primary/40 hover:bg-card/80 hover:shadow-lg hover:shadow-primary/5"
      )}
    >
      {/* Selection checkbox */}
      {selectable && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleSelect?.(config.name)
          }}
          className={cn(
            "absolute left-2 top-2 flex h-5 w-5 items-center justify-center rounded-md border transition-all",
            selected
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card text-transparent opacity-0 group-hover:opacity-100"
          )}
          aria-label={selected ? "Deselect" : "Select"}
        >
          <Check className="h-3 w-3" />
        </button>
      )}

      {/* Download button */}
      <button
        onClick={() => onDownload(asset)}
        className={cn(
          "absolute right-2 top-2 rounded-md p-1",
          "opacity-0 transition-opacity group-hover:opacity-100",
          "text-primary hover:bg-primary/10"
        )}
        title={`Download ${config.name}`}
      >
        <Download className="h-3.5 w-3.5" />
      </button>

      {/* Preview */}
      <div
        onClick={() => onDownload(asset)}
        className={cn(
          "flex cursor-pointer items-center justify-center rounded-lg bg-secondary/50",
          "transition-transform duration-200 group-hover:scale-105",
          isSmall ? "h-14 w-14 p-3" : "h-20 w-20 p-2"
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset.url}
          alt={config.name}
          className="max-h-full max-w-full object-contain"
          style={{
            imageRendering: isSmall ? "pixelated" : "auto",
          }}
        />
      </div>
      <div className="w-full min-w-0 text-center">
        <p className="truncate font-mono text-xs font-medium text-foreground">{config.name}</p>
        <p className="mt-0.5 text-[10px] text-muted-foreground">
          {config.width}x{config.height}
        </p>
      </div>
    </div>
  )
}
