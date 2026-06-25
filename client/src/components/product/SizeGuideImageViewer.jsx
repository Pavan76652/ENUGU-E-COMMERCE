import { useCallback, useEffect, useRef, useState } from 'react';
import { getOptimizedSizeGuideImageUrl } from '../../utils/sizeGuideImage';

const MIN_SCALE = 1;
const MAX_SCALE = 3;
const ZOOM_STEP = 0.5;

const getTouchDistance = (touches) => {
  const [a, b] = touches;
  const dx = a.clientX - b.clientX;
  const dy = a.clientY - b.clientY;
  return Math.hypot(dx, dy);
};

const SizeGuideImageViewer = ({ src, alt = 'ENUGU size guide' }) => {
  const containerRef = useRef(null);
  const clickTimerRef = useRef(null);
  const pinchRef = useRef({ startDistance: 0, startScale: 1 });
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, originX: 0, originY: 0 });

  const optimizedSrc = getOptimizedSizeGuideImageUrl(src, { width: 1400 });

  const resetZoom = useCallback(() => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    resetZoom();
    setLoaded(false);
  }, [src, resetZoom]);

  const clampOffset = useCallback((nextScale, nextOffset) => {
    const container = containerRef.current;
    if (!container || nextScale <= 1) {
      return { x: 0, y: 0 };
    }

    const maxX = ((nextScale - 1) * container.clientWidth) / 2;
    const maxY = ((nextScale - 1) * container.clientHeight) / 2;

    return {
      x: Math.max(-maxX, Math.min(maxX, nextOffset.x)),
      y: Math.max(-maxY, Math.min(maxY, nextOffset.y)),
    };
  }, []);

  const toggleZoom = useCallback(() => {
    setScale((current) => {
      const next = current > 1 ? 1 : 2;
      if (next === 1) {
        setOffset({ x: 0, y: 0 });
      }
      return next;
    });
  }, []);

  const handleImageClick = () => {
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
      toggleZoom();
      return;
    }

    clickTimerRef.current = setTimeout(() => {
      clickTimerRef.current = null;
      toggleZoom();
    }, 220);
  };

  const handlePointerDown = (event) => {
    if (scale <= 1) return;
    setIsDragging(true);
    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      originX: offset.x,
      originY: offset.y,
    };
  };

  const handlePointerMove = (event) => {
    if (!isDragging) return;
    const dx = event.clientX - dragRef.current.startX;
    const dy = event.clientY - dragRef.current.startY;
    setOffset(clampOffset(scale, {
      x: dragRef.current.originX + dx,
      y: dragRef.current.originY + dy,
    }));
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (event) => {
    if (event.touches.length === 2) {
      pinchRef.current = {
        startDistance: getTouchDistance(event.touches),
        startScale: scale,
      };
    }
  };

  const handleTouchMove = (event) => {
    if (event.touches.length !== 2) return;
    const distance = getTouchDistance(event.touches);
    const ratio = distance / pinchRef.current.startDistance;
    const nextScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, pinchRef.current.startScale * ratio));
    setScale(nextScale);
    if (nextScale === 1) {
      setOffset({ x: 0, y: 0 });
    } else {
      setOffset((current) => clampOffset(nextScale, current));
    }
  };

  const zoomIn = () => {
    setScale((current) => Math.min(MAX_SCALE, current + ZOOM_STEP));
  };

  const zoomOut = () => {
    setScale((current) => {
      const next = Math.max(MIN_SCALE, current - ZOOM_STEP);
      if (next === 1) setOffset({ x: 0, y: 0 });
      return next;
    });
  };

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-xl bg-gray-50 touch-pan-y"
        style={{ aspectRatio: loaded ? 'auto' : '3 / 4', minHeight: loaded ? undefined : '280px' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-enugu-black border-t-transparent" />
          </div>
        )}

        <img
          src={optimizedSrc}
          alt={alt}
          loading="lazy"
          decoding="async"
          draggable={false}
          onClick={handleImageClick}
          onDoubleClick={(event) => {
            event.preventDefault();
            if (clickTimerRef.current) {
              clearTimeout(clickTimerRef.current);
              clickTimerRef.current = null;
            }
          }}
          onLoad={() => setLoaded(true)}
          className={`mx-auto w-full cursor-zoom-in select-none transition-transform duration-300 ease-out ${
            loaded ? 'opacity-100' : 'opacity-0'
          } ${scale > 1 ? 'cursor-grab active:cursor-grabbing' : ''}`}
          style={{
            transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${scale})`,
            transformOrigin: 'center center',
          }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-xs text-gray-500">
          Tap, click, or double-tap to zoom. Pinch on mobile.
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={zoomOut}
            aria-label="Zoom out"
            className="rounded-full border border-gray-300 px-3 py-1.5 text-sm font-medium text-enugu-black transition hover:border-enugu-black"
          >
            −
          </button>
          <button
            type="button"
            onClick={resetZoom}
            aria-label="Reset zoom"
            className="rounded-full border border-gray-300 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-enugu-black transition hover:border-enugu-black"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={zoomIn}
            aria-label="Zoom in"
            className="rounded-full border border-gray-300 px-3 py-1.5 text-sm font-medium text-enugu-black transition hover:border-enugu-black"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default SizeGuideImageViewer;
