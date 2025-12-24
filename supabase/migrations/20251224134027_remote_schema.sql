drop extension if exists "pg_net";

alter table "public"."bets" drop constraint "bets_match_id_fkey";

alter table "public"."tournament_entries" drop constraint "tournament_entries_pool_id_fkey";

drop function if exists "public"."distribute_pool_rewards"(p_pool_id uuid);


  create table "public"."pool_participants" (
    "id" uuid not null default gen_random_uuid(),
    "pool_id" uuid not null,
    "user_id" uuid not null,
    "joined_at" timestamp with time zone default now()
      );



  create table "public"."profiles" (
    "id" uuid not null,
    "username" text,
    "first_name" text,
    "last_name" text,
    "avatar_url" text,
    "updated_at" timestamp with time zone default now(),
    "mobile_number" text,
    "date_of_birth" date,
    "gender" text,
    "telegram_id" bigint,
    "wallet_address" text,
    "real_money_balance" numeric default 0.00
      );


alter table "public"."profiles" enable row level security;

CREATE INDEX idx_pool_participants_user_id ON public.pool_participants USING btree (user_id);

CREATE UNIQUE INDEX pool_participants_pkey ON public.pool_participants USING btree (id);

CREATE UNIQUE INDEX pool_participants_pool_id_user_id_key ON public.pool_participants USING btree (pool_id, user_id);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX profiles_telegram_id_key ON public.profiles USING btree (telegram_id);

CREATE UNIQUE INDEX profiles_username_key ON public.profiles USING btree (username);

alter table "public"."pool_participants" add constraint "pool_participants_pkey" PRIMARY KEY using index "pool_participants_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."pool_participants" add constraint "pool_participants_pool_id_user_id_key" UNIQUE using index "pool_participants_pool_id_user_id_key";

alter table "public"."pool_participants" add constraint "pool_participants_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."pool_participants" validate constraint "pool_participants_user_id_fkey";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."profiles" add constraint "profiles_real_money_balance_check" CHECK ((real_money_balance >= (0)::numeric)) not valid;

alter table "public"."profiles" validate constraint "profiles_real_money_balance_check";

alter table "public"."profiles" add constraint "profiles_telegram_id_key" UNIQUE using index "profiles_telegram_id_key";

alter table "public"."profiles" add constraint "profiles_username_key" UNIQUE using index "profiles_username_key";

grant delete on table "public"."pool_participants" to "anon";

grant insert on table "public"."pool_participants" to "anon";

grant references on table "public"."pool_participants" to "anon";

grant select on table "public"."pool_participants" to "anon";

grant trigger on table "public"."pool_participants" to "anon";

grant truncate on table "public"."pool_participants" to "anon";

grant update on table "public"."pool_participants" to "anon";

grant delete on table "public"."pool_participants" to "authenticated";

grant insert on table "public"."pool_participants" to "authenticated";

grant references on table "public"."pool_participants" to "authenticated";

grant select on table "public"."pool_participants" to "authenticated";

grant trigger on table "public"."pool_participants" to "authenticated";

grant truncate on table "public"."pool_participants" to "authenticated";

grant update on table "public"."pool_participants" to "authenticated";

grant delete on table "public"."pool_participants" to "service_role";

grant insert on table "public"."pool_participants" to "service_role";

grant references on table "public"."pool_participants" to "service_role";

grant select on table "public"."pool_participants" to "service_role";

grant trigger on table "public"."pool_participants" to "service_role";

grant truncate on table "public"."pool_participants" to "service_role";

grant update on table "public"."pool_participants" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";


  create policy "Users can view own profile"
  on "public"."profiles"
  as permissive
  for select
  to public
using ((auth.uid() = id));



  create policy "profiles_delete_policy"
  on "public"."profiles"
  as permissive
  for delete
  to authenticated
using ((auth.uid() = id));



  create policy "profiles_insert_policy"
  on "public"."profiles"
  as permissive
  for insert
  to authenticated
with check ((auth.uid() = id));



  create policy "profiles_select_policy"
  on "public"."profiles"
  as permissive
  for select
  to authenticated
using ((auth.uid() = id));



  create policy "profiles_update_policy"
  on "public"."profiles"
  as permissive
  for update
  to authenticated
using ((auth.uid() = id));



  create policy "Service role can manage all"
  on "public"."users"
  as permissive
  for all
  to service_role
using (true)
with check (true);



  create policy "Users can update own profile"
  on "public"."users"
  as permissive
  for update
  to public
using ((auth.uid() = id));



