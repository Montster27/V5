export class ResourceService {
  private resources: Record<string, number> = {
    money: 1000,
    social: 50,
    knowledge: 30,
    energy: 100,
    stress: 0
  };

  getResource(name: string): number {
    return this.resources[name] ?? 0;
  }

  setResource(name: string, value: number): void {
    if (this.isValidResource(name)) {
      this.resources[name] = this.clampValue(name, value);
    }
  }

  updateResource(name: string, delta: number): void {
    if (this.isValidResource(name)) {
      const currentValue = this.getResource(name);
      this.setResource(name, currentValue + delta);
    }
  }

  private isValidResource(name: string): boolean {
    return Object.keys(this.resources).includes(name);
  }

  private clampValue(name: string, value: number): number {
    switch (name) {
      case 'energy':
      case 'social':
      case 'stress':
        return Math.max(0, Math.min(100, value));
      case 'money':
        return Math.max(0, value);
      case 'knowledge':
        return Math.max(0, Math.min(1000, value));
      default:
        return value;
    }
  }
}