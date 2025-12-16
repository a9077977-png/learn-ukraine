import { BookOpen, Video, FileText, Award, MessageCircle, Clock } from 'lucide-react';

const features = [
  {
    icon: Video,
    title: 'Відеоуроки',
    description: 'Якісні відеоуроки від практикуючих спеціалістів',
  },
  {
    icon: FileText,
    title: 'PDF матеріали',
    description: 'Додаткові текстові матеріали для кращого засвоєння',
  },
  {
    icon: BookOpen,
    title: 'Тести та завдання',
    description: 'Перевіряйте свої знання після кожного модуля',
  },
  {
    icon: MessageCircle,
    title: 'Підтримка викладача',
    description: 'Пряме спілкування з викладачем курсу',
  },
  {
    icon: Award,
    title: 'Сертифікати',
    description: 'Отримуйте сертифікат після завершення курсу',
  },
  {
    icon: Clock,
    title: 'Гнучкий графік',
    description: 'Навчайтеся у зручний для вас час',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Чому обирають нас
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Ми створили платформу, яка робить онлайн-навчання ефективним та захоплюючим
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="group p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/20 hover:shadow-lg transition-all duration-300 animate-fade-in opacity-0"
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
            >
              <div className="w-14 h-14 rounded-xl gradient-hero flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <feature.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-xl mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
