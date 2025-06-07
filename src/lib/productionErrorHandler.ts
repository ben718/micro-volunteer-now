
import { logger } from './logger';

class ProductionErrorHandler {
  private initialized = false;

  init() {
    if (this.initialized) return;

    // Capturer les erreurs de ressources manquantes
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        // Erreur de ressource (image, CSS, etc.)
        logger.error('Resource loading error', {
          source: event.target,
          filename: event.filename,
          message: event.message
        });
      }
    });

    // Capturer les erreurs de chunks manquants
    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason?.message?.includes('Loading chunk')) {
        logger.warn('Chunk loading failed, reloading page', event.reason);
        // En production, on peut recharger la page pour les erreurs de chunks
        if (!import.meta.env.DEV) {
          window.location.reload();
        }
      }
    });

    this.initialized = true;
    logger.info('Production error handler initialized');
  }
}

export const productionErrorHandler = new ProductionErrorHandler();
