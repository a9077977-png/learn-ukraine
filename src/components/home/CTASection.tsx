import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-20">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl gradient-hero p-12 md:p-16">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
          
          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Безкоштовна реєстрація
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Готові почати навчання?
            </h2>
            
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Приєднуйтесь до тисяч студентів, які вже навчаються на нашій платформі. 
              Отримайте доступ до якісних курсів українською мовою.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                asChild 
                className="h-14 px-8 text-base gap-2"
              >
                <Link to="/auth?tab=signup">
                  Зареєструватися безкоштовно
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                asChild 
                className="h-14 px-8 text-base bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                <Link to="/courses">
                  Переглянути курси
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
