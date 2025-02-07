export class SkillService {
  private skills: Record<string, number> = {
    BODY: 1,
    MIND: 1,
    HEART: 1,
    WORLD: 1,
    MASTERY: 1
  };

  getSkillLevel(skillName: string): number {
    return this.skills[skillName] ?? 1;
  }

  increaseSkill(skillName: string, amount: number = 1): void {
    if (this.isValidSkill(skillName)) {
      this.skills[skillName] = Math.min(10, this.skills[skillName] + amount);
    }
  }

  private isValidSkill(skillName: string): boolean {
    return Object.keys(this.skills).includes(skillName);
  }
}