import React from 'react';
import { ExternalLink } from 'lucide-react';

interface SourceCitationsProps {
  sources: string[];
}

const SourceCitations: React.FC<SourceCitationsProps> = ({ sources }) => {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-6 pt-4 border-t border-slate-700/50">
      <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
        <ExternalLink className="w-3 h-3" /> Nguồn dữ liệu (Google Search):
      </p>
      <div className="flex flex-wrap gap-2">
        {sources.slice(0, 3).map((source, idx) => {
          try {
            const domain = new URL(source).hostname.replace('www.', '');
            return (
              <a 
                key={idx} 
                href={source} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[10px] bg-slate-800 text-blue-400 hover:text-blue-300 px-2 py-1 rounded-full border border-slate-700 transition-colors truncate max-w-[150px]"
              >
                {domain}
              </a>
            );
          } catch (e) {
            return null;
          }
        })}
      </div>
    </div>
  );
};

export default SourceCitations;