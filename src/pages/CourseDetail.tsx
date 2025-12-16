import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Clock, BookOpen, User, PlayCircle, FileText, CheckCircle2, 
  ArrowLeft, Star, Users, Award, Loader2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { Course, Lesson, Test, Enrollment } from '@/types/database';
import { CATEGORY_LABELS, LEVEL_LABELS, LEVEL_COLORS } from '@/types/database';

const CourseDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      // Fetch course
      const { data: courseData } = await supabase
        .from('courses')
        .select(`
          *,
          teacher:profiles!courses_teacher_id_fkey(*)
        `)
        .eq('id', id)
        .maybeSingle();

      if (courseData) {
        setCourse(courseData as unknown as Course);
      }

      // Fetch lessons
      const { data: lessonsData } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', id)
        .order('order_index');

      if (lessonsData) {
        setLessons(lessonsData as Lesson[]);
      }

      // Fetch tests
      const { data: testsData } = await supabase
        .from('tests')
        .select('*')
        .eq('course_id', id)
        .order('order_index');

      if (testsData) {
        setTests(testsData as Test[]);
      }

      // Check enrollment
      if (user) {
        const { data: enrollmentData } = await supabase
          .from('enrollments')
          .select('*')
          .eq('course_id', id)
          .eq('user_id', user.id)
          .maybeSingle();

        if (enrollmentData) {
          setEnrollment(enrollmentData as Enrollment);
        }
      }

      setLoading(false);
    };

    fetchData();
  }, [id, user]);

  const handleEnroll = async () => {
    if (!user) {
      navigate('/auth?redirect=' + encodeURIComponent(`/courses/${id}`));
      return;
    }

    setEnrolling(true);
    const { error } = await supabase
      .from('enrollments')
      .insert({
        user_id: user.id,
        course_id: id,
      });

    if (error) {
      toast({
        title: 'Помилка',
        description: 'Не вдалося записатися на курс',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Успішно!',
        description: 'Ви записалися на курс',
      });
      setEnrollment({
        id: '',
        user_id: user.id,
        course_id: id!,
        enrolled_at: new Date().toISOString(),
        completed_at: null,
        progress_percent: 0,
      });
    }
    setEnrolling(false);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!course) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Курс не знайдено</h1>
          <Button asChild>
            <Link to="/courses">Повернутися до каталогу</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-muted/50 to-background py-12">
        <div className="container">
          <Button 
            variant="ghost" 
            className="mb-6 gap-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4" />
            Назад
          </Button>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{CATEGORY_LABELS[course.category]}</Badge>
                <Badge className={LEVEL_COLORS[course.level]}>{LEVEL_LABELS[course.level]}</Badge>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold">{course.title}</h1>
              
              <p className="text-lg text-muted-foreground">
                {course.description}
              </p>

              <div className="flex flex-wrap gap-6 text-sm">
                <span className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  {course.duration_hours} годин
                </span>
                <span className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-muted-foreground" />
                  {lessons.length} уроків
                </span>
                <span className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                  {tests.length} тестів
                </span>
              </div>

              {/* Teacher */}
              {course.teacher && (
                <div className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border/50">
                  <Avatar className="w-14 h-14">
                    <AvatarImage src={course.teacher.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(course.teacher.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm text-muted-foreground">Викладач</p>
                    <p className="font-semibold">{course.teacher.full_name}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 shadow-lg">
                {course.thumbnail_url ? (
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                    <img 
                      src={course.thumbnail_url} 
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-video gradient-hero rounded-t-lg flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-primary-foreground/80" />
                  </div>
                )}
                <CardContent className="p-6 space-y-4">
                  {enrollment ? (
                    <>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Ваш прогрес</span>
                          <span className="font-medium">{enrollment.progress_percent}%</span>
                        </div>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ width: `${enrollment.progress_percent}%` }} 
                          />
                        </div>
                      </div>
                      <Button className="w-full" size="lg" asChild>
                        <Link to={`/courses/${course.id}/learn`}>
                          Продовжити навчання
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="text-center py-2">
                        <p className="text-3xl font-bold text-success">Безкоштовно</p>
                      </div>
                      <Button 
                        className="w-full" 
                        size="lg"
                        onClick={handleEnroll}
                        disabled={enrolling}
                      >
                        {enrolling && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Записатися на курс
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-12">
        <div className="container">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold mb-6">Програма курсу</h2>
            
            {lessons.length === 0 ? (
              <p className="text-muted-foreground">Уроки ще не додані</p>
            ) : (
              <Accordion type="single" collapsible className="space-y-4">
                {lessons.map((lesson, index) => (
                  <AccordionItem 
                    key={lesson.id} 
                    value={lesson.id}
                    className="bg-card border border-border/50 rounded-xl px-6"
                  >
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-center gap-4 text-left">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary shrink-0">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{lesson.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {lesson.duration_minutes} хв
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <p className="text-muted-foreground mb-4">
                        {lesson.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {lesson.video_url && (
                          <Badge variant="outline" className="gap-1">
                            <PlayCircle className="w-3 h-3" />
                            Відео
                          </Badge>
                        )}
                        {lesson.pdf_url && (
                          <Badge variant="outline" className="gap-1">
                            <FileText className="w-3 h-3" />
                            PDF
                          </Badge>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}

            {/* Tests */}
            {tests.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Тести</h3>
                <div className="space-y-3">
                  {tests.map((test) => (
                    <div 
                      key={test.id}
                      className="flex items-center gap-4 p-4 bg-card border border-border/50 rounded-xl"
                    >
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium">{test.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Прохідний бал: {test.passing_score}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CourseDetailPage;
