-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert default categories
INSERT INTO categories (name, icon, color, description) VALUES
  ('Alimentaire', '🍽️', 'bg-orange-100 text-orange-700', 'Missions liées à la distribution alimentaire et aux repas'),
  ('Social', '😊', 'bg-green-100 text-green-700', 'Missions d''accompagnement et de soutien social'),
  ('Environnement', '🌱', 'bg-emerald-100 text-emerald-700', 'Missions de protection de l''environnement et de développement durable'),
  ('Éducation', '📚', 'bg-purple-100 text-purple-700', 'Missions de soutien scolaire et d''éducation'),
  ('Santé', '🏥', 'bg-red-100 text-red-700', 'Missions liées à la santé et au bien-être'),
  ('Culture', '🎨', 'bg-blue-100 text-blue-700', 'Missions culturelles et artistiques'),
  ('Sport', '⚽', 'bg-yellow-100 text-yellow-700', 'Missions sportives et activités physiques');

-- Add RLS policies
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Categories are insertable by authenticated users" ON categories
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Categories are updatable by authenticated users" ON categories
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Categories are deletable by authenticated users" ON categories
  FOR DELETE USING (auth.role() = 'authenticated'); 