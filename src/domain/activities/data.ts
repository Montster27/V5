import { Activity } from './types';

export const ACTIVITIES: Record<string, Activity> = {
  study: {
    id: 'study',
    name: 'Study',
    description: 'Hit the books to gain knowledge',
    duration: 3,
    costs: {
      energy: 10,
      stress: 5
    },
    rewards: {
      knowledge: 5
    },
    requirements: {
      energy: 20
    }
  },
  work: {
    id: 'work',
    name: 'Work',
    description: 'Work a shift to earn money',
    duration: 4,
    costs: {
      energy: 15,
      stress: 8
    },
    rewards: {
      money: 10
    },
    requirements: {
      energy: 25
    }
  },
  socialize: {
    id: 'socialize',
    name: 'Socialize',
    description: 'Spend time with friends',
    duration: 2,
    costs: {
      energy: 5,
      money: 5
    },
    rewards: {
      social: 3,
      stress: -5
    },
    requirements: {
      energy: 10,
      money: 5
    }
  },
  rest: {
    id: 'rest',
    name: 'Rest',
    description: 'Take a break to recover energy',
    duration: 2,
    costs: {},
    rewards: {
      energy: 20,
      stress: -10
    }
  },
  exercise: {
    id: 'exercise',
    name: 'Exercise',
    description: 'Work out to stay healthy',
    duration: 1,
    costs: {
      energy: 10
    },
    rewards: {
      energy: 5,
      stress: -5
    },
    requirements: {
      energy: 15
    }
  }
};