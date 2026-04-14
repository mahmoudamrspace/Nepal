-- Apply to hosted Supabase (project ref rzmkyxcdaeopbpbgpjbv):
--   npm run db:remote:login
--   npm run db:remote:link   # database password from Dashboard → Settings → Database
--   npm run db:remote:push
-- Or paste this file into Dashboard → SQL Editor.
--
-- Matches app schema (camelCase columns). No public.users — use auth.users + profiles.

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
CREATE TYPE "PackageCategory" AS ENUM ('Adventure', 'Culture', 'Relaxation', 'Wellness');
CREATE TYPE "Difficulty" AS ENUM ('Easy', 'Moderate', 'Challenging');
CREATE TYPE "BookingStatus" AS ENUM ('pending', 'confirmed', 'cancelled');
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'paid', 'failed');
CREATE TYPE "PaymentMethod" AS ENUM ('credit_card', 'bank_transfer', 'paypal');
CREATE TYPE "ReviewPlatform" AS ENUM ('Google', 'TripAdvisor');

-- ---------------------------------------------------------------------------
-- Profiles (linked to Supabase Auth)
-- ---------------------------------------------------------------------------
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'EDITOR' CHECK (role IN ('SUPER_ADMIN', 'EDITOR', 'VIEWER')),
  name TEXT NOT NULL DEFAULT '',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION public.set_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.set_profiles_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1)),
    'EDITOR'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Content tables (camelCase columns to match existing API / Prisma)
