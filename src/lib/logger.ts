
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: string;
  userAgent?: string;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;
  private logs: LogEntry[] = [];

  private createLogEntry(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    };
  }

  private shouldLog(level: LogLevel): boolean {
    if (this.isDevelopment) return true;
    
    // En production, on ne log que warn et error
    return level === 'warn' || level === 'error';
  }

  debug(message: string, data?: any) {
    if (this.shouldLog('debug')) {
      const entry = this.createLogEntry('debug', message, data);
      this.logs.push(entry);
      console.debug(`[DEBUG] ${message}`, data);
    }
  }

  info(message: string, data?: any) {
    if (this.shouldLog('info')) {
      const entry = this.createLogEntry('info', message, data);
      this.logs.push(entry);
      console.info(`[INFO] ${message}`, data);
    }
  }

  warn(message: string, data?: any) {
    if (this.shouldLog('warn')) {
      const entry = this.createLogEntry('warn', message, data);
      this.logs.push(entry);
      console.warn(`[WARN] ${message}`, data);
    }
  }

  error(message: string, error?: any) {
    const entry = this.createLogEntry('error', message, error);
    this.logs.push(entry);
    console.error(`[ERROR] ${message}`, error);
    
    // En production, on pourrait envoyer les erreurs à un service externe
    if (!this.isDevelopment) {
      this.sendToErrorService(entry);
    }
  }

  private sendToErrorService(entry: LogEntry) {
    // TODO: Intégrer avec Sentry ou un autre service de monitoring
    // Pour l'instant, on stocke juste localement
    try {
      const errors = JSON.parse(localStorage.getItem('app_errors') || '[]');
      errors.push(entry);
      // Garder seulement les 50 dernières erreurs
      if (errors.length > 50) {
        errors.splice(0, errors.length - 50);
      }
      localStorage.setItem('app_errors', JSON.stringify(errors));
    } catch (e) {
      console.error('Failed to store error:', e);
    }
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logger = new Logger();
