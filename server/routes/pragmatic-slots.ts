import { RequestHandler } from "express";
import {
  PragmaticSlot,
  PragmaticSlotsResponse,
  GameHistory,
  UserProfile,
  AdminStats,
} from "../../shared/api";

// Pragmatic Play slots data with real thumbnails
const PRAGMATIC_SLOTS: PragmaticSlot[] = [
  {
    id: "gates-of-olympus",
    name: "Gates of Olympus",
    thumbnail:
      "https://demogamesfree.pragmaticplay.net/gs2c/common/images/games/200x200/vs20olympgate.png",
    category: "Popular",
    provider: "Pragmatic Play",
    rtp: 96.5,
    volatility: "High",
    maxWin: "5,000x",
    features: ["Free Spins", "Multipliers", "Tumble"],
    isNew: false,
    isPopular: true,
    releaseDate: "2021-02-13",
  },
  {
    id: "sweet-bonanza",
    name: "Sweet Bonanza",
    thumbnail:
      "https://demogamesfree.pragmaticplay.net/gs2c/common/images/games/200x200/vs20fruitsw.png",
    category: "Popular",
    provider: "Pragmatic Play",
    rtp: 96.48,
    volatility: "High",
    maxWin: "21,100x",
    features: ["Free Spins", "Multipliers", "Tumble"],
    isNew: false,
    isPopular: true,
    releaseDate: "2019-06-27",
  },
  {
    id: "the-dog-house",
    name: "The Dog House",
    thumbnail:
      "https://demogamesfree.pragmaticplay.net/gs2c/common/images/games/200x200/vs20doghouse.png",
    category: "Animal",
    provider: "Pragmatic Play",
    rtp: 96.51,
    volatility: "High",
    maxWin: "6,750x",
    features: ["Free Spins", "Sticky Wilds", "Multipliers"],
    isNew: false,
    isPopular: true,
    releaseDate: "2019-04-23",
  },
  {
    id: "wolf-gold",
    name: "Wolf Gold",
    thumbnail:
      "https://demogamesfree.pragmaticplay.net/gs2c/common/images/games/200x200/vs25wolfgold.png",
    category: "Animal",
    provider: "Pragmatic Play",
    rtp: 96.01,
    volatility: "Medium",
    maxWin: "2,500x",
    features: ["Free Spins", "Money Respin", "Jackpot"],
    isNew: false,
    isPopular: true,
    releaseDate: "2017-05-25",
  },
  {
    id: "great-rhino-megaways",
    name: "Great Rhino Megaways",
    thumbnail:
      "https://demogamesfree.pragmaticplay.net/gs2c/common/images/games/200x200/vswaysrhino.png",
    category: "Megaways",
    provider: "Pragmatic Play",
    rtp: 96.58,
    volatility: "High",
    maxWin: "20,000x",
    features: ["Megaways", "Free Spins", "Tumble"],
    isNew: false,
    isPopular: true,
    releaseDate: "2020-04-30",
  },
  {
    id: "starlight-princess",
    name: "Starlight Princess",
    thumbnail:
      "https://demogamesfree.pragmaticplay.net/gs2c/common/images/games/200x200/vs20starlight.png",
    category: "Fantasy",
    provider: "Pragmatic Play",
    rtp: 96.5,
    volatility: "High",
    maxWin: "5,000x",
    features: ["Free Spins", "Multipliers", "Tumble"],
    isNew: true,
    isPopular: true,
    releaseDate: "2021-05-26",
  },
  {
    id: "big-bass-bonanza",
    name: "Big Bass Bonanza",
    thumbnail:
      "https://demogamesfree.pragmaticplay.net/gs2c/common/images/games/200x200/vs10fishing.png",
    category: "Fishing",
    provider: "Pragmatic Play",
    rtp: 96.71,
    volatility: "High",
    maxWin: "2,100x",
    features: ["Free Spins", "Money Collect", "Multipliers"],
    isNew: false,
    isPopular: true,
    releaseDate: "2020-12-14",
  },
  {
    id: "sugar-rush",
    name: "Sugar Rush",
    thumbnail:
      "https://demogamesfree.pragmaticplay.net/gs2c/common/images/games/200x200/vs20sugarrush.png",
    category: "Sweet",
    provider: "Pragmatic Play",
    rtp: 96.5,
    volatility: "High",
    maxWin: "5,000x",
    features: ["Free Spins", "Multipliers", "Tumble"],
    isNew: true,
    isPopular: false,
    releaseDate: "2022-04-28",
  },
  {
    id: "book-of-fallen",
    name: "Book of Fallen",
    thumbnail:
      "https://demogamesfree.pragmaticplay.net/gs2c/common/images/games/200x200/vs10bookoftut.png",
    category: "Adventure",
    provider: "Pragmatic Play",
    rtp: 96.28,
    volatility: "High",
    maxWin: "5,000x",
    features: ["Free Spins", "Expanding Symbols", "Gamble"],
    isNew: false,
    isPopular: false,
    releaseDate: "2021-09-30",
  },
  {
    id: "wild-west-gold",
    name: "Wild West Gold",
    thumbnail:
      "https://demogamesfree.pragmaticplay.net/gs2c/common/images/games/200x200/vs40wildwest.png",
    category: "Western",
    provider: "Pragmatic Play",
    rtp: 96.51,
    volatility: "High",
    maxWin: "5,000x",
    features: ["Free Spins", "Sticky Wilds", "Multipliers"],
    isNew: false,
    isPopular: false,
    releaseDate: "2020-01-30",
  },
  {
    id: "fire-strike",
    name: "Fire Strike",
    thumbnail:
      "https://demogamesfree.pragmaticplay.net/gs2c/common/images/games/200x200/vs15fire.png",
    category: "Classic",
    provider: "Pragmatic Play",
    rtp: 96.48,
    volatility: "High",
    maxWin: "2,500x",
    features: ["Respin", "Progressive Jackpot"],
    isNew: false,
    isPopular: false,
    releaseDate: "2020-06-25",
  },
  {
    id: "aztec-gems",
    name: "Aztec Gems",
    thumbnail:
      "https://demogamesfree.pragmaticplay.net/gs2c/common/images/games/200x200/vs9aztecgems.png",
    category: "Adventure",
    provider: "Pragmatic Play",
    rtp: 96.52,
    volatility: "High",
    maxWin: "1,000x",
    features: ["Money Respin"],
    isNew: false,
    isPopular: false,
    releaseDate: "2018-05-31",
  },
];

