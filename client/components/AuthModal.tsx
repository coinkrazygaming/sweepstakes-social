import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Crown,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Chrome,
  Facebook,
} from "lucide-react";

interface AuthModalProps {
  children: React.ReactNode;
}

export default function AuthModal({ children }: AuthModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // In real app, handle login logic here
      console.log("Login:", loginForm);
    }, 1500);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupForm.password !== signupForm.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // In real app, handle signup logic here
      console.log("Signup:", signupForm);
    }, 1500);
  };

  const handleSocialAuth = (provider: string) => {
    setIsLoading(true);

    // Simulate social auth
    setTimeout(() => {
      setIsLoading(false);
      console.log(`${provider} auth`);
    }, 1000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-md bg-card border-white/10">
        <DialogTitle className="sr-only">Authentication</DialogTitle>
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-2">
            <Crown className="h-8 w-8 text-gold animate-pulse-glow" />
            <span className="text-2xl font-bold text-white">PrizeHub</span>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-black/20">
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-gold data-[state=active]:text-black"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="data-[state=active]:bg-gold data-[state=active]:text-black"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-white">Welcome Back</CardTitle>
                <CardDescription className="text-gray-300">
                  Sign in to continue winning prizes
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Social Login */}
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white hover:text-black"
                    onClick={() => handleSocialAuth("Google")}
                    disabled={isLoading}
                  >
                    <Chrome className="mr-2 h-4 w-4" />
                    Continue with Google
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-blue-600 hover:text-white hover:border-blue-600"
                    onClick={() => handleSocialAuth("Facebook")}
                    disabled={isLoading}
                  >
                    <Facebook className="mr-2 h-4 w-4" />
                    Continue with Facebook
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full bg-white/20" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-gray-400">
                      Or continue with email
                    </span>
                  </div>
                </div>

                {/* Email Login Form */}
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-white">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10 bg-black/20 border-white/20 text-white placeholder:text-gray-400"
                        value={loginForm.email}
                        onChange={(e) =>
                          setLoginForm({ ...loginForm, email: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-white">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="pl-10 pr-10 bg-black/20 border-white/20 text-white placeholder:text-gray-400"
                        value={loginForm.password}
                        onChange={(e) =>
                          setLoginForm({
                            ...loginForm,
                            password: e.target.value,
                          })
                        }
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 text-gray-400 hover:text-white"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gold text-black hover:bg-gold-dark font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>

                <p className="text-center text-sm text-gray-400">
                  <button className="text-gold hover:underline">
                    Forgot your password?
                  </button>
                </p>
              </CardContent>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-white">Join PrizeHub</CardTitle>
                <CardDescription className="text-gray-300">
                  Create an account and start winning today
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Social Signup */}
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white hover:text-black"
                    onClick={() => handleSocialAuth("Google")}
                    disabled={isLoading}
                  >
                    <Chrome className="mr-2 h-4 w-4" />
                    Sign up with Google
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-blue-600 hover:text-white hover:border-blue-600"
                    onClick={() => handleSocialAuth("Facebook")}
                    disabled={isLoading}
                  >
                    <Facebook className="mr-2 h-4 w-4" />
                    Sign up with Facebook
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full bg-white/20" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-gray-400">
                      Or create account with email
                    </span>
                  </div>
                </div>

                {/* Email Signup Form */}
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-white">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Enter your full name"
                        className="pl-10 bg-black/20 border-white/20 text-white placeholder:text-gray-400"
                        value={signupForm.name}
                        onChange={(e) =>
                          setSignupForm({ ...signupForm, name: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-white">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10 bg-black/20 border-white/20 text-white placeholder:text-gray-400"
                        value={signupForm.email}
                        onChange={(e) =>
                          setSignupForm({
                            ...signupForm,
                            email: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-white">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        className="pl-10 pr-10 bg-black/20 border-white/20 text-white placeholder:text-gray-400"
                        value={signupForm.password}
                        onChange={(e) =>
                          setSignupForm({
                            ...signupForm,
                            password: e.target.value,
                          })
                        }
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 text-gray-400 hover:text-white"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm" className="text-white">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-confirm"
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        className="pl-10 bg-black/20 border-white/20 text-white placeholder:text-gray-400"
                        value={signupForm.confirmPassword}
                        onChange={(e) =>
                          setSignupForm({
                            ...signupForm,
                            confirmPassword: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gold text-black hover:bg-gold-dark font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>

                <p className="text-center text-xs text-gray-400">
                  By signing up, you agree to our{" "}
                  <button className="text-gold hover:underline">
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button className="text-gold hover:underline">
                    Privacy Policy
                  </button>
                </p>
              </CardContent>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
