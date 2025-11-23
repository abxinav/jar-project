export enum AppView {
  ONBOARDING = 'ONBOARDING',
  FEED = 'FEED',
  MATCH = 'MATCH',
  PROFILE_DETAIL = 'PROFILE_DETAIL' // Sub-view usually, but helpful for state
}

export enum HabitCategory {
  RUNNING = 'Running',
  READING = 'Reading',
  MEDITATION = 'Meditation',
  CODING = 'Coding',
  HIKING = 'Hiking',
  WRITING = 'Writing',
  LIFTING = 'Lifting',
  YOGA = 'Yoga'
}

export interface Integration {
  id: string;
  name: string; // e.g. "Strava", "Goodreads"
  icon: string; // Emoji or icon name
  dataPreview: string; // "187 km this week"
  connected: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  photoUrl: string;
  habit: HabitCategory;
  bio: string; // "The Pitch"
  schedule: boolean[]; // 7 days, true = available
  streak: number; // Current personal streak
  ghostScore: number; // 0-100
  integrations: Integration[];
  location: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isVoice?: boolean;
}
