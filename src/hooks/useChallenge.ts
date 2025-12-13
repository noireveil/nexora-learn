import { useState, useEffect, useRef, useCallback } from 'react';
import { getChallengeById, getNextChallengeId } from '@/services/courseService'; 
import { getCurrentUser, updateUserProgress, getUserProgress } from '@/services/userService';
import { Challenge, db } from '@/lib/db/schema';
import { predictNextDifficulty } from '@/ml/services/difficultyPredictor'; 
import { checkPlagiarism } from '@/ml/services/antiCheatService'; 
import { WorkerPayload, WorkerResponse, ConsoleLog } from '@/types/worker';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

export const useChallenge = (challengeId: string) => {
  const [code, setCodeState] = useState('');
  const [logs, setLogs] = useState<ConsoleLog[]>([]);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasSolvedBefore, setHasSolvedBefore] = useState(false); 
  const [nextChallengeId, setNextChallengeId] = useState<string | null>(null);
  const [aiRecommendation, setAiRecommendation] = useState<'Easy' | 'Medium' | 'Hard' | null>(null);
  const [unlockedHints, setUnlockedHints] = useState<number[]>([]);
  
  const isCheatDetected = useRef<boolean>(false);
  const workerRef = useRef<Worker | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const initWorker = useCallback(() => {
    if (workerRef.current) workerRef.current.terminate();
    workerRef.current = new Worker(new URL('@/workers/codeExecutor.worker.ts', import.meta.url));
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!challengeId) return;
      try {
        const data = await getChallengeById(challengeId);
        if (data) {
          setChallenge(data);
          let codeToDisplay = data.starterCode; 
          
          setIsCompleted(false); 
          setAiRecommendation(null);
          setUnlockedHints([]); 
          isCheatDetected.current = false; 
          
          const nextId = getNextChallengeId(challengeId);
          setNextChallengeId(nextId);

          const user = await getCurrentUser();
          if (user) {
            const progress = await getUserProgress(user.id!);
            const isSolved = progress?.completedChallenges.includes(challengeId);
            
            if (isSolved) {
                setHasSolvedBefore(true);
                setIsCompleted(true);

                const lastSuccess = await db.submissions
                    .where({ userId: user.id, challengeId: challengeId, status: 'PASSED' })
                    .last();
                
                if (lastSuccess && lastSuccess.code) {
                    codeToDisplay = lastSuccess.code;
                    
                    toast("📂 Mode Review: Memuat jawaban terakhirmu", { 
                        icon: '👀',
                        id: 'review-mode-toast'
                    });
                }
            }
          }
          setCodeState(codeToDisplay);
        }
      } catch (error) {
        toast.error("Gagal memuat soal");
      }
    };
    load();
  }, [challengeId]);

  useEffect(() => {
    initWorker();
    return () => { 
        if (workerRef.current) workerRef.current.terminate();
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [initWorker]);

  const handleCodeChange = (newCode: string) => {
      const diff = newCode.length - code.length;
      const ANOMALY_THRESHOLD = 20;

      if (diff > ANOMALY_THRESHOLD) {
          if (!isCheatDetected.current) {
              isCheatDetected.current = true;
              toast.error("⚠️ Terdeteksi Copy-Paste! Mohon ketik kode secara manual untuk melatih Muscle Memory.", {
                  duration: 5000,
                  icon: '🚫',
                  style: {
                      border: '1px solid #EF4444',
                      padding: '16px',
                      color: '#B91C1C',
                      background: '#FEF2F2'
                  },
              });
          }
      }
      setCodeState(newCode);
  };

  const runCode = useCallback(() => {
    if (isCheatDetected.current) {
        setLogs([{ 
            type: 'error', 
            content: '⛔ SUBMISSION BLOCKED\n\nSistem mendeteksi aktivitas Copy-Paste (Anomali Input). \n\nNexora didesain untuk melatih "Muscle Memory". Silakan Reset kode dan ketik ulang secara manual untuk melanjutkan.', 
            timestamp: Date.now() 
        }]);
        toast.error("Submission Ditolak: Anomali Terdeteksi");
        return; 
    }

    if (!challenge || !workerRef.current) return;

    setIsRunning(true);
    setLogs([]);
    if (!hasSolvedBefore) setIsCompleted(false);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    timeoutRef.current = setTimeout(() => {
        if (workerRef.current) {
            workerRef.current.terminate();
            setLogs(prev => [...prev, { 
                type: 'error', 
                content: '⏱️ Timeout: Kode berjalan terlalu lama (>5 detik). Kemungkinan "Infinite Loop".', 
                timestamp: Date.now() 
            }]);
            toast.error("Execution Timeout! Worker di-reset.");
            setIsRunning(false);
            initWorker();
        }
    }, 5000); 

    const isPython = challenge.id.startsWith('py-');
    const language = isPython ? 'python' : 'javascript';

    const payload: WorkerPayload = {
      code,
      language,
      testCases: challenge.testCases
    };

    workerRef.current.postMessage(payload);
    
    workerRef.current.onmessage = async (e: MessageEvent<WorkerResponse>) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      const { status, logs: newLogs, testResults, error, executionTime } = e.data;
      setLogs(newLogs);

      if (status === 'error') {
        setLogs(prev => [...prev, { type: 'error', content: `Error: ${error}`, timestamp: Date.now() }]);
        toast.error("Eksekusi Gagal");
      } else {
        const allPassed = testResults.length > 0 && testResults.every(r => r.passed);
        const user = await getCurrentUser();
        
        if (user && user.id) {
            const cheatResult = await checkPlagiarism(code, challenge.id, user.id);
            
            if (!cheatResult.isOriginal) {
                 toast.error("Submission Ditolak: Terindikasi Plagiarisme dari user lain.");
                 setLogs(prev => [...prev, { 
                    type: 'fail', 
                    content: `[SECURITY] ${cheatResult.detectedPatterns?.[0]}`, 
                    timestamp: Date.now() 
                }]);
                setIsRunning(false);
                return;
            }

            await db.submissions.add({
                userId: user.id,
                challengeId: challenge.id,
                code: code,
                status: allPassed ? 'PASSED' : 'FAILED',
                timestamp: new Date().toISOString(),
                executionTime: executionTime || 0,
                timeSpent: 0, 
                hintsUsed: unlockedHints.length 
            });

            if (allPassed) {
              if (!hasSolvedBefore) {
                  await updateUserProgress(user.id, challenge.id, challenge.xpReward);
                  toast.success(`Hebat! +${challenge.xpReward} XP`);
                  confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
                  setIsCompleted(true); 
                  setHasSolvedBefore(true); 
                  predictNextDifficulty(user.id).then(diff => setAiRecommendation(diff));
              } else {
                  toast.success("Solusi Valid! (Review Mode)");
                  setIsCompleted(true);
              }
            } else if (testResults.length > 0) {
              toast.error("Masih ada test case yang gagal.");
            }
        }
      }
      setIsRunning(false);
    };

    workerRef.current.onerror = (err) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      console.error("Worker Error:", err);
      setIsRunning(false);
      toast.error("Worker Error: Cek console browser");
    };
  }, [challenge, code, hasSolvedBefore, unlockedHints, initWorker]);

  const resetCode = () => {
    if (challenge) {
        setCodeState(challenge.starterCode);
        isCheatDetected.current = false;
        toast.success("Editor di-reset ke awal.");
    }
    setLogs([]);
    setIsCompleted(false); 
    setAiRecommendation(null);
  };

  const unlockHint = () => {
      if (!challenge?.hints) return;
      const nextIndex = unlockedHints.length;
      if (nextIndex < challenge.hints.length) {
          setUnlockedHints(prev => [...prev, nextIndex]);
      }
  };

  const closeModal = () => {
      setIsCompleted(false);
  };

  return {
    challenge,
    code,
    setCode: handleCodeChange,
    output: logs,
    isRunning,
    isCompleted,
    nextChallengeId,
    aiRecommendation,
    runCode,
    resetCode,
    unlockedHints, 
    unlockHint,
    closeModal
  };
};