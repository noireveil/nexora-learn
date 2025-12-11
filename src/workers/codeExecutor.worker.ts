/// <reference lib="webworker" />
import { WorkerPayload, WorkerResponse, ConsoleLog, TestResult } from '@/types/worker';

importScripts("https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js");

declare const loadPyodide: any;

let pyodide: any = null;

const initPyodide = async () => {
  if (!pyodide) {
    try {
        pyodide = await loadPyodide();
        await pyodide.runPythonAsync(`
          import sys
          from io import StringIO
          sys.stdout = StringIO()
        `);
    } catch (e) {
        throw new Error("Gagal memuat Python Engine. Cek koneksi internet atau gunakan fitur Download Offline.");
    }
  }
  return pyodide;
};

const safeSerialize = (val: any): any => {
    if (typeof val === 'function') return `[Function: ${val.name || 'anonymous'}]`;
    if (typeof val === 'undefined') return 'undefined';
    if (typeof val === 'symbol') return String(val);
    if (Number.isNaN(val)) return 'NaN';
    return val;
};

const checkEquality = (actual: any, expected: any): boolean => {
    if (typeof actual === 'function') return false;

    const strActual = String(actual).trim();
    const strExpected = String(expected).trim();

    if (strActual === strExpected) return true;

    const numActual = Number(strActual);
    const numExpected = Number(strExpected);
    
    if (!isNaN(numActual) && !isNaN(numExpected)) {
        return Math.abs(numActual - numExpected) < 0.05; 
    }

    try {
        return JSON.stringify(actual) === JSON.stringify(expected);
    } catch (e) {
        return false;
    }
};

self.onmessage = async (e: MessageEvent<WorkerPayload>) => {
  const { code, language, testCases } = e.data;
  const startTime = performance.now();
  
  const logs: ConsoleLog[] = [];
  let testResults: TestResult[] = [];
  let status: WorkerResponse['status'] = 'success';
  let error: string | undefined;

  const spyConsole = {
    log: (...args: any[]) => logs.push({ type: 'log', content: args.map(a => String(a)).join(' '), timestamp: Date.now() }),
    error: (...args: any[]) => logs.push({ type: 'error', content: args.map(a => String(a)).join(' '), timestamp: Date.now() }),
    warn: (...args: any[]) => logs.push({ type: 'warn', content: args.map(a => String(a)).join(' '), timestamp: Date.now() }),
    info: (...args: any[]) => logs.push({ type: 'info', content: args.map(a => String(a)).join(' '), timestamp: Date.now() }),
  };

  try {
    if (language === 'javascript') {
      const wrapperCode = `
        ${code}
        if (typeof solution !== 'undefined' && typeof solution === 'function') {
            return solution;
        }
        return undefined;
      `;
      
      let userFn: Function | undefined;
      try {
          userFn = new Function('console', wrapperCode)(spyConsole);
      } catch (err: any) {
          throw new Error(`Syntax Error: ${err.message}`);
      }

      if (testCases?.length > 0) {
        testResults = testCases.map((tc) => {
            let passed = false;
            let actualValue: any = null;

            try {
                const inputArgs = Array.isArray(tc.input) ? tc.input : [tc.input];
                
                if (userFn) {
                    if (inputArgs.length > 1 && userFn.length === 1) {
                        let currentFn: any = userFn;
                        for (const arg of inputArgs) {
                            if (typeof currentFn === 'function') {
                                currentFn = currentFn(arg);
                            }
                        }
                        actualValue = currentFn;
                    } else {
                        actualValue = userFn(...inputArgs);
                    }
                } else {
                    const lastLog = logs[logs.length - 1];
                    if (lastLog) actualValue = lastLog.content;
                }

                passed = checkEquality(actualValue, tc.expected);

            } catch (err: any) {
                error = err.message;
                passed = false;
            }

            return { 
                description: tc.description, 
                passed, 
                expected: safeSerialize(tc.expected), 
                actual: safeSerialize(actualValue)    
            };
        });
      }

    } 
    else if (language === 'python') {
      const py = await initPyodide();
      await py.runPythonAsync('sys.stdout.truncate(0)\nsys.stdout.seek(0)');
      
      try {
          await py.runPythonAsync(code);
          
          const stdout = await py.runPythonAsync('sys.stdout.getvalue()');
          if (stdout) {
             stdout.split('\n').forEach((l: string) => {
                if (l) logs.push({ type: 'log', content: l, timestamp: Date.now() });
             });
          }

          if (testCases?.length > 0) {
             const hasSolution = await py.runPythonAsync(`'solution' in globals()`);
             
             if (!hasSolution) {
                 const outputStr = logs.map(l => l.content).join('\n').trim();
                 const passed = checkEquality(outputStr, testCases[0].expected);
                 
                 testResults.push({
                     description: "Output Check",
                     passed,
                     expected: safeSerialize(testCases[0].expected),
                     actual: safeSerialize(outputStr)
                 });
             } else {
                 for (const tc of testCases) {
                     let argsStr = "";
                     if (Array.isArray(tc.input)) {
                         argsStr = tc.input.map(arg => {
                             if (typeof arg === 'string') return `"${arg}"`;
                             return JSON.stringify(arg);
                         }).join(", ");
                     } else {
                         argsStr = typeof tc.input === 'string' ? `"${tc.input}"` : String(tc.input);
                     }
                     
                     const pyRun = `solution(${argsStr})`;
                     const result = await py.runPythonAsync(pyRun);
                     
                     let jsResult = result;
                     if (result && result.toJs) {
                         jsResult = result.toJs();
                     }

                     const passed = checkEquality(jsResult, tc.expected);
                     
                     testResults.push({
                         description: tc.description,
                         passed,
                         expected: safeSerialize(tc.expected),
                         actual: safeSerialize(jsResult)
                     });
                 }
             }
          }

      } catch (pyError: any) {
          throw new Error(pyError.message);
      }
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