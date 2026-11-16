// Global in-memory singleton for offline video playback
let memoryBlobUrl = null;
let isLoadedInMemory = false;

const CACHE_NAME = 'bgmi-hero-stream-v1';
const VIDEO_PATH = '/zLF7ZVlv.mp4';

/**
 * Loads video into browser RAM as a Blob URL, backing it with CacheStorage.
 * Guarantees zero-network offline loop playback until page refresh.
 *
 * @param {Function} onProgress - Callback (percent: number) => void
 * @returns {Promise<string>} The blob: URL or fallback URL
 */
export async function loadVideoOfflineBlob(onProgress) {
  // If already loaded in memory during this session, return immediately
  if (memoryBlobUrl && isLoadedInMemory) {
    if (onProgress) onProgress(100);
    return memoryBlobUrl;
  }

  let videoBlob = null;

  // 1. Check CacheStorage first (instant if previously cached)
  if (typeof window !== 'undefined' && 'caches' in window) {
    try {
      const cache = await window.caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(VIDEO_PATH);
      if (cachedResponse) {
        if (onProgress) onProgress(60);
        videoBlob = await cachedResponse.blob();
        if (onProgress) onProgress(100);
      }
    } catch (e) {
      console.warn('CacheStorage read failed:', e);
    }
  }

  // 2. If not cached, fetch with progress tracking
  if (!videoBlob && typeof fetch !== 'undefined') {
    try {
      const response = await fetch(VIDEO_PATH);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const contentLengthHeader = response.headers.get('content-length');
      const totalBytes = contentLengthHeader ? parseInt(contentLengthHeader, 10) : 6765725;

      if (response.body && typeof ReadableStream !== 'undefined') {
        const reader = response.body.getReader();
        const chunks = [];
        let receivedBytes = 0;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
          receivedBytes += value.length;

          if (totalBytes > 0 && onProgress) {
            const percent = Math.min(99, Math.round((receivedBytes / totalBytes) * 100));
            onProgress(percent);
          }
        }

        videoBlob = new Blob(chunks, { type: 'video/mp4' });

        // Save into CacheStorage for future instant reloads
        if ('caches' in window) {
          try {
            const cache = await window.caches.open(CACHE_NAME);
            const cacheResponse = new Response(videoBlob.slice(0), {
              headers: {
                'Content-Type': 'video/mp4',
                'Content-Length': String(videoBlob.size)
              }
            });
            await cache.put(VIDEO_PATH, cacheResponse);
          } catch (cacheErr) {
            console.warn('CacheStorage put failed:', cacheErr);
          }
        }
      } else {
        videoBlob = await response.blob();
      }

      if (onProgress) onProgress(100);
    } catch (fetchErr) {
      console.warn('Fetch video blob failed, falling back to direct video path:', fetchErr);
    }
  }

  // 3. Create persistent object URL in RAM
  if (videoBlob) {
    try {
      memoryBlobUrl = URL.createObjectURL(videoBlob);
      isLoadedInMemory = true;
      return memoryBlobUrl;
    } catch (blobErr) {
      console.warn('createObjectURL failed:', blobErr);
    }
  }

  // Fallback to direct path
  return VIDEO_PATH;
}

/**
 * Returns current memory blob URL if available
 */
export function getCachedBlobUrl() {
  return memoryBlobUrl;
}

/**
 * Check if video is already ready in memory
 */
export function isVideoInMemory() {
  return isLoadedInMemory;
}
