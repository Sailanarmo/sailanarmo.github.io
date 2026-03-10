import './style.css'
import { fromArrayBuffer } from 'geotiff'

const STORAGE_KEY = 'sidebar-collapsed'

const sidebar = document.getElementById('sidebar')
const toggleBtn = document.getElementById('sidebar-toggle')

if (sidebar && toggleBtn) {
  // Restore persisted collapse state
  if (localStorage.getItem(STORAGE_KEY) === 'true') {
    sidebar.classList.add('collapsed')
  }

  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed')
    localStorage.setItem(
      STORAGE_KEY,
      String(sidebar.classList.contains('collapsed'))
    )
  })
}

// ---------------------------------------------------------------------------
// Atlas page — only runs when the canvas element is present
// ---------------------------------------------------------------------------

const atlasCanvas = document.getElementById('atlas-canvas') as HTMLCanvasElement | null
if (atlasCanvas) {
  initAtlas(atlasCanvas).catch((err) => {
    setStatus(`Failed to load: ${err}`)
  })
}

function setStatus(msg: string) {
  const el = document.getElementById('atlas-status')
  if (el) el.textContent = msg
}

// Decode a PNG URL using the browser's built-in image + 2D canvas pipeline.
// Returns RGBA bytes (4 channels, 8-bit) — exactly what OpenCV CV_8UC4 expects.
async function decodePng(url: string): Promise<{ data: Uint8Array; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const offscreen = document.createElement('canvas')
      offscreen.width = img.naturalWidth
      offscreen.height = img.naturalHeight
      const ctx = offscreen.getContext('2d')!
      ctx.drawImage(img, 0, 0)
      const imageData = ctx.getImageData(0, 0, img.naturalWidth, img.naturalHeight)
      resolve({
        data: new Uint8Array(imageData.data.buffer),
        width: img.naturalWidth,
        height: img.naturalHeight,
      })
    }
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`))
    img.src = url
  })
}

// Decode a TIFF/TIFF file via geotiff.js, normalising any bit depth down to 8-bit.
async function decodeTiff(file: File): Promise<{ data: Uint8Array; width: number; height: number; channels: number }> {
  const buf = await file.arrayBuffer()
  const tiff = await fromArrayBuffer(buf)
  const image = await tiff.getImage()

  const width = image.getWidth()
  const height = image.getHeight()
  const channels = image.getSamplesPerPixel()
  const bitsPerSample = image.getBitsPerSample()

  // interleave:true gives a single flat array in R,G,B,... order
  const rasters = await image.readRasters({ interleave: true })

  let data: Uint8Array
  if (bitsPerSample > 8) {
    // Normalise 16-bit (common in scientific microscopy) to 8-bit
    const src = rasters as Uint16Array
    const maxVal = (1 << bitsPerSample) - 1
    data = new Uint8Array(src.length)
    for (let i = 0; i < src.length; i++) {
      data[i] = Math.round((src[i] / maxVal) * 255)
    }
  } else {
    data = new Uint8Array((rasters as unknown as ArrayBufferLike))
  }

  return { data, width, height, channels }
}

async function loadDataset(name: 'LGN' | 'PAG', Module: any) {
  setStatus(`Loading ${name} dataset…`)
  const manifest: Record<string, string[]> = await fetch('/Dataset/manifest.json').then((r) => r.json())
  const files = manifest[name] ?? []

  for (let i = 0; i < files.length; i++) {
    setStatus(`Loading ${name} ${i + 1}/${files.length}…`)
    const url = `/Dataset/${name}/${files[i]}`
    const { data, width, height } = await decodePng(url)
    // RGBA (4 channels) — the browser canvas always returns 4-channel RGBA
    Module.addOverlayImageFromPixels(data, width, height, 4)
  }
  setStatus(`${name} dataset loaded (${files.length} images).`)
}

async function initAtlas(canvas: HTMLCanvasElement) {
  // Size the backing buffer to match the CSS layout size
  canvas.width = canvas.offsetWidth || 900
  canvas.height = canvas.offsetHeight || 600

  // Vite blocks dynamic import() of files in public/ at dev time.
  // Workaround: fetch the JS text, wrap it in a blob: URL, then import that.
  // The browser's native loader handles blob: URLs directly, bypassing Vite.
  // locateFile tells Emscripten where to find the .wasm alongside the JS.
  const jsText = await fetch('/wasm/AtlasImagerWeb.js').then((r) => r.text())
  const blob = new Blob([jsText], { type: 'text/javascript' })
  const blobUrl = URL.createObjectURL(blob)
  let AtlasImagerFactory: (opts: object) => Promise<any>
  try {
    const mod = await import(/* @vite-ignore */ blobUrl)
    AtlasImagerFactory = mod.default
  } finally {
    URL.revokeObjectURL(blobUrl)
  }
  const Module = await AtlasImagerFactory({
    canvas,
    locateFile: (path: string) => `/wasm/${path}`,
  })

  Module.initRenderer(canvas.width, canvas.height)
  setStatus('Ready.')

  // Show viewer controls now that the module is live
  const viewerControls = document.getElementById('viewer-controls')
  if (viewerControls) viewerControls.style.display = ''

  // User X-Ray upload (TIFF)
  document.getElementById('user-image-input')?.addEventListener('change', async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    setStatus('Decoding TIFF…')
    const { data, width, height, channels } = await decodeTiff(file)
    Module.loadMainImageFromPixels(data, width, height, channels)
    setStatus('User image loaded.')
  })

  // Dataset buttons
  document.getElementById('btn-load-lgn')?.addEventListener('click', () => loadDataset('LGN', Module))
  document.getElementById('btn-load-pag')?.addEventListener('click', () => loadDataset('PAG', Module))

  // Viewer controls
  document.getElementById('btn-prev')?.addEventListener('click', () => Module.prevImage())
  document.getElementById('btn-next')?.addEventListener('click', () => Module.nextImage())
  document.getElementById('btn-reset')?.addEventListener('click', () => Module.resetImage())
  document.getElementById('slider-opacity')?.addEventListener('input', (e) => {
    const pct = Number((e.target as HTMLInputElement).value)
    Module.setOpacity(pct / 100)
  })

  // Keep the canvas in sync when the window is resized
  window.addEventListener('resize', () => {
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    Module.resizeRenderer(canvas.width, canvas.height)
  })
}

