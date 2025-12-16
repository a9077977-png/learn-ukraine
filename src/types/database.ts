export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';
export type CourseCategory = 'web_development' | 'programming' | 'design' | 'data_science' | 'marketing' | 'business';
export type UserRole = 'student' | 'teacher' | 'admin';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  title: string;
  description: string | null;
  short_description: string | null;
  thumbnail_url: string | null;
  category: CourseCategory;
  level: CourseLevel;
  teacher_id: string | null;
  duration_hours: number;
  total_lessons: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  teacher?: Profile;
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  pdf_url: string | null;
  order_index: number;
  duration_minutes: number;
  created_at: string;
  updated_at: string;
}

export interface Test {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  passing_score: number;
  order_index: number;
  created_at: string;
}

export interface TestQuestion {
  id: string;
  test_id: string;
  question: string;
  options: string[];
  correct_answer: number;
  order_index: number;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
  completed_at: string | null;
  progress_percent: number;
  course?: Course;
}

export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  completed_at: string | null;
}

export interface TestResult {
  id: string;
  user_id: string;
  test_id: string;
  score: number;
  passed: boolean;
  answers: Record<string, number> | null;
  completed_at: string;
}

export interface CourseReview {
  id: string;
  user_id: string;
  course_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  profile?: Profile;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  course_id: string | null;
  content: string;
  read: boolean;
  created_at: string;
}

export const CATEGORY_LABELS: Record<CourseCategory, string> = {
  web_development: 'Веб-розробка',
  programming: 'Програмування',
  design: 'Дизайн',
  data_science: 'Data Science',
  marketing: 'Маркетинг',
  business: 'Бізнес',
};

export const LEVEL_LABELS: Record<CourseLevel, string> = {
  beginner: 'Початковий',
  intermediate: 'Середній',
  advanced: 'Просунутий',
};

export const LEVEL_COLORS: Record<CourseLevel, string> = {
  beginner: 'bg-success/10 text-success',
  intermediate: 'bg-warning/10 text-warning',
  advanced: 'bg-destructive/10 text-destructive',
};
