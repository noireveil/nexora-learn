'use client';

import { useParams, useRouter } from 'next/navigation';
import { useChallenge } from '@/hooks/useChallenge';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { Button } from '@/components/ui/Button';
import { Play, RotateCcw, ChevronLeft, Terminal, FileText, CheckCircle, XCircle, ArrowRight, Star, BrainCircuit, Sparkles, Lightbulb, Lock, BookOpen, Code2, SquareTerminal } from 'lucide-react';
import { WebPreview } from '@/components/features/learn/WebPreview';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import ReactMarkdown from 'react-markdown';
import { getCourseByChallengeId } from '@/services/courseService';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function ChallengePage() {
  const params = useParams();
  const router = useRouter();
  const challengeId = params.id as string;
  
  const [activeTab, setActiveTab] = useState<'problem' | 'editor' | 'console'>('problem');

  const { 
    challenge, 
    code, 
    setCode, 
    output, 
    isRunning, 
    isCompleted,
    nextChallengeId,
    aiRecommendation,
    runCode, 
    resetCode,
    unlockedHints, 
    unlockHint,
    closeModal
  } = useChallenge(challengeId);

  const courseId = getCourseByChallengeId(challengeId);
  const backLink = courseId ? `/learn/${courseId}` : '/learn';

  if (!challenge) return <div className="min-h-screen flex items-center justify-center text-text-muted bg-background">Memuat Studio Koding...</div>;

  const isWebChallenge = challenge.topic.includes("Web") || challenge.topic.includes("HTML") || challenge.topic.includes("CSS");
  const isPython = challenge.id.startsWith('py-');

  const editorLanguage = isWebChallenge ? 'html' : isPython ? 'python' : 'javascript';

  const handleRunMobile = () => {
    setActiveTab('console');
    runCode();
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden font-sans relative">
        <AnimatePresence>
            {isCompleted && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
                    />
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 20 }}
                        className="relative bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-slate-100"
                    >
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                            <Star className="w-10 h-10 text-green-600 fill-green-600 animate-pulse" />
                        </div>
                        
                        <h2 className="text-2xl font-black text-slate-900 mb-2">Luar Biasa! 🎉</h2>
                        <p className="text-slate-600 mb-4">
                            Kamu mendapatkan <span className="font-bold text-orange-600">+{challenge.xpReward} XP</span>.
                        </p>

                        {aiRecommendation && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100 text-left"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <BrainCircuit size={18} className="text-indigo-600" />
                                    <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">AI Analysis</span>
                                </div>
                                <p className="text-xs text-indigo-800 leading-relaxed">
                                    Berdasarkan performa kodemu, saran tantangan selanjutnya:
                                </p>
                                <div className="mt-2 flex items-center gap-2">
                                    <Sparkles size={14} className="text-indigo-500"/>
                                    <span className="font-black text-sm text-indigo-900 uppercase">{aiRecommendation}</span>
                                </div>
                            </motion.div>
                        )}

                        <div className="space-y-3">
                            {nextChallengeId ? (
                                <Button 
                                    onClick={() => router.push(`/challenge/${nextChallengeId}`)} 
                                    variant="accent" 
                                    className="w-full h-12 text-base shadow-xl shadow-orange-500/20"
                                >
                                    Lanjut Soal Berikutnya <ArrowRight size={18} className="ml-2"/>
                                </Button>
                            ) : (
                                <Button 
                                    onClick={() => router.push('/learn')} 
                                    variant="accent" 
                                    className="w-full h-12 text-base"
                                >
                                    Selesai! Kembali ke Menu
                                </Button>
                            )}
                            
                            <Button 
                                onClick={closeModal} 
                                variant="ghost" 
                                className="w-full"
                            >
                                Tetap di sini
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>

        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0 z-20 shadow-sm">
            <div className="flex items-center gap-3">
                <Link href={backLink} className="p-2 hover:bg-gray-100 rounded-md text-text-muted transition-colors">
                    <ChevronLeft size={18} />
                </Link>
                <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block"></div>
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-0 sm:gap-2">
                    <h1 className="font-bold text-primary text-sm md:text-base line-clamp-1">{challenge.title}</h1>
                    <span className="text-[10px] sm:text-xs text-text-muted hidden sm:inline-block px-2 py-0.5 bg-gray-100 rounded-full">{challenge.topic}</span>
                </div>
            </div>
            
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={resetCode} className="text-xs h-8 px-2 sm:px-3">
                    <RotateCcw size={14} className="sm:mr-2"/> <span className="hidden sm:inline">Reset</span>
                </Button>
                
                <Button 
                    variant="accent" 
                    size="sm" 
                    onClick={typeof window !== 'undefined' && window.innerWidth < 768 ? handleRunMobile : runCode} 
                    disabled={isRunning} 
                    className="h-8 px-3 sm:px-4 text-xs font-bold"
                >
                    {isRunning ? (
                        <span className="animate-pulse">...</span>
                    ) : (
                        <><Play size={14} className="sm:mr-2 fill-white"/> <span className="hidden sm:inline">Jalankan</span></>
                    )}
                </Button>
            </div>
        </header>

        <div className="md:hidden flex border-b border-gray-200 bg-white shrink-0">
            <button 
                onClick={() => setActiveTab('problem')}
                className={cn(
                    "flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition-colors",
                    activeTab === 'problem' ? "border-primary text-primary bg-primary/5" : "border-transparent text-slate-500"
                )}
            >
                <BookOpen size={16}/> Soal
            </button>
            <button 
                onClick={() => setActiveTab('editor')}
                className={cn(
                    "flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition-colors",
                    activeTab === 'editor' ? "border-primary text-primary bg-primary/5" : "border-transparent text-slate-500"
                )}
            >
                <Code2 size={16}/> Kode
            </button>
            <button 
                onClick={() => setActiveTab('console')}
                className={cn(
                    "flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition-colors relative",
                    activeTab === 'console' ? "border-primary text-primary bg-primary/5" : "border-transparent text-slate-500"
                )}
            >
                <SquareTerminal size={16}/> Hasil
                {output.length > 0 && activeTab !== 'console' && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                )}
            </button>
        </div>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative min-h-0">
            
            <div className={cn(
                "w-full md:w-[35%] lg:w-[30%] bg-white border-r border-gray-200 flex-col z-10 h-full",
                activeTab === 'problem' ? "flex" : "hidden md:flex"
            )}>
                <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar pb-20 md:pb-6">
                    <div className="mb-4">
                        <span className={cn(
                            "text-[10px] font-bold px-2 py-1 rounded border uppercase tracking-wider",
                            challenge.difficulty === 'Easy' ? "bg-green-50 text-green-700 border-green-200" :
                            challenge.difficulty === 'Medium' ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                            "bg-red-50 text-red-700 border-red-200"
                        )}>
                            {challenge.difficulty}
                        </span>
                    </div>

                    <article className="prose prose-sm prose-slate max-w-none 
                        prose-headings:font-bold prose-headings:text-slate-800 
                        prose-p:text-slate-600 prose-strong:text-slate-900
                        prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-medium prose-code:before:content-none prose-code:after:content-none
                        prose-pre:bg-[#1e1e1e] prose-pre:text-gray-100 prose-pre:border prose-pre:border-gray-200 prose-pre:shadow-sm
                        [&_pre_code]:text-gray-100 [&_pre_code]:bg-transparent [&_pre_code]:p-0
                        mb-8
                    ">
                        <ReactMarkdown
                            remarkPlugins={[remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                        >
                            {challenge.description}
                        </ReactMarkdown>
                    </article>

                    <div className="mt-8 space-y-3 mb-8">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <Lightbulb size={16} className="text-yellow-500" /> Bantuan
                            </h3>
                            <span className="text-xs text-slate-400">
                                {unlockedHints.length}/{challenge.hints?.length || 0} Terbuka
                            </span>
                        </div>

                        {challenge.hints && challenge.hints.length > 0 ? (
                            <div className="space-y-2">
                                {challenge.hints.map((hint, idx) => {
                                    const isOpen = unlockedHints.includes(idx);
                                    return (
                                        <div key={idx} className={cn(
                                            "border rounded-xl overflow-hidden transition-all duration-300",
                                            isOpen ? "bg-yellow-50 border-yellow-200" : "bg-slate-50 border-slate-100"
                                        )}>
                                            {isOpen ? (
                                                <div className="p-3 text-sm text-slate-700 animate-in fade-in slide-in-from-top-1">
                                                    <span className="font-bold text-yellow-600 mr-2">Tip {idx+1}:</span>
                                                    {hint.text}
                                                </div>
                                            ) : (
                                                <button 
                                                    onClick={unlockHint}
                                                    disabled={idx !== unlockedHints.length} 
                                                    className="w-full p-3 flex items-center justify-center gap-2 text-xs font-bold text-slate-400 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    <Lock size={12} /> Buka Hint {idx + 1}
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-400 border border-slate-100 border-dashed">
                                Tidak ada bantuan untuk soal ini. Kamu pasti bisa!
                            </div>
                        )}
                    </div>

                    <div className="bg-surfaceHighlight/50 rounded-xl border border-gray-200 overflow-hidden mb-6">
                        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center gap-2">
                            <FileText size={14} className="text-text-muted"/>
                            <span className="text-xs font-bold text-text-muted uppercase">Kriteria Pengujian</span>
                        </div>
                        <div className="p-4 space-y-3">
                            {challenge.testCases.map((tc, idx) => (
                                <div key={idx} className="flex gap-3 text-xs text-text-muted">
                                   <div className="w-5 h-5 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 font-mono text-[10px]">
                                     {idx + 1}
                                   </div>
                                   <div className="pt-0.5">{tc.description}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className={cn(
                "flex-1 flex-col min-w-0 bg-[#1e1e1e] h-full",
                (activeTab === 'editor' || activeTab === 'console') ? "flex" : "hidden md:flex"
            )}>
                
                <div className={cn(
                    "relative",
                    activeTab === 'editor' ? "flex-1 block h-full" : "hidden md:flex-1 md:block"
                )}>
                    <CodeEditor 
                        code={code} 
                        onChange={(val) => setCode(val || '')} 
                        language={editorLanguage}
                    />
                </div>

                <div className={cn(
                    "border-t border-white/10 flex-col bg-[#1e1e1e]",
                    activeTab === 'console' ? "flex-1 flex h-full" : "hidden md:flex md:h-[35%] md:min-h-[150px]"
                )}>
                    {isWebChallenge ? (
                        <WebPreview code={code} />
                    ) : (
                        <>
                            <div className="px-4 py-2 border-b border-white/10 bg-[#252526] flex justify-between items-center select-none shrink-0">
                                <div className="flex items-center gap-2">
                                    <Terminal size={14} className="text-gray-400"/>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Console Output</span>
                                </div>
                            </div>
                            <div className="flex-1 p-4 overflow-y-auto font-mono text-sm space-y-1.5 custom-scrollbar text-gray-300">
                                {output.length === 0 && (
                                    <div className="h-full flex items-center justify-center text-gray-600 italic text-xs">
                                        Hasil eksekusi kode akan muncul di sini...
                                    </div>
                                )}
                                {output.map((log, i) => (
                                    <div key={i} className={cn(
                                        "flex items-start gap-2.5 pb-1 border-b border-white/5 last:border-0 animation-fade-in",
                                        log.type === 'error' ? "text-red-400" :
                                        log.type === 'success' ? "text-emerald-400" :
                                        log.type === 'fail' ? "text-orange-400" :
                                        log.type === 'warn' ? "text-yellow-400" :
                                        "text-gray-300"
                                    )}>
                                        <span className="mt-1 shrink-0 opacity-80">
                                            {log.type === 'success' && <CheckCircle size={14}/>}
                                            {log.type === 'fail' && <XCircle size={14}/>}
                                            {log.type === 'error' && <XCircle size={14}/>}
                                            {log.type === 'warn' && <span className="text-yellow-500">⚠️</span>}
                                            {log.type === 'log' && <span className="text-gray-500">›</span>}
                                        </span>
                                        <span className="break-all leading-relaxed whitespace-pre-wrap">{log.content}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
}