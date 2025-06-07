
import { logger } from './logger';

interface ErrorDetails {
  message: string;
  filename?: string;
  lineno?: number;
  colno?: number;
  error?: Error;
  url?: string;
  userAgent?: string;
  timestamp: string;
}

class GlobalErrorHandler {
  private initialized = false;

  init() {
    if (this.initialized) return;

    // Capturer les erreurs JavaScript non gérées
    window.addEventListener('error', this.handleError.bind(this));
    
    // Capturer les promesses rejetées non gérées
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this));

    this.initialized = true;
    logger.info('Global error handler initialized');
  }

  private handleError(event: ErrorEvent) {
    const errorDetails: ErrorDetails = {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    };

    logger.error('Uncaught JavaScript error', errorDetails);

    // En production, on peut décider de ne pas afficher l'erreur à l'utilisateur
    if (!import.meta.env.DEV) {
      event.preventDefault();
    }
  }

  private handleUnhandledRejection(event: PromiseRejectionEvent) {
    const errorDetails: ErrorDetails = {
      message: event.reason?.message || 'Unhandled promise rejection',
      error: event.reason,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    };

    logger.error('Unhandled promise rejection', errorDetails);

    // En production, on peut décider de ne pas afficher l'erreur à l'utilisateur
    if (!import.meta.env.DEV) {
      event.preventDefault();
    }
  }
}

export const globalErrorHandler = new GlobalErrorHandler();
