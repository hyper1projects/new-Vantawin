drop view if exists "public"."leaderboard_view";


  create table "public"."team_metadata" (
    "team_name" text not null,
    "logo_url" text,
    "updated_at" timestamp with time zone default now(),
    "api_football_id" integer,
    "league_name" text
      );


alter table "public"."team_metadata" enable row level security;

CREATE UNIQUE INDEX team_metadata_api_football_id_idx ON public.team_metadata USING btree (api_football_id);

CREATE UNIQUE INDEX team_metadata_pkey ON public.team_metadata USING btree (team_name);

alter table "public"."team_metadata" add constraint "team_metadata_pkey" PRIMARY KEY using index "team_metadata_pkey";

alter table "public"."tournament_entries" add constraint "tournament_entries_pool_id_fkey" FOREIGN KEY (pool_id) REFERENCES public.pools(id) not valid;

alter table "public"."tournament_entries" validate constraint "tournament_entries_pool_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_matches_with_logos()
 RETURNS TABLE(id uuid, start_time timestamp with time zone, league text, is_live boolean, home_team jsonb, away_team jsonb, questions jsonb, status text, home_score integer, away_score integer, winner text, created_at timestamp with time zone)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT
        m.id,
        m.start_time,
        m.league,
        m.is_live,
        m.home_team || jsonb_build_object('image', home_meta.logo_url),
        m.away_team || jsonb_build_object('image', away_meta.logo_url),
        m.questions,
        m.status,
        m.home_score,
        m.away_score,
        m.winner,
        m.created_at
    FROM
        public.matches AS m
    LEFT JOIN
        public.team_metadata AS home_meta ON (m.home_team ->> 'name') = home_meta.team_name
    LEFT JOIN
        public.team_metadata AS away_meta ON (m.away_team ->> 'name') = away_meta.team_name
    ORDER BY
        m.start_time ASC;
END;
$function$
;

create or replace view "public"."leaderboard_view" as  WITH bet_stats AS (
         SELECT e_1.id AS entry_id,
            count(*) FILTER (WHERE (b.status = 'win'::text)) AS wins,
            count(*) FILTER (WHERE (b.status = ANY (ARRAY['win'::text, 'loss'::text]))) AS total_settled
           FROM (public.tournament_entries e_1
             LEFT JOIN public.bets b ON ((e_1.id = b.entry_id)))
          GROUP BY e_1.id
        )
 SELECT e.pool_id,
    p.tier,
    u.username,
    e.total_xp,
    e.vanta_balance,
    e.id AS entry_id,
    COALESCE(bs.total_settled, (0)::bigint) AS total_bets,
    (COALESCE((((bs.wins)::numeric / (NULLIF(bs.total_settled, 0))::numeric) * (100)::numeric), (0)::numeric))::numeric(5,2) AS win_rate,
    rank() OVER (PARTITION BY e.pool_id ORDER BY e.total_xp DESC, COALESCE((((bs.wins)::numeric / (NULLIF(bs.total_settled, 0))::numeric) * (100)::numeric), (0)::numeric) DESC) AS rank
   FROM (((public.tournament_entries e
     JOIN public.users u ON ((e.user_id = u.id)))
     JOIN public.pools p ON ((e.pool_id = p.id)))
     LEFT JOIN bet_stats bs ON ((e.id = bs.entry_id)));


grant delete on table "public"."team_metadata" to "anon";

grant insert on table "public"."team_metadata" to "anon";

grant references on table "public"."team_metadata" to "anon";

grant select on table "public"."team_metadata" to "anon";

grant trigger on table "public"."team_metadata" to "anon";

grant truncate on table "public"."team_metadata" to "anon";

grant update on table "public"."team_metadata" to "anon";

grant delete on table "public"."team_metadata" to "authenticated";

grant insert on table "public"."team_metadata" to "authenticated";

grant references on table "public"."team_metadata" to "authenticated";

grant select on table "public"."team_metadata" to "authenticated";

grant trigger on table "public"."team_metadata" to "authenticated";

grant truncate on table "public"."team_metadata" to "authenticated";

grant update on table "public"."team_metadata" to "authenticated";

grant delete on table "public"."team_metadata" to "service_role";

grant insert on table "public"."team_metadata" to "service_role";

grant references on table "public"."team_metadata" to "service_role";

grant select on table "public"."team_metadata" to "service_role";

grant trigger on table "public"."team_metadata" to "service_role";

grant truncate on table "public"."team_metadata" to "service_role";

grant update on table "public"."team_metadata" to "service_role";


  create policy "Public read logos"
  on "public"."team_metadata"
  as permissive
  for select
  to public
using (true);



  create policy "Public view entries"
  on "public"."tournament_entries"
  as permissive
  for select
  to public
using (true);



