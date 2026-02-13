"use client"

import { useState, useCallback, useMemo } from "react"
import { Download, Zap, Package, Loader2, RotateCcw, Filter } from "lucide-react"
import JSZip from "jszip"
import { UploadZone } from "@/components/upload-zone"
import { AssetGrid } from "@/components/asset-grid"
import { CodePreview } from "@/components/code-preview"
import { ASSET_CONFIGS, CATEGORY_LABELS } from "@/lib/asset-config"
import { generateAssets, type GeneratedAsset } from "@/lib/image-processor"

const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS)

export function FaviconGenerator() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [assets, setAssets] = useState<GeneratedAsset[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState({ current: 0, total: 0 })

  // Category filter state
  const [enabledCategories, setEnabledCategories] = useState<Set<string>>(
    new Set(ALL_CATEGORIES)
  )

  // Selection state for selective download
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set())

  const toggleCategory = useCallback((cat: string) => {
    setEnabledCategories((prev) => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })
  }, [])

  const toggleAllCategories = useCallback(() => {
    setEnabledCategories((prev) => {
      if (prev.size === ALL_CATEGORIES.length) return new Set()
      return new Set(ALL_CATEGORIES)
    })
  }, [])

  const filteredConfigs = useMemo(
    () => ASSET_CONFIGS.filter((c) => enabledCategories.has(c.category)),
    [enabledCategories]
  )

  const handleFileSelect = useCallback((selectedFile: File) => {
    setFile(selectedFile)
    setPreviewUrl(URL.createObjectURL(selectedFile))
    setAssets([])
    setSelectedAssets(new Set())
  }, [])

  const handleClear = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    assets.forEach((a) => URL.revokeObjectURL(a.url))
    setFile(null)
    setPreviewUrl(null)
    setAssets([])
    setSelectedAssets(new Set())
    setProgress({ current: 0, total: 0 })
  }, [previewUrl, assets])

  const handleGenerate = useCallback(async () => {
    if (!file || filteredConfigs.length === 0) return
    setIsGenerating(true)
    setProgress({ current: 0, total: filteredConfigs.length })
    setSelectedAssets(new Set())

    try {
      const results = await generateAssets(file, filteredConfigs, (current, total) => {
        setProgress({ current, total })
      })
      setAssets(results)
    } catch (err) {
      console.error("Generation failed:", err)
    } finally {
      setIsGenerating(false)
    }
  }, [file, filteredConfigs])

  // Selection handlers
  const toggleAssetSelection = useCallback((name: string) => {
    setSelectedAssets((prev) => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }, [])

  const selectAll = useCallback(() => {
    setSelectedAssets(new Set(assets.map((a) => a.config.name)))
  }, [assets])

  const clearSelection = useCallback(() => {
    setSelectedAssets(new Set())
  }, [])

  const downloadZip = useCallback(
    async (assetsToDownload: GeneratedAsset[]) => {
      if (assetsToDownload.length === 0) return

      const zip = new JSZip()

      for (const asset of assetsToDownload) {
        const arrayBuffer = await asset.blob.arrayBuffer()
        zip.file(asset.config.name, arrayBuffer)
      }

      // Add webmanifest
      const androids = assetsToDownload.filter((a) => a.config.category === "android")
      if (androids.length > 0) {
        const manifest = JSON.stringify(
          {
            name: "My Blog",
            short_name: "Blog",
            icons: androids.map((a) => ({
              src: `/${a.config.name}`,
              sizes: `${a.config.width}x${a.config.height}`,
              type: "image/png",
            })),
            theme_color: "#ffffff",
            background_color: "#ffffff",
            display: "standalone",
          },
          null,
          2
        )
        zip.file("site.webmanifest", manifest)
      }

      const blob = await zip.generateAsync({ type: "blob" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "favicon-assets.zip"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    },
    []
  )

  const handleDownloadAll = useCallback(() => {
    downloadZip(assets)
  }, [assets, downloadZip])

  const handleDownloadSelected = useCallback(() => {
    const selected = assets.filter((a) => selectedAssets.has(a.config.name))
    downloadZip(selected)
  }, [assets, selectedAssets, downloadZip])

  return (
    <div className="space-y-8">
      {/* Upload */}
      <section>
        <UploadZone
          onFileSelect={handleFileSelect}
          currentFile={file}
          previewUrl={previewUrl}
          onClear={handleClear}
        />
      </section>

      {/* Category Filter */}
      {file && (
        <section className="rounded-xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Categories</span>
              <span className="text-xs text-muted-foreground">
                ({enabledCategories.size}/{ALL_CATEGORIES.length})
              </span>
            </div>
            <button
              onClick={toggleAllCategories}
              className="text-xs font-medium text-primary transition-colors hover:text-primary/80"
            >
              {enabledCategories.size === ALL_CATEGORIES.length ? "Deselect All" : "Select All"}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {ALL_CATEGORIES.map((cat) => {
              const count = ASSET_CONFIGS.filter((c) => c.category === cat).length
              const enabled = enabledCategories.has(cat)
              return (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    enabled
                      ? "border border-primary/30 bg-primary/10 text-primary"
                      : "border border-border bg-secondary/30 text-muted-foreground line-through opacity-60"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      enabled ? "bg-primary" : "bg-muted-foreground/30"
                    }`}
                  />
                  {CATEGORY_LABELS[cat]}
                  <span className="font-mono opacity-70">{count}</span>
                </button>
              )
            })}
          </div>
          {filteredConfigs.length > 0 && (
            <p className="mt-2 text-xs text-muted-foreground">
              {filteredConfigs.length} assets will be generated
            </p>
          )}
        </section>
      )}

      {/* Actions */}
      {file && (
        <section className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || filteredConfigs.length === 0}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating... ({progress.current}/{progress.total})
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                Generate {filteredConfigs.length} Assets
              </>
            )}
          </button>

          {assets.length > 0 && (
            <>
              <button
                onClick={handleDownloadAll}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-secondary"
              >
                <Package className="h-4 w-4" />
                Download All ZIP
              </button>
              {selectedAssets.size > 0 && (
                <button
                  onClick={handleDownloadSelected}
                  className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-5 py-2.5 text-sm font-medium text-primary transition-all hover:bg-primary/10"
                >
                  <Download className="h-4 w-4" />
                  Download Selected ({selectedAssets.size})
                </button>
              )}
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-secondary hover:text-foreground disabled:opacity-50"
              >
                <RotateCcw className="h-4 w-4" />
                Regenerate
              </button>
            </>
          )}
        </section>
      )}

      {/* Progress Bar */}
      {isGenerating && (
        <div className="rounded-lg bg-secondary/50 p-1">
          <div
            className="h-1 rounded-full bg-primary transition-all duration-300"
            style={{ width: `${(progress.current / progress.total) * 100}%` }}
          />
        </div>
      )}

      {/* Results */}
      {assets.length > 0 && (
        <>
          <section>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-foreground">Generated Assets</h2>
                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  {assets.length} files
                </span>
              </div>
              <div className="flex items-center gap-3">
                {selectedAssets.size > 0 ? (
                  <button
                    onClick={clearSelection}
                    className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Clear selection
                  </button>
                ) : (
                  <button
                    onClick={selectAll}
                    className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Select all
                  </button>
                )}
                <button
                  onClick={handleDownloadAll}
                  className="inline-flex items-center gap-1.5 text-sm text-primary transition-colors hover:text-primary/80"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download all
                </button>
              </div>
            </div>
            <AssetGrid
              assets={assets}
              selectedAssets={selectedAssets}
              onToggleSelect={toggleAssetSelection}
            />
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold text-foreground">Usage Code</h2>
            <CodePreview assets={assets} />
          </section>
        </>
      )}
    </div>
  )
}
