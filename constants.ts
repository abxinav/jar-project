import { HabitCategory, UserProfile } from './types';

export const HABITS = [
  { id: HabitCategory.RUNNING, label: 'Running', icon: '🏃' },
  { id: HabitCategory.READING, label: 'Reading', icon: '📚' },
  { id: HabitCategory.MEDITATION, label: 'Meditation', icon: '🧘' },
  { id: HabitCategory.HIKING, label: 'Hiking', icon: '🥾' },
  { id: HabitCategory.WRITING, label: 'Writing', icon: '✍️' },
  { id: HabitCategory.LIFTING, label: 'Lifting', icon: '🏋️' },
];

export const MOCK_USERS: UserProfile[] = [
  {
    id: 'u1',
    name: 'Elena',
    age: 28,
    photoUrl: 'https://picsum.photos/id/338/800/1200',
    habit: HabitCategory.RUNNING,
    bio: 'Training for my first marathon. Need someone to ensure I don’t skip the long Sunday runs.',
    schedule: [false, true, false, true, false, true, true], // T, Th, Sat, Sun
    streak: 42,
    ghostScore: 98,
    location: 'Central Park',
    integrations: [
      { id: 'strava', name: 'Strava', icon: '👟', connected: true, dataPreview: '187 km this week · 5:20 /km' },
      { id: 'alltrails', name: 'AllTrails', icon: '🌲', connected: false, dataPreview: '' }
    ]
  },
  {
    id: 'u2',
    name: 'Marcus',
    age: 31,
    photoUrl: 'https://picsum.photos/id/91/800/1200',
    habit: HabitCategory.READING,
    bio: 'Architecture student. Trying to finish one biography a week. Let’s discuss over Sunday coffee.',
    schedule: [true, true, true, true, true, false, false], // Weekdays
    streak: 12,
    ghostScore: 87,
    location: 'Cafe Grumpy',
    integrations: [
      { id: 'goodreads', name: 'Goodreads', icon: '📖', connected: true, dataPreview: 'Reading "Atomic Habits" · 28 pages/day' }
    ]
  },
  {
    id: 'u3',
    name: 'Sarah',
    age: 26,
    photoUrl: 'https://picsum.photos/id/64/800/1200',
    habit: HabitCategory.HIKING,
    bio: 'Badger Pass regular. I hike rain or shine. Looking for an early riser.',
    schedule: [false, false, false, false, false, true, true], // Weekends
    streak: 8,
    ghostScore: 94,
    location: 'Yosemite Valley',
    integrations: [
      { id: 'alltrails', name: 'AllTrails', icon: '🌲', connected: true, dataPreview: '12 hikes this month · 4,200ft gain' },
      { id: 'strava', name: 'Strava', icon: '👟', connected: true, dataPreview: 'Active recovery walks' }
    ]
  },
  {
    id: 'u4',
    name: 'David',
    age: 34,
    photoUrl: 'https://picsum.photos/id/177/800/1200',
    habit: HabitCategory.WRITING,
    bio: 'Drafting a sci-fi novel. 500 words daily minimum. Silence is golden.',
    schedule: [true, true, true, true, true, true, true], // Everyday
    streak: 156,
    ghostScore: 99,
    location: 'Home Office',
    integrations: [
      { id: 'storygraph', name: 'StoryGraph', icon: '📊', connected: true, dataPreview: 'On track for 2024 reading goal' }
    ]
  }
];

export const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
