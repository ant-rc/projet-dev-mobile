import type { FriendProfile } from '@/src/types/models';

export const FRIEND_PRESETS: FriendProfile[] = [
  {
    id: 'preset-marie',
    pseudo: 'Marie la foodie',
    avatarColor: '#ef4444',
    preferences: {
      likedTags: ['italian', 'sushi', 'japanese', 'fine dining', 'gastronomic'],
      dislikedTags: ['fast food'],
      preferredPriceLevels: [2, 3, 4],
      minRating: 4.0,
    },
  },
  {
    id: 'preset-tom',
    pseudo: 'Tom le radin',
    avatarColor: '#f97316',
    preferences: {
      likedTags: ['burger', 'pizza', 'tacos', 'mexican', 'fast food'],
      dislikedTags: ['fine dining', 'gastronomic'],
      preferredPriceLevels: [1, 2],
      minRating: 0,
    },
  },
  {
    id: 'preset-lola',
    pseudo: 'Lola la végé',
    avatarColor: '#22c55e',
    preferences: {
      likedTags: ['vegan', 'vegetarian', 'healthy'],
      dislikedTags: ['burger', 'fast food'],
      preferredPriceLevels: [1, 2, 3],
      minRating: 3.5,
    },
  },
  {
    id: 'preset-karim',
    pseudo: 'Karim curieux',
    avatarColor: '#3b82f6',
    preferences: {
      likedTags: ['indian', 'japanese', 'thai', 'vietnamese', 'curry', 'asian'],
      dislikedTags: [],
      preferredPriceLevels: [1, 2, 3],
      minRating: 3.5,
    },
  },
  {
    id: 'preset-sophie',
    pseudo: 'Sophie classe',
    avatarColor: '#8b5cf6',
    preferences: {
      likedTags: ['french', 'fine dining', 'gastronomic', 'bistro'],
      dislikedTags: ['fast food', 'tacos'],
      preferredPriceLevels: [3, 4],
      minRating: 4.5,
    },
  },
  {
    id: 'preset-hugo',
    pseudo: 'Hugo street',
    avatarColor: '#eab308',
    preferences: {
      likedTags: ['burger', 'tacos', 'fast food', 'mexican', 'asian'],
      dislikedTags: ['fine dining'],
      preferredPriceLevels: [1, 2],
      minRating: 3.0,
    },
  },
  {
    id: 'preset-emma',
    pseudo: 'Emma healthy',
    avatarColor: '#14b8a6',
    preferences: {
      likedTags: ['vegan', 'vegetarian', 'healthy', 'japanese', 'sushi'],
      dislikedTags: ['fast food', 'burger'],
      preferredPriceLevels: [2, 3],
      minRating: 4.0,
    },
  },
  {
    id: 'preset-lucas',
    pseudo: 'Lucas chill',
    avatarColor: '#06b6d4',
    preferences: {
      likedTags: ['bistro', 'french', 'italian', 'pizza', 'asian'],
      dislikedTags: [],
      preferredPriceLevels: [1, 2, 3],
      minRating: 3.5,
    },
  },
];

export function getFriendPresetById(id: string): FriendProfile | undefined {
  return FRIEND_PRESETS.find((preset) => preset.id === id);
}
