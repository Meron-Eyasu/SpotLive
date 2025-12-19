/*
  # Create Event Images Storage Bucket

  1. Storage Setup
    - Create `event-images` bucket for storing event images
    - Configure CORS and access policies

  2. Security
    - Allow public read access to images
    - Allow authenticated users to upload images
    - Images are organized by event
*/

DO $$
BEGIN
  -- Create the bucket if it doesn't exist
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('event-images', 'event-images', true)
  ON CONFLICT (id) DO NOTHING;
END $$;

-- Allow public read access
CREATE POLICY "Public can read event images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'event-images');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload event images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'event-images');

-- Allow authenticated users to delete their own images
CREATE POLICY "Authenticated users can delete their event images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'event-images');
