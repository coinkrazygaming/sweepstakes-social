import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, ArrowLeft, Sparkles } from 'lucide-react';
import AuthModal from '@/components/AuthModal';

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export default function PlaceholderPage({ 
  title, 
  description, 
  icon = <Sparkles className="h-12 w-12 text-gold" /> 
}: PlaceholderPageProps) {
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
              <Button variant="outline" className="border-gold text-gold hover:bg-gold hover:text-black">
                Login
              </Button>
              <Button className="bg-gold text-black hover:bg-gold-dark font-medium">
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
        <Card className="bg-card/80 backdrop-blur-sm border-white/10 max-w-md w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {icon}
            </div>
            <CardTitle className="text-2xl text-white">{title}</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6 text-center">
            <p className="text-gray-300">
              {description}
            </p>
            
            <div className="space-y-3">
              <p className="text-sm text-gray-400">
                This page is coming soon! Continue exploring other features or return to the homepage.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  asChild 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-black"
                >
                  <Link to="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                  </Link>
                </Button>
                
                <Button 
                  asChild 
                  className="bg-gold text-black hover:bg-gold-dark font-medium"
                >
                  <Link to="/spin-wheel">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Try Spin Wheel
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
