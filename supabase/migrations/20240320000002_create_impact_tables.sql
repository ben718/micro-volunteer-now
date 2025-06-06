-- Table pour les statistiques utilisateur
CREATE TABLE user_stats (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  missions_completed INTEGER DEFAULT 0,
  associations_helped INTEGER DEFAULT 0,
  time_volunteered INTEGER DEFAULT 0, -- en minutes
  points_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table pour les badges
CREATE TABLE badges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  requirement_type TEXT NOT NULL, -- 'missions', 'time', 'associations', 'points'
  requirement_value INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table de liaison pour les badges gagnés
CREATE TABLE user_badges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, badge_id)
);

-- Fonction pour mettre à jour les statistiques utilisateur
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Mettre à jour les statistiques lors de la complétion d'une mission
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    UPDATE user_stats
    SET 
      missions_completed = missions_completed + 1,
      time_volunteered = time_volunteered + NEW.duration,
      points_earned = points_earned + NEW.points,
      updated_at = NOW()
    WHERE user_id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour les statistiques
CREATE TRIGGER update_user_stats_trigger
AFTER UPDATE ON mission_participants
FOR EACH ROW
EXECUTE FUNCTION update_user_stats();

-- Fonction pour vérifier et attribuer les badges
CREATE OR REPLACE FUNCTION check_and_award_badges()
RETURNS TRIGGER AS $$
DECLARE
  badge_record RECORD;
BEGIN
  -- Vérifier tous les badges pour lesquels l'utilisateur n'a pas encore gagné
  FOR badge_record IN 
    SELECT b.* 
    FROM badges b
    WHERE NOT EXISTS (
      SELECT 1 FROM user_badges ub 
      WHERE ub.user_id = NEW.user_id AND ub.badge_id = b.id
    )
  LOOP
    -- Vérifier si l'utilisateur remplit les critères pour le badge
    IF (
      (badge_record.requirement_type = 'missions' AND NEW.missions_completed >= badge_record.requirement_value) OR
      (badge_record.requirement_type = 'time' AND NEW.time_volunteered >= badge_record.requirement_value) OR
      (badge_record.requirement_type = 'associations' AND NEW.associations_helped >= badge_record.requirement_value) OR
      (badge_record.requirement_type = 'points' AND NEW.points_earned >= badge_record.requirement_value)
    ) THEN
      -- Attribuer le badge
      INSERT INTO user_badges (user_id, badge_id)
      VALUES (NEW.user_id, badge_record.id);
    END IF;
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour vérifier les badges
CREATE TRIGGER check_badges_trigger
AFTER UPDATE ON user_stats
FOR EACH ROW
EXECUTE FUNCTION check_and_award_badges();

-- Insérer quelques badges par défaut
INSERT INTO badges (name, description, icon, color, requirement_type, requirement_value) VALUES
  ('Premier pas', 'Complétez votre première mission', '🌟', 'bg-yellow-500', 'missions', 1),
  ('Ponctuel', 'Donnez 60 minutes de votre temps', '⏰', 'bg-blue-500', 'time', 60),
  ('Solidaire', 'Aidez 3 associations différentes', '🤝', 'bg-green-500', 'associations', 3),
  ('Expert', 'Complétez 10 missions', '🏆', 'bg-purple-500', 'missions', 10),
  ('Maître', 'Gagnez 1000 points', '👑', 'bg-red-500', 'points', 1000);

-- Politiques de sécurité
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- Politiques pour user_stats
CREATE POLICY "Les utilisateurs peuvent voir leurs propres statistiques"
  ON user_stats FOR SELECT
  USING (auth.uid() = user_id);

-- Politiques pour badges
CREATE POLICY "Tout le monde peut voir les badges"
  ON badges FOR SELECT
  TO authenticated
  USING (true);

-- Politiques pour user_badges
CREATE POLICY "Les utilisateurs peuvent voir leurs propres badges"
  ON user_badges FOR SELECT
  USING (auth.uid() = user_id); 