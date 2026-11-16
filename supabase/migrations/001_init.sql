-- PROFILES (satu baris per akun login)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  full_name text,
  avatar_url text,
  xp integer not null default 0,
  streak integer not null default 0,
  last_active_date date,
  created_at timestamptz not null default now()
);

-- COURSES
create table if not exists public.courses (
  id bigint generated always as identity primary key,
  slug text unique not null,
  title text not null,
  description text,
  icon text,
  level text not null default 'beginner'
    check (level in ('beginner', 'intermediate', 'advanced')),
  order_index integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

-- LESSONS
create table if not exists public.lessons (
  id bigint generated always as identity primary key,
  course_id bigint not null references public.courses(id) on delete cascade,
  title text not null,
  content text,          -- isi materi (markdown)
  code_example text,
  order_index integer not null default 0,
  xp_reward integer not null default 10,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

do $$ 
begin
  if not exists (
    select 1 from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where c.relname = 'lessons_course_id_order_index_idx' and n.nspname = 'public'
  ) then
    create index on public.lessons (course_id, order_index);
  end if;
end $$;

-- QUIZ QUESTIONS
create table if not exists public.quiz_questions (
  id bigint generated always as identity primary key,
  lesson_id bigint not null references public.lessons(id) on delete cascade,
  question text not null,
  options jsonb not null,  -- contoh: ["A", "B", "C", "D"]
  correct_index integer not null,
  explanation text,
  order_index integer not null default 0
);

do $$ 
begin
  if not exists (
    select 1 from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where c.relname = 'quiz_questions_lesson_id_order_index_idx' and n.nspname = 'public'
  ) then
    create index on public.quiz_questions (lesson_id, order_index);
  end if;
end $$;

-- ENROLLMENTS
create table if not exists public.enrollments (
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_id bigint not null references public.courses(id) on delete cascade,
  enrolled_at timestamptz not null default now(),
  primary key (user_id, course_id)
);

-- LESSON PROGRESS
create table if not exists public.lesson_progress (
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id bigint not null references public.lessons(id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

-- QUIZ ATTEMPTS
create table if not exists public.quiz_attempts (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id bigint not null references public.lessons(id) on delete cascade,
  score integer not null,
  total integer not null,
  created_at timestamptz not null default now()
);

-- Buat profil otomatis saat user mendaftar
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Drop trigger dulu jika sudah ada agar tidak duplikat saat dibuat ulang
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ROW LEVEL SECURITY
alter table public.profiles        enable row level security;
alter table public.courses         enable row level security;
alter table public.lessons         enable row level security;
alter table public.quiz_questions  enable row level security;
alter table public.enrollments     enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.quiz_attempts   enable row level security;

-- Drop policy lama agar tidak terjadi error "policy already exists"
drop policy if exists "courses_read" on public.courses;
drop policy if exists "lessons_read" on public.lessons;
drop policy if exists "quiz_read" on public.quiz_questions;
drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "enrollments_own" on public.enrollments;
drop policy if exists "progress_own" on public.lesson_progress;
drop policy if exists "attempts_own" on public.quiz_attempts;

-- Konten publik: semua orang boleh membaca yang sudah dipublikasikan
create policy "courses_read" on public.courses
  for select using (is_published);
create policy "lessons_read" on public.lessons
  for select using (is_published);
create policy "quiz_read" on public.quiz_questions
  for select using (
    exists (select 1 from public.lessons l
            where l.id = lesson_id and l.is_published)
  );

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "enrollments_own" on public.enrollments
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "progress_own" on public.lesson_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "attempts_own" on public.quiz_attempts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);