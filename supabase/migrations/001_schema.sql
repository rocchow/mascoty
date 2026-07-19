-- Profiles (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  credits_balance INTEGER NOT NULL DEFAULT 3,
  stripe_customer_id TEXT UNIQUE,
  subscription_status TEXT NOT NULL DEFAULT 'free',
  subscription_tier TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Mascots
CREATE TABLE public.mascots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT,
  personality TEXT,
  style TEXT NOT NULL,
  colors JSONB,
  description TEXT,
  image_url TEXT,
  image_path TEXT,
  thumbnail_url TEXT,
  generation_params JSONB,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_mascots_user_id ON public.mascots(user_id);
CREATE INDEX idx_mascots_created_at ON public.mascots(created_at DESC);

ALTER TABLE public.mascots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users CRUD own mascots" ON public.mascots
  FOR ALL USING (auth.uid() = user_id);

-- Credit transactions
CREATE TABLE public.credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  reason TEXT NOT NULL,
  reference_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_credit_tx_user ON public.credit_transactions(user_id, created_at DESC);

ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own transactions" ON public.credit_transactions
  FOR SELECT USING (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  INSERT INTO public.credit_transactions (user_id, amount, reason)
  VALUES (NEW.id, 3, 'signup_bonus');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Atomic credit deduction
CREATE OR REPLACE FUNCTION public.deduct_credit(p_user_id UUID, p_reference_id TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  current_balance INTEGER;
BEGIN
  SELECT credits_balance INTO current_balance
  FROM profiles WHERE id = p_user_id FOR UPDATE;

  IF current_balance < 1 THEN RETURN FALSE; END IF;

  UPDATE profiles SET credits_balance = credits_balance - 1, updated_at = now()
  WHERE id = p_user_id;

  INSERT INTO credit_transactions (user_id, amount, reason, reference_id)
  VALUES (p_user_id, -1, 'generation', p_reference_id);

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Credit refund (used when generation fails)
CREATE OR REPLACE FUNCTION public.refund_credit(p_user_id UUID, p_reference_id TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles SET credits_balance = credits_balance + 1, updated_at = now()
  WHERE id = p_user_id;

  INSERT INTO credit_transactions (user_id, amount, reason, reference_id)
  VALUES (p_user_id, 1, 'refund', p_reference_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add credits (used by Stripe webhook)
CREATE OR REPLACE FUNCTION public.add_credits(p_user_id UUID, p_amount INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles SET credits_balance = credits_balance + p_amount, updated_at = now()
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
