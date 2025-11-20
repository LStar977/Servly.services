import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, X, LayoutDashboard, LogOut, User, Search, Home, PlusCircle } from "lucide-react";
import { useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAuthPage = location.startsWith("/auth");

  if (isAuthPage) {
    return <main>{children}</main>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background pb-16 md:pb-0">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 text-white"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              </svg>
            </div>
            <span className="font-heading font-bold text-xl tracking-tight text-foreground">Servly</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/search">
              <span className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                Find a Service
              </span>
            </Link>
            <Link href="/for-business">
              <span className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                For Business
              </span>
            </Link>
          </nav>

          {/* Auth / User Menu (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={`/${user.role}/dashboard`} className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">Log in</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">Get Started</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle (only for logged out state on mobile, or "more" menu) */}
          {!user && (
             <button
               className="md:hidden p-2"
               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
             >
               {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
             </button>
          )}
        </div>

        {/* Mobile Menu (Logged Out) */}
        {isMobileMenuOpen && !user && (
          <div className="md:hidden border-t p-4 bg-background space-y-4">
            <nav className="flex flex-col gap-4">
              <Link href="/search">
                <span className="text-sm font-medium py-2 block" onClick={() => setIsMobileMenuOpen(false)}>
                  Find a Service
                </span>
              </Link>
              <Link href="/for-business">
                <span className="text-sm font-medium py-2 block" onClick={() => setIsMobileMenuOpen(false)}>
                  For Business
                </span>
              </Link>
              <div className="border-t pt-4 flex flex-col gap-2">
                <Link href="/auth/login">
                  <Button className="w-full" variant="secondary" onClick={() => setIsMobileMenuOpen(false)}>Log in</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="w-full" onClick={() => setIsMobileMenuOpen(false)}>Get Started</Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="hidden md:block bg-muted/30 border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-6 w-6 rounded-md bg-primary flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-3.5 h-3.5 text-white"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  </svg>
                </div>
                <span className="font-heading font-bold text-lg tracking-tight">Servly</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Connecting you with trusted local professionals for all your home and lifestyle needs.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/search?c=cleaning">Home Cleaning</Link></li>
                <li><Link href="/search?c=plumbing">Plumbing</Link></li>
                <li><Link href="/search?c=electrical">Electrical</Link></li>
                <li><Link href="/search?c=moving">Moving</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about">About Us</Link></li>
                <li><Link href="/careers">Careers</Link></li>
                <li><Link href="/blog">Blog</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">For Pros</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/auth/signup?role=provider">Become a Provider</Link></li>
                <li><Link href="/resources">Success Stories</Link></li>
                <li><Link href="/provider-support">Provider Support</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Servly Inc. All rights reserved.
            </p>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/terms">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t h-16 z-40 flex items-center justify-around px-2 pb-safe-area">
        <Link href="/">
          <div className={`flex flex-col items-center justify-center w-16 h-full ${location === '/' ? 'text-primary' : 'text-muted-foreground'}`}>
            <Home className="h-5 w-5 mb-1" />
            <span className="text-[10px] font-medium">Home</span>
          </div>
        </Link>
        
        <Link href="/search">
          <div className={`flex flex-col items-center justify-center w-16 h-full ${location.startsWith('/search') ? 'text-primary' : 'text-muted-foreground'}`}>
            <Search className="h-5 w-5 mb-1" />
            <span className="text-[10px] font-medium">Search</span>
          </div>
        </Link>

        {user ? (
           <>
             <Link href={`/${user.role}/dashboard`}>
               <div className={`flex flex-col items-center justify-center w-16 h-full ${location.includes('dashboard') ? 'text-primary' : 'text-muted-foreground'}`}>
                 <LayoutDashboard className="h-5 w-5 mb-1" />
                 <span className="text-[10px] font-medium">Dash</span>
               </div>
             </Link>
             
             <Link href="/profile">
                <div className={`flex flex-col items-center justify-center w-16 h-full ${location === '/profile' ? 'text-primary' : 'text-muted-foreground'}`}>
                  <User className="h-5 w-5 mb-1" />
                  <span className="text-[10px] font-medium">Profile</span>
                </div>
             </Link>
             
             <div 
               className="flex flex-col items-center justify-center w-16 h-full text-muted-foreground cursor-pointer"
               onClick={logout}
             >
               <LogOut className="h-5 w-5 mb-1" />
               <span className="text-[10px] font-medium">Logout</span>
             </div>
           </>
        ) : (
           <Link href="/auth/login">
             <div className={`flex flex-col items-center justify-center w-16 h-full ${location.startsWith('/auth') ? 'text-primary' : 'text-muted-foreground'}`}>
               <User className="h-5 w-5 mb-1" />
               <span className="text-[10px] font-medium">Log in</span>
             </div>
           </Link>
        )}
      </div>
    </div>
  );
}
