import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Zap, 
  Trophy, 
  Coins, 
  TrendingUp,
  RotateCcw,
  Crown,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  SlotSpinResponse, 
  SlotStats, 
  SLOT_SYMBOLS 
} from '@shared/api';

export default function SlotsGame() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<SlotSpinResponse | null>(null);
  const [balance, setBalance] = useState(1000);
  const [bet, setBet] = useState(10);
  const [stats, setStats] = useState<SlotStats | null>(null);
  const [reels, setReels] = useState<string[][]>([
    ['cherry', 'lemon', 'orange'],
    ['plum', 'bell', 'diamond'],
    ['seven', 'crown', 'cherry']
  ]);

  // Load initial data
  useEffect(() => {
    loadBalance();
    loadStats();
  }, []);

  const loadBalance = async () => {
    try {
      const response = await fetch('/api/slots/balance');
      const data = await response.json();
      setBalance(data.balance);
    } catch (error) {
      console.error('Failed to load balance:', error);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch('/api/slots/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const spinSlots = async () => {
    if (isSpinning || balance < bet) return;

    setIsSpinning(true);
    setResult(null);

    try {
      const response = await fetch('/api/slots/spin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bet, userId: 'demo-user' }),
      });

      const data: SlotSpinResponse = await response.json();
      
      if (data.success && data.result) {
        // Animate reels spinning
        const spinDuration = 2000;
        const interval = setInterval(() => {
          setReels(data.result!.reels.map(() => 
            Array(3).fill(0).map(() => getRandomSymbol())
          ));
        }, 100);

        setTimeout(() => {
          clearInterval(interval);
          setReels(data.result!.reels);
          setResult(data);
          setBalance(data.balance || balance);
          setIsSpinning(false);
          loadStats(); // Refresh stats
        }, spinDuration);
      } else {
        setIsSpinning(false);
        alert(data.error || 'Spin failed');
      }
    } catch (error) {
      setIsSpinning(false);
      console.error('Spin error:', error);
      alert('Failed to spin. Please try again.');
    }
  };

  const resetBalance = async () => {
    try {
      const response = await fetch('/api/slots/reset-balance', {
        method: 'POST',
      });
      const data = await response.json();
      setBalance(data.balance);
      setResult(null);
    } catch (error) {
      console.error('Failed to reset balance:', error);
    }
  };

  const getRandomSymbol = () => {
    return SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)].id;
  };

  const getSymbolEmoji = (symbolId: string) => {
    const symbol = SLOT_SYMBOLS.find(s => s.id === symbolId);
    return symbol ? symbol.emoji : '❓';
  };

  const getSymbolName = (symbolId: string) => {
    const symbol = SLOT_SYMBOLS.find(s => s.id === symbolId);
    return symbol ? symbol.name : 'Unknown';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Main Game Card */}
      <Card className="bg-card/80 backdrop-blur-sm border-white/10">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl text-white flex items-center justify-center">
            <Crown className="mr-2 h-8 w-8 text-gold animate-pulse-glow" />
            Lucky Slots
          </CardTitle>
          <p className="text-gray-300">Match symbols across paylines to win big!</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Balance and Bet Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-black/20 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Coins className="h-5 w-5 text-gold" />
                <span className="text-white font-medium">Balance:</span>
                <Badge className="bg-gold text-black text-lg px-3 py-1">
                  {balance.toLocaleString()} pts
                </Badge>
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={resetBalance}
                className="border-gray-500 text-gray-300 hover:bg-gray-500 hover:text-white"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset
              </Button>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor="bet" className="text-white">Bet:</Label>
                <Input
                  id="bet"
                  type="number"
                  min="1"
                  max="100"
                  value={bet}
                  onChange={(e) => setBet(Number(e.target.value))}
                  className="w-20 bg-black/20 border-white/20 text-white text-center"
                  disabled={isSpinning}
                />
                <span className="text-gray-300">pts</span>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setBet(Math.min(bet * 2, 100))}
                  disabled={isSpinning}
                  className="border-gold text-gold hover:bg-gold hover:text-black"
                >
                  2x
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setBet(Math.min(balance, 100))}
                  disabled={isSpinning || balance < 100}
                  className="border-purple text-purple hover:bg-purple hover:text-white"
                >
                  Max
                </Button>
              </div>
            </div>
          </div>

          {/* Slot Machine */}
          <div className="relative">
            {/* Slot Reels */}
            <div className="bg-gradient-to-br from-yellow-600 via-yellow-500 to-yellow-400 p-6 rounded-xl border-4 border-gold shadow-2xl">
              <div className="grid grid-cols-3 gap-2 bg-black/80 p-4 rounded-lg">
                {reels.map((reel, reelIndex) => (
                  <div key={reelIndex} className="space-y-2">
                    {reel.map((symbol, symbolIndex) => (
                      <div
                        key={`${reelIndex}-${symbolIndex}`}
                        className={cn(
                          "w-20 h-20 bg-white rounded-lg flex items-center justify-center text-4xl border-2 border-gray-300 transition-all duration-100",
                          isSpinning && "animate-pulse border-gold"
                        )}
                      >
                        {getSymbolEmoji(symbol)}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              
              {/* Paylines indicator */}
              <div className="mt-4 text-center">
                <Badge className="bg-black/60 text-gold border-gold">
                  9 Paylines Active
                </Badge>
              </div>
            </div>

            {/* Spin Button */}
            <div className="text-center mt-6">
              <Button
                size="lg"
                onClick={spinSlots}
                disabled={isSpinning || balance < bet}
                className={cn(
                  "bg-gold text-black hover:bg-gold-dark font-bold px-12 py-6 text-xl",
                  isSpinning && "animate-pulse",
                  (balance < bet) && "opacity-50 cursor-not-allowed"
                )}
              >
                {isSpinning ? (
                  <>
                    <Zap className="mr-2 h-6 w-6 animate-spin" />
                    Spinning...
                  </>
                ) : balance < bet ? (
                  <>
                    <Coins className="mr-2 h-6 w-6" />
                    Insufficient Balance
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-6 w-6" />
                    SPIN ({bet} pts)
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Win Result */}
          {result && result.success && result.result && result.result.totalWin > 0 && (
            <div className="text-center space-y-4 animate-bounce-light">
              <div className="mx-auto w-24 h-24 bg-gold rounded-full flex items-center justify-center">
                {result.result.isJackpot ? (
                  <Crown className="h-12 w-12 text-black animate-spin" />
                ) : (
                  <Trophy className="h-12 w-12 text-black" />
                )}
              </div>
              
              <div>
                <h3 className="text-3xl font-bold text-white mb-2">
                  {result.result.isJackpot ? '🎰 JACKPOT! 🎰' : '🎉 You Win! 🎉'}
                </h3>
                <Badge className="bg-gold text-black text-2xl px-6 py-3">
                  +{result.result.totalWin.toLocaleString()} points
                </Badge>
                {result.result.multiplier > 1 && (
                  <div className="mt-2">
                    <Badge className="bg-purple text-white">
                      {result.result.multiplier}x Multiplier
                    </Badge>
                  </div>
                )}
              </div>
              
              {result.result.winLines.length > 0 && (
                <div className="text-sm text-gray-300">
                  <p>Winning Lines: {result.result.winLines.length}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Game Stats and Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Paytable */}
        <Card className="bg-card/80 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Sparkles className="mr-2 h-5 w-5 text-gold" />
              Paytable
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {SLOT_SYMBOLS.map((symbol) => (
                <div key={symbol.id} className="flex items-center justify-between p-2 bg-black/20 rounded">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{symbol.emoji}</span>
                    <span className="text-white text-sm">{symbol.name}</span>
                  </div>
                  <div className="text-gold font-medium">
                    {symbol.multiplier}x
                  </div>
                </div>
              ))}
            </div>
            <Separator className="my-4 bg-white/20" />
            <p className="text-xs text-gray-400">
              Get 3+ matching symbols on any payline to win. Jackpot requires all crown symbols.
            </p>
          </CardContent>
        </Card>

        {/* Game Stats */}
        <Card className="bg-card/80 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-gold" />
              Game Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gold">
                      {stats.totalSpins.toLocaleString()}
                    </div>
                    <div className="text-gray-300 text-sm">Total Spins</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gold">
                      {stats.totalWins.toLocaleString()}
                    </div>
                    <div className="text-gray-300 text-sm">Total Wins</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Biggest Win:</span>
                    <span className="text-gold font-bold">
                      {stats.biggestWin.toLocaleString()} pts
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Jackpot Pool:</span>
                    <span className="text-purple font-bold">
                      {stats.jackpotPool.toLocaleString()} pts
                    </span>
                  </div>
                </div>

                {stats.recentWinners.length > 0 && (
                  <>
                    <Separator className="bg-white/20" />
                    <div>
                      <h4 className="text-white font-medium mb-2">Recent Winners</h4>
                      <div className="space-y-1">
                        {stats.recentWinners.slice(0, 3).map((winner, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-gray-300">{winner.username}</span>
                            <span className={cn(
                              "font-medium",
                              winner.isJackpot ? "text-purple" : "text-gold"
                            )}>
                              {winner.isJackpot ? '🎰' : '🏆'} {winner.amount.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-400">
                Loading stats...
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