-- ---------------------------------------------------------------------------
CREATE TABLE public.authors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  avatar TEXT,
  bio TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.tags (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  color TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.blog_posts (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  "featuredImage" TEXT NOT NULL,
  images TEXT[] NOT NULL DEFAULT '{}',
  "authorId" TEXT NOT NULL REFERENCES public.authors (id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  "publishedAt" TIMESTAMPTZ,
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  views INTEGER NOT NULL DEFAULT 0,
  "seoTitle" TEXT,
  "seoDescription" TEXT,
  "readingTime" INTEGER NOT NULL DEFAULT 5
);

CREATE TABLE public."_BlogPostToTag" (
  "A" TEXT NOT NULL REFERENCES public.blog_posts (id) ON DELETE CASCADE,
  "B" TEXT NOT NULL REFERENCES public.tags (id) ON DELETE CASCADE,
  PRIMARY KEY ("A", "B")
);

CREATE TABLE public.packages (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  "shortDescription" TEXT NOT NULL,
  "fullDescription" TEXT NOT NULL,
  price DOUBLE PRECISION NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  duration TEXT NOT NULL,
  location TEXT NOT NULL,
  difficulty "Difficulty" NOT NULL,
  "groupSize" INTEGER NOT NULL,
  images TEXT[] NOT NULL DEFAULT '{}',
  "featuredImage" TEXT NOT NULL,
  category "PackageCategory" NOT NULL,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  "availableDates" TEXT[] NOT NULL DEFAULT '{}',
  itinerary JSONB NOT NULL DEFAULT '[]',
  included TEXT[] NOT NULL DEFAULT '{}',
  excluded TEXT[] NOT NULL DEFAULT '{}',
  faq JSONB NOT NULL DEFAULT '[]',
  highlights TEXT[] NOT NULL DEFAULT '{}',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public."_PackageToTag" (
  "A" TEXT NOT NULL REFERENCES public.packages (id) ON DELETE CASCADE,
  "B" TEXT NOT NULL REFERENCES public.tags (id) ON DELETE CASCADE,
  PRIMARY KEY ("A", "B")
);

CREATE TABLE public.bookings (
  id TEXT PRIMARY KEY,
  "bookingNumber" TEXT NOT NULL UNIQUE,
  "packageId" TEXT NOT NULL REFERENCES public.packages (id) ON DELETE RESTRICT,
  travelers JSONB NOT NULL,
  "selectedDate" TEXT NOT NULL,
  "numberOfTravelers" INTEGER NOT NULL,
  "basePrice" DOUBLE PRECISION NOT NULL,
  taxes DOUBLE PRECISION NOT NULL,
  fees DOUBLE PRECISION NOT NULL,
  "totalPrice" DOUBLE PRECISION NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status "BookingStatus" NOT NULL DEFAULT 'pending',
  "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'pending',
  "paymentMethod" "PaymentMethod",
  "customerEmail" TEXT NOT NULL,
  "customerPhone" TEXT NOT NULL,
  "specialRequests" TEXT,
  "emergencyContact" JSONB,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.reviews (
  id TEXT PRIMARY KEY,
  platform "ReviewPlatform" NOT NULL,
  "reviewerName" TEXT NOT NULL,
  "reviewerAvatar" TEXT,
  rating INTEGER NOT NULL,
  "reviewText" TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  "reviewUrl" TEXT,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.contact_submissions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  read BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE public.newsletter_subscribers (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  "subscribedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX blog_posts_slug_idx ON public.blog_posts (slug);
CREATE INDEX blog_posts_published_idx ON public.blog_posts ("publishedAt");
CREATE INDEX packages_slug_idx ON public.packages (slug);
CREATE INDEX bookings_number_idx ON public.bookings ("bookingNumber");

-- ---------------------------------------------------------------------------
-- Blog view counter (RLS-safe)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.increment_post_views (p_slug TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.blog_posts
  SET views = views + 1
  WHERE slug = p_slug AND "publishedAt" IS NOT NULL;
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_post_views (TEXT) TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- Storage: public marketing bucket
-- ---------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', TRUE)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

CREATE POLICY "Public read media objects"
ON storage.objects FOR SELECT
USING (bucket_id = 'media');

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."_BlogPostToTag" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."_PackageToTag" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Profiles: own row
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id);

-- Public read content
CREATE POLICY "authors_select_anon" ON public.authors FOR SELECT TO anon USING (TRUE);
CREATE POLICY "authors_select_auth" ON public.authors FOR SELECT TO authenticated USING (TRUE);

CREATE POLICY "tags_select_anon" ON public.tags FOR SELECT TO anon USING (TRUE);
CREATE POLICY "tags_select_auth" ON public.tags FOR SELECT TO authenticated USING (TRUE);

CREATE POLICY "packages_select_anon" ON public.packages FOR SELECT TO anon USING (TRUE);
CREATE POLICY "packages_select_auth" ON public.packages FOR SELECT TO authenticated USING (TRUE);

CREATE POLICY "reviews_select_anon" ON public.reviews FOR SELECT TO anon USING (TRUE);
CREATE POLICY "reviews_select_auth" ON public.reviews FOR SELECT TO authenticated USING (TRUE);

CREATE POLICY "blog_published_select_anon" ON public.blog_posts FOR SELECT TO anon
  USING ("publishedAt" IS NOT NULL);
CREATE POLICY "blog_select_auth" ON public.blog_posts FOR SELECT TO authenticated USING (TRUE);

CREATE POLICY "blogpost_tag_select_anon" ON public."_BlogPostToTag" FOR SELECT TO anon
  USING (
    EXISTS (
      SELECT 1 FROM public.blog_posts p
      WHERE p.id = "A" AND p."publishedAt" IS NOT NULL
    )
  );
CREATE POLICY "blogpost_tag_select_auth" ON public."_BlogPostToTag" FOR SELECT TO authenticated USING (TRUE);

CREATE POLICY "packagetag_select_anon" ON public."_PackageToTag" FOR SELECT TO anon USING (TRUE);
CREATE POLICY "packagetag_select_auth" ON public."_PackageToTag" FOR SELECT TO authenticated USING (TRUE);

-- Public writes
CREATE POLICY "bookings_insert_anon" ON public.bookings FOR INSERT TO anon WITH CHECK (TRUE);
CREATE POLICY "bookings_insert_auth" ON public.bookings FOR INSERT TO authenticated WITH CHECK (TRUE);

CREATE POLICY "contact_insert_anon" ON public.contact_submissions FOR INSERT TO anon WITH CHECK (TRUE);
CREATE POLICY "contact_insert_auth" ON public.contact_submissions FOR INSERT TO authenticated WITH CHECK (TRUE);

CREATE POLICY "newsletter_insert_anon" ON public.newsletter_subscribers FOR INSERT TO anon WITH CHECK (TRUE);
CREATE POLICY "newsletter_insert_auth" ON public.newsletter_subscribers FOR INSERT TO authenticated WITH CHECK (TRUE);

-- Grants (Supabase defaults often include these; safe to repeat)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT INSERT ON public.bookings TO anon, authenticated;
GRANT INSERT ON public.contact_submissions TO anon, authenticated;
GRANT INSERT ON public.newsletter_subscribers TO anon, authenticated;
GRANT UPDATE ON public.profiles TO authenticated;
