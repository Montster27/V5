export interface EventOption {
  id: string;
  text: string;
  consequences?: {
    resources?: Partial<ResourceModifiers>;
    // Add other consequence types as needed
  };
}

export interface EventDisplayProps {
  id: string;
  title: string;
  description: string;
  options: EventOption[];
}

export interface ResourceModifiers {
  money?: number;
  knowledge?: number;
  socialPoints?: number;
  energy?: number;
  stress?: number;
}