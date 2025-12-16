import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CourseGrid } from '@/components/courses/CourseGrid';
import { ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { Course } from '@/types/database';

export function FeaturedCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      const { data } = await supabase
        .from('courses')
        .select(`
          *,
          teacher:profiles!courses_teacher_id_fkey(*)
        `)
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (data) {
        setCourses(data as unknown as Course[]);
      }
      setLoading(false);
    };

    fetchCourses();
  }, []);

  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Популярні курси
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Обирайте серед найпопулярніших курсів платформи та розпочніть навчання вже сьогодні
            </p>
          </div>
          <Button asChild variant="outline" className="gap-2 shrink-0">
            <Link to="/courses">
              Всі курси
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <CourseGrid 
          courses={courses} 
          loading={loading}
          emptyMessage="Курси скоро з'являться"
        />
      </div>
    </section>
  );
}
