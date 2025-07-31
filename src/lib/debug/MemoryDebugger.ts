export class MemoryDebugger {
  private measurements: Map<string, any> = new Map();

  // Measure canvas memory usage
  measureCanvasMemory(): void {
    const canvases = document.querySelectorAll('canvas');
    let totalMemory = 0;
    const details: any[] = [];

    canvases.forEach((canvas, index) => {
      const bytes = canvas.width * canvas.height * 4; // RGBA
      const mb = bytes / 1024 / 1024;
      details.push({
        index,
        width: canvas.width,
        height: canvas.height,
        cssWidth: canvas.style.width,
        cssHeight: canvas.style.height,
        memory: `${mb.toFixed(2)}MB`,
        id: canvas.id || 'unnamed'
      });
      totalMemory += mb;
    });

    this.measurements.set('canvas', {
      total: `${totalMemory.toFixed(2)}MB`,
      count: canvases.length,
      details
    });

    console.table(details);
    console.log(`Total Canvas Memory: ${totalMemory.toFixed(2)}MB`);
  }

  // Measure image cache
  measureImageCache(): void {
    const images = document.querySelectorAll('img');
    const imageDetails: any[] = [];
    
    images.forEach((img) => {
      if (img.complete && img.naturalWidth > 0) {
        const estimatedBytes = img.naturalWidth * img.naturalHeight * 4;
        imageDetails.push({
          src: img.src.substring(img.src.lastIndexOf('/') + 1),
          dimensions: `${img.naturalWidth}x${img.naturalHeight}`,
          memory: `${(estimatedBytes / 1024 / 1024).toFixed(2)}MB`
        });
      }
    });

    this.measurements.set('images', {
      count: images.length,
      details: imageDetails
    });
  }

  // Count island renderer assets
  async countIslandAssets(renderer: any): Promise<void> {
    if (!renderer.islandRenderer) return;

    const assetCache = renderer.islandRenderer.assetCache;
    if (!assetCache) return;

    const details = {
      islands: assetCache.islands?.size || 0,
      shields: assetCache.shields?.size || 0,
      logos: assetCache.logos?.size || 0,
      banner: assetCache.banner ? 1 : 0
    };

    // Estimate memory for cached images
    let estimatedMemory = 0;
    let breakdownDetails: any[] = [];
    
    // Islands (1862x1075 x 4 variants)
    const islandMem = (1862 * 1075 * 4) * details.islands / 1024 / 1024;
    estimatedMemory += islandMem;
    breakdownDetails.push({
      type: 'Islands',
      count: details.islands,
      dimensions: '1862x1075',
      perItem: `${(1862 * 1075 * 4 / 1024 / 1024).toFixed(2)}MB`,
      total: `${islandMem.toFixed(2)}MB`
    });
    
    // Shields (320x400 per chain - optimized size)
    if (details.shields > 0) {
      const shieldMem = (320 * 400 * 4) * details.shields / 1024 / 1024;
      estimatedMemory += shieldMem;
      breakdownDetails.push({
        type: 'Shields (Optimized)',
        count: details.shields,
        dimensions: '320x400',
        perItem: `${(320 * 400 * 4 / 1024 / 1024).toFixed(2)}MB`,
        total: `${shieldMem.toFixed(2)}MB`
      });
    }
    
    // Logos (estimated 350x350 average)
    const logoMem = (350 * 350 * 4) * details.logos / 1024 / 1024;
    estimatedMemory += logoMem;
    breakdownDetails.push({
      type: 'Logos',
      count: details.logos,
      dimensions: '~350x350',
      perItem: `${(350 * 350 * 4 / 1024 / 1024).toFixed(2)}MB`,
      total: `${logoMem.toFixed(2)}MB`
    });
    
    // Banner (1415x475)
    if (details.banner) {
      const bannerMem = (1415 * 475 * 4) / 1024 / 1024;
      estimatedMemory += bannerMem;
      breakdownDetails.push({
        type: 'Banner',
        count: 1,
        dimensions: '1415x475',
        perItem: `${bannerMem.toFixed(2)}MB`,
        total: `${bannerMem.toFixed(2)}MB`
      });
    }

    this.measurements.set('islandAssets', {
      ...details,
      estimatedMemory: `${estimatedMemory.toFixed(2)}MB`
    });

    console.log('Island Renderer Assets:', details);
    console.table(breakdownDetails);
    console.log(`Total Estimated Asset Memory: ${estimatedMemory.toFixed(2)}MB`);
  }

  // Check JS heap
  measureJSHeap(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const details = {
        usedJSHeap: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
        totalJSHeap: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
        limit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)}MB`,
        usage: `${((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100).toFixed(1)}%`
      };
      
      this.measurements.set('jsHeap', details);
      console.log('JS Heap:', details);
    }
  }

  // Count DOM nodes
  measureDOM(): void {
    const allElements = document.querySelectorAll('*').length;
    const svgElements = document.querySelectorAll('svg *').length;
    
    this.measurements.set('dom', {
      totalElements: allElements,
      svgElements: svgElements,
      nonSvgElements: allElements - svgElements
    });

    console.log('DOM Nodes:', {
      total: allElements,
      svg: svgElements,
      other: allElements - svgElements
    });
  }

  // Analyze Svelte components
  analyzeSvelteComponents(): void {
    // Count mounted components by looking for Svelte's internal markers
    const svelteNodes = document.querySelectorAll('[data-svelte-h]');
    const componentRoots = new Set();
    
    // Find component boundaries
    document.querySelectorAll('*').forEach(el => {
      if (el.hasAttribute('data-svelte-h') || 
          el.classList.toString().includes('svelte-')) {
        let parent = el.parentElement;
        while (parent && parent !== document.body) {
          if (parent.hasAttribute('data-svelte-h')) break;
          parent = parent.parentElement;
        }
        if (!parent || parent === document.body) {
          componentRoots.add(el);
        }
      }
    });

    this.measurements.set('svelte', {
      markers: svelteNodes.length,
      estimatedComponents: componentRoots.size
    });
  }

  // Get all measurements
  getAllMeasurements(): void {
    console.log('\n=== MEMORY ANALYSIS REPORT ===\n');
    
    this.measureCanvasMemory();
    console.log('');
    
    this.measureJSHeap();
    console.log('');
    
    this.measureImageCache();
    console.log('');
    
    this.measureDOM();
    console.log('');
    
    this.analyzeSvelteComponents();
    console.log('');

    // Summary
    const summary = {
      canvas: this.measurements.get('canvas')?.total,
      jsHeap: this.measurements.get('jsHeap')?.usedJSHeap,
      images: this.measurements.get('images')?.count,
      domNodes: this.measurements.get('dom')?.totalElements,
      islandAssets: this.measurements.get('islandAssets')?.estimatedMemory
    };

    console.log('\n=== SUMMARY ===');
    console.table(summary);
  }

  // Monitor memory over time
  startMonitoring(intervalMs: number = 5000): void {
    console.log('Starting memory monitoring...');
    
    const monitor = () => {
      const timestamp = new Date().toLocaleTimeString();
      console.log(`\n[${timestamp}] Memory snapshot:`);
      
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        console.log(`Heap: ${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`);
      }
      
      this.measureCanvasMemory();
    };

    monitor(); // Initial measurement
    setInterval(monitor, intervalMs);
  }

  // Force garbage collection (Chrome DevTools only)
  forceGC(): void {
    if ('gc' in window) {
      console.log('Forcing garbage collection...');
      (window as any).gc();
      setTimeout(() => {
        this.measureJSHeap();
      }, 100);
    } else {
      console.warn('Garbage collection not available. Run Chrome with --js-flags="--expose-gc"');
    }
  }
}

// Export singleton instance
export const memoryDebugger = new MemoryDebugger();

// Expose to window for console access
if (typeof window !== 'undefined') {
  (window as any).memoryDebugger = memoryDebugger;
  console.log('Memory debugger available as window.memoryDebugger');
  console.log('Usage: memoryDebugger.getAllMeasurements()');
}