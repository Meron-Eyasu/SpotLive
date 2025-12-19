/*
  # Create Events Table for ShowGo Platform

  1. New Tables
    - `events`
      - `id` (uuid, primary key) - Unique identifier for each event
      - `name` (text) - Event name/title
      - `description` (text) - Event description
      - `location` (text) - City and state/country
      - `venue` (text) - Venue name
      - `date` (text) - Event date (e.g., "August 25")
      - `time` (text) - Event time (e.g., "8:00 PM")
      - `category` (text) - Event category (e.g., "Rock", "Jazz", "Electronic")
      - `image_url` (text) - URL to event image
      - `created_at` (timestamptz) - Timestamp of record creation

  2. Security
    - Enable RLS on `events` table
    - Add policy for public read access (no auth required for browsing events)
    - Add policy for authenticated users to insert events (for future admin functionality)
*/

CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  location text NOT NULL,
  venue text NOT NULL,
  date text NOT NULL,
  time text NOT NULL,
  category text NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view events"
  ON events
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert events"
  ON events
  FOR INSERT
  TO authenticated
  WITH CHECK (true);