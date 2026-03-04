import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Stage, Layer, Rect, Text, Line, Group, Circle, Image as KonvaImage, Arrow } from 'react-konva';
import { Node, Edge, GcpServiceType, Group as DiagramGroup } from '../types';
import { GCP_ICON_URLS } from '../constants';
import { Maximize2, ZoomIn, ZoomOut, RotateCcw, Download, Cloud, Building2 } from 'lucide-react';

interface DiagramCanvasProps {
  nodes: Node[];
  edges: Edge[];
  groups?: DiagramGroup[];
  width: number;
  height: number;
  onEnlarge?: () => void;
}

const NodeIcon = ({ url, x, y }: { url: string; x: number; y: number }) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new window.Image();
    img.src = url;
    img.crossOrigin = 'Anonymous';
    img.onload = () => setImage(img);
  }, [url]);

  if (!image) return null;

  return (
    <KonvaImage
      image={image}
      x={x}
      y={y}
      width={56}
      height={56}
    />
  );
};

export const DiagramCanvas: React.FC<DiagramCanvasProps> = ({ nodes, edges, groups = [], width, height, onEnlarge }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const stageRef = useRef<any>(null);

  const resetZoom = () => {
    if (nodes.length === 0) return;
    const allX = [...nodes.map(n => n.x), ...groups.map(g => g.x), ...groups.map(g => g.x + g.width)];
    const allY = [...nodes.map(n => n.y), ...groups.map(g => g.y), ...groups.map(g => g.y + g.height)];
    const minX = Math.min(...allX, 0);
    const minY = Math.min(...allY, 0);
    const maxX = Math.max(...allX, width);
    const maxY = Math.max(...allY, height);
    const contentWidth = maxX - minX + 300;
    const contentHeight = maxY - minY + 300;
    const scaleX = width / contentWidth;
    const scaleY = height / contentHeight;
    const newScale = Math.min(scaleX, scaleY, 1);
    setScale(newScale);
    setPosition({
      x: (width - contentWidth * newScale) / 2 - minX * newScale,
      y: (height - contentHeight * newScale) / 2 - minY * newScale
    });
  };

  useEffect(() => {
    resetZoom();
  }, [nodes, groups, width, height]);

  const handleZoom = (factor: number) => {
    const newScale = scale * factor;
    setScale(Math.max(0.1, Math.min(5, newScale)));
  };

  const handleDownload = () => {
    if (!stageRef.current) return;
    const uri = stageRef.current.toDataURL({ pixelRatio: 3 }); // HD Quality
    const link = document.createElement('a');
    link.download = 'gcp-architecture.png';
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    const scaleBy = 1.1;
    const stage = stageRef.current;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    setScale(Math.max(0.1, Math.min(5, newScale)));
    setPosition({
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    });
  };

  return (
    <div 
      className="w-full h-full bg-[#f8f9fa] rounded-2xl overflow-hidden border border-zinc-200 relative shadow-inner group"
      onDoubleClick={onEnlarge}
    >
      <Stage 
        ref={stageRef}
        width={width} 
        height={height} 
        scaleX={scale} 
        scaleY={scale}
        x={position.x}
        y={position.y}
        draggable
        onWheel={handleWheel}
        className="cursor-grab active:cursor-grabbing"
      >
        <Layer>
          {/* Subtle Grid */}
          {Array.from({ length: 80 }).map((_, i) => (
            <Line
              key={`v-${i}`}
              points={[i * 50, -2000, i * 50, 4000]}
              stroke="#f1f3f4"
              strokeWidth={1}
            />
          ))}
          {Array.from({ length: 80 }).map((_, i) => (
            <Line
              key={`h-${i}`}
              points={[-2000, i * 50, 4000, i * 50]}
              stroke="#f1f3f4"
              strokeWidth={1}
            />
          ))}

          {/* Groups (Regions/VPCs/On-Prem) */}
          {groups.map((group) => (
            <Group key={group.id} x={group.x} y={group.y}>
              <Rect
                width={group.width}
                height={group.height}
                fill={group.environment === 'on-prem' ? 'rgba(95, 99, 104, 0.02)' : 'transparent'}
                stroke={group.environment === 'on-prem' ? '#5F6368' : (group.type === 'region' ? '#4285F4' : '#BDC1C6')}
                strokeWidth={2}
                dash={group.type === 'vpc' ? [12, 6] : (group.environment === 'on-prem' ? [5, 5] : [])}
                cornerRadius={12}
              />
              <Rect
                width={160}
                height={32}
                fill={group.environment === 'on-prem' ? '#5F6368' : (group.type === 'region' ? '#4285F4' : '#BDC1C6')}
                cornerRadius={[12, 0, 12, 0]}
              />
              <Text
                text={group.label}
                fontSize={12}
                fontFamily="Inter"
                fontStyle="bold"
                fill="white"
                x={12}
                y={10}
              />
              {group.cidr && (
                <Text
                  text={group.cidr}
                  fontSize={10}
                  fontFamily="JetBrains Mono"
                  fill={group.environment === 'on-prem' ? '#5F6368' : '#4285F4'}
                  x={12}
                  y={group.height - 20}
                />
              )}
              <Text
                text={group.type.toUpperCase()}
                fontSize={9}
                fontFamily="Inter"
                fontStyle="bold"
                fill={group.environment === 'on-prem' ? '#5F6368' : '#70757a'}
                x={group.width - 100}
                y={-20}
                width={100}
                align="right"
              />
            </Group>
          ))}

          {/* Edges */}
          {edges.map((edge) => {
            const fromNode = nodes.find((n) => n.id === edge.from);
            const toNode = nodes.find((n) => n.id === edge.to);
            if (!fromNode || !toNode) return null;

            const startX = fromNode.x + 60;
            const startY = fromNode.y + 60;
            const endX = toNode.x + 60;
            const endY = toNode.y + 60;

            const midX = (startX + endX) / 2;
            const midY = (startY + endY) / 2;

            return (
              <Group key={edge.id}>
                <Arrow
                  points={[startX, startY, endX, endY]}
                  stroke="#BDC1C6"
                  strokeWidth={2}
                  fill="#BDC1C6"
                  pointerLength={8}
                  pointerWidth={8}
                  tension={0.2}
                />
                {edge.label && (
                  <Text
                    x={midX + 15}
                    y={midY - 15}
                    text={edge.label}
                    fontSize={10}
                    fontFamily="Inter"
                    fill="#5f6368"
                    fontStyle="italic"
                  />
                )}
              </Group>
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => (
            <Group key={node.id} x={node.x} y={node.y} draggable>
              <Rect
                width={120}
                height={140}
                fill="white"
                cornerRadius={12}
                shadowBlur={20}
                shadowOpacity={0.1}
                shadowOffset={{ x: 0, y: 6 }}
                stroke="#e8eaed"
                strokeWidth={1.5}
              />
              
              <Circle
                x={60}
                y={45}
                radius={34}
                fill="#f8f9fa"
                stroke="#f1f3f4"
                strokeWidth={1}
              />

              <Group x={32} y={17}>
                <NodeIcon url={GCP_ICON_URLS[node.type] || GCP_ICON_URLS[GcpServiceType.COMPUTE_ENGINE]} x={0} y={0} />
              </Group>

              <Text
                text={node.label}
                fontSize={12}
                fontFamily="Inter"
                fontStyle="bold"
                fill="#202124"
                x={5}
                y={88}
                width={110}
                align="center"
                lineHeight={1.3}
              />
              
              <Text
                text={node.type}
                fontSize={9}
                fontFamily="Inter"
                fill="#5f6368"
                x={5}
                y={112}
                width={110}
                align="center"
              />

              {node.ipAddress && (
                <Text
                  text={node.ipAddress}
                  fontSize={9}
                  fontFamily="JetBrains Mono"
                  fill="#4285F4"
                  x={5}
                  y={124}
                  width={110}
                  align="center"
                />
              )}
            </Group>
          ))}
        </Layer>
      </Stage>
      
      {/* Toolbar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 bg-white/90 backdrop-blur border border-zinc-200 rounded-2xl shadow-2xl z-20">
        <button onClick={() => handleZoom(1.2)} className="p-2 hover:bg-zinc-100 rounded-xl transition-colors text-zinc-600" title="Zoom In">
          <ZoomIn className="w-5 h-5" />
        </button>
        <button onClick={() => handleZoom(0.8)} className="p-2 hover:bg-zinc-100 rounded-xl transition-colors text-zinc-600" title="Zoom Out">
          <ZoomOut className="w-5 h-5" />
        </button>
        <div className="w-px h-6 bg-zinc-200 mx-1" />
        <button onClick={resetZoom} className="p-2 hover:bg-zinc-100 rounded-xl transition-colors text-zinc-600" title="Reset View">
          <RotateCcw className="w-5 h-5" />
        </button>
        <button onClick={handleDownload} className="p-2 hover:bg-zinc-100 rounded-xl transition-colors text-zinc-600" title="Download HD PNG">
          <Download className="w-5 h-5" />
        </button>
        <div className="w-px h-6 bg-zinc-200 mx-1" />
        <button onClick={onEnlarge} className="p-2 hover:bg-zinc-100 rounded-xl transition-colors text-zinc-600" title="Full Screen">
          <Maximize2 className="w-5 h-5" />
        </button>
      </div>

      <div className="absolute top-6 left-6 flex flex-col gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur border border-zinc-200 rounded-xl shadow-sm">
          <Cloud className="w-4 h-4 text-gcp-blue" />
          <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Cloud Environment</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur border border-zinc-200 rounded-xl shadow-sm">
          <Building2 className="w-4 h-4 text-zinc-500" />
          <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">On-Premises</span>
        </div>
      </div>
    </div>
  );
};
