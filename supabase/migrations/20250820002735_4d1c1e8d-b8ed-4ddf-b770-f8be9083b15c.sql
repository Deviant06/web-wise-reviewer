-- Create quiz_results table for storing student quiz data
CREATE TABLE public.quiz_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name TEXT NOT NULL,
  section TEXT NOT NULL,
  subject TEXT NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  percentage INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (no authentication required)
CREATE POLICY "Anyone can view quiz results" 
ON public.quiz_results 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert quiz results" 
ON public.quiz_results 
FOR INSERT 
WITH CHECK (true);

-- Create index for better performance when querying by student and subject
CREATE INDEX idx_quiz_results_student_subject ON public.quiz_results(student_name, subject, completed_at DESC);