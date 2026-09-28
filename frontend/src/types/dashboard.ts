/**
 * Tipos e interfaces para el Dashboard y simulación de carreras de caracoles.
 */

export interface SnailParticipant {
  id: string;
  name: string;
  victories: number;
  color: string;
  avatar: string;
}

export interface BetStatistics {
  won: number;
  lost: number;
  totalBets: number;
  winRate: number;
}

export interface DailyRaceSummary {
  totalRaces: number;
  completedRaces: number;
  snails: SnailParticipant[];
}
