export interface PoolPrize {
  rank: string;
  amount: number;
}

export interface Pool {
  id: string;
  name: string; // DB: name
  description?: string; // DB: description
  status: 'ongoing' | 'upcoming' | 'ended';
  prizePool: number; // DB: total_pot
  entryFee: number;
  participants: number; // Count from pool_participants
  maxParticipants?: number; // DB: max_participants
  startTime: string; // ISO
  endTime: string; // ISO
  image?: string; // DB: image_url
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  rules?: string;
  prizeDistribution?: PoolPrize[];
}