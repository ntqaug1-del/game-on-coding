-- Create enum for student ranks
CREATE TYPE public.student_rank AS ENUM ('Bạc', 'Vàng', 'Bạch Kim', 'Kim Cương', 'Cao Thủ');

-- Create classes table
CREATE TABLE public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create students table
CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  avatar_url TEXT,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
  score INTEGER DEFAULT 1000,
  rank student_rank DEFAULT 'Bạc',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a utility app)
CREATE POLICY "Allow public access to classes" ON public.classes FOR ALL USING (true);
CREATE POLICY "Allow public access to students" ON public.students FOR ALL USING (true);

-- Function to calculate rank based on score
CREATE OR REPLACE FUNCTION public.calculate_rank(score_value INTEGER)
RETURNS student_rank
LANGUAGE SQL
IMMUTABLE
AS $$
  SELECT CASE
    WHEN score_value >= 2100 THEN 'Cao Thủ'::student_rank
    WHEN score_value >= 1800 THEN 'Kim Cương'::student_rank
    WHEN score_value >= 1500 THEN 'Bạch Kim'::student_rank
    WHEN score_value >= 1200 THEN 'Vàng'::student_rank
    ELSE 'Bạc'::student_rank
  END;
$$;

-- Function to update rank when score changes
CREATE OR REPLACE FUNCTION public.update_student_rank()
RETURNS TRIGGER AS $$
BEGIN
  NEW.rank = public.calculate_rank(NEW.score);
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update rank when score changes
CREATE TRIGGER update_student_rank_trigger
  BEFORE INSERT OR UPDATE OF score ON public.students
  FOR EACH ROW
  EXECUTE FUNCTION public.update_student_rank();

-- Create storage bucket for student avatars
INSERT INTO storage.buckets (id, name, public) 
VALUES ('student-avatars', 'student-avatars', true);

-- Storage policies for student avatars
CREATE POLICY "Allow public read access to student avatars" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'student-avatars');

CREATE POLICY "Allow public upload to student avatars" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'student-avatars');

CREATE POLICY "Allow public update to student avatars" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'student-avatars');

CREATE POLICY "Allow public delete to student avatars" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'student-avatars');