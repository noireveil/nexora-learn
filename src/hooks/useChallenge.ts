import { useState, useEffect, useRef, useCallback } from 'react';
import { getChallengeById } from '@/services/courseService';
import { getCurrentUser } from '@/services/userService';
import { Challenge } from '@/lib/db/schema';
import { predictNextDifficulty } from '@/ml/services/difficultyPredictor'; 
import { WorkerPayload, WorkerResponse, ConsoleLog } from '@/types/worker';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

export const useChallenge = (challengeId: string) => {
  const [code, setCode] = useState('// Loading...');
  const [logs, setLogs] = useState<ConsoleLog[]>([]);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  
  const workerRef = useRef<Worker | null>(null);

  // Initialize Challenge Data
  useEffect(() => {
    const load = async () => {
      if (!challengeId) return;
      try {
        const data = await getChallengeById(challengeId);
        if (data) {
          setChallenge(data);
          setCode(data.starterCode);
        }
      } catch (error) {
        toast.error("Failed to load challenge");
      }
    };
    load();
  }, [challengeId]);

  // Manage Worker Lifecycle
  useEffect(() => {
    workerRef.current = new Worker(new URL('@/workers/codeExecutor.worker.ts', import.meta.url));
    
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const runCode = useCallback(() => {
    if (!challenge || !workerRef.current) return;

    setIsRunning(true);
    setLogs([]);

    const payload: WorkerPayload = {
      code,
      language: 'javascript',
      testCases: challenge.testCases
    };

    workerRef.current.postMessage(payload);
    workerRef.current.onmessage = async (e: MessageEvent<WorkerResponse>) => {
      const { status, logs: newLogs, testResults, error } = e.data;
      
      setLogs(newLogs);

      if (status === 'error') {
        setLogs(prev => [...prev, { type: 'error', content: `Runtime Error: ${error}`, timestamp: Date.now() }]);
        toast.error("Execution Failed");
      } else {
        const allPassed = testResults.length > 0 && testResults.every(r => r.passed);
        
        if (allPassed) {
          toast.success(`Challenge Solved! +${challenge.xpReward} XP`);
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
          try {
            const user = await getCurrentUser();
            if (user && user.id) {
                const nextDifficulty = await predictNextDifficulty(user.id);
                console.log(`🤖 AI Recommendation for next challenge: ${nextDifficulty}`);
            }
          } catch (err) {
            console.error("AI Prediction failed:", err);
          }

        } else if (testResults.length > 0) {
          toast.error("Some test cases failed");
        }
      }

      setIsRunning(false);
    };

    workerRef.current.onerror = (err) => {
      console.error("Worker Error:", err);
      setIsRunning(false);
      toast.error("System Error: Worker crashed");
    };
  }, [challenge, code]);

  const resetCode = () => {
    if (challenge) setCode(challenge.starterCode);
    setLogs([]);
  };

  return {
    challenge,
    code,
    setCode,
    output: logs,
    isRunning,
    runCode,
    resetCode
  };
};