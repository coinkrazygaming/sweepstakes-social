import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  Star,
  Trophy,
  Gift,
  Zap,
  Clock,
  Users,
  DollarSign,
  TrendingUp,
  Crown,
  Sparkles
} from 'lucide-react';
import AuthModal from '@/components/AuthModal';

export default function Index() {
  const [userPoints] = useState(1250);
  const [todayEntries] = useState(3);
  const maxDailyEntries = 5;

  const featuredGames = [
    {
      id: 1,
      title: "Golden Spin Wheel",
      description: "Spin for cash prizes up to $10,000",
      prize: "$10,000",
      odds: "1:500",
      players: 2847,
      image: "🎰",
      category: "Instant Win",
      isHot: true,
      link: "/spin-wheel"
    },
    {
      id: 2,
      title: "Lucky Slots",
      description: "Match symbols for instant prizes and jackpots",
      prize: "50,000 pts",
      odds: "1:200",
      players: 3421,
      image: "🎰",
      category: "Slots",
      isNew: true,
      link: "/slots"
    },
    {
      id: 3,
      title: "Crypto Scratch Cards",
      description: "Scratch to win Bitcoin & Ethereum",
      prize: "1 BTC",
      odds: "1:1000",
      players: 1523,
      image: "🪙",
      category: "Crypto",
      link: "/scratch-cards"
    },
    {
      id: 4,
      title: "Daily Gift Card Draw",
      description: "Win Amazon, Apple, and more gift cards",
      prize: "$500",
      odds: "1:100",
      players: 5429,
      image: "🎁",
      category: "Gift Cards",
      endsIn: "6h 23m",
      link: "/daily-draws"
    }
  ];

  const recentWinners = [
    { name: "Sarah M.", prize: "$5,000", game: "Golden Spin", time: "2 mins ago", avatar: "SM" },
    { name: "Mike R.", prize: "0.1 BTC", game: "Crypto Cards", time: "15 mins ago", avatar: "MR" },
    { name: "Jessica L.", prize: "$250 Amazon", game: "Gift Card Draw", time: "32 mins ago", avatar: "JL" },
    { name: "David K.", prize: "$1,000", game: "Golden Spin", time: "1 hour ago", avatar: "DK" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Navigation */}
      <nav className="border-b border-white/10 backdrop-blur-lg bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Crown className="h-8 w-8 text-gold animate-pulse-glow" />
                <span className="text-2xl font-bold text-white">PrizeHub</span>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/pragmatic-slots" className="text-white hover:text-gold transition-colors">Pragmatic Slots</Link>
              <Link to="/dashboard" className="text-white hover:text-gold transition-colors">Dashboard</Link>
              <Link to="/leaderboard" className="text-white hover:text-gold transition-colors">Leaderboard</Link>
              <Link to="/winners" className="text-white hover:text-gold transition-colors">Winners</Link>
              <Link to="/referrals" className="text-white hover:text-gold transition-colors">Refer Friends</Link>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-black/30 rounded-full px-4 py-2">
                <Sparkles className="h-4 w-4 text-gold" />
                <span className="text-white font-medium">{userPoints.toLocaleString()} pts</span>
              </div>
              <AuthModal>
                <Button variant="outline" className="border-gold text-gold hover:bg-gold hover:text-black">
                  Login
                </Button>
              </AuthModal>
              <AuthModal>
                <Button className="bg-gold text-black hover:bg-gold-dark font-medium">
                  Sign Up
                </Button>
              </AuthModal>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="relative">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Win Real Prizes
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-yellow-400 to-gold animate-pulse-glow">
                Every Day
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of winners in daily sweepstakes. Spin wheels, scratch cards, and enter draws for cash, crypto, and amazing prizes.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button size="lg" className="bg-gold text-black hover:bg-gold-dark font-bold px-8 py-4 text-lg animate-bounce-light">
                <Zap className="mr-2 h-5 w-5" />
                Start Playing Free
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg">
                <Trophy className="mr-2 h-5 w-5" />
                View All Prizes
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-gold mb-2">$2.3M+</div>
                <div className="text-gray-300">Total Prizes Won</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gold mb-2">50K+</div>
                <div className="text-gray-300">Happy Winners</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gold mb-2">98%</div>
                <div className="text-gray-300">Payout Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Progress */}
      <section className="px-4 sm:px-6 lg:px-8 mb-12">
        <div className="max-w-7xl mx-auto">
          <Card className="bg-gradient-to-r from-purple/20 to-blue/20 border-purple/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">Daily Entries</h3>
                  <p className="text-gray-300 text-sm">You have {maxDailyEntries - todayEntries} entries remaining today</p>
                </div>
                <Badge className="bg-gold text-black">
                  {todayEntries}/{maxDailyEntries}
                </Badge>
              </div>
              <Progress value={(todayEntries / maxDailyEntries) * 100} className="h-3" />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Games */}
      <section className="px-4 sm:px-6 lg:px-8 mb-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Featured Games</h2>
            <p className="text-gray-300 text-lg">Play now for your chance to win big prizes</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredGames.map((game) => (
              <Card key={game.id} className="bg-card/80 backdrop-blur-sm border-white/10 hover:border-gold/50 transition-all duration-300 hover:scale-105 group">
                <CardHeader className="relative">
                  {game.isHot && (
                    <Badge className="absolute top-4 right-4 bg-red-500 text-white animate-pulse">
                      🔥 HOT
                    </Badge>
                  )}
                  {game.isNew && (
                    <Badge className="absolute top-4 right-4 bg-green-500 text-white">
                      ✨ NEW
                    </Badge>
                  )}
                  <div className="text-6xl mb-4 text-center">{game.image}</div>
                  <CardTitle className="text-white text-xl">{game.title}</CardTitle>
                  <CardDescription className="text-gray-300">{game.description}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gold font-bold text-lg">Prize: {game.prize}</span>
                      <Badge variant="outline" className="border-gray-500 text-gray-300">
                        {game.category}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-300">
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="h-4 w-4" />
                        <span>Odds: {game.odds}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{game.players.toLocaleString()} playing</span>
                      </div>
                    </div>

                    {game.endsIn && (
                      <div className="flex items-center space-x-1 text-yellow-400 text-sm">
                        <Clock className="h-4 w-4" />
                        <span>Ends in {game.endsIn}</span>
                      </div>
                    )}

                    <Button
                      asChild
                      className="w-full bg-gold text-black hover:bg-gold-dark font-medium group-hover:animate-pulse-glow"
                    >
                      <Link to={game.link}>
                        <Gift className="mr-2 h-4 w-4" />
                        Play Now
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Winners */}
      <section className="px-4 sm:px-6 lg:px-8 mb-16">
        <div className="max-w-7xl mx-auto">
          <Card className="bg-card/80 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-2xl flex items-center">
                <Trophy className="mr-2 h-6 w-6 text-gold" />
                Recent Winners
              </CardTitle>
              <CardDescription className="text-gray-300">
                See who's been winning big on PrizeHub
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {recentWinners.map((winner, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-white/10">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback className="bg-gold text-black font-bold">
                          {winner.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-white font-medium">{winner.name}</div>
                        <div className="text-gray-300 text-sm">{winner.game}</div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-gold font-bold">{winner.prize}</div>
                      <div className="text-gray-400 text-sm">{winner.time}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-6">
                <Button variant="outline" className="border-gold text-gold hover:bg-gold hover:text-black">
                  View All Winners
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Crown className="h-6 w-6 text-gold" />
                <span className="text-xl font-bold text-white">PrizeHub</span>
              </div>
              <p className="text-gray-300 text-sm">
                The ultimate destination for daily sweepstakes, instant wins, and amazing prizes.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-4">Games</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link to="/spin-wheel" className="hover:text-gold transition-colors">Spin Wheel</Link></li>
                <li><Link to="/scratch-cards" className="hover:text-gold transition-colors">Scratch Cards</Link></li>
                <li><Link to="/daily-draws" className="hover:text-gold transition-colors">Daily Draws</Link></li>
                <li><Link to="/instant-win" className="hover:text-gold transition-colors">Instant Win</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-4">Community</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link to="/leaderboard" className="hover:text-gold transition-colors">Leaderboard</Link></li>
                <li><Link to="/winners" className="hover:text-gold transition-colors">Winners Gallery</Link></li>
                <li><Link to="/referrals" className="hover:text-gold transition-colors">Refer Friends</Link></li>
                <li><Link to="/blog" className="hover:text-gold transition-colors">Blog</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link to="/help" className="hover:text-gold transition-colors">Help Center</Link></li>
                <li><Link to="/contact" className="hover:text-gold transition-colors">Contact Us</Link></li>
                <li><Link to="/terms" className="hover:text-gold transition-colors">Terms of Service</Link></li>
                <li><Link to="/privacy" className="hover:text-gold transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 PrizeHub. All rights reserved. Play responsibly.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
