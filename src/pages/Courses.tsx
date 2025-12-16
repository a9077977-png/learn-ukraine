import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { CourseGrid } from '@/components/courses/CourseGrid';
import { CourseFilters } from '@/components/courses/CourseFilters';
import { supabase } from '@/integrations/supabase/client';
import type { Course, CourseCategory, CourseLevel } from '@/types/database';

const CoursesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState<CourseCategory | 'all'>(
    (searchParams.get('category') as CourseCategory) || 'all'
  );
  const [level, setLevel] = useState<CourseLevel | 'all'>(
    (searchParams.get('level') as CourseLevel) || 'all'
  );

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('courses')
        .select(`
          *,
          teacher:profiles!courses_teacher_id_fkey(*)
        `)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (data) {
        setCourses(data as unknown as Course[]);
      }
      setLoading(false);
    };

    fetchCourses();
  }, []);

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category !== 'all') params.set('category', category);
    if (level !== 'all') params.set('level', level);
    setSearchParams(params, { replace: true });
  }, [search, category, level, setSearchParams]);

  // Filtered courses
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        !search ||
        course.title.toLowerCase().includes(search.toLowerCase()) ||
        course.description?.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'all' || course.category === category;
      const matchesLevel = level === 'all' || course.level === level;

      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [courses, search, category, level]);

  const handleReset = () => {
    setSearch('');
    setCategory('all');
    setLevel('all');
  };

  return (
    <Layout>
      <div className="py-12">
        <div className="container">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Каталог курсів
            </h1>
            <p className="text-muted-foreground text-lg">
              Знайдіть курс, який підходить саме вам
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8">
            <CourseFilters
              search={search}
              onSearchChange={setSearch}
              category={category}
              onCategoryChange={setCategory}
              level={level}
              onLevelChange={setLevel}
              onReset={handleReset}
            />
          </div>

          {/* Results count */}
          {!loading && (
            <p className="text-muted-foreground mb-6">
              Знайдено курсів: {filteredCourses.length}
            </p>
          )}

          {/* Course grid */}
          <CourseGrid
            courses={filteredCourses}
            loading={loading}
            emptyMessage="За вашим запитом курсів не знайдено"
          />
        </div>
      </div>
    </Layout>
  );
};

export default CoursesPage;
