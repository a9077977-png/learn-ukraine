import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GraduationCap, Mail, Lock, User, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Введіть коректну email адресу'),
  password: z.string().min(6, 'Пароль має містити мінімум 6 символів'),
});

const signupSchema = z.object({
  fullName: z.string().min(2, 'Ім\'я має містити мінімум 2 символи'),
  email: z.string().email('Введіть коректну email адресу'),
  password: z.string().min(6, 'Пароль має містити мінімум 6 символів'),
});

const AuthPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, signIn, signUp } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'login');
  const [loading, setLoading] = useState(false);

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  // Errors
  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});
  const [signupErrors, setSignupErrors] = useState<Record<string, string>>({});

  const redirectTo = searchParams.get('redirect') || '/dashboard';

  useEffect(() => {
    if (user) {
      navigate(redirectTo, { replace: true });
    }
  }, [user, navigate, redirectTo]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginErrors({});

    const result = loginSchema.safeParse({ email: loginEmail, password: loginPassword });
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });
      setLoginErrors(errors);
      return;
    }

    setLoading(true);
    const { error } = await signIn(loginEmail, loginPassword);
    setLoading(false);

    if (error) {
      toast({
        title: 'Помилка входу',
        description: error.message === 'Invalid login credentials' 
          ? 'Невірний email або пароль' 
          : error.message,
        variant: 'destructive',
      });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupErrors({});

    const result = signupSchema.safeParse({ 
      fullName: signupName, 
      email: signupEmail, 
      password: signupPassword 
    });
    
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });
      setSignupErrors(errors);
      return;
    }

    setLoading(true);
    const { error } = await signUp(signupEmail, signupPassword, signupName);
    setLoading(false);

    if (error) {
      if (error.message.includes('already registered')) {
        toast({
          title: 'Помилка реєстрації',
          description: 'Користувач з таким email вже зареєстрований',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Помилка реєстрації',
          description: error.message,
          variant: 'destructive',
        });
      }
    } else {
      toast({
        title: 'Успішна реєстрація!',
        description: 'Ви можете увійти у свій акаунт',
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border/40">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="hidden sm:inline">EduPlatform</span>
          </Link>
          <Button variant="ghost" asChild>
            <Link to="/" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              На головну
            </Link>
          </Button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-xl border-border/50">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl">Ласкаво просимо!</CardTitle>
              <CardDescription>
                Увійдіть або створіть акаунт, щоб продовжити
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Вхід</TabsTrigger>
                  <TabsTrigger value="signup">Реєстрація</TabsTrigger>
                </TabsList>

                {/* Login Tab */}
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="email@example.com"
                          className="pl-10"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                        />
                      </div>
                      {loginErrors.email && (
                        <p className="text-sm text-destructive">{loginErrors.email}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-password">Пароль</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="login-password"
                          type="password"
                          placeholder="••••••••"
                          className="pl-10"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                        />
                      </div>
                      {loginErrors.password && (
                        <p className="text-sm text-destructive">{loginErrors.password}</p>
                      )}
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={loading}>
                      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      Увійти
                    </Button>
                  </form>
                </TabsContent>

                {/* Signup Tab */}
                <TabsContent value="signup">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Повне ім'я</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="Іван Петренко"
                          className="pl-10"
                          value={signupName}
                          onChange={(e) => setSignupName(e.target.value)}
                        />
                      </div>
                      {signupErrors.fullName && (
                        <p className="text-sm text-destructive">{signupErrors.fullName}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="email@example.com"
                          className="pl-10"
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                        />
                      </div>
                      {signupErrors.email && (
                        <p className="text-sm text-destructive">{signupErrors.email}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Пароль</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="••••••••"
                          className="pl-10"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                        />
                      </div>
                      {signupErrors.password && (
                        <p className="text-sm text-destructive">{signupErrors.password}</p>
                      )}
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={loading}>
                      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      Зареєструватися
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Реєструючись, ви погоджуєтесь з{' '}
            <Link to="/terms" className="underline hover:text-foreground">
              умовами використання
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
