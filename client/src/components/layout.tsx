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
import { Menu, X, LayoutDashboard, LogOut, User } from "lucide-react";
import { useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAuthPage = location ? location.startsWith("/auth") : false;

  if (isAuthPage) {
    return <main>{children}</main>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-heading font-bold text-xl leading-none">S</span>
            </div>
            <span className="font-heading font-bold text-xl tracking-tight text-foreground">Servly</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/how-it-works">
              <span className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                How it Works
              </span>
            </Link>
            <Link href="/for-business">
              <span className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                For Business
              </span>
            </Link>
            <Link href="/about">
              <span className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                About
              </span>
            </Link>
            <Link href="/contact">
              <span className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                Contact
              </span>
            </Link>
            {user?.role === 'admin' && (
              <Link href="/admin/dashboard">
                <span className="text-sm font-medium text-primary hover:text-primary/80 transition-colors cursor-pointer font-semibold">
                  Admin
                </span>
              </Link>
            )}
          </nav>

          {/* Auth / User Menu */}
          <div className="hidden md:flex items-center gap-4">
            {user && user.name ? (
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
                      <p className="text-sm font-medium leading-none">{user.name || 'User'}</p>
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

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t p-4 bg-background space-y-4">
            <nav className="flex flex-col gap-4">
              <Link href="/how-it-works">
                <span className="text-sm font-medium py-2 block" onClick={() => setIsMobileMenuOpen(false)}>
                  How it Works
                </span>
              </Link>
              <Link href="/for-business">
                <span className="text-sm font-medium py-2 block" onClick={() => setIsMobileMenuOpen(false)}>
                  For Business
                </span>
              </Link>
              <Link href="/about">
                <span className="text-sm font-medium py-2 block" onClick={() => setIsMobileMenuOpen(false)}>
                  About
                </span>
              </Link>
              <Link href="/contact">
                <span className="text-sm font-medium py-2 block" onClick={() => setIsMobileMenuOpen(false)}>
                  Contact
                </span>
              </Link>
              <div className="border-t pt-4 flex flex-col gap-2">
                {user && user.role ? (
                  <>
                    {user.role === 'admin' && (
                      <Link href="/admin/dashboard">
                        <Button className="w-full justify-start text-primary font-semibold" variant="ghost" onClick={() => setIsMobileMenuOpen(false)}>
                          Admin
                        </Button>
                      </Link>
                    )}
                    <Link href={`/${user.role}/dashboard`}>
                       <Button className="w-full justify-start" variant="ghost" onClick={() => setIsMobileMenuOpen(false)}>
                          <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                       </Button>
                    </Link>
                    <Button className="w-full justify-start text-red-600" variant="ghost" onClick={() => { logout(); setIsMobileMenuOpen(false); }}>
                       <LogOut className="mr-2 h-4 w-4" /> Log out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login">
                      <Button className="w-full" variant="secondary" onClick={() => setIsMobileMenuOpen(false)}>Log in</Button>
                    </Link>
                    <Link href="/auth/signup">
                      <Button className="w-full" onClick={() => setIsMobileMenuOpen(false)}>Get Started</Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-muted/30 border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-6 w-6 rounded-md bg-primary flex items-center justify-center">
                  <span className="text-white font-heading font-bold text-sm leading-none">S</span>
                </div>
                <span className="font-heading font-bold text-lg tracking-tight">Servly</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your world of services, simplified. Book trusted local professionals in minutes.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Explore</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/how-it-works">How it Works</Link></li>
                <li><Link href="/search">Find a Pro</Link></li>
                <li><Link href="/about">About Us</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">For Business</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/for-business">Benefits</Link></li>
                <li><Link href="/auth/signup?role=provider">Join as Provider</Link></li>
                <li><Link href="/for-business">Success Stories</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/legal">Terms of Use</Link></li>
                <li><Link href="/legal">Privacy Policy</Link></li>
                <li><Link href="/legal">Provider Agreement</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Servly Inc. All rights reserved.
            </p>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <Link href="/legal">Privacy Policy</Link>
              <Link href="/legal">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
