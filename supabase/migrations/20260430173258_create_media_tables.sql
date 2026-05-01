/*
  # Create media tables for sister's photos and videos

  1. New Tables
    - `photos`
      - `id` (uuid, primary key)
      - `title` (text, caption for the photo)
      - `image_url` (text, URL to the stored image)
      - `category` (text, e.g. 'nature', 'aesthetic', 'dreamy')
      - `liked` (boolean, whether the photo is liked)
      - `created_at` (timestamptz)
    - `videos`
      - `id` (uuid, primary key)
      - `title` (text, title of the video)
      - `video_url` (text, URL to the stored video)
      - `thumbnail_url` (text, URL to the video thumbnail)
      - `duration` (text, video duration display string)
      - `category` (text, e.g. 'lifestyle', 'aesthetic', 'selfcare', 'fashion')
      - `featured` (boolean, whether this is the featured video)
      - `liked` (boolean, whether the video is liked)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Allow anyone to read (public site)
    - Only authenticated users can insert/update/delete
*/

CREATE TABLE IF NOT EXISTS photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  image_url text NOT NULL,
  category text NOT NULL DEFAULT 'aesthetic',
  liked boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view photos"
  ON photos FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can add photos"
  ON photos FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update photos"
  ON photos FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete photos"
  ON photos FOR DELETE
  TO authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  video_url text NOT NULL,
  thumbnail_url text DEFAULT '',
  duration text DEFAULT '0:00',
  category text NOT NULL DEFAULT 'lifestyle',
  featured boolean DEFAULT false,
  liked boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view videos"
  ON videos FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can add videos"
  ON videos FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update videos"
  ON videos FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete videos"
  ON videos FOR DELETE
  TO authenticated
  USING (true);
