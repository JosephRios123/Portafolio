-- ============== ROLES SYSTEM ==============
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

create policy "Users can view their own roles"
  on public.user_roles for select to authenticated
  using (auth.uid() = user_id);

create policy "Admins manage roles"
  on public.user_roles for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- ============== TIMESTAMP TRIGGER ==============
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============== PROJECTS ==============
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tags text[] not null default '{}',
  description text not null,
  link text,
  image_url text,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.projects enable row level security;
create trigger projects_touch before update on public.projects
  for each row execute function public.touch_updated_at();

create policy "Anyone can view projects" on public.projects
  for select using (true);
create policy "Admins manage projects" on public.projects
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- ============== EXPERIENCES ==============
create table public.experiences (
  id uuid primary key default gen_random_uuid(),
  role text not null,
  company text not null,
  start_date text not null,
  end_date text,
  is_current boolean not null default false,
  color text not null default 'hsl(217 91% 60%)',
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.experiences enable row level security;
create trigger experiences_touch before update on public.experiences
  for each row execute function public.touch_updated_at();

create policy "Anyone can view experiences" on public.experiences
  for select using (true);
create policy "Admins manage experiences" on public.experiences
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create table public.experience_bullets (
  id uuid primary key default gen_random_uuid(),
  experience_id uuid not null references public.experiences(id) on delete cascade,
  text text not null,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.experience_bullets enable row level security;
create index on public.experience_bullets (experience_id);

create policy "Anyone can view bullets" on public.experience_bullets
  for select using (true);
create policy "Admins manage bullets" on public.experience_bullets
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- ============== MINDSET PRINCIPLES ==============
create type public.mindset_category as enum ('Técnica', 'Humana', 'Estratégica');

create table public.mindset_principles (
  id uuid primary key default gen_random_uuid(),
  phrase text not null,
  description text not null,
  category mindset_category not null,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.mindset_principles enable row level security;
create trigger mindset_touch before update on public.mindset_principles
  for each row execute function public.touch_updated_at();

create policy "Anyone can view principles" on public.mindset_principles
  for select using (true);
create policy "Admins manage principles" on public.mindset_principles
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- ============== FORMATIONS ==============
create type public.formation_status as enum ('Completado', 'En progreso', 'Certificado');

create table public.formations (
  id uuid primary key default gen_random_uuid(),
  course text not null,
  institution text not null,
  city text,
  status formation_status not null default 'Completado',
  obtained_date text,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.formations enable row level security;
create trigger formations_touch before update on public.formations
  for each row execute function public.touch_updated_at();

create policy "Anyone can view formations" on public.formations
  for select using (true);
create policy "Admins manage formations" on public.formations
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- ============== STORAGE BUCKET ==============
insert into storage.buckets (id, name, public)
values ('project-previews', 'project-previews', true)
on conflict (id) do nothing;

create policy "Public can read project previews"
  on storage.objects for select
  using (bucket_id = 'project-previews');

create policy "Admins upload project previews"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'project-previews' and public.has_role(auth.uid(), 'admin'));

create policy "Admins update project previews"
  on storage.objects for update to authenticated
  using (bucket_id = 'project-previews' and public.has_role(auth.uid(), 'admin'));

create policy "Admins delete project previews"
  on storage.objects for delete to authenticated
  using (bucket_id = 'project-previews' and public.has_role(auth.uid(), 'admin'));