
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

interface PositionPreviewProps {
  width: number; // mm
  height: number; // mm
  type?: string;
  finish?: string;
  className?: string;
  /** When true the component will not render the visual <img> preview; useful for hidden/offscreen canvases */
  hidePreview?: boolean;
}

export type PositionPreviewHandle = {
  /** returns PNG data URL (Promise resolves to string) */
  getImage: () => Promise<string>;
};

const MM_TO_PX = (mm: number) => Math.round((mm / 25.4) * 96); // approximate conversion using 96 DPI

const PositionPreview = forwardRef<PositionPreviewHandle, PositionPreviewProps>((props, ref) => {
  const { width, height, type = 'Window', finish = 'Anodized', className = '', hidePreview = false } = props;
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  // create offscreen canvas once
  useEffect(() => {
    const canvas = document.createElement('canvas');
    offscreenCanvasRef.current = canvas;
    return () => {
      offscreenCanvasRef.current = null;
    };
  }, []);

  // draw function - renders diagram on the offscreen canvas and sets data URL
  const draw = async () => {
    const canvas = offscreenCanvasRef.current;
    if (!canvas) return '';

    // map provided mm dimensions to a reasonable pixel drawing size
    const pxWidth = Math.max(120, Math.min(600, MM_TO_PX(width) / 2));
    const pxHeight = Math.max(80, Math.min(600, MM_TO_PX(height) / 2));

    const padding = Math.round(Math.min(pxWidth, pxHeight) * 0.12);
    const frameThickness = Math.max(6, Math.round(Math.min(pxWidth, pxHeight) * 0.06));

    // use devicePixelRatio for crispness
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = (pxWidth + padding * 2) * dpr;
    canvas.height = (pxHeight + padding * 2) * dpr;
    canvas.style.width = `${pxWidth + padding * 2}px`;
    canvas.style.height = `${pxHeight + padding * 2}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);

    // outer frame (wood/finish)
    ctx.fillStyle = '#8D6E63';
    roundRect(ctx, padding - frameThickness, padding - frameThickness, pxWidth + frameThickness * 2, pxHeight + frameThickness * 2, 4);
    ctx.fill();

    // inner aluminum frame
    ctx.fillStyle = '#0f172a';
    roundRect(ctx, padding, padding, pxWidth, pxHeight, 2);
    ctx.fill();

    // glass area
    ctx.fillStyle = '#e6f7ff';
    roundRect(ctx, padding + frameThickness, padding + frameThickness, pxWidth - frameThickness * 2, pxHeight - frameThickness * 2, 2);
    ctx.fill();

    // type-specific markers
    if (type.toLowerCase().includes('slider')) {
      ctx.fillStyle = '#0b2447';
      ctx.fillRect(padding + pxWidth / 2 - 6, padding + 6, 12, pxHeight - 12);
    } else if (type.toLowerCase().includes('casement')) {
      ctx.strokeStyle = '#1d4ed8';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(padding + frameThickness, padding + frameThickness);
      ctx.lineTo(padding + pxWidth / 2, padding + pxHeight - frameThickness);
      ctx.lineTo(padding + pxWidth - frameThickness, padding + frameThickness);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // dimension arrows & text
    ctx.fillStyle = '#0f172a';
    ctx.font = '12px system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${width} mm`, padding + pxWidth / 2, padding + pxHeight + 20);
    ctx.save();
    ctx.translate(padding + pxWidth + 30, padding + pxHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(`${height} mm`, 0, 0);
    ctx.restore();

    // small legend
    ctx.fillStyle = '#111827';
    ctx.font = '10px system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Type: ${type}`, padding, padding + pxHeight + 40);
    ctx.fillText(`Finish: ${finish}`, padding + 120, padding + pxHeight + 40);

    // return PNG dataURL
    const dataUrl = canvas.toDataURL('image/png');
    setDataUrl(dataUrl);
    return dataUrl;
  };

  // expose getImage() via ref
  useImperativeHandle(ref, () => ({
    getImage: async () => {
      // ensure draw has run
      const img = await draw();
      return img || '';
    }
  }), [width, height, type, finish]);

  // redraw when props change (non-blocking)
  useEffect(() => {
    let mounted = true;
    (async () => {
      await draw();
      if (!mounted) return;
    })();
    return () => { mounted = false; };
  }, [width, height, type, finish]);

  // helper: rounded rectangle
  function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
  }

  return (
    <div className={`relative ${className}`}>
      {/* Visible preview image (uses generated dataUrl). When hidePreview is true we keep canvases off-DOM */}
      {!hidePreview && (
        <div className="flex flex-col items-center bg-white p-2 border border-slate-200 rounded-lg shadow-sm">
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Diagram</div>
          {dataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={dataUrl} alt={`Diagram ${width}x${height}`} className="max-w-full h-auto rounded-md border" />
          ) : (
            <div className="w-40 h-24 bg-slate-100 rounded flex items-center justify-center text-[12px] text-slate-400">Rendering...</div>
          )}
        </div>
      )}
    </div>
  );
});

export default PositionPreview;
