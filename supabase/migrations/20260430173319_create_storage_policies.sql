/*
  # Create storage policies for photo and video uploads

  1. Storage Buckets
    - `photos` bucket (public) - for storing photo images
    - `videos` bucket (public) - for storing video files

  2. Security
    - Anyone can view files in both buckets (public site)
    - Only authenticated users can upload/update/delete files
*/

-- Photos bucket policies
CREATE POLICY "Anyone can view photos"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'photos');

CREATE POLICY "Authenticated users can upload photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'photos');

CREATE POLICY "Authenticated users can update photos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'photos')
  WITH CHECK (bucket_id = 'photos');

CREATE POLICY "Authenticated users can delete photos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'photos');

-- Videos bucket policies
CREATE POLICY "Anyone can view videos"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'videos');

CREATE POLICY "Authenticated users can upload videos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'videos');

CREATE POLICY "Authenticated users can update videos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'videos')
  WITH CHECK (bucket_id = 'videos');

CREATE POLICY "Authenticated users can delete videos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'videos');
