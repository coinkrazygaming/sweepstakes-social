import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search,
  Star,
  TrendingUp,
  Coins,
  Crown,
  Filter,
  Play,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PragmaticSlot, PragmaticSlotsResponse, UserProfile } from '@shared/api';

interface PragmaticSlotsGalleryProps {
  onPlayGame?: (gameId: string, gameType: 'GC' | 'SC') => void;
}

export default function PragmaticSlotsGallery({ onPlayGame }: PragmaticSlotsGalleryProps) {
  const [slots, setSlots] = useState<PragmaticSlot[]>([]);
  const [filteredSlots, setFilteredSlots] = useState<PragmaticSlot[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    loadSlots();
    loadUserProfile();
  }, []);

  useEffect(() => {
    filterAndSortSlots();
  }, [slots, searchTerm, selectedCategory, sortBy]);

  const loadSlots = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/pragmatic/slots');
      const data: PragmaticSlotsResponse = await response.json();
      setSlots(data.slots);
      setCategories(['all', ...data.categories]);
    } catch (error) {
      console.error('Failed to load slots:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async () => {
    try {
      const response = await fetch('/api/user/profile');
      const profile: UserProfile = await response.json();
      setUserProfile(profile);
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
  };

  const filterAndSortSlots = () => {
    let filtered = [...slots];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(slot =>
        slot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        slot.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(slot => slot.category === selectedCategory);
    }

    // Sort
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
        break;
      case 'rtp':
        filtered.sort((a, b) => b.rtp - a.rtp);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    setFilteredSlots(filtered);
  };

  const handlePlayGame = async (gameId: string, gameType: 'GC' | 'SC') => {
    if (onPlayGame) {
      onPlayGame(gameId, gameType);
    } else {
      // Default behavior - simulate play
      try {
        const response = await fetch('/api/pragmatic/play', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            gameId,
            gameType,
            amount: gameType === 'GC' ? 100 : 1,
            userId: 'demo-user'
          })
        });
        
        const result = await response.json();
        
        if (result.success) {
          alert(`${result.result === 'win' ? '🎉 You Won!' : '😔 Better luck next time!'} ${result.result === 'win' ? `+${result.winAmount} ${gameType}` : ''}`);
          loadUserProfile(); // Refresh balance
        } else {
          alert(result.error || 'Game failed');
        }
      } catch (error) {
        console.error('Game play error:', error);
        alert('Failed to play game');
      }
    }
  };

  const SlotCard = ({ slot }: { slot: PragmaticSlot }) => (
    <Card className="bg-card/80 backdrop-blur-sm border-white/10 hover:border-gold/50 transition-all duration-300 hover:scale-105 group overflow-hidden">
      <div className="relative">
        {/* Thumbnail */}
        <div className="aspect-square relative overflow-hidden">
          <img
            src={slot.thumbnail}
            alt={slot.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
            onError={(e) => {
              // Fallback image if thumbnail fails to load
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
          
          {/* Overlay badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {slot.isNew && (
              <Badge className="bg-green-500 text-white text-xs">NEW</Badge>
            )}
            {slot.isPopular && (
              <Badge className="bg-red-500 text-white text-xs">🔥 HOT</Badge>
            )}
          </div>
          
          {/* RTP Badge */}
          <div className="absolute top-2 right-2">
            <Badge className="bg-black/70 text-white text-xs">
              RTP {slot.rtp}%
            </Badge>
          </div>
          
          {/* Max Win Badge */}
          <div className="absolute bottom-2 right-2">
            <Badge className="bg-gold text-black text-xs font-bold">
              Max {slot.maxWin}
            </Badge>
          </div>
        </div>
        
        {/* Game Info */}
        <CardContent className="p-4 space-y-3">
          <div>
            <h3 className="text-white font-bold text-sm mb-1 truncate">{slot.name}</h3>
            <div className="flex items-center justify-between text-xs">
              <Badge variant="outline" className="border-gray-500 text-gray-300">
                {slot.category}
              </Badge>
              <span className="text-gray-400">{slot.volatility} Vol.</span>
            </div>
          </div>
          
          {/* Features */}
          <div className="flex flex-wrap gap-1">
            {slot.features.slice(0, 2).map((feature, index) => (
              <Badge key={index} className="bg-purple/20 text-purple text-xs px-2 py-1">
                {feature}
              </Badge>
            ))}
            {slot.features.length > 2 && (
              <Badge className="bg-gray-500/20 text-gray-400 text-xs px-2 py-1">
                +{slot.features.length - 2}
              </Badge>
            )}
          </div>
          
          {/* Play Buttons */}
          <div className="space-y-2 pt-2">
            {/* Play for Fun (GC) */}
            <Button
              onClick={() => handlePlayGame(slot.id, 'GC')}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium text-sm py-2"
              disabled={!userProfile || userProfile.gcBalance < 100}
            >
              <Coins className="mr-2 h-4 w-4" />
              Play For Fun (GC)!
            </Button>
            
            {/* Play with Real (SC) */}
            <Button
              onClick={() => handlePlayGame(slot.id, 'SC')}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium text-sm py-2"
              disabled={!userProfile || userProfile.scBalance < 1}
            >
              <Crown className="mr-2 h-4 w-4" />
              Play with REAL (SC)!
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>
          <p className="text-gray-300">Loading slots...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Balance Display */}
      {userProfile && (
        <Card className="bg-gradient-to-r from-purple/20 to-blue/20 border-purple/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gold">
                    {userProfile.gcBalance.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-300">Gold Coins (GC)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {userProfile.scBalance.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-300">Sweeps Coins (SC)</div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-lg font-bold text-white">Level {userProfile.level}</div>
                <div className="text-sm text-gray-300">{userProfile.username}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Filters and Search */}
      <Card className="bg-card/80 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Filter className="mr-2 h-5 w-5 text-gold" />
            Pragmatic Play Slots
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search slots..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black/20 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
            
            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-black/20 border-white/20 text-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-black/20 border-white/20 text-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="rtp">Highest RTP</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Results Count */}
            <div className="flex items-center justify-center">
              <Badge className="bg-gold text-black">
                {filteredSlots.length} games
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Slots Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {filteredSlots.map((slot) => (
          <SlotCard key={slot.id} slot={slot} />
        ))}
      </div>

      {/* No Results */}
      {filteredSlots.length === 0 && (
        <Card className="bg-card/80 backdrop-blur-sm border-white/10">
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-4">🎰</div>
            <h3 className="text-xl font-bold text-white mb-2">No slots found</h3>
            <p className="text-gray-300">Try adjusting your search or filters</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
