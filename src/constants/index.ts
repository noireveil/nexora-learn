export const STATUS = {
  PASSED: 'PASSED',
  FAILED: 'FAILED',
  LOCKED: 'LOCKED',
  OPEN: 'OPEN',
  COMPLETED: 'COMPLETED'
} as const;

export const STORAGE_KEYS = {
  LAST_LOGIN: 'lastLogin',
  USER_ID: 'userId'
};

export const ROUTES = {
  DASHBOARD: '/dashboard',
  LEARN: '/learn',
  LOGIN: '/'
};