import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Users, BookOpen, Award } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-hero opacity-5" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="container relative py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Нові курси щотижня
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Навчайтеся{' '}
              <span className="gradient-text">онлайн</span>
              <br />
              з найкращими викладачами
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg">
              Отримайте нові навички у веб-розробці, програмуванні та дизайні. 
              Якісні курси українською мовою від практикуючих фахівців.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="h-14 px-8 text-base gap-2">
                <Link to="/courses">
                  Переглянути курси
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-14 px-8 text-base gap-2">
                <Link to="/auth?tab=signup">
                  <Play className="w-5 h-5" />
                  Почати безкоштовно
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-2xl">10,000+</p>
                  <p className="text-sm text-muted-foreground">Студентів</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="font-bold text-2xl">50+</p>
                  <p className="text-sm text-muted-foreground">Курсів</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                  <Award className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="font-bold text-2xl">95%</p>
                  <p className="text-sm text-muted-foreground">Задоволених</p>
                </div>
              </div>
            </div>
          </div>

          {/* Illustration */}
          <div className="relative hidden lg:block animate-fade-in delay-200">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Decorative elements */}
              <div className="absolute inset-0 gradient-hero rounded-3xl rotate-6 opacity-20" />
              <div className="absolute inset-0 bg-card rounded-3xl shadow-2xl border border-border/50 overflow-hidden">
                <div className="p-8 h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-3 h-3 rounded-full bg-destructive" />
                    <div className="w-3 h-3 rounded-full bg-warning" />
                    <div className="w-3 h-3 rounded-full bg-success" />
                  </div>
                  
                  {/* Mock course content */}
                  <div className="space-y-4 flex-1">
                    <div className="h-4 bg-muted rounded-full w-3/4" />
                    <div className="h-4 bg-muted rounded-full w-1/2" />
                    <div className="h-32 bg-primary/5 rounded-xl flex items-center justify-center mt-6">
                      <Play className="w-12 h-12 text-primary/40" />
                    </div>
                    <div className="space-y-2 mt-6">
                      <div className="h-3 bg-muted rounded-full w-full" />
                      <div className="h-3 bg-muted rounded-full w-5/6" />
                      <div className="h-3 bg-muted rounded-full w-4/6" />
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="mt-auto pt-6 border-t border-border">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Прогрес курсу</span>
                      <span className="font-medium">65%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: '65%' }} />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating cards */}
              <div className="absolute -right-8 top-20 bg-card p-4 rounded-xl shadow-lg border border-border animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                    <Award className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Сертифікат</p>
                    <p className="text-xs text-muted-foreground">Отримано!</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -left-8 bottom-32 bg-card p-4 rounded-xl shadow-lg border border-border animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">15 уроків</p>
                    <p className="text-xs text-muted-foreground">Веб-розробка</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
