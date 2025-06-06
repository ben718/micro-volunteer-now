-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  avatar TEXT,
  level TEXT NOT NULL,
  missions_count INTEGER NOT NULL DEFAULT 0,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create global_stats table
CREATE TABLE IF NOT EXISTS global_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  total_missions INTEGER NOT NULL DEFAULT 0,
  total_volunteers INTEGER NOT NULL DEFAULT 0,
  total_hours INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert initial global stats
INSERT INTO global_stats (total_missions, total_volunteers, total_hours)
VALUES (0, 0, 0)
ON CONFLICT DO NOTHING;

-- Add RLS policies for testimonials
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Testimonials are viewable by everyone" ON testimonials
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own testimonials" ON testimonials
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own testimonials" ON testimonials
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own testimonials" ON testimonials
  FOR DELETE USING (auth.uid() = user_id);

-- Add RLS policies for global_stats
ALTER TABLE global_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Global stats are viewable by everyone" ON global_stats
  FOR SELECT USING (true);

CREATE POLICY "Global stats are updatable by authenticated users" ON global_stats
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create function to update global stats
CREATE OR REPLACE FUNCTION update_global_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update total missions
  UPDATE global_stats
  SET total_missions = (SELECT COUNT(*) FROM missions WHERE status = 'completed');
  
  -- Update total volunteers
  UPDATE global_stats
  SET total_volunteers = (SELECT COUNT(DISTINCT user_id) FROM mission_participants);
  
  -- Update total hours
  UPDATE global_stats
  SET total_hours = (SELECT COALESCE(SUM(duration), 0) FROM missions WHERE status = 'completed');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update global stats
CREATE TRIGGER update_stats_on_mission_complete
  AFTER UPDATE OF status ON missions
  FOR EACH ROW
  WHEN (NEW.status = 'completed')
  EXECUTE FUNCTION update_global_stats();

CREATE TRIGGER update_stats_on_participant_add
  AFTER INSERT ON mission_participants
  FOR EACH ROW
  EXECUTE FUNCTION update_global_stats(); 