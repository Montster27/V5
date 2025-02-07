import { EventBus } from "../EventBus";
import { Skill, SkillType } from "../../domain/skills/types";

export class SkillManager {
  private skills: Map<SkillType, Skill> = new Map();

  constructor(private eventBus: EventBus) {
    this.initializeSkills();
  }

  private initializeSkills(): void {
    // Initialize with base skills
    const baseSkills: SkillType[] = ["BODY", "MIND", "HEART", "WORLD", "MASTERY"];
    baseSkills.forEach(type => {
      this.skills.set(type, {
        type,
        level: 1,
        experience: 0
      });
    });
  }

  getState() {
    return Array.from(this.skills.values());
  }

  getSkill(type: SkillType): Skill | undefined {
    return this.skills.get(type);
  }
}