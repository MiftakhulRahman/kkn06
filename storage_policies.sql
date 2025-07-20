-- Storage policies untuk bucket 'media'
-- Jalankan di Supabase SQL Editor

-- Policy untuk mengizinkan authenticated users upload ke bucket media
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'media' AND 
  auth.role() = 'authenticated'
);

-- Policy untuk mengizinkan authenticated users update file mereka sendiri
CREATE POLICY "Allow authenticated updates" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'media' AND 
  auth.role() = 'authenticated'
);

-- Policy untuk mengizinkan public read dari bucket media
CREATE POLICY "Allow public read" ON storage.objects
FOR SELECT USING (
  bucket_id = 'media'
);

-- Policy untuk mengizinkan authenticated users delete file mereka sendiri
CREATE POLICY "Allow authenticated deletes" ON storage.objects
FOR DELETE USING (
  bucket_id = 'media' AND 
  auth.role() = 'authenticated'
); 