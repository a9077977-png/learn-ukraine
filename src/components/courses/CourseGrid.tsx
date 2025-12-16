import { CourseCard } from './CourseCard';
import type { Course, Enrollment } from '@/types/database';
import { Loader2 } from 'lucide-react';

interface CourseGridProps {
  courses: Course[];
  enrollments?: Enrollment[];
  loading?: boolean;
  showProgress?: boolean;
  emptyMessage?: string;
}

export function CourseGrid({ 
  courses, 
  enrollments = [],
  loading, 
  showProgress,
  emptyMessage = 'Курси не знайдено' 
}: CourseGridProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course, index) => {
        const enrollment = enrollments.find(e => e.course_id === course.id);
        return (
          <div 
            key={course.id} 
            className="animate-fade-in opacity-0"
            style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
          >
            <CourseCard 
              course={course} 
              showProgress={showProgress}
              progress={enrollment?.progress_percent}
            />
          </div>
        );
      })}
    </div>
  );
}
