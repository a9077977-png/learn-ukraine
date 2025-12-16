import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, BookOpen, Star, User } from 'lucide-react';
import type { Course } from '@/types/database';
import { CATEGORY_LABELS, LEVEL_LABELS, LEVEL_COLORS } from '@/types/database';

interface CourseCardProps {
  course: Course;
  showProgress?: boolean;
  progress?: number;
}

export function CourseCard({ course, showProgress, progress = 0 }: CourseCardProps) {
  return (
    <Card className="overflow-hidden card-hover group h-full flex flex-col">
      <div className="relative aspect-video overflow-hidden bg-muted">
        {course.thumbnail_url ? (
          <img 
            src={course.thumbnail_url} 
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full gradient-hero flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-primary-foreground/80" />
          </div>
        )}
        <Badge 
          className={`absolute top-3 left-3 ${LEVEL_COLORS[course.level]}`}
          variant="secondary"
        >
          {LEVEL_LABELS[course.level]}
        </Badge>
      </div>

      <CardContent className="p-5 flex-1 flex flex-col">
        <Badge variant="outline" className="w-fit mb-3 text-xs">
          {CATEGORY_LABELS[course.category]}
        </Badge>
        
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {course.title}
        </h3>
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-1">
          {course.short_description || course.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {course.duration_hours} год
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            {course.total_lessons} уроків
          </span>
        </div>

        {course.teacher && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {course.teacher.full_name}
            </span>
          </div>
        )}

        {showProgress && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Прогрес</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <Button asChild className="w-full">
          <Link to={`/courses/${course.id}`}>
            {showProgress ? 'Продовжити навчання' : 'Детальніше'}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
