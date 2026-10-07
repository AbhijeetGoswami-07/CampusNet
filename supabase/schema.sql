create extension if not exists pgcrypto;

do $$ begin
  create type public.user_role as enum ('student', 'provider', 'admin');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.listing_category as enum ('flat', 'hostel', 'pg', 'mess', 'laundry');
exception when duplicate_object then null;
end $$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text,
  phone text,
  role public.user_role not null default 'student',
  avatar_url text,
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.listings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  category public.listing_category not null,
  description text,
  address text not null,
  locality text,
  city text,
  college_name text,
  latitude numeric,
  longitude numeric,
  distance_km numeric check (distance_km is null or distance_km >= 0),
  monthly_rent numeric not null default 0 check (monthly_rent >= 0),
  security_deposit numeric not null default 0 check (security_deposit >= 0),
  electricity_cost numeric check (electricity_cost is null or electricity_cost >= 0),
  food_cost numeric check (food_cost is null or food_cost >= 0),
  wifi_cost numeric check (wifi_cost is null or wifi_cost >= 0),
  laundry_cost numeric check (laundry_cost is null or laundry_cost >= 0),
  maintenance_cost numeric check (maintenance_cost is null or maintenance_cost >= 0),
  travel_cost_estimate numeric check (travel_cost_estimate is null or travel_cost_estimate >= 0),
  room_type text,
  gender_preference text,
  total_capacity integer check (total_capacity is null or total_capacity >= 0),
  available_capacity integer check (available_capacity is null or available_capacity >= 0),
  food_available boolean not null default false,
  laundry_available boolean not null default false,
  wifi_available boolean not null default false,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'suspended')),
  is_active boolean not null default true,
  verification_status text not null default 'unverified' check (verification_status in ('unverified', 'phone_verified', 'address_verified', 'admin_verified')),
  last_verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (available_capacity is null or total_capacity is null or available_capacity <= total_capacity)
);

create table public.amenities (
  id uuid primary key default gen_random_uuid(),
  name text unique not null
);

create table public.listing_amenities (
  listing_id uuid not null references public.listings(id) on delete cascade,
  amenity_id uuid not null references public.amenities(id) on delete cascade,
  primary key (listing_id, amenity_id)
);

