-- Make user_id nullable to allow anonymous uploads
ALTER TABLE public.files ALTER COLUMN user_id DROP NOT NULL;

-- Drop existing RLS policies
DROP POLICY IF EXISTS "Users can view their own files" ON public.files;
DROP POLICY IF EXISTS "Users can upload their own files" ON public.files;
DROP POLICY IF EXISTS "Users can update their own files" ON public.files;
DROP POLICY IF EXISTS "Users can delete their own files" ON public.files;

-- Create new RLS policies that support both authenticated and anonymous users
CREATE POLICY "Anyone can upload files"
ON public.files
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can view files"
ON public.files
FOR SELECT
USING (true);

CREATE POLICY "Users can update their own files"
ON public.files
FOR UPDATE
USING (
  (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  OR (user_id IS NULL)
);

CREATE POLICY "Users can delete their own files"
ON public.files
FOR DELETE
USING (
  (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  OR (user_id IS NULL)
);

-- Update storage policies to allow anonymous uploads
DROP POLICY IF EXISTS "Users can upload files" ON storage.objects;
DROP POLICY IF EXISTS "Users can view files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete files" ON storage.objects;

CREATE POLICY "Anyone can upload files"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'files');

CREATE POLICY "Anyone can view files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'files');

CREATE POLICY "Anyone can delete files"
ON storage.objects
FOR DELETE
USING (bucket_id = 'files');