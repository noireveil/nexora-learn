'use client';

import { useParams } from 'next/navigation';
import { useChallenge } from '@/hooks/useChallenge';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { Button } from '@/components/ui/Button';
import { Play, CheckCircle, AlertCircle, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export default function ChallengePage() {
  const params = useParams();
  
  // Custom hook handles Worker, Toast, and Logic
  const { 
    challenge, 
    code, 
    setCode, 
    output, 
    isRunning, 
    runCode, 
    resetCode 
  } = useChallenge(params.id as string);

  if (!challenge) return <div className="text-center py-20 text-white">Loading challenge...</div>;

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col md:flex-row bg-background">
        {/* Left Panel */}
        <div className="w-full md:w-1/3 p-6 border-r border-white/5 overflow-y-auto">
            <div className="mb-6">
                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded uppercase tracking-wider">
                    {challenge.difficulty}
                </span>
                <h1 className="text-2xl font-bold mt-2 text-white">{challenge.title}</h1>
            </div>
            
            <div className="prose prose-invert prose-sm mb-8 text-text-muted">
                <p>{challenge.description}</p>
            </div>

            <div className="bg-surface p-4 rounded-lg border border-white/5">
                <h3 className="text-sm font-bold text-text-muted mb-2 uppercase">Test Cases</h3>
                <div className="space-y-2">
                    {challenge.testCases.map((tc, idx) => (
                        <div key={idx} className="text-xs font-mono text-gray-400">
                           • {tc.description}
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 flex flex-col min-w-0">
            {/* Toolbar */}
            <div className="h-12 border-b border-white/5 flex items-center justify-between px-4 bg-surface/50">
                <div className="text-xs text-text-muted">main.js</div>
                <div className="flex gap-2">
                    <Button variant="ghost" className="h-8 text-xs" onClick={resetCode}>
                        <RotateCcw size={14} className="mr-1"/> Reset
                    </Button>
                    <Button className="h-8 text-xs bg-green-600 hover:bg-green-700" onClick={runCode} disabled={isRunning}>
                        <Play size={14} className="mr-1 fill-white"/> 
                        {isRunning ? 'Running...' : 'Run Code'}
                    </Button>
                </div>
            </div>

            {/* Editor */}
            <div className="flex-1 relative">
                <CodeEditor code={code} onChange={(val) => setCode(val || '')} />
            </div>

            {/* Console */}
            <div className="h-1/3 border-t border-white/10 bg-[#0d1117] flex flex-col">
                <div className="px-4 py-2 border-b border-white/5 text-xs font-bold text-text-muted uppercase tracking-wider">
                    Console Output
                </div>
                <div className="flex-1 p-4 overflow-y-auto font-mono text-sm space-y-1">
                    {output.length === 0 && <span className="text-gray-600 italic">Run your code to see output...</span>}
                    {output.map((log, i) => (
                        <div key={i} className={cn(
                            "pb-1 border-b border-white/5 last:border-0",
                            log.type === 'error' && "text-red-400",
                            log.type === 'success' && "text-green-400",
                            log.type === 'fail' && "text-orange-400",
                            log.type === 'log' && "text-gray-300"
                        )}>
                            {log.type === 'success' && <CheckCircle size={12} className="inline mr-2"/>}
                            {log.type === 'fail' && <AlertCircle size={12} className="inline mr-2"/>}
                            {log.content}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
}