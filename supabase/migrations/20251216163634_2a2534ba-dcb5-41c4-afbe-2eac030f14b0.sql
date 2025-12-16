-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('student', 'teacher', 'admin');

-- Create enum for course level
CREATE TYPE public.course_level AS ENUM ('beginner', 'intermediate', 'advanced');

-- Create enum for course category
CREATE TYPE public.course_category AS ENUM ('web_development', 'programming', 'design', 'data_science', 'marketing', 'business');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'student',
  UNIQUE (user_id, role)
);

-- Create courses table
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  thumbnail_url TEXT,
  category course_category NOT NULL,
  level course_level NOT NULL DEFAULT 'beginner',
  teacher_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  duration_hours INTEGER DEFAULT 0,
  total_lessons INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create lessons table
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  pdf_url TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  duration_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tests table
CREATE TABLE public.tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  passing_score INTEGER DEFAULT 70,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create test_questions table
CREATE TABLE public.test_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id UUID REFERENCES public.tests(id) ON DELETE CASCADE NOT NULL,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer INTEGER NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0
);

-- Create enrollments table
CREATE TABLE public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  progress_percent INTEGER DEFAULT 0,
  UNIQUE (user_id, course_id)
);

-- Create lesson_progress table
CREATE TABLE public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE (user_id, lesson_id)
);

-- Create test_results table
CREATE TABLE public.test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  test_id UUID REFERENCES public.tests(id) ON DELETE CASCADE NOT NULL,
  score INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  answers JSONB,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create course_reviews table
CREATE TABLE public.course_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, course_id)
);

-- Create messages table for student-teacher communication
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Security definer function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to get user's primary role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles WHERE user_id = _user_id LIMIT 1
$$;

-- RLS Policies for profiles
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for user_roles (only admins can modify)
CREATE POLICY "Roles viewable by owner and admins" ON public.user_roles FOR SELECT USING (
  auth.uid() = user_id OR public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Admins can insert roles" ON public.user_roles FOR INSERT WITH CHECK (
  public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Admins can update roles" ON public.user_roles FOR UPDATE USING (
  public.has_role(auth.uid(), 'admin')
);

-- RLS Policies for courses
CREATE POLICY "Published courses are viewable by everyone" ON public.courses FOR SELECT USING (
  is_published = true OR teacher_id = auth.uid() OR public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Teachers can insert courses" ON public.courses FOR INSERT WITH CHECK (
  public.has_role(auth.uid(), 'teacher') OR public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Teachers can update own courses" ON public.courses FOR UPDATE USING (
  teacher_id = auth.uid() OR public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Admins can delete courses" ON public.courses FOR DELETE USING (
  public.has_role(auth.uid(), 'admin')
);

-- RLS Policies for lessons
CREATE POLICY "Lessons viewable for enrolled users" ON public.lessons FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.courses c
    WHERE c.id = course_id AND (
      c.is_published = true OR c.teacher_id = auth.uid() OR public.has_role(auth.uid(), 'admin')
    )
  )
);
CREATE POLICY "Teachers can manage lessons" ON public.lessons FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.courses c
    WHERE c.id = course_id AND (c.teacher_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  )
);

-- RLS Policies for tests
CREATE POLICY "Tests viewable for enrolled users" ON public.tests FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.courses c
    WHERE c.id = course_id AND (
      c.is_published = true OR c.teacher_id = auth.uid() OR public.has_role(auth.uid(), 'admin')
    )
  )
);
CREATE POLICY "Teachers can manage tests" ON public.tests FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.courses c
    WHERE c.id = course_id AND (c.teacher_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  )
);

-- RLS Policies for test_questions
CREATE POLICY "Questions viewable with test access" ON public.test_questions FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.tests t
    JOIN public.courses c ON c.id = t.course_id
    WHERE t.id = test_id AND (
      c.is_published = true OR c.teacher_id = auth.uid() OR public.has_role(auth.uid(), 'admin')
    )
  )
);
CREATE POLICY "Teachers can manage questions" ON public.test_questions FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.tests t
    JOIN public.courses c ON c.id = t.course_id
    WHERE t.id = test_id AND (c.teacher_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  )
);

-- RLS Policies for enrollments
CREATE POLICY "Users can view own enrollments" ON public.enrollments FOR SELECT USING (
  user_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM public.courses c WHERE c.id = course_id AND c.teacher_id = auth.uid()) OR
  public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Users can enroll themselves" ON public.enrollments FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own enrollments" ON public.enrollments FOR UPDATE USING (user_id = auth.uid());

-- RLS Policies for lesson_progress
CREATE POLICY "Users can view own progress" ON public.lesson_progress FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own progress" ON public.lesson_progress FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own progress" ON public.lesson_progress FOR UPDATE USING (user_id = auth.uid());

-- RLS Policies for test_results
CREATE POLICY "Users can view own results" ON public.test_results FOR SELECT USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.tests t
    JOIN public.courses c ON c.id = t.course_id
    WHERE t.id = test_id AND c.teacher_id = auth.uid()
  ) OR
  public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Users can insert own results" ON public.test_results FOR INSERT WITH CHECK (user_id = auth.uid());

-- RLS Policies for reviews
CREATE POLICY "Reviews are viewable by everyone" ON public.course_reviews FOR SELECT USING (true);
CREATE POLICY "Users can insert own reviews" ON public.course_reviews FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own reviews" ON public.course_reviews FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own reviews" ON public.course_reviews FOR DELETE USING (user_id = auth.uid());

-- RLS Policies for messages
CREATE POLICY "Users can view own messages" ON public.messages FOR SELECT USING (
  sender_id = auth.uid() OR receiver_id = auth.uid()
);
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (sender_id = auth.uid());
CREATE POLICY "Users can update own messages" ON public.messages FOR UPDATE USING (receiver_id = auth.uid());

-- Trigger to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
  
  -- Default role is student
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'student');
  
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON public.lessons
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();