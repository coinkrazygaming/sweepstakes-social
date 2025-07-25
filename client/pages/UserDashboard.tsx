import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Crown, 
  ArrowLeft, 
  User, 
  History, 
  TrendingUp, 
  Trophy,
  Coins,
  Calendar,
  Clock,
  Target,
  Star,
  Gamepad2
} from 'lucide-react';
import AuthModal from '@/components/AuthModal';
import { UserProfile, GameHistory } from '@shared/api';
import { cn } from '@/lib/utils';

export default function UserDashboard() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [gameHistory, setGameHistory] = useState<GameHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [historyFilter, setHistoryFilter] = useState<'all' | 'GC' | 'SC'>('all');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Load user profile
      const profileResponse = await fetch('/api/user/profile');
      const profile: UserProfile = await profileResponse.json();
      setUserProfile(profile);
      
      // Load game history
      const historyResponse = await fetch('/api/user/history?limit=50');
      const historyData = await historyResponse.json();
      setGameHistory(historyData.history || []);
      
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetBalance = async () => {
    try {
      const response = await fetch('/api/admin/reset-balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gcAmount: 50000, scAmount: 25 })
      });
      
      const result = await response.json();
      if (result.success) {
        setUserProfile(result.user);
        alert('Balance reset successfully!');
      }
    } catch (error) {
      console.error('Failed to reset balance:', error);
      alert('Failed to reset balance');
    }
  };

  const filteredHistory = gameHistory.filter(game => 
    historyFilter === 'all' || game.gameType === historyFilter
  );

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getWinRate = () => {
    if (!userProfile || userProfile.totalPlayed === 0) return 0;
    return Math.round((userProfile.totalWins / userProfile.totalPlayed) * 100);
  };

  const getLevelProgress = () => {
    if (!userProfile) return 0;
    // Simple level calculation based on total played games
    const currentLevelBase = (userProfile.level - 1) * 50;
    const nextLevelBase = userProfile.level * 50;
    const progress = ((userProfile.totalPlayed - currentLevelBase) / (nextLevelBase - currentLevelBase)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>
          <p className="text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Navigation */}
      <nav className="border-b border-white/10 backdrop-blur-lg bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Crown className="h-8 w-8 text-gold animate-pulse-glow" />
              <span className="text-2xl font-bold text-white">PrizeHub</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/pragmatic-slots" className="text-white hover:text-gold transition-colors">
                Slots Gallery
              </Link>
              <Link to="/admin" className="text-white hover:text-gold transition-colors">
                Admin
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                asChild 
                variant="outline" 
                size="sm"
                className="border-white text-white hover:bg-white hover:text-black"
              >
                <Link to="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
              
              <AuthModal>
                <Button variant="outline" className="border-gold text-gold hover:bg-gold hover:text-black">
                  Login
                </Button>
              </AuthModal>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {userProfile && (
          <>
            {/* User Profile Header */}
            <Card className="bg-gradient-to-r from-purple/20 to-blue/20 border-purple/30 mb-8">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                  <Avatar className="w-20 h-20 border-4 border-gold">
                    <AvatarFallback className="bg-gold text-black text-2xl font-bold">
                      {userProfile.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl font-bold text-white mb-2">{userProfile.username}</h1>
                    <p className="text-gray-300 mb-4">{userProfile.email}</p>
                    
                    <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
                      <div className="flex items-center space-x-2">
                        <Star className="h-5 w-5 text-gold" />
                        <span className="text-white font-medium">Level {userProfile.level}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-5 w-5 text-blue-400" />
                        <span className="text-gray-300">
                          Joined {new Date(userProfile.joinDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-green-400" />
                        <span className="text-gray-300">
                          Last seen {new Date(userProfile.lastLogin).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    {/* Level Progress */}
                    <div className="mt-4 max-w-md">
                      <div className="flex justify-between text-sm text-gray-300 mb-1">
                        <span>Level {userProfile.level}</span>
                        <span>Level {userProfile.level + 1}</span>
                      </div>
                      <Progress value={getLevelProgress()} className="h-2" />
                    </div>
                  </div>
                  
                  <Button 
                    onClick={resetBalance}
                    variant="outline" 
                    className="border-gold text-gold hover:bg-gold hover:text-black"
                  >
                    Reset Balance
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-card/80 backdrop-blur-sm border-white/10">
                <CardContent className="p-6 text-center">
                  <Coins className="h-8 w-8 text-gold mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gold mb-1">
                    {userProfile.gcBalance.toLocaleString()}
                  </div>
                  <div className="text-gray-300 text-sm">Gold Coins (GC)</div>
                </CardContent>
              </Card>
              
              <Card className="bg-card/80 backdrop-blur-sm border-white/10">
                <CardContent className="p-6 text-center">
                  <Crown className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-400 mb-1">
                    {userProfile.scBalance.toLocaleString()}
                  </div>
                  <div className="text-gray-300 text-sm">Sweeps Coins (SC)</div>
                </CardContent>
              </Card>
              
              <Card className="bg-card/80 backdrop-blur-sm border-white/10">
                <CardContent className="p-6 text-center">
                  <Trophy className="h-8 w-8 text-purple mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white mb-1">
                    {userProfile.totalWins}
                  </div>
                  <div className="text-gray-300 text-sm">Total Wins</div>
                </CardContent>
              </Card>
              
              <Card className="bg-card/80 backdrop-blur-sm border-white/10">
                <CardContent className="p-6 text-center">
                  <Target className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white mb-1">
                    {getWinRate()}%
                  </div>
                  <div className="text-gray-300 text-sm">Win Rate</div>
                </CardContent>
              </Card>
            </div>

            {/* Dashboard Tabs */}
            <Tabs defaultValue="history" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 bg-black/20">
                <TabsTrigger value="history" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                  <History className="mr-2 h-4 w-4" />
                  Game History
                </TabsTrigger>
                <TabsTrigger value="stats" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Statistics
                </TabsTrigger>
                <TabsTrigger value="games" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                  <Gamepad2 className="mr-2 h-4 w-4" />
                  Play Games
                </TabsTrigger>
              </TabsList>

              {/* Game History Tab */}
              <TabsContent value="history" className="space-y-4">
                <Card className="bg-card/80 backdrop-blur-sm border-white/10">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white">Recent Game History</CardTitle>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={historyFilter === 'all' ? 'default' : 'outline'}
                          onClick={() => setHistoryFilter('all')}
                          className={historyFilter === 'all' ? 'bg-gold text-black' : 'border-white text-white'}
                        >
                          All
                        </Button>
                        <Button
                          size="sm"
                          variant={historyFilter === 'GC' ? 'default' : 'outline'}
                          onClick={() => setHistoryFilter('GC')}
                          className={historyFilter === 'GC' ? 'bg-gold text-black' : 'border-white text-white'}
                        >
                          GC
                        </Button>
                        <Button
                          size="sm"
                          variant={historyFilter === 'SC' ? 'default' : 'outline'}
                          onClick={() => setHistoryFilter('SC')}
                          className={historyFilter === 'SC' ? 'bg-gold text-black' : 'border-white text-white'}
                        >
                          SC
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {filteredHistory.length > 0 ? (
                      <div className="space-y-3">
                        {filteredHistory.slice(0, 20).map((game) => (
                          <div
                            key={game.id}
                            className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-white/10"
                          >
                            <div className="flex items-center space-x-4">
                              <div className={cn(
                                "w-3 h-3 rounded-full",
                                game.result === 'win' ? 'bg-green-500' : 'bg-red-500'
                              )}></div>
                              <div>
                                <div className="text-white font-medium">{game.gameName}</div>
                                <div className="text-gray-400 text-sm">
                                  {formatDate(game.timestamp)}
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="flex items-center space-x-2">
                                <Badge className={cn(
                                  "text-xs",
                                  game.gameType === 'GC' ? 'bg-gold text-black' : 'bg-green-600 text-white'
                                )}>
                                  {game.gameType}
                                </Badge>
                                <span className="text-gray-300">-{game.amount}</span>
                                {game.result === 'win' && game.winAmount && (
                                  <span className="text-green-400 font-bold">
                                    +{game.winAmount}
                                  </span>
                                )}
                              </div>
                              <div className={cn(
                                "text-sm font-medium",
                                game.result === 'win' ? 'text-green-400' : 'text-red-400'
                              )}>
                                {game.result === 'win' ? '🎉 Win' : '😔 Loss'}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Gamepad2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">No games played yet</h3>
                        <p className="text-gray-400 mb-4">Start playing to see your game history here</p>
                        <Button asChild className="bg-gold text-black hover:bg-gold-dark">
                          <Link to="/pragmatic-slots">
                            Play Slots
                          </Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Statistics Tab */}
              <TabsContent value="stats" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-card/80 backdrop-blur-sm border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white">Player Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Total Games Played:</span>
                        <span className="text-white font-bold">{userProfile.totalPlayed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Total Wins:</span>
                        <span className="text-green-400 font-bold">{userProfile.totalWins}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Win Rate:</span>
                        <span className="text-white font-bold">{getWinRate()}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Current Level:</span>
                        <span className="text-gold font-bold">Level {userProfile.level}</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-card/80 backdrop-blur-sm border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {gameHistory.slice(0, 5).map((game) => (
                        <div key={game.id} className="flex items-center justify-between">
                          <div>
                            <div className="text-white text-sm">{game.gameName}</div>
                            <div className="text-gray-400 text-xs">{formatDate(game.timestamp)}</div>
                          </div>
                          <Badge className={cn(
                            "text-xs",
                            game.result === 'win' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                          )}>
                            {game.result}
                          </Badge>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Play Games Tab */}
              <TabsContent value="games" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-card/80 backdrop-blur-sm border-white/10 hover:border-gold/50 transition-all">
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-4">🎰</div>
                      <h3 className="text-white font-bold mb-2">Pragmatic Play Slots</h3>
                      <p className="text-gray-300 text-sm mb-4">Premium slots with dual currency</p>
                      <Button asChild className="w-full bg-gold text-black hover:bg-gold-dark">
                        <Link to="/pragmatic-slots">
                          Play Now
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-card/80 backdrop-blur-sm border-white/10 hover:border-gold/50 transition-all">
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-4">🎡</div>
                      <h3 className="text-white font-bold mb-2">Spin Wheel</h3>
                      <p className="text-gray-300 text-sm mb-4">Spin for instant prizes</p>
                      <Button asChild className="w-full bg-purple text-white hover:bg-purple-dark">
                        <Link to="/spin-wheel">
                          Play Now
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-card/80 backdrop-blur-sm border-white/10 hover:border-gold/50 transition-all">
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-4">🎯</div>
                      <h3 className="text-white font-bold mb-2">Lucky Slots</h3>
                      <p className="text-gray-300 text-sm mb-4">Classic slot machine</p>
                      <Button asChild className="w-full bg-blue-600 text-white hover:bg-blue-700">
                        <Link to="/slots">
                          Play Now
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}
