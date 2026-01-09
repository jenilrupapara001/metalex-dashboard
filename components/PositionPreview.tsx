
import React from 'react';

interface PositionPreviewProps {
  width: number; // mm
  height: number; // mm
  type: string;
  finish?: string;
  className?: string;
}

const PositionPreview: React.FC<PositionPreviewProps> = ({ width, height, type, finish = 'Golden Oak', className }) => {
  const maxCanvasSize = 220;
  const padding = 60;
  const aluminumFrameWidth = 12; 
  const woodFrameWidth = 24; 

  const aspectRatio = width / height;
  
  let drawWidth, drawHeight;
  if (aspectRatio > 1) {
    drawWidth = maxCanvasSize;
    drawHeight = maxCanvasSize / aspectRatio;
  } else {
    drawHeight = maxCanvasSize;
    drawWidth = maxCanvasSize * aspectRatio;
  }

  const canvasWidth = drawWidth + padding * 2;
  const canvasHeight = drawHeight + padding * 2;

  const woodColors = {
    base: '#8D6E63', 
    dark: '#4E342E',
    light: '#BCAAA4'
  };

  return (
    <div className={`flex flex-col items-center bg-white p-4 border border-slate-200 rounded-xl shadow-sm ${className}`}>
      <div className="flex justify-between w-full mb-3 px-1">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Architectural Elevation</span>
        <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-100 uppercase">Scale 1:20</span>
      </div>
      
      <svg width={canvasWidth} height={canvasHeight} viewBox={`0 0 ${canvasWidth} ${canvasHeight}`} className="drop-shadow-md">
        <defs>
          <pattern id="woodGrainEnhanced" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
            <rect width="120" height="120" fill={woodColors.base} />
            <path d="M0 15 Q 30 5, 60 15 T 120 15 M0 45 Q 40 55, 120 45 M0 75 Q 30 65, 60 75 T 120 75" fill="none" stroke={woodColors.dark} strokeWidth="1" opacity="0.3" />
            <path d="M0 5 C 20 0, 40 10, 60 5 S 100 0, 120 5" fill="none" stroke={woodColors.light} strokeWidth="0.5" opacity="0.2" />
          </pattern>

          <linearGradient id="glassRealism" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f0f9ff" />
            <stop offset="40%" stopColor="#e0f2fe" />
            <stop offset="60%" stopColor="#bae6fd" />
            <stop offset="100%" stopColor="#7dd3fc" />
          </linearGradient>

          <pattern id="glassReflectionStripes" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
            <rect width="15" height="80" fill="white" opacity="0.12" />
            <rect x="30" width="3" height="80" fill="white" opacity="0.2" />
          </pattern>
        </defs>

        {/* OUTER WOODEN FRAME */}
        <rect 
          x={padding - woodFrameWidth} 
          y={padding - woodFrameWidth} 
          width={drawWidth + (woodFrameWidth * 2)} 
          height={drawHeight + (woodFrameWidth * 2)} 
          fill="url(#woodGrainEnhanced)"
          stroke={woodColors.dark}
          strokeWidth="2"
          rx="2"
        />
        
        {/* Frame Bevels */}
        <line x1={padding - woodFrameWidth} y1={padding - woodFrameWidth} x2={padding} y2={padding} stroke={woodColors.dark} strokeWidth="0.5" />
        <line x1={padding + drawWidth + woodFrameWidth} y1={padding - woodFrameWidth} x2={padding + drawWidth} y2={padding} stroke={woodColors.dark} strokeWidth="0.5" />
        <line x1={padding - woodFrameWidth} y1={padding + drawHeight + woodFrameWidth} x2={padding} y2={padding + drawHeight} stroke={woodColors.dark} strokeWidth="0.5" />
        <line x1={padding + drawWidth + woodFrameWidth} y1={padding + drawHeight + woodFrameWidth} x2={padding + drawWidth} y2={padding + drawHeight} stroke={woodColors.dark} strokeWidth="0.5" />

        {/* INNER ALUMINUM CASING */}
        <rect 
          x={padding} 
          y={padding} 
          width={drawWidth} 
          height={drawHeight} 
          fill="#1e293b" 
          stroke="#0f172a" 
          strokeWidth="3" 
        />

        {/* GLASS UNIT */}
        <rect 
          x={padding + aluminumFrameWidth} 
          y={padding + aluminumFrameWidth} 
          width={drawWidth - (aluminumFrameWidth * 2)} 
          height={drawHeight - (aluminumFrameWidth * 2)} 
          fill="url(#glassRealism)"
          stroke="#0369a1"
          strokeWidth="0.5"
        />
        
        <rect 
          x={padding + aluminumFrameWidth} 
          y={padding + aluminumFrameWidth} 
          width={drawWidth - (aluminumFrameWidth * 2)} 
          height={drawHeight - (aluminumFrameWidth * 2)} 
          fill="url(#glassReflectionStripes)"
        />

        {/* TYPE SPECIFIC MECHANICS */}
        {type.toLowerCase().includes('slider') && (
          <g>
            <rect x={padding + (drawWidth / 2) - 8} y={padding} width="16" height={drawHeight} fill="#0f172a" />
            <path d={`M${padding + 35} ${padding + (drawHeight / 2)} h20 l-6 -6 m6 6 l-6 6`} fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <path d={`M${padding + drawWidth - 35} ${padding + (drawHeight / 2)} h-20 l6 -6 m-6 6 l6 6`} fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}

        {type.toLowerCase().includes('casement') && (
          <path 
            d={`M${padding + aluminumFrameWidth} ${padding + aluminumFrameWidth} L${padding + drawWidth / 2} ${padding + drawHeight - aluminumFrameWidth} L${padding + drawWidth - aluminumFrameWidth} ${padding + aluminumFrameWidth}`} 
            fill="none" 
            stroke="#1d4ed8" 
            strokeWidth="2" 
            strokeDasharray="8 5" 
            opacity="0.9"
          />
        )}

        {/* INDUSTRIAL DIMENSIONING */}
        <g className="font-black">
          {/* Width Dimension */}
          <line x1={padding} y1={canvasHeight - 20} x2={padding + drawWidth} y2={canvasHeight - 20} stroke="#334155" strokeWidth="1.5" />
          <line x1={padding} y1={canvasHeight - 28} x2={padding} y2={canvasHeight - 12} stroke="#334155" strokeWidth="1.5" />
          <line x1={padding + drawWidth} y1={canvasHeight - 28} x2={padding + drawWidth} y2={canvasHeight - 12} stroke="#334155" strokeWidth="1.5" />
          <rect x={padding + (drawWidth/2) - 40} y={canvasHeight - 32} width="80" height="24" fill="white" rx="4" />
          <text x={padding + (drawWidth / 2)} y={canvasHeight - 15} textAnchor="middle" fontSize="14" fill="#0f172a">{width} mm</text>

          {/* Height Dimension */}
          <line x1={canvasWidth - 20} y1={padding} x2={canvasWidth - 20} y2={padding + drawHeight} stroke="#334155" strokeWidth="1.5" />
          <line x1={canvasWidth - 28} y1={padding} x2={canvasWidth - 12} y2={padding} stroke="#334155" strokeWidth="1.5" />
          <line x1={canvasWidth - 28} y1={padding + drawHeight} x2={canvasWidth - 12} y2={padding + drawHeight} stroke="#334155" strokeWidth="1.5" />
          
          <g transform={`translate(${canvasWidth - 16}, ${padding + drawHeight / 2}) rotate(-90)`}>
            <rect x="-40" y="-12" width="80" height="24" fill="white" rx="4" />
            <text x="0" y="6" textAnchor="middle" fontSize="14" fill="#0f172a">{height} mm</text>
          </g>
        </g>
      </svg>
      
      <div className="mt-4 w-full grid grid-cols-2 gap-4 text-[11px] font-black text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100 uppercase tracking-tight">
        <div className="text-center border-r border-slate-200">
          <p className="text-[8px] text-slate-400 mb-0.5 font-black uppercase">Main Profile</p>
          <p className="text-slate-800">Interior Face</p>
        </div>
        <div className="text-center">
          <p className="text-[8px] text-slate-400 mb-0.5 font-black uppercase">Outer Casement</p>
          <p className="text-slate-800">{finish}</p>
        </div>
      </div>
    </div>
  );
};

export default PositionPreview;
