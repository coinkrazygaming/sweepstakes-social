import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Crown, ArrowLeft, Gamepad2 } from 'lucide-react';
import PragmaticSlotsGallery from '@/components/PragmaticSlotsGallery';
import AuthModal from '@/components/AuthModal';

export default function PragmaticSlotsPage() {
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
              <Link to="/dashboard" className="text-white hover:text-gold transition-colors">
                Dashboard
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
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Gamepad2 className="h-12 w-12 text-gold mr-4" />
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              Pragmatic Play
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-yellow-400 to-gold block">
                Slots Gallery
              </span>
            </h1>
          </div>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Play premium slots with both Gold Coins (GC) for fun and Sweeps Coins (SC) for real prizes. 
            Featuring the latest releases from Pragmatic Play!
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <div className="flex items-center space-x-2 bg-red-600/20 rounded-full px-4 py-2 border border-red-500/30">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-300 font-medium">Play for Fun with GC</span>
            </div>
            <div className="flex items-center space-x-2 bg-green-600/20 rounded-full px-4 py-2 border border-green-500/30">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-300 font-medium">Play for Real with SC</span>
            </div>
          </div>
        </div>
      </section>

      {/* Slots Gallery */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <PragmaticSlotsGallery />
        </div>
      </section>
    </div>
  );
}
