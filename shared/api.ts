/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Slots Game Types
 */
export interface SlotSymbol {
  id: string;
  name: string;
  emoji: string;
  multiplier: number;
  rarity: number; // 1-100, lower = rarer
}

export interface SlotReel {
  symbols: string[]; // Array of symbol IDs
}

export interface SlotResult {
  reels: string[][]; // 3x3 grid of symbol IDs
  winLines: WinLine[];
  totalWin: number;
  isJackpot: boolean;
  multiplier: number;
}

export interface WinLine {
  line: number;
  symbols: string[];
  count: number;
  multiplier: number;
  win: number;
}

export interface SlotSpinRequest {
  bet: number; // Points bet
  userId?: string;
}

export interface SlotSpinResponse {
  success: boolean;
  result?: SlotResult;
  balance?: number;
  error?: string;
  gameId: string;
  timestamp: number;
}

export interface SlotStats {
  totalSpins: number;
  totalWins: number;
  biggestWin: number;
  jackpotPool: number;
  recentWinners: RecentSlotWinner[];
}

export interface RecentSlotWinner {
  username: string;
  amount: number;
  timestamp: number;
  isJackpot: boolean;
}

/**
 * Slot game configuration
 */
export const SLOT_SYMBOLS: SlotSymbol[] = [
  { id: 'cherry', name: 'Cherry', emoji: '🍒', multiplier: 2, rarity: 30 },
  { id: 'lemon', name: 'Lemon', emoji: '🍋', multiplier: 3, rarity: 25 },
  { id: 'orange', name: 'Orange', emoji: '🍊', multiplier: 4, rarity: 20 },
  { id: 'plum', name: 'Plum', emoji: '🟣', multiplier: 5, rarity: 15 },
  { id: 'bell', name: 'Bell', emoji: '🔔', multiplier: 8, rarity: 8 },
  { id: 'diamond', name: 'Diamond', emoji: '💎', multiplier: 15, rarity: 5 },
  { id: 'seven', name: 'Lucky Seven', emoji: '7️⃣', multiplier: 25, rarity: 3 },
  { id: 'crown', name: 'Crown', emoji: '👑', multiplier: 50, rarity: 1 }
];

export const SLOT_PAYLINES = [
  [0, 1, 2], // Top row
  [3, 4, 5], // Middle row
  [6, 7, 8], // Bottom row
  [0, 4, 8], // Diagonal top-left to bottom-right
  [2, 4, 6], // Diagonal top-right to bottom-left
  [0, 3, 6], // Left column
  [1, 4, 7], // Middle column
  [2, 5, 8], // Right column
  [1, 3, 5], // V shape
];

/**
 * Pragmatic Play Slots Types
 */
export interface PragmaticSlot {
  id: string;
  name: string;
  thumbnail: string;
  category: string;
  provider: string;
  rtp: number;
  volatility: 'Low' | 'Medium' | 'High';
  maxWin: string;
  features: string[];
  isNew: boolean;
  isPopular: boolean;
  releaseDate: string;
}

export interface GameHistory {
  id: string;
  gameId: string;
  gameName: string;
  gameType: 'GC' | 'SC';
  amount: number;
  result: 'win' | 'loss';
  winAmount?: number;
  timestamp: number;
  sessionId: string;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  gcBalance: number; // Gold Coins
  scBalance: number; // Sweeps Coins
  totalWins: number;
  totalPlayed: number;
  level: number;
  joinDate: number;
  lastLogin: number;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalGamesPlayed: number;
  totalGCWagered: number;
  totalSCWagered: number;
  totalPayouts: number;
  revenueToday: number;
  revenueMonth: number;
}

export interface PragmaticSlotsResponse {
  slots: PragmaticSlot[];
  total: number;
  categories: string[];
}
