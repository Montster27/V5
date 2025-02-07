export enum Major {
  COMPUTER_SCIENCE = 'Computer Science',
  BUSINESS = 'Business',
  ENGINEERING = 'Engineering',
  LIBERAL_ARTS = 'Liberal Arts',
  SCIENCE = 'Science'
}

export enum Skill {
  // Academic skills
  MATH = 'Mathematics',
  WRITING = 'Writing',
  RESEARCH = 'Research',
  PROGRAMMING = 'Programming',
  STUDY_HABITS = 'Study Habits',

  // Social skills
  LEADERSHIP = 'Leadership',
  NETWORKING = 'Networking',
  PUBLIC_SPEAKING = 'Public Speaking',
  TEAMWORK = 'Teamwork',
  EMPATHY = 'Empathy',

  // Life skills
  TIME_MANAGEMENT = 'Time Management',
  STRESS_MANAGEMENT = 'Stress Management',
  FINANCIAL_MANAGEMENT = 'Financial Management',
  PROBLEM_SOLVING = 'Problem Solving',
  ADAPTABILITY = 'Adaptability'
}

export enum StatusEffect {
  // Positive effects
  WELL_RESTED = 'Well Rested',
  FOCUSED = 'Focused',
  MOTIVATED = 'Motivated',
  INSPIRED = 'Inspired',
  ENERGIZED = 'Energized',

  // Negative effects
  EXHAUSTED = 'Exhausted',
  STRESSED = 'Stressed',
  OVERWHELMED = 'Overwhelmed',
  DISTRACTED = 'Distracted',
  BURNED_OUT = 'Burned Out'
}

export interface CharacterAttributes {
  intelligence: number;
  charisma: number;
  resilience: number;
  creativity: number;
  discipline: number;
}

export interface SkillLevels {
  [key: string]: number;
}

export interface ActiveEffects {
  [key: string]: {
    type: StatusEffect;
    duration: number;  // in game hours
    magnitude: number; // effect strength
  };
}

export interface CharacterState {
  // Basic info
  name: string;
  major: Major;
  
  // Core attributes (1-100)
  attributes: CharacterAttributes;
  
  // Skills (0-100)
  skills: SkillLevels;
  
  // Status
  activeEffects: ActiveEffects;
  
  // Derived states
  isRested: boolean;
  isStressed: boolean;
  
  // Academic status
  gpa: number;
  creditsCompleted: number;
  currentCourses: string[];
}

export const INITIAL_CHARACTER_STATE: CharacterState = {
  name: '',
  major: Major.COMPUTER_SCIENCE,
  attributes: {
    intelligence: 50,
    charisma: 50,
    resilience: 50,
    creativity: 50,
    discipline: 50
  },
  skills: Object.values(Skill).reduce((acc, skill) => {
    acc[skill] = 0;
    return acc;
  }, {} as SkillLevels),
  activeEffects: {},
  isRested: true,
  isStressed: false,
  gpa: 0.0,
  creditsCompleted: 0,
  currentCourses: []
};