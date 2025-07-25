import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Trophy, Gift } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Prize {
  id: number;
  label: string;
  value: string;
  color: string;
  probability: number;
}

export default function SpinWheel() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [winner, setWinner] = useState<Prize | null>(null);
  const [canSpin, setCanSpin] = useState(true);
  const wheelRef = useRef<HTMLDivElement>(null);

  const prizes: Prize[] = [
    { id: 1, label: '$1,000', value: '$1,000 Cash', color: 'bg-gold', probability: 0.01 },
    { id: 2, label: '$50', value: '$50 Cash', color: 'bg-green-500', probability: 0.05 },
    { id: 3, label: '$10', value: '$10 Cash', color: 'bg-blue-500', probability: 0.15 },
    { id: 4, label: '$5', value: '$5 Cash', color: 'bg-purple-500', probability: 0.20 },
    { id: 5, label: 'Try Again', value: 'Better luck next time!', color: 'bg-gray-500', probability: 0.30 },
    { id: 6, label: '$25', value: '$25 Cash', color: 'bg-orange-500', probability: 0.10 },
    { id: 7, label: '$100', value: '$100 Cash', color: 'bg-red-500', probability: 0.03 },
    { id: 8, label: 'Bonus', value: '2x Spin Multiplier', color: 'bg-pink-500', probability: 0.16 }
  ];

  const spinWheel = () => {
    if (isSpinning || !canSpin) return;

    setIsSpinning(true);
    setWinner(null);
    setCanSpin(false);

    // Calculate winner based on probability
    const random = Math.random();
    let cumulativeProbability = 0;
    let selectedPrize = prizes[prizes.length - 1]; // fallback

    for (const prize of prizes) {
      cumulativeProbability += prize.probability;
      if (random <= cumulativeProbability) {
        selectedPrize = prize;
        break;
      }
    }

    // Calculate rotation to land on selected prize
    const prizeAngle = 360 / prizes.length;
    const prizeIndex = prizes.findIndex(p => p.id === selectedPrize.id);
    const targetAngle = prizeIndex * prizeAngle + (prizeAngle / 2);
    
    // Add multiple full rotations for effect
    const spins = 5 + Math.random() * 3; // 5-8 full rotations
    const finalRotation = currentRotation + (360 * spins) + (360 - targetAngle);

    setCurrentRotation(finalRotation);

    // Animation duration
    setTimeout(() => {
      setIsSpinning(false);
      setWinner(selectedPrize);
      // Reset spin availability after 3 seconds
      setTimeout(() => setCanSpin(true), 3000);
    }, 4000);
  };

  const segmentAngle = 360 / prizes.length;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="bg-card/80 backdrop-blur-sm border-white/10">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl text-white flex items-center justify-center">
            <Trophy className="mr-2 h-8 w-8 text-gold" />
            Golden Spin Wheel
          </CardTitle>
          <p className="text-gray-300">Spin to win amazing cash prizes!</p>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {/* Wheel Container */}
          <div className="relative flex items-center justify-center">
            {/* Pointer */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-20">
              <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-gold"></div>
            </div>

            {/* Wheel */}
            <div className="relative">
              <div
                ref={wheelRef}
                className={cn(
                  "w-80 h-80 rounded-full border-8 border-gold relative overflow-hidden transition-transform",
                  isSpinning ? "duration-[4000ms] ease-out" : "duration-300"
                )}
                style={{
                  transform: `rotate(${currentRotation}deg)`,
                }}
              >
                {prizes.map((prize, index) => {
                  const rotation = index * segmentAngle;
                  return (
                    <div
                      key={prize.id}
                      className={cn(
                        "absolute w-1/2 h-1/2 origin-bottom-right border-r border-white/20",
                        prize.color
                      )}
                      style={{
                        transform: `rotate(${rotation}deg)`,
                        clipPath: `polygon(0 0, 100% 0, 87% 87%, 0 100%)`,
                      }}
                    >
                      <div
                        className="absolute top-4 right-2 text-white font-bold text-xs transform -rotate-45 origin-center whitespace-nowrap"
                        style={{
                          transform: `rotate(${segmentAngle / 2 - 45}deg)`,
                        }}
                      >
                        {prize.label}
                      </div>
                    </div>
                  );
                })}
                
                {/* Center circle */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gold rounded-full border-4 border-white flex items-center justify-center">
                  <Zap className="h-6 w-6 text-black" />
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="text-center space-y-4">
            <Button
              size="lg"
              onClick={spinWheel}
              disabled={isSpinning || !canSpin}
              className={cn(
                "bg-gold text-black hover:bg-gold-dark font-bold px-8 py-4 text-lg",
                isSpinning && "animate-pulse",
                !canSpin && !isSpinning && "opacity-50 cursor-not-allowed"
              )}
            >
              {isSpinning ? (
                <>
                  <Zap className="mr-2 h-5 w-5 animate-spin" />
                  Spinning...
                </>
              ) : !canSpin ? (
                <>
                  <Gift className="mr-2 h-5 w-5" />
                  Cooling Down...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-5 w-5" />
                  Spin to Win!
                </>
              )}
            </Button>

            {!canSpin && !isSpinning && (
              <p className="text-gray-400 text-sm">
                Next spin available in a few seconds...
              </p>
            )}
          </div>

          {/* Winner Display */}
          {winner && (
            <div className="text-center space-y-4 animate-bounce-light">
              <div className="mx-auto w-24 h-24 bg-gold rounded-full flex items-center justify-center">
                <Trophy className="h-12 w-12 text-black" />
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  🎉 Congratulations! 🎉
                </h3>
                <Badge className="bg-gold text-black text-lg px-4 py-2">
                  You won: {winner.value}
                </Badge>
              </div>
              
              {winner.id !== 5 && ( // Not "Try Again"
                <p className="text-gray-300">
                  Your prize will be credited to your account within 24 hours.
                </p>
              )}
            </div>
          )}

          {/* Game Info */}
          <div className="bg-black/20 rounded-lg p-4 space-y-2">
            <h4 className="text-white font-medium mb-2">Prize Breakdown:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-300">$1,000 Cash - 1% chance</div>
              <div className="text-gray-300">$100 Cash - 3% chance</div>
              <div className="text-gray-300">$50 Cash - 5% chance</div>
              <div className="text-gray-300">$25 Cash - 10% chance</div>
              <div className="text-gray-300">$10 Cash - 15% chance</div>
              <div className="text-gray-300">$5 Cash - 20% chance</div>
              <div className="text-gray-300">2x Multiplier - 16% chance</div>
              <div className="text-gray-300">Try Again - 30% chance</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
