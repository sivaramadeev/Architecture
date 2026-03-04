import React, { useState, useRef, useEffect } from 'react';
import { Search, Send, Layout, Database, Server, Shield, Cpu, Cloud, Sparkles, Loader2, History, X, Maximize2 } from 'lucide-react';
import { Architecture } from './types';
import { generateArchitecture } from './services/gemini';
import { DiagramCanvas } from './components/DiagramCanvas';
import { AnalysisPanel } from './components/AnalysisPanel';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'motion/react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SUGGESTIONS = [
  "Scalable E-commerce with Global Load Balancing",
  "Serverless Data Pipeline for Real-time Analytics",
  "High Availability Multi-region GKE Cluster",
  "Secure Internal HR Portal with Identity Aware Proxy",
  "Low-latency Gaming Backend with Cloud Spanner"
];

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [architecture, setArchitecture] = useState<Architecture | null>(null);
  const [activeAltIndex, setActiveAltIndex] = useState<number | null>(null);
  const [isEnlarged, setIsEnlarged] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateSize = () => {
      if (canvasRef.current) {
        setCanvasSize({
          width: canvasRef.current.clientWidth,
          height: canvasRef.current.clientHeight,
        });
      }
    };
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleGenerate = async (inputPrompt: string = prompt) => {
    if (!inputPrompt.trim()) return;
    setLoading(true);
    setActiveAltIndex(null);
    try {
      const result = await generateArchitecture(inputPrompt);
      setArchitecture(result);
      if (!history.includes(inputPrompt)) {
        setHistory(prev => [inputPrompt, ...prev].slice(0, 5));
      }
    } catch (error) {
      console.error("Failed to generate architecture:", error);
    } finally {
      setLoading(false);
    }
  };

  const activeNodes = activeAltIndex !== null && architecture 
    ? architecture.alternatives[activeAltIndex].nodes 
    : architecture?.nodes || [];

  const activeEdges = activeAltIndex !== null && architecture 
    ? architecture.alternatives[activeAltIndex].edges 
    : architecture?.edges || [];

  const activeGroups = activeAltIndex !== null && architecture 
    ? architecture.alternatives[activeAltIndex].groups 
    : architecture?.groups || [];

  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden">
      {/* Sidebar */}
// ... existing code ...
      <aside className="w-80 border-r border-zinc-200 bg-white flex flex-col">
        <div className="p-6 border-b border-zinc-100">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-gcp-blue rounded-lg flex items-center justify-center">
              <Cloud className="text-white w-5 h-5" />
            </div>
            <h1 className="font-bold text-lg tracking-tight">GCP Architect</h1>
          </div>
          <p className="text-xs text-zinc-500">AI-Powered Cloud Design Assistant</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {/* Input Section */}
          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Describe Requirements</label>
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. A scalable web app with global load balancing and a NoSQL database..."
                className="w-full h-32 p-4 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-gcp-blue/20 focus:border-gcp-blue outline-none transition-all resize-none"
              />
              <button
                onClick={() => handleGenerate()}
                disabled={loading || !prompt.trim()}
                className="absolute bottom-3 right-3 p-2 bg-gcp-blue text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-500/20"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Suggestions */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Quick Scenarios</label>
            </div>
            <div className="space-y-2">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setPrompt(s);
                    handleGenerate(s);
                  }}
                  className="w-full text-left p-3 text-xs bg-zinc-50 border border-zinc-100 rounded-lg hover:border-gcp-blue/30 hover:bg-white transition-all text-zinc-600 hover:text-gcp-blue group"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <History className="w-3 h-3 text-zinc-400" />
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Recent Designs</label>
              </div>
              <div className="space-y-2">
                {history.map((h, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setPrompt(h);
                      handleGenerate(h);
                    }}
                    className="w-full text-left p-3 text-xs text-zinc-500 hover:text-zinc-900 truncate border-l-2 border-transparent hover:border-zinc-300 pl-4 transition-all"
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-zinc-100 bg-zinc-50/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center text-[10px] font-bold text-zinc-500">
              SD
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-900">Certified Architect</p>
              <p className="text-[10px] text-zinc-500">v1.0.4 • Active</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-zinc-200 bg-white px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-zinc-100 rounded-full text-[10px] font-bold text-zinc-500">
              <Layout className="w-3 h-3" />
              DIAGRAM VIEW
            </div>
            <div className="h-4 w-px bg-zinc-200" />
            <div className="text-sm font-medium text-zinc-400">
              {architecture ? "Architecture Design Ready" : "Waiting for requirements..."}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="p-2 text-zinc-400 hover:text-zinc-600 transition-colors">
              <Shield className="w-5 h-5" />
            </button>
            <button className="p-2 text-zinc-400 hover:text-zinc-600 transition-colors">
              <Database className="w-5 h-5" />
            </button>
            <button className="p-2 text-zinc-400 hover:text-zinc-600 transition-colors">
              <Cpu className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Workspace */}
        <div className="flex-1 flex overflow-hidden p-8 gap-8">
          {/* Canvas Area */}
          <div className="flex-[3] flex flex-col gap-4 min-w-0">
            <div ref={canvasRef} className="flex-1 min-h-0">
              {architecture ? (
                <DiagramCanvas
                  nodes={activeNodes}
                  edges={activeEdges}
                  groups={activeGroups}
                  width={canvasSize.width}
                  height={canvasSize.height}
                  onEnlarge={() => setIsEnlarged(true)}
                />
              ) : (
                <div className="w-full h-full border-2 border-dashed border-zinc-200 rounded-2xl flex flex-col items-center justify-center text-zinc-400 gap-4 bg-zinc-50/50">
                  <div className="p-4 bg-white rounded-full shadow-sm border border-zinc-100">
                    <Server className="w-8 h-8 text-zinc-300" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium">No Architecture Generated</p>
                    <p className="text-xs">Enter your requirements in the sidebar to begin</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Analysis Area */}
          <div className="flex-[2] min-w-0">
            {architecture ? (
              <AnalysisPanel
                explanation={architecture.explanation}
                alternatives={architecture.alternatives}
                activeAltIndex={activeAltIndex}
                onSelectAlternative={setActiveAltIndex}
              />
            ) : (
// ... existing code ...
              <div className="h-full border border-zinc-200 rounded-2xl bg-white p-8 flex flex-col items-center justify-center text-center gap-4">
                <div className="w-12 h-12 bg-zinc-50 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-zinc-200" />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900">Solution Analysis</h3>
                  <p className="text-sm text-zinc-500 mt-1">
                    Once generated, you'll see detailed explanations, alternative solutions, and cost estimates here.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Enlarged Modal */}
      <AnimatePresence>
        {isEnlarged && architecture && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-8"
            onClick={() => setIsEnlarged(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full h-full rounded-3xl overflow-hidden shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-16 border-b border-zinc-100 px-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gcp-blue rounded-lg flex items-center justify-center">
                    <Cloud className="text-white w-5 h-5" />
                  </div>
                  <h2 className="font-bold text-lg">
                    {activeAltIndex !== null 
                      ? architecture.alternatives[activeAltIndex].title 
                      : "Primary Architecture Design"}
                  </h2>
                </div>
                <button 
                  onClick={() => setIsEnlarged(false)}
                  className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-zinc-400" />
                </button>
              </div>
              <div className="flex-1 p-8">
                <DiagramCanvas
                  nodes={activeNodes}
                  edges={activeEdges}
                  groups={activeGroups}
                  width={window.innerWidth - 128}
                  height={window.innerHeight - 192}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
