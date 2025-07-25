import { RequestHandler } from "express";
import { 
  SlotSpinRequest, 
  SlotSpinResponse, 
  SlotResult, 
  SlotStats,
  SLOT_SYMBOLS, 
  SLOT_PAYLINES,
  WinLine,
  RecentSlotWinner
} from "@shared/api";

// In-memory storage (use database in production)
let gameStats: SlotStats = {
  totalSpins: 0,
  totalWins: 0,
  biggestWin: 0,
  jackpotPool: 50000,
  recentWinners: []
};

// User balances (use database in production)
const userBalances = new Map<string, number>();

// Get user balance (default 1000 points for demo)
function getUserBalance(userId: string): number {
  if (!userBalances.has(userId)) {
    userBalances.set(userId, 1000);
  }
  return userBalances.get(userId)!;
}

// Update user balance
function updateUserBalance(userId: string, amount: number): void {
  const currentBalance = getUserBalance(userId);
  userBalances.set(userId, currentBalance + amount);
}

// Weighted random selection based on rarity
function getRandomSymbol(): string {
  const totalWeight = SLOT_SYMBOLS.reduce((sum, symbol) => sum + symbol.rarity, 0);
  let random = Math.random() * totalWeight;
  
  for (const symbol of SLOT_SYMBOLS) {
    random -= symbol.rarity;
    if (random <= 0) {
      return symbol.id;
    }
  }
  
  return SLOT_SYMBOLS[0].id; // Fallback
}

// Generate 3x3 slot grid
function generateSlotGrid(): string[][] {
  const grid: string[][] = [];
  for (let row = 0; row < 3; row++) {
    grid[row] = [];
    for (let col = 0; col < 3; col++) {
      grid[row][col] = getRandomSymbol();
    }
  }
  return grid;
}

// Check for winning lines
function checkWinLines(reels: string[][], bet: number): { winLines: WinLine[], totalWin: number } {
  const winLines: WinLine[] = [];
  let totalWin = 0;
  
  // Flatten the grid for easier payline checking
  const flatGrid = reels.flat();
  
  SLOT_PAYLINES.forEach((payline, lineIndex) => {
    const lineSymbols = payline.map(pos => flatGrid[pos]);
    const firstSymbol = lineSymbols[0];
    
    // Check for matching symbols
    let matchCount = 1;
    for (let i = 1; i < lineSymbols.length; i++) {
      if (lineSymbols[i] === firstSymbol) {
        matchCount++;
      } else {
        break;
      }
    }
    
    // Minimum 3 matches required for a win
    if (matchCount >= 3) {
      const symbol = SLOT_SYMBOLS.find(s => s.id === firstSymbol);
      if (symbol) {
        const winMultiplier = symbol.multiplier * matchCount;
        const winAmount = bet * winMultiplier;
        
        winLines.push({
          line: lineIndex,
          symbols: lineSymbols.slice(0, matchCount),
          count: matchCount,
          multiplier: winMultiplier,
          win: winAmount
        });
        
        totalWin += winAmount;
      }
    }
  });
  
  return { winLines, totalWin };
}

// Check for jackpot (all crown symbols)
function checkJackpot(reels: string[][]): boolean {
  const flatGrid = reels.flat();
  return flatGrid.every(symbol => symbol === 'crown');
}

// Add recent winner
function addRecentWinner(username: string, amount: number, isJackpot: boolean): void {
  const winner: RecentSlotWinner = {
    username,
    amount,
    timestamp: Date.now(),
    isJackpot
  };
  
  gameStats.recentWinners.unshift(winner);
  
  // Keep only last 10 winners
  if (gameStats.recentWinners.length > 10) {
    gameStats.recentWinners = gameStats.recentWinners.slice(0, 10);
  }
}

// Spin slots handler
export const handleSlotSpin: RequestHandler = (req, res) => {
  try {
    const { bet, userId = 'demo-user' }: SlotSpinRequest = req.body;
    
    // Validate bet amount
    if (!bet || bet < 1 || bet > 100) {
      return res.status(400).json({
        success: false,
        error: 'Invalid bet amount. Must be between 1 and 100 points.',
        gameId: '',
        timestamp: Date.now()
      } as SlotSpinResponse);
    }
    
    // Check user balance
    const userBalance = getUserBalance(userId);
    if (userBalance < bet) {
      return res.status(400).json({
        success: false,
        error: 'Insufficient balance.',
        balance: userBalance,
        gameId: '',
        timestamp: Date.now()
      } as SlotSpinResponse);
    }
    
    // Deduct bet from balance
    updateUserBalance(userId, -bet);
    
    // Generate slot result
    const reels = generateSlotGrid();
    const { winLines, totalWin } = checkWinLines(reels, bet);
    const isJackpot = checkJackpot(reels);
    
    // Calculate final win amount
    let finalWin = totalWin;
    if (isJackpot) {
      finalWin += gameStats.jackpotPool;
      gameStats.jackpotPool = 50000; // Reset jackpot
    }
    
    // Add winnings to balance
    if (finalWin > 0) {
      updateUserBalance(userId, finalWin);
      gameStats.totalWins++;
      
      if (finalWin > gameStats.biggestWin) {
        gameStats.biggestWin = finalWin;
      }
      
      // Add to recent winners if significant win
      if (finalWin >= bet * 5 || isJackpot) {
        addRecentWinner(`Player${userId.slice(-4)}`, finalWin, isJackpot);
      }
    }
    
    // Update stats
    gameStats.totalSpins++;
    gameStats.jackpotPool += Math.floor(bet * 0.1); // 10% of each bet goes to jackpot
    
    const result: SlotResult = {
      reels,
      winLines,
      totalWin: finalWin,
      isJackpot,
      multiplier: finalWin > 0 ? Math.round(finalWin / bet) : 0
    };
    
    const response: SlotSpinResponse = {
      success: true,
      result,
      balance: getUserBalance(userId),
      gameId: `slot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    };
    
    res.json(response);
    
  } catch (error) {
    console.error('Slot spin error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      gameId: '',
      timestamp: Date.now()
    } as SlotSpinResponse);
  }
};

// Get slot stats handler
export const handleSlotStats: RequestHandler = (_req, res) => {
  res.json(gameStats);
};

// Get user balance handler
export const handleUserBalance: RequestHandler = (req, res) => {
  const userId = req.params.userId || 'demo-user';
  const balance = getUserBalance(userId);
  
  res.json({ 
    userId, 
    balance,
    timestamp: Date.now()
  });
};

// Reset user balance (demo purposes)
export const handleResetBalance: RequestHandler = (req, res) => {
  const userId = req.params.userId || 'demo-user';
  userBalances.set(userId, 1000);
  
  res.json({ 
    userId, 
    balance: 1000,
    message: 'Balance reset to 1000 points',
    timestamp: Date.now()
  });
};