create table public.listing_images (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  image_url text not null,
  storage_path text not null,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create unique index one_primary_image_per_listing on public.listing_images(listing_id) where is_primary;

create table public.saved_listings (
  student_id uuid not null references public.profiles(id) on delete cascade,
  listing_id uuid not null references public.listings(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (student_id, listing_id)
);

create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  listing_id uuid not null references public.listings(id) on delete cascade,
  message text not null,
  contact_preference text,
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  listing_id uuid not null references public.listings(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (student_id, listing_id)
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  listing_id uuid not null references public.listings(id) on delete cascade,
  reason text not null,
  description text,
  status text not null default 'open' check (status in ('open', 'investigating', 'resolved', 'dismissed')),
  admin_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.vacancy_history (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  previous_capacity integer,
  new_capacity integer not null check (new_capacity >= 0),
  updated_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

create index listings_category_idx on public.listings(category);
create index listings_city_idx on public.listings(city);
create index listings_locality_idx on public.listings(locality);
create index listings_status_idx on public.listings(status);
create index listings_monthly_rent_idx on public.listings(monthly_rent);
create index listings_college_name_idx on public.listings(college_name);
create index listings_last_verified_at_idx on public.listings(last_verified_at);
create index listings_distance_km_idx on public.listings(distance_km);
create index listings_owner_id_idx on public.listings(owner_id);
create index enquiries_listing_id_idx on public.enquiries(listing_id);
create index reports_listing_id_idx on public.reports(listing_id);
create index vacancy_history_listing_id_idx on public.vacancy_history(listing_id);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger listings_set_updated_at before update on public.listings for each row execute function public.set_updated_at();
create trigger enquiries_set_updated_at before update on public.enquiries for each row execute function public.set_updated_at();
create trigger reviews_set_updated_at before update on public.reviews for each row execute function public.set_updated_at();
create trigger reports_set_updated_at before update on public.reports for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
declare requested_role text := coalesce(new.raw_user_meta_data ->> 'role', 'student');
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'full_name', ''), split_part(new.email, '@', 1)),
    new.email,
    case when requested_role = 'provider' then 'provider'::public.user_role else 'student'::public.user_role end
  );
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'); $$;

create or replace function public.confirm_vacancy(target_listing uuid, new_capacity integer)
returns void language plpgsql security definer set search_path = public
as $$
declare previous_capacity integer;
begin
  select available_capacity into previous_capacity from public.listings where id = target_listing and owner_id = auth.uid();
  if not found then raise exception 'Only the listing owner can confirm vacancy'; end if;
  update public.listings set available_capacity = new_capacity, last_verified_at = now() where id = target_listing;
  insert into public.vacancy_history (listing_id, previous_capacity, new_capacity, updated_by) values (target_listing, previous_capacity, new_capacity, auth.uid());
end;
$$;

create or replace view public.listing_review_summary as
select l.id as listing_id,
       coalesce(round(avg(r.rating) filter (where r.status = 'approved'), 2), 0)::numeric as average_rating,
       count(r.id) filter (where r.status = 'approved')::integer as approved_review_count
from public.listings l
left join public.reviews r on r.listing_id = l.id
group by l.id;

create or replace function public.protect_profile_role()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  if old.role is distinct from new.role and not public.is_admin() then
    raise exception 'Only an administrator may change a user role';
  end if;
  return new;
end;
$$;

create trigger profiles_protect_role before update on public.profiles for each row execute function public.protect_profile_role();

create or replace function public.protect_listing_moderation()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  if not public.is_admin() and (
    old.owner_id is distinct from new.owner_id or
    old.status is distinct from new.status or
    old.verification_status is distinct from new.verification_status
  ) then
    raise exception 'Only an administrator may change listing ownership or moderation fields';
  end if;
  return new;
end;
$$;

create trigger listings_protect_moderation before update on public.listings for each row execute function public.protect_listing_moderation();

alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.amenities enable row level security;
alter table public.listing_amenities enable row level security;
alter table public.listing_images enable row level security;
alter table public.saved_listings enable row level security;
alter table public.enquiries enable row level security;
alter table public.reviews enable row level security;
alter table public.reports enable row level security;
alter table public.vacancy_history enable row level security;

create policy "Public reads approved listings" on public.listings for select using (status = 'approved' and is_active = true);
create policy "Providers insert own listings" on public.listings for insert with check (auth.uid() = owner_id and exists (select 1 from public.profiles where id = auth.uid() and role = 'provider'));
create policy "Providers update own listings" on public.listings for update using (auth.uid() = owner_id and exists (select 1 from public.profiles where id = auth.uid() and role = 'provider')) with check (auth.uid() = owner_id);
create policy "Providers delete own listings" on public.listings for delete using (auth.uid() = owner_id and exists (select 1 from public.profiles where id = auth.uid() and role = 'provider'));
create policy "Admins manage listings" on public.listings for all using (public.is_admin()) with check (public.is_admin());
create policy "Users read own profile" on public.profiles for select using (auth.uid() = id or public.is_admin());
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id and role in ('student', 'provider'));
create policy "Admins manage profiles" on public.profiles for all using (public.is_admin()) with check (public.is_admin());
create policy "Public reads amenities" on public.amenities for select using (true);
create policy "Admins manage amenities" on public.amenities for all using (public.is_admin()) with check (public.is_admin());
create policy "Providers insert listing amenities" on public.listing_amenities for insert with check (exists (select 1 from public.listings where id = listing_id and owner_id = auth.uid()));
create policy "Providers update listing amenities" on public.listing_amenities for update using (exists (select 1 from public.listings where id = listing_id and owner_id = auth.uid())) with check (exists (select 1 from public.listings where id = listing_id and owner_id = auth.uid()));
create policy "Providers delete listing amenities" on public.listing_amenities for delete using (exists (select 1 from public.listings where id = listing_id and owner_id = auth.uid()));
create policy "Public reads approved images" on public.listing_images for select using (exists (select 1 from public.listings where id = listing_id and status = 'approved'));
create policy "Providers insert own images" on public.listing_images for insert with check (exists (select 1 from public.listings where id = listing_id and owner_id = auth.uid()));
create policy "Providers update own images" on public.listing_images for update using (exists (select 1 from public.listings where id = listing_id and owner_id = auth.uid())) with check (exists (select 1 from public.listings where id = listing_id and owner_id = auth.uid()));
create policy "Providers delete own images" on public.listing_images for delete using (exists (select 1 from public.listings where id = listing_id and owner_id = auth.uid()));
create policy "Students read own saved listings" on public.saved_listings for select using (auth.uid() = student_id);
create policy "Students create own saved listings" on public.saved_listings for insert with check (auth.uid() = student_id and exists (select 1 from public.profiles where id = auth.uid() and role = 'student'));
create policy "Students delete own saved listings" on public.saved_listings for delete using (auth.uid() = student_id);
create policy "Students create enquiries" on public.enquiries for insert with check (auth.uid() = student_id and exists (select 1 from public.profiles where id = auth.uid() and role = 'student'));
create policy "Students read own enquiries" on public.enquiries for select using (auth.uid() = student_id);
create policy "Providers read own listing enquiries" on public.enquiries for select using (exists (select 1 from public.listings where id = listing_id and owner_id = auth.uid()));
create policy "Providers update own listing enquiries" on public.enquiries for update using (exists (select 1 from public.listings where id = listing_id and owner_id = auth.uid())) with check (exists (select 1 from public.listings where id = listing_id and owner_id = auth.uid()));
create policy "Admins manage enquiries" on public.enquiries for all using (public.is_admin()) with check (public.is_admin());
create policy "Students create own reviews" on public.reviews for insert with check (auth.uid() = student_id and exists (select 1 from public.profiles where id = auth.uid() and role = 'student'));
create policy "Students update own reviews" on public.reviews for update using (auth.uid() = student_id and status = 'pending') with check (auth.uid() = student_id and status = 'pending');
create policy "Students delete own reviews" on public.reviews for delete using (auth.uid() = student_id and status = 'pending');
create policy "Public reads approved reviews" on public.reviews for select using (status = 'approved');
create policy "Admins manage reviews" on public.reviews for all using (public.is_admin()) with check (public.is_admin());
create policy "Users create own reports" on public.reports for insert with check (auth.uid() = reporter_id);
create policy "Users read own reports" on public.reports for select using (auth.uid() = reporter_id or public.is_admin());
create policy "Admins manage reports" on public.reports for update using (public.is_admin()) with check (public.is_admin());
create policy "Admins delete reports" on public.reports for delete using (public.is_admin());
create policy "Providers view own vacancy history" on public.vacancy_history for select using (exists (select 1 from public.listings where id = listing_id and owner_id = auth.uid()) or public.is_admin());

comment on view public.listing_review_summary is 'Average rating and approved review count per listing.';

-- Create the listing-images bucket in Storage before applying these policies.
insert into storage.buckets (id, name, public)
values ('listing-images', 'listing-images', true)
on conflict (id) do nothing;

create policy "Public reads approved listing images" on storage.objects
for select using (bucket_id = 'listing-images' and exists (
  select 1 from public.listing_images li
  join public.listings l on l.id = li.listing_id
  where li.storage_path = name and l.status = 'approved'
));

create policy "Providers upload own listing images" on storage.objects
for insert to authenticated
with check (bucket_id = 'listing-images' and name like (auth.uid()::text || '/%'));

create policy "Providers update own stored images" on storage.objects
for update to authenticated
using (bucket_id = 'listing-images' and owner_id = auth.uid())
with check (bucket_id = 'listing-images' and owner_id = auth.uid());

create policy "Providers delete own stored images" on storage.objects
for delete to authenticated
using (bucket_id = 'listing-images' and owner_id = auth.uid());
