import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Crown, ArrowLeft } from 'lucide-react';
import SpinWheel from '@/components/SpinWheel';
import AuthModal from '@/components/AuthModal';

export default function SpinWheelPage() {
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

      {/* Content */}
      <div className="py-12">
        <SpinWheel />
      </div>
    </div>
  );
}
