export interface MenuItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  createdAt: number;
}

export interface MenuItemInput {
  name: string;
  price: number;
  image?: string;
}

export type AppPhase = 'SETUP' | 'VOTING';

export interface VotingSessionState {
  phase: AppPhase;
  items: MenuItem[];
  votes: Record<string, number>;
  userVotedId: string | null;
}