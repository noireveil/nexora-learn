// Contract definitions for Worker communication

export type ExecutionStatus = 'success' | 'error' | 'timeout';

export interface TestResult {
  description: string;
  passed: boolean;
  expected?: any;
  actual?: any;
}

export interface ConsoleLog {
  type: 'log' | 'error' | 'warn' | 'info';
  content: string;
  timestamp: number;
}

// Payload sent TO Worker
export interface WorkerPayload {
  code: string;
  language: 'javascript' | 'python';
  testCases: {
    input: any;
    expected: any;
    description: string;
  }[];
}

// Response FROM Worker
export interface WorkerResponse {
  status: ExecutionStatus;
  logs: ConsoleLog[];
  testResults: TestResult[];
  error?: string;
  executionTime: number;
}