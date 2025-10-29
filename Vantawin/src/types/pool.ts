export interface Pool {
  id: string;
  name: string;
  status: 'ongoing' | 'upcoming' | 'ended';
  prizePool: number;
  entryFee: number;
  participants: number;
  maxParticipants?: number; // Optional for upcoming/ongoing
  startTime: string; // e.g., "2024-10-27T10:00:00Z"
  endTime: string; // e.g., "2024-10-27T18:00:00Z"
  description: string;
  image?: string; // Optional image for the pool
  tier: 'Bronze' | 'Silver' | 'Gold'; // New tier property
}