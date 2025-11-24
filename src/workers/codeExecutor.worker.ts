import { WorkerPayload, WorkerResponse, ConsoleLog, TestResult } from '@/types/worker';

// Create isolated function scope
const createSandboxedFunction = (code: string) => {
  return new Function('console', code);
};

self.onmessage = async (e: MessageEvent<WorkerPayload>) => {
  const { code, language, testCases } = e.data;
  const startTime = performance.now();
  
  const logs: ConsoleLog[] = [];
  let testResults: TestResult[] = [];
  let status: WorkerResponse['status'] = 'success';
  let error: string | undefined;

  // Console spy to capture user output
  const spyConsole = {
    log: (...args: any[]) => logs.push({ type: 'log', content: args.join(' '), timestamp: Date.now() }),
    error: (...args: any[]) => logs.push({ type: 'error', content: args.join(' '), timestamp: Date.now() }),
    warn: (...args: any[]) => logs.push({ type: 'warn', content: args.join(' '), timestamp: Date.now() }),
    info: (...args: any[]) => logs.push({ type: 'info', content: args.join(' '), timestamp: Date.now() }),
  };

  try {
    if (language === 'javascript') {
      // Execute user code
      const userFn = createSandboxedFunction(code);
      userFn(spyConsole);

      // Run test case validation
      if (testCases?.length > 0) {
        testResults = testCases.map((tc) => {
          // Basic string matching for MVP
          const isPassed = logs.some(log => log.content.includes(String(tc.expected)));
          return {
            description: tc.description,
            passed: isPassed,
            expected: tc.expected
          };
        });
      }
    } else {
      // Placeholder for Python runtime
      logs.push({ type: 'warn', content: 'Python runtime initializing...', timestamp: Date.now() });
    }
  } catch (err: any) {
    status = 'error';
    error = err instanceof Error ? err.message : String(err);
  }

  const response: WorkerResponse = {
    status,
    logs,
    testResults,
    error,
    executionTime: performance.now() - startTime
  };

  self.postMessage(response);
};