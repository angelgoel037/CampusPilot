/**
 * CampusPilot — Core Domain Constants
 * Eight canonical campus-life streams used by the final prototype.
 */

export const CAMPUS_CATEGORIES = [
  'technical',
  'cultural',
  'sports',
  'social',
  'career',
  'wellness',
  'learning_research',
  'important_campus',
] as const;

export const LEGACY_CAMPUS_CATEGORIES = ['cultural_music', 'academic_important'] as const;

export type CampusCategory = (typeof CAMPUS_CATEGORIES | typeof LEGACY_CAMPUS_CATEGORIES)[number];

export const CATEGORY_LABELS: Record<CampusCategory, { label: string; icon: string; description: string }> = {
  technical: {
    label: 'Technical',
    icon: '💻',
    description: 'Hackathons, coding, AI/ML, robotics, tech workshops',
  },
  cultural: {
    label: 'Cultural',
    icon: '🎭',
    description: 'Music, dance, drama, art, fashion, literary fests',
  },
  sports: {
    label: 'Sports',
    icon: '🏆',
    description: 'Cricket, football, basketball, athletics, esports',
  },
  social: {
    label: 'Social & Campus Life',
    icon: '🎉',
    description: 'Freshers, farewell, fests, parties, social meetups',
  },
  career: {
    label: 'Career',
    icon: '💼',
    description: 'Placements, internships, resume workshops, company talks',
  },
  wellness: {
    label: 'Wellness',
    icon: '🧠',
    description: 'Psychology, mental wellbeing, stress management, health camps',
  },
  learning_research: {
    label: 'Learning & Research',
    icon: '🔬',
    description: 'Guest lectures, seminars, research talks, academic workshops',
  },
  important_campus: {
    label: 'Important Campus',
    icon: '📢',
    description: 'MST/exam notices, result declarations, university circulars',
  },

  cultural_music: {
    label: 'Cultural & Music',
    icon: '🎵',
    description: 'Legacy cultural and music category',
  },

  academic_important: {
    label: 'Academic & Notices',
    icon: '📢',
    description: 'Legacy academic and important notices category',
  },
};

export const LEGACY_CATEGORY_LABELS: Record<(typeof LEGACY_CAMPUS_CATEGORIES)[number], { label: string; icon: string; description: string }> = {
  cultural_music: { label: 'Cultural & Music (legacy)', icon: '🎵', description: 'Legacy category kept for earlier test data.' },
  academic_important: { label: 'Academic & Notices (legacy)', icon: '📢', description: 'Legacy category kept for earlier test data.' },
};

export const IMPORTANCE_LEVELS = ['normal', 'high', 'critical'] as const;
export type ImportanceLevel = (typeof IMPORTANCE_LEVELS)[number];

export const ITEM_STATUSES = ['draft', 'published', 'cancelled', 'archived'] as const;
export type ItemStatus = (typeof ITEM_STATUSES)[number];

export const AUDIENCE_TYPES = ['all_students', 'specific_group', 'specific_department'] as const;
export type AudienceType = (typeof AUDIENCE_TYPES)[number];

export const SOURCE_TYPES = ['publisher_manual', 'poster_extraction', 'future_integration'] as const;
export type SourceType = (typeof SOURCE_TYPES)[number];

/** Explainable heuristic weights used by the recommendation prototype. */
export const RECOMMENDATION_WEIGHTS = {
  INTEREST_MATCH: 0.40,
  TIME_RELEVANCE: 0.25,
  URGENCY: 0.15,
  POPULARITY: 0.10,
  DISCOVERY: 0.10,
} as const;
