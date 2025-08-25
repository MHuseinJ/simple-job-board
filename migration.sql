-- Table
create table if not exists public.profiles (
                                               id uuid primary key references auth.users(id) on delete cascade,
    username text unique,
    company_name text,
    updated_at timestamptz default now()
    );

alter table public.profiles enable row level security;

-- RLS policies
create policy "read profiles (auth)"
on public.profiles for select
                                  to authenticated
                                  using (true);

create policy "insert own profile"
on public.profiles for insert
to authenticated
with check (auth.uid() = id);

create policy "update own profile"
on public.profiles for update
                                         to authenticated
                                         using (auth.uid() = id);

-- Auto-create profile row when a user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
insert into public.profiles (id,company_name,username) values (
                                            new.id,
                                            coalesce(new.raw_user_meta_data->>'company_name', ''),
                                            new.email
                                        )
    on conflict (id) do nothing;
return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();


create table public.jobs (
                             id uuid not null default extensions.uuid_generate_v4 (),
                             title text not null,
                             description text null,
                             location text null,
                             job_type text null,
                             company_id uuid not null,
                             created_at timestamp with time zone null default now(),
                             constraint jobs_pkey primary key (id),
                             constraint jobs_company_id_fkey foreign KEY (company_id) references profiles (id) on delete CASCADE,
                             constraint jobs_job_type_check check (
                                 (
                                     job_type = any (
                                                     array[
                                                         'Full-Time'::text,
                                                     'Part-Time'::text,
                                                     'Contract'::text
        ]
                                         )
                                     )
                                 )
) TABLESPACE pg_default;

create or replace view public.job_company as
select j.id,
       j.title,
       j.location,
       j.job_type,
       j.description,
       p.company_name,
       j.created_at
from public.jobs j
         join public.profiles p on p.id = j.company_id;

-- RLS doesn’t apply to views directly, so control access with GRANTs:
grant select on public.job_company to anon;