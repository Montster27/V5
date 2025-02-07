export type SkillType = "BODY" | "MIND" | "HEART" | "WORLD" | "MASTERY";

export interface Skill {
  type: SkillType;
  level: number;
  experience: number;
}