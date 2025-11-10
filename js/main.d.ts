export default app;
declare const app: MainApp;
declare class MainApp {
  performanceOptimizer: PerformanceOptimizer;
  animationManager: AnimationManager;
  navigationController: NavigationController;
  interactionHandler: InteractionHandler;
  initialized: boolean;
  init(): Promise<void>;
  setupErrorHandling(): void;
  handleInitializationError(error: any): void;
  handleGlobalError(error: any): void;
  handlePromiseRejection(reason: any): void;
  showErrorMessage(message: any): void;
  getPerformanceMode(): boolean;
  destroy(): void;
}
import { PerformanceOptimizer } from './modules/performance-optimizer.js';
import { AnimationManager } from './modules/animation-manager.js';
import { NavigationController } from './modules/navigation-controller.js';
import { InteractionHandler } from './modules/interaction-handler.js';
//# sourceMappingURL=main.d.ts.map
