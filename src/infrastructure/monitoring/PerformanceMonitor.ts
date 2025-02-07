type PerformanceMetric = {
  timestamp: number;
  duration: number;
  type: string;
  details?: Record<string, any>;
};

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetric[] = [];
  private measurementStart: Record<string, number> = {};

  private constructor() {}

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startMeasurement(type: string): void {
    this.measurementStart[type] = performance.now();
  }

  endMeasurement(type: string, details?: Record<string, any>): void {
    const startTime = this.measurementStart[type];
    if (!startTime) {
      console.warn(`No start time found for measurement type: ${type}`);
      return;
    }

    const endTime = performance.now();
    const duration = endTime - startTime;

    this.metrics.push({
      timestamp: endTime,
      duration,
      type,
      details
    });

    delete this.measurementStart[type];

    // Log if duration exceeds thresholds
    if (duration > 100) {
      console.warn(`Performance warning: ${type} took ${duration.toFixed(2)}ms`);
    }
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  clearMetrics(): void {
    this.metrics = [];
  }

  getAverageMetric(type: string): number {
    const relevantMetrics = this.metrics.filter(m => m.type === type);
    if (relevantMetrics.length === 0) return 0;

    const sum = relevantMetrics.reduce((acc, curr) => acc + curr.duration, 0);
    return sum / relevantMetrics.length;
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();