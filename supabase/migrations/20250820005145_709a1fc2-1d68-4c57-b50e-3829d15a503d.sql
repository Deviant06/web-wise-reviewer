-- Remove the public read policy that exposes all student data
DROP POLICY IF EXISTS "Anyone can view quiz results" ON public.quiz_results;

-- Keep the insert policy so students can still submit their quiz results
-- This policy already exists: "Anyone can insert quiz results"

-- Add a new policy that only allows viewing a specific result by ID
-- This enables secure verification if needed in the future
CREATE POLICY "View specific quiz result by ID" ON public.quiz_results
FOR SELECT USING (
  -- Only allow viewing if the exact ID is provided
  -- This prevents bulk data access while allowing specific record verification
  true
);

-- Actually, let's be more restrictive - remove the above policy for now
DROP POLICY IF EXISTS "View specific quiz result by ID" ON public.quiz_results;

-- The table now has:
-- 1. INSERT policy: Students can submit results
-- 2. NO SELECT policy: No one can view results (protecting student privacy)
-- This fixes the security issue while maintaining functionality