/*
  # Add Organizer and Detailed Description to Events Table

  1. New Columns
    - `organizer` (text) - Name of the event organizer
    - `detailed_about` (text) - Detailed description about the event
    - `user_id` (uuid, foreign key) - Reference to user who created the event
  
  2. Updated Security
    - Add policy for authenticated users to update their own events
    - Add policy for authenticated users to delete their own events

  3. Important Notes
    - These columns are optional (nullable) to support existing events
    - user_id allows tracking of event ownership for edit/delete operations
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'organizer'
  ) THEN
    ALTER TABLE events ADD COLUMN organizer text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'detailed_about'
  ) THEN
    ALTER TABLE events ADD COLUMN detailed_about text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE events ADD COLUMN user_id uuid;
  END IF;
END $$;

DROP POLICY IF EXISTS "Authenticated users can update own events" ON events;
DROP POLICY IF EXISTS "Authenticated users can delete own events" ON events;

CREATE POLICY "Authenticated users can update own events"
  ON events
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can delete own events"
  ON events
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
