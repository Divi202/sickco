// lib/log.ts
// This file will be replace with actual logging library or tool like pino, winston or sentry.
// For now we have created custom log utility for convience.

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const colors: Record<LogLevel, string> = {
  debug: '\x1b[36m', // cyan
  info: '\x1b[32m', // green
  warn: '\x1b[33m', // yellow
  error: '\x1b[31m', // red
};
const reset = '\x1b[0m';

function formatMessage(level: LogLevel, message: any, meta?: any) {
  const timestamp = new Date().toISOString();
  const base = `[${timestamp}] [${level.toUpperCase()}]`;

  if (process.env.NODE_ENV !== 'production') {
    // Add color in dev
    const color = colors[level];
    return `${color}${base}${reset} ${message}${meta ? ' ' + JSON.stringify(meta) : ''}`;
  }

  // No color in production (clean logs)
  return `${base} ${message}${meta ? ' ' + JSON.stringify(meta) : ''}`;
}

export const log = {
  debug: (message: any, meta?: any) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(formatMessage('debug', message, meta));
    }
  },
  info: (message: any, meta?: any) => {
    console.info(formatMessage('info', message, meta));
  },
  warn: (message: any, meta?: any) => {
    console.warn(formatMessage('warn', message, meta));
  },
  error: (message: any, meta?: any) => {
    console.error(formatMessage('error', message, meta));
  },
};
