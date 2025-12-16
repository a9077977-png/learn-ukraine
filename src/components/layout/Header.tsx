import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { GraduationCap, Menu, X, User, LogOut, BookOpen, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function Header() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 glass">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="hidden sm:inline">EduPlatform</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            to="/courses" 
            className="text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            Каталог курсів
          </Link>
          {user && (
            <Link 
              to="/dashboard" 
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              Мій кабінет
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name || 'User'} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(profile?.full_name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium">{profile?.full_name || 'Користувач'}</p>
                  <p className="text-xs text-muted-foreground">{profile?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Мій кабінет
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/my-courses')}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  Мої курси
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  Профіль
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Вийти
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link to="/auth">Увійти</Link>
              </Button>
              <Button asChild>
                <Link to="/auth?tab=signup">Реєстрація</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background animate-slide-up">
          <nav className="container py-4 flex flex-col gap-2">
            <Link 
              to="/courses" 
              className="px-4 py-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Каталог курсів
            </Link>
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="px-4 py-2 rounded-lg hover:bg-muted transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Мій кабінет
                </Link>
                <Link 
                  to="/my-courses" 
                  className="px-4 py-2 rounded-lg hover:bg-muted transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Мої курси
                </Link>
                <button 
                  className="px-4 py-2 rounded-lg hover:bg-muted transition-colors text-left text-destructive"
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                >
                  Вийти
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 px-4 pt-2">
                <Button variant="outline" asChild className="w-full">
                  <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>Увійти</Link>
                </Button>
                <Button asChild className="w-full">
                  <Link to="/auth?tab=signup" onClick={() => setMobileMenuOpen(false)}>Реєстрація</Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
