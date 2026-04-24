
-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Progress
CREATE TABLE public.player_progress (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  unlocked_level INT NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.player_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Progress viewable by owner" ON public.player_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Progress insert by owner" ON public.player_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Progress update by owner" ON public.player_progress FOR UPDATE USING (auth.uid() = user_id);

-- Leaderboard scores
CREATE TABLE public.leaderboard_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  score NUMERIC NOT NULL,
  category TEXT NOT NULL DEFAULT 'tap',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.leaderboard_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Scores readable by everyone" ON public.leaderboard_scores FOR SELECT USING (true);
CREATE POLICY "Users insert own scores" ON public.leaderboard_scores FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own scores" ON public.leaderboard_scores FOR DELETE USING (auth.uid() = user_id);

-- Game Builder projects
CREATE TABLE public.game_builder_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.game_builder_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "GB owner select" ON public.game_builder_projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "GB owner insert" ON public.game_builder_projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "GB owner update" ON public.game_builder_projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "GB owner delete" ON public.game_builder_projects FOR DELETE USING (auth.uid() = user_id);

-- Game Maker files
CREATE TABLE public.game_maker_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  path TEXT NOT NULL,
  content TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, path)
);
ALTER TABLE public.game_maker_files ENABLE ROW LEVEL SECURITY;
CREATE POLICY "GM owner select" ON public.game_maker_files FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "GM owner insert" ON public.game_maker_files FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "GM owner update" ON public.game_maker_files FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "GM owner delete" ON public.game_maker_files FOR DELETE USING (auth.uid() = user_id);

-- Auto-create profile + progress on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  INSERT INTO public.player_progress (user_id, unlocked_level) VALUES (NEW.id, 1);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
