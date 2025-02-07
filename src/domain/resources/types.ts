export type ResourceType = "KNOWLEDGE" | "MONEY" | "SOCIAL" | "ENERGY" | "STRESS";

export interface Resource {
  type: ResourceType;
  value: number;
  maxValue: number;
}