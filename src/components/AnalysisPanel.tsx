import React from 'react';
import { AlternativeSolution } from '../types';
import { TrendingUp, CheckCircle2, AlertCircle, DollarSign, Info, Maximize2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { clsx } from 'clsx';

interface AnalysisPanelProps {
  explanation: string;
  alternatives: AlternativeSolution[];
  activeAltIndex: number | null;
  onSelectAlternative: (index: number | null) => void;
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ 
  explanation, 
  alternatives, 
  activeAltIndex,
  onSelectAlternative 
}) => {
  return (
    <div className="flex flex-col gap-8 h-full overflow-y-auto custom-scrollbar pr-4">
      <section className="bg-white rounded-[2rem] p-8 border border-zinc-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gcp-blue/10 rounded-xl flex items-center justify-center">
              <Info className="w-5 h-5 text-gcp-blue" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-zinc-900">Architectural Logic</h3>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Design Rationale</p>
            </div>
          </div>
          {activeAltIndex !== null && (
            <button 
              onClick={() => onSelectAlternative(null)}
              className="px-4 py-2 bg-gcp-blue text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
            >
              Reset to Primary
            </button>
          )}
        </div>
        <div className="prose prose-sm max-w-none text-zinc-600 leading-relaxed">
          <ReactMarkdown>{explanation}</ReactMarkdown>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-gcp-green/10 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-gcp-green" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-zinc-900">Alternative Solutions</h3>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Trade-off Analysis</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          {alternatives.map((alt, idx) => (
            <button 
              key={idx} 
              onClick={() => onSelectAlternative(idx)}
              className={clsx(
                "text-left bg-white border rounded-[2rem] p-8 shadow-sm transition-all group relative overflow-hidden",
                activeAltIndex === idx 
                  ? "border-gcp-blue ring-4 ring-gcp-blue/5" 
                  : "border-zinc-200 hover:border-gcp-blue/30 hover:shadow-xl hover:-translate-y-1"
              )}
            >
              {activeAltIndex === idx && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-gcp-blue/5 rounded-bl-[4rem] flex items-center justify-center pl-6 pb-6">
                  <CheckCircle2 className="w-6 h-6 text-gcp-blue" />
                </div>
              )}
              
              <div className="flex justify-between items-start mb-4 pr-12">
                <div>
                  <h4 className="font-bold text-zinc-900 text-lg">{alt.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md text-[10px] font-bold border border-emerald-100">
                      <DollarSign className="w-3 h-3" />
                      {alt.estimatedCost}
                    </div>
                    <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-widest">Estimated Monthly</span>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-zinc-500 mb-8 leading-relaxed">{alt.description}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-emerald-50/30 rounded-2xl p-4 border border-emerald-100/50">
                  <h5 className="text-[10px] uppercase tracking-wider font-bold text-emerald-700 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3" /> Key Advantages
                  </h5>
                  <ul className="space-y-2">
                    {alt.pros.map((p, i) => (
                      <li key={i} className="text-xs text-zinc-600 flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-amber-50/30 rounded-2xl p-4 border border-amber-100/50">
                  <h5 className="text-[10px] uppercase tracking-wider font-bold text-amber-700 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-3 h-3" /> Considerations
                  </h5>
                  <ul className="space-y-2">
                    {alt.cons.map((c, i) => (
                      <li key={i} className="text-xs text-zinc-600 flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className={clsx(
                "mt-8 pt-6 border-t border-zinc-100 flex items-center justify-between transition-all",
                activeAltIndex === idx ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              )}>
                <span className="text-[10px] font-bold text-gcp-blue uppercase tracking-widest">
                  {activeAltIndex === idx ? "Active Configuration" : "View Architecture"}
                </span>
                <div className="w-8 h-8 rounded-full bg-gcp-blue/10 flex items-center justify-center">
                  <Maximize2 className="w-4 h-4 text-gcp-blue" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
