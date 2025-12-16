import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl">
              <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-primary-foreground" />
              </div>
              <span>EduPlatform</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Українська платформа онлайн-освіти. Навчайтеся новому разом з найкращими викладачами.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="font-semibold">Навігація</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/courses" className="text-muted-foreground hover:text-foreground transition-colors">
                  Каталог курсів
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  Про нас
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Контакти
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="font-semibold">Категорії</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/courses?category=web_development" className="text-muted-foreground hover:text-foreground transition-colors">
                  Веб-розробка
                </Link>
              </li>
              <li>
                <Link to="/courses?category=programming" className="text-muted-foreground hover:text-foreground transition-colors">
                  Програмування
                </Link>
              </li>
              <li>
                <Link to="/courses?category=design" className="text-muted-foreground hover:text-foreground transition-colors">
                  Дизайн
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold">Контакти</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                support@eduplatform.ua
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                +380 (44) 123-45-67
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                Київ, Україна
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} EduPlatform. Всі права захищено.
          </p>
          <div className="flex gap-4 text-sm">
            <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
              Політика конфіденційності
            </Link>
            <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
              Умови використання
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
