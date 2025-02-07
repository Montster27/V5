import { EventBus } from "../../domain/shared/events";
import { Resource, ResourceType } from "../../domain/resources/types";
import { GameTime } from "../../domain/time/types";

export class ResourceManager {
  private resources: Map<ResourceType, Resource> = new Map();

  constructor(private eventBus: EventBus) {
    this.initializeResources();
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.eventBus.subscribe('HOURLY_UPDATE', () => this.processHourlyUpdate());
    this.eventBus.subscribe('DAILY_UPDATE', () => this.processDailyUpdate());
  }

  private initializeResources(): void {
    this.resources.set("KNOWLEDGE", { type: "KNOWLEDGE", value: 0, maxValue: 100000 });
    this.resources.set("MONEY", { type: "MONEY", value: 100, maxValue: 100000 });
    this.resources.set("SOCIAL", { type: "SOCIAL", value: 0, maxValue: 100000 });
    this.resources.set("ENERGY", { type: "ENERGY", value: 100, maxValue: 100 });
    this.resources.set("STRESS", { type: "STRESS", value: 0, maxValue: 100 });
  }

  private processHourlyUpdate(): void {
    // Base hourly changes
    this.updateResource("ENERGY", this.getResource("ENERGY")!.value - 2);
    this.updateResource("KNOWLEDGE", this.getResource("KNOWLEDGE")!.value + 5);
    this.updateResource("MONEY", this.getResource("MONEY")!.value + 1);
    
    // Stress affects all gains
    const stress = this.getResource("STRESS")!.value;
    if (stress > 50) {
      this.updateResource("ENERGY", this.getResource("ENERGY")!.value - 1);
    }
  }

  private processDailyUpdate(): void {
    // Daily recovery and expenses
    this.updateResource("ENERGY", 100); // Full energy at start of day
    this.updateResource("MONEY", this.getResource("MONEY")!.value - 10); // Daily expenses
    this.updateResource("STRESS", Math.max(0, this.getResource("STRESS")!.value - 10)); // Stress recovery
  }

  getState() {
    return Array.from(this.resources.values());
  }

  getResource(type: ResourceType): Resource | undefined {
    return this.resources.get(type);
  }

  updateResource(type: ResourceType, value: number): void {
    const resource = this.resources.get(type);
    if (resource) {
      resource.value = Math.max(0, Math.min(value, resource.maxValue));
      this.eventBus.emit('RESOURCE_UPDATED', { type, value: resource.value });
    }
  }
}