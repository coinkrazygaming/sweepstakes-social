import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Crown, 
  ArrowLeft, 
  Shield, 
  Users, 
  TrendingUp, 
  DollarSign,
  Activity,
  Settings,
  Database,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Coins,
  Calendar,
  BarChart3,
  UserX,
  Gamepad2,
  RefreshCw
} from 'lucide-react';
import AuthModal from '@/components/AuthModal';
import { AdminStats, UserProfile, GameHistory } from '@shared/api';
import { cn } from '@/lib/utils';

export default function AdminDashboard() {
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [gameHistory, setGameHistory] = useState<GameHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Admin controls state
  const [selectedUserId, setSelectedUserId] = useState('demo-user');
  const [gcAmount, setGcAmount] = useState(50000);
  const [scAmount, setScAmount] = useState(25);
  const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      
      // Load admin stats
      const statsResponse = await fetch('/api/admin/stats');
      const stats: AdminStats = await statsResponse.json();
      setAdminStats(stats);
      
      // Load recent game history
      const historyResponse = await fetch('/api/user/history?limit=100');
      const historyData = await historyResponse.json();
      setGameHistory(historyData.history || []);
      
    } catch (error) {
      console.error('Failed to load admin data:', error);
      showAlert('error', 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadAdminData();
    setRefreshing(false);
    showAlert('success', 'Data refreshed successfully');
  };

  const resetUserBalance = async () => {
    try {
      const response = await fetch(`/api/admin/reset-balance/${selectedUserId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gcAmount, scAmount })
      });
      
      const result = await response.json();
      if (result.success) {
        showAlert('success', `Balance reset for ${selectedUserId}: ${gcAmount} GC, ${scAmount} SC`);
        await loadAdminData(); // Refresh data
      } else {
        showAlert('error', result.error || 'Failed to reset balance');
      }
    } catch (error) {
      console.error('Failed to reset balance:', error);
      showAlert('error', 'Failed to reset balance');
    }
  };

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlertMessage({ type, message });
    setTimeout(() => setAlertMessage(null), 5000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate some derived stats
  const getRevenueTrend = () => {
    if (!adminStats) return 0;
    const avgDailyRevenue = adminStats.revenueMonth / 30;
    return adminStats.revenueToday > avgDailyRevenue ? 'up' : 'down';
  };

  const getActiveUserPercentage = () => {
    if (!adminStats || adminStats.totalUsers === 0) return 0;
    return Math.round((adminStats.activeUsers / adminStats.totalUsers) * 100);
  };

  const getTotalWagered = () => {
    if (!adminStats) return 0;
    return adminStats.totalGCWagered + (adminStats.totalSCWagered * 100); // SC worth 100x more
  };

  const getPayoutPercentage = () => {
    const totalWagered = getTotalWagered();
    if (!adminStats || totalWagered === 0) return 0;
    return Math.round((adminStats.totalPayouts / totalWagered) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>
          <p className="text-gray-300">Loading admin dashboard...</p>
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
              <span className="text-2xl font-bold text-white">PrizeHub Admin</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/dashboard" className="text-white hover:text-gold transition-colors">
                User Dashboard
              </Link>
              <Link to="/pragmatic-slots" className="text-white hover:text-gold transition-colors">
                Slots Gallery
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                onClick={refreshData}
                disabled={refreshing}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <RefreshCw className={cn("mr-2 h-4 w-4", refreshing && "animate-spin")} />
                Refresh
              </Button>
              
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
                <Button className="bg-gold text-black hover:bg-gold-dark font-medium">
                  Admin Login
                </Button>
              </AuthModal>
            </div>
          </div>
        </div>
      </nav>

      {/* Alert Messages */}
      {alertMessage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <Alert className={cn(
            "border",
            alertMessage.type === 'success' ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'
          )}>
            {alertMessage.type === 'success' ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            <AlertDescription className="text-white">
              {alertMessage.message}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Shield className="h-12 w-12 text-gold" />
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-gray-300">System overview and management controls</p>
            </div>
          </div>
        </div>

        {adminStats && (
          <>
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-card/80 backdrop-blur-sm border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Users</p>
                      <p className="text-2xl font-bold text-white">{adminStats.totalUsers}</p>
                      <p className="text-green-400 text-sm">
                        {getActiveUserPercentage()}% active today
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/80 backdrop-blur-sm border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Games Played</p>
                      <p className="text-2xl font-bold text-white">{adminStats.totalGamesPlayed.toLocaleString()}</p>
                      <p className="text-blue-400 text-sm">All time</p>
                    </div>
                    <Gamepad2 className="h-8 w-8 text-purple" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/80 backdrop-blur-sm border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Revenue Today</p>
                      <p className="text-2xl font-bold text-white">{formatCurrency(adminStats.revenueToday)}</p>
                      <p className={cn(
                        "text-sm flex items-center",
                        getRevenueTrend() === 'up' ? 'text-green-400' : 'text-red-400'
                      )}>
                        <TrendingUp className="h-3 w-3 mr-1" />
                        vs monthly avg
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/80 backdrop-blur-sm border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Payout Rate</p>
                      <p className="text-2xl font-bold text-white">{getPayoutPercentage()}%</p>
                      <p className="text-gold text-sm">
                        {formatCurrency(adminStats.totalPayouts)} paid
                      </p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-gold" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Dashboard Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5 bg-black/20">
                <TabsTrigger value="overview" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                  <Activity className="mr-2 h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="users" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                  <Users className="mr-2 h-4 w-4" />
                  Users
                </TabsTrigger>
                <TabsTrigger value="games" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                  <Gamepad2 className="mr-2 h-4 w-4" />
                  Games
                </TabsTrigger>
                <TabsTrigger value="controls" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                  <Settings className="mr-2 h-4 w-4" />
                  Controls
                </TabsTrigger>
                <TabsTrigger value="reports" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Reports
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-card/80 backdrop-blur-sm border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white">Revenue Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Today's Revenue:</span>
                        <span className="text-green-400 font-bold">{formatCurrency(adminStats.revenueToday)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Monthly Revenue:</span>
                        <span className="text-green-400 font-bold">{formatCurrency(adminStats.revenueMonth)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Total GC Wagered:</span>
                        <span className="text-white font-bold">{adminStats.totalGCWagered.toLocaleString()} GC</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Total SC Wagered:</span>
                        <span className="text-white font-bold">{adminStats.totalSCWagered.toLocaleString()} SC</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/80 backdrop-blur-sm border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white">System Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">API Status:</span>
                        <Badge className="bg-green-500 text-white">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Online
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Database:</span>
                        <Badge className="bg-green-500 text-white">
                          <Database className="mr-1 h-3 w-3" />
                          Connected
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Active Users:</span>
                        <span className="text-white font-bold">{adminStats.activeUsers}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Games Running:</span>
                        <Badge className="bg-blue-500 text-white">12 Active</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Users Tab */}
              <TabsContent value="users" className="space-y-4">
                <Card className="bg-card/80 backdrop-blur-sm border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">User Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div className="text-center p-4 bg-black/20 rounded-lg">
                        <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{adminStats.totalUsers}</div>
                        <div className="text-gray-300 text-sm">Total Users</div>
                      </div>
                      <div className="text-center p-4 bg-black/20 rounded-lg">
                        <Activity className="h-8 w-8 text-green-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{adminStats.activeUsers}</div>
                        <div className="text-gray-300 text-sm">Active Today</div>
                      </div>
                      <div className="text-center p-4 bg-black/20 rounded-lg">
                        <UserX className="h-8 w-8 text-red-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{adminStats.totalUsers - adminStats.activeUsers}</div>
                        <div className="text-gray-300 text-sm">Inactive</div>
                      </div>
                    </div>

                    <Alert className="border-blue-500 bg-blue-500/10">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="text-white">
                        User management features are demo-only. In production, implement proper user lookup, banning, and support tools.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Games Tab */}
              <TabsContent value="games" className="space-y-4">
                <Card className="bg-card/80 backdrop-blur-sm border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Recent Game Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-white/10">
                            <TableHead className="text-gray-300">Game</TableHead>
                            <TableHead className="text-gray-300">Type</TableHead>
                            <TableHead className="text-gray-300">Amount</TableHead>
                            <TableHead className="text-gray-300">Result</TableHead>
                            <TableHead className="text-gray-300">Time</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {gameHistory.slice(0, 10).map((game) => (
                            <TableRow key={game.id} className="border-white/10">
                              <TableCell className="text-white">{game.gameName}</TableCell>
                              <TableCell>
                                <Badge className={cn(
                                  "text-xs",
                                  game.gameType === 'GC' ? 'bg-gold text-black' : 'bg-green-600 text-white'
                                )}>
                                  {game.gameType}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-white">{game.amount}</TableCell>
                              <TableCell>
                                <Badge className={cn(
                                  "text-xs",
                                  game.result === 'win' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                                )}>
                                  {game.result}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-gray-300 text-sm">
                                {formatDate(game.timestamp)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Controls Tab */}
              <TabsContent value="controls" className="space-y-4">
                <Card className="bg-card/80 backdrop-blur-sm border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Admin Controls</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Balance Reset Section */}
                    <div className="p-4 bg-black/20 rounded-lg border border-white/10">
                      <h3 className="text-white font-bold mb-4 flex items-center">
                        <Coins className="mr-2 h-5 w-5 text-gold" />
                        Reset User Balance
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <Label htmlFor="userId" className="text-white">User ID</Label>
                          <Input
                            id="userId"
                            value={selectedUserId}
                            onChange={(e) => setSelectedUserId(e.target.value)}
                            className="bg-black/20 border-white/20 text-white"
                            placeholder="Enter user ID"
                          />
                        </div>
                        <div>
                          <Label htmlFor="gcAmount" className="text-white">Gold Coins (GC)</Label>
                          <Input
                            id="gcAmount"
                            type="number"
                            value={gcAmount}
                            onChange={(e) => setGcAmount(Number(e.target.value))}
                            className="bg-black/20 border-white/20 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="scAmount" className="text-white">Sweeps Coins (SC)</Label>
                          <Input
                            id="scAmount"
                            type="number"
                            value={scAmount}
                            onChange={(e) => setScAmount(Number(e.target.value))}
                            className="bg-black/20 border-white/20 text-white"
                          />
                        </div>
                      </div>
                      
                      <Button 
                        onClick={resetUserBalance}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Reset Balance
                      </Button>
                    </div>

                    {/* System Controls */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-black/20 rounded-lg border border-white/10">
                        <h4 className="text-white font-medium mb-3">Game Controls</h4>
                        <div className="space-y-2">
                          <Button variant="outline" className="w-full border-white text-white hover:bg-white hover:text-black">
                            Pause All Games
                          </Button>
                          <Button variant="outline" className="w-full border-white text-white hover:bg-white hover:text-black">
                            Adjust Odds
                          </Button>
                          <Button variant="outline" className="w-full border-white text-white hover:bg-white hover:text-black">
                            Trigger Jackpot
                          </Button>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-black/20 rounded-lg border border-white/10">
                        <h4 className="text-white font-medium mb-3">System Maintenance</h4>
                        <div className="space-y-2">
                          <Button variant="outline" className="w-full border-white text-white hover:bg-white hover:text-black">
                            Clear Cache
                          </Button>
                          <Button variant="outline" className="w-full border-white text-white hover:bg-white hover:text-black">
                            Backup Database
                          </Button>
                          <Button variant="outline" className="w-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
                            Emergency Stop
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Reports Tab */}
              <TabsContent value="reports" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-card/80 backdrop-blur-sm border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white">Financial Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Total Revenue (Month):</span>
                        <span className="text-green-400 font-bold">{formatCurrency(adminStats.revenueMonth)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Total Payouts:</span>
                        <span className="text-red-400 font-bold">{formatCurrency(adminStats.totalPayouts)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Net Profit:</span>
                        <span className="text-gold font-bold">
                          {formatCurrency(adminStats.revenueMonth - adminStats.totalPayouts)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Profit Margin:</span>
                        <span className="text-white font-bold">
                          {Math.round(((adminStats.revenueMonth - adminStats.totalPayouts) / adminStats.revenueMonth) * 100)}%
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/80 backdrop-blur-sm border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white">Export Reports</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button variant="outline" className="w-full border-white text-white hover:bg-white hover:text-black">
                        <Calendar className="mr-2 h-4 w-4" />
                        Daily Report (CSV)
                      </Button>
                      <Button variant="outline" className="w-full border-white text-white hover:bg-white hover:text-black">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Financial Report (PDF)
                      </Button>
                      <Button variant="outline" className="w-full border-white text-white hover:bg-white hover:text-black">
                        <Users className="mr-2 h-4 w-4" />
                        User Activity Report
                      </Button>
                      <Button variant="outline" className="w-full border-white text-white hover:bg-white hover:text-black">
                        <Gamepad2 className="mr-2 h-4 w-4" />
                        Game Performance Report
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