// In-memory storage (use database in production)
let gameHistories: GameHistory[] = [];
let userProfiles: Map<string, UserProfile> = new Map();

// Initialize demo user
const demoUser: UserProfile = {
  id: "demo-user",
  username: "Player123",
  email: "demo@example.com",
  gcBalance: 50000,
  scBalance: 25,
  totalWins: 150,
  totalPlayed: 500,
  level: 15,
  joinDate: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
  lastLogin: Date.now(),
};

userProfiles.set("demo-user", demoUser);

// Get all Pragmatic Play slots
export const getPragmaticSlots: RequestHandler = (req, res) => {
  try {
    const { category, search, limit = "20" } = req.query;

    let filteredSlots = [...PRAGMATIC_SLOTS];

    // Filter by category
    if (category && category !== "all") {
      filteredSlots = filteredSlots.filter(
        (slot) =>
          slot.category.toLowerCase() === (category as string).toLowerCase(),
      );
    }

    // Filter by search
    if (search) {
      const searchTerm = (search as string).toLowerCase();
      filteredSlots = filteredSlots.filter(
        (slot) =>
          slot.name.toLowerCase().includes(searchTerm) ||
          slot.category.toLowerCase().includes(searchTerm),
      );
    }

    // Apply limit
    const limitNum = parseInt(limit as string);
    if (limitNum > 0) {
      filteredSlots = filteredSlots.slice(0, limitNum);
    }

    // Get unique categories
    const categories = [
      ...new Set(PRAGMATIC_SLOTS.map((slot) => slot.category)),
    ];

    const response: PragmaticSlotsResponse = {
      slots: filteredSlots,
      total: filteredSlots.length,
      categories: categories,
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching Pragmatic slots:", error);
    res.status(500).json({ error: "Failed to fetch slots" });
  }
};

// Play game (GC or SC)
export const playPragmaticSlot: RequestHandler = (req, res) => {
  try {
    const { gameId, gameType, amount, userId = "demo-user" } = req.body;

    const user = userProfiles.get(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const game = PRAGMATIC_SLOTS.find((slot) => slot.id === gameId);
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }

    // Check balance
    const currentBalance = gameType === "GC" ? user.gcBalance : user.scBalance;
    if (currentBalance < amount) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    // Deduct bet
    if (gameType === "GC") {
      user.gcBalance -= amount;
    } else {
      user.scBalance -= amount;
    }

    // Simulate game result (30% win rate)
    const isWin = Math.random() < 0.3;
    let winAmount = 0;

    if (isWin) {
      // Random win multiplier between 1.1x to 10x
      const multiplier = 1.1 + Math.random() * 8.9;
      winAmount = Math.floor(amount * multiplier);

      // Add winnings
      if (gameType === "GC") {
        user.gcBalance += winAmount;
      } else {
        user.scBalance += winAmount;
      }

      user.totalWins++;
    }

    user.totalPlayed++;

    // Create game history entry
    const gameHistory: GameHistory = {
      id: `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      gameId,
      gameName: game.name,
      gameType: gameType as "GC" | "SC",
      amount,
      result: isWin ? "win" : "loss",
      winAmount: isWin ? winAmount : undefined,
      timestamp: Date.now(),
      sessionId: `session_${Date.now()}`,
    };

    gameHistories.unshift(gameHistory);

    // Keep only last 100 games
    if (gameHistories.length > 100) {
      gameHistories = gameHistories.slice(0, 100);
    }

    res.json({
      success: true,
      result: isWin ? "win" : "loss",
      winAmount: isWin ? winAmount : 0,
      newBalance: {
        gc: user.gcBalance,
        sc: user.scBalance,
      },
      gameHistory,
    });
  } catch (error) {
    console.error("Error playing slot:", error);
    res.status(500).json({ error: "Failed to play game" });
  }
};

// Get user profile
export const getUserProfile: RequestHandler = (req, res) => {
  const userId = req.params.userId || "demo-user";
  const user = userProfiles.get(userId);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json(user);
};

// Get user game history
export const getUserHistory: RequestHandler = (req, res) => {
  const userId = req.params.userId || "demo-user";
  const { limit = "20", gameType } = req.query;

  let userHistory = gameHistories.filter(
    (game) => game.sessionId.includes(userId) || userId === "demo-user",
  );

  if (gameType && gameType !== "all") {
    userHistory = userHistory.filter((game) => game.gameType === gameType);
  }

  const limitNum = parseInt(limit as string);
  if (limitNum > 0) {
    userHistory = userHistory.slice(0, limitNum);
  }

  res.json({
    history: userHistory,
    total: userHistory.length,
  });
};

// Admin stats
export const getAdminStats: RequestHandler = (_req, res) => {
  const totalUsers = userProfiles.size;
  const activeUsers = Array.from(userProfiles.values()).filter(
    (user) => Date.now() - user.lastLogin < 24 * 60 * 60 * 1000,
  ).length;

  const totalGamesPlayed = gameHistories.length;
  const totalGCWagered = gameHistories
    .filter((g) => g.gameType === "GC")
    .reduce((sum, g) => sum + g.amount, 0);
  const totalSCWagered = gameHistories
    .filter((g) => g.gameType === "SC")
    .reduce((sum, g) => sum + g.amount, 0);

  const totalPayouts = gameHistories
    .filter((g) => g.result === "win")
    .reduce((sum, g) => sum + (g.winAmount || 0), 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayGames = gameHistories.filter(
    (g) => g.timestamp >= today.getTime(),
  );

  const revenueToday =
    todayGames.reduce((sum, g) => sum + g.amount, 0) -
    todayGames
      .filter((g) => g.result === "win")
      .reduce((sum, g) => sum + (g.winAmount || 0), 0);

  const thisMonth = new Date();
  thisMonth.setDate(1);
  thisMonth.setHours(0, 0, 0, 0);
  const monthGames = gameHistories.filter(
    (g) => g.timestamp >= thisMonth.getTime(),
  );

  const revenueMonth =
    monthGames.reduce((sum, g) => sum + g.amount, 0) -
    monthGames
      .filter((g) => g.result === "win")
      .reduce((sum, g) => sum + (g.winAmount || 0), 0);

  const stats: AdminStats = {
    totalUsers,
    activeUsers,
    totalGamesPlayed,
    totalGCWagered,
    totalSCWagered,
    totalPayouts,
    revenueToday,
    revenueMonth,
  };

  res.json(stats);
};

// Reset balances (admin)
export const resetUserBalance: RequestHandler = (req, res) => {
  const userId = req.params.userId || "demo-user";
  const { gcAmount = 50000, scAmount = 25 } = req.body;

  const user = userProfiles.get(userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  user.gcBalance = gcAmount;
  user.scBalance = scAmount;

  res.json({
    success: true,
    user,
    message: "Balance reset successfully",
  });
};
