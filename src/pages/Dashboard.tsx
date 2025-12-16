import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CourseGrid } from '@/components/courses/CourseGrid';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import type { Course, Enrollment } from '@/types/database';
import { 
  BookOpen, Clock, Award, TrendingUp, ArrowRight, 
  Loader2, GraduationCap, MessageCircle
} from 'lucide-react';

const DashboardPage = () => {
  const { user, profile, role, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth?redirect=/dashboard');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      // Fetch enrollments with courses
      const { data: enrollmentsData } = await supabase
        .from('enrollments')
        .select(`
          *,
          course:courses(
            *,
            teacher:profiles!courses_teacher_id_fkey(*)
          )
        `)
        .eq('user_id', user.id)
        .order('enrolled_at', { ascending: false });

      if (enrollmentsData) {
        setEnrollments(enrollmentsData as unknown as Enrollment[]);
        setCourses(enrollmentsData.map(e => (e as any).course).filter(Boolean) as Course[]);
      }

      setLoading(false);
    };

    fetchData();
  }, [user]);

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  const completedCourses = enrollments.filter(e => e.completed_at);
  const activeCourses = enrollments.filter(e => !e.completed_at);
  const totalProgress = enrollments.length > 0 
    ? Math.round(enrollments.reduce((acc, e) => acc + e.progress_percent, 0) / enrollments.length)
    : 0;

  return (
    <Layout>
      <div className="py-8 md:py-12">
        <div className="container">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Вітаємо, {profile?.full_name || 'Студент'}!
            </h1>
            <p className="text-muted-foreground">
              Ось ваша статистика навчання
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="card-hover">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{enrollments.length}</p>
                    <p className="text-sm text-muted-foreground">Всього курсів</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{activeCourses.length}</p>
                    <p className="text-sm text-muted-foreground">В процесі</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                    <Award className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{completedCourses.length}</p>
                    <p className="text-sm text-muted-foreground">Завершено</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{totalProgress}%</p>
                    <p className="text-sm text-muted-foreground">Середній прогрес</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* My Courses */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Мої курси</h2>
              <Button variant="outline" asChild className="gap-2">
                <Link to="/courses">
                  Знайти курси
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>

            {courses.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <GraduationCap className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Ви ще не записані на жоден курс</h3>
                  <p className="text-muted-foreground mb-4">
                    Перегляньте каталог та оберіть курс, який вас цікавить
                  </p>
                  <Button asChild>
                    <Link to="/courses">Переглянути курси</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <CourseGrid 
                courses={courses} 
                enrollments={enrollments}
                showProgress 
              />
            )}
          </div>

          {/* Quick Actions */}
          {(role === 'teacher' || role === 'admin') && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Панель викладача</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="card-hover cursor-pointer" onClick={() => navigate('/teacher/courses')}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold">Мої курси</p>
                        <p className="text-sm text-muted-foreground">Керування курсами</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-hover cursor-pointer" onClick={() => navigate('/teacher/students')}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <p className="font-semibold">Студенти</p>
                        <p className="text-sm text-muted-foreground">Перегляд прогресу</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-hover cursor-pointer" onClick={() => navigate('/messages')}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                        <MessageCircle className="w-6 h-6 text-warning" />
                      </div>
                      <div>
                        <p className="font-semibold">Повідомлення</p>
                        <p className="text-sm text-muted-foreground">Спілкування зі студентами</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
