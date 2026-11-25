-- 진행 장표 데이터 (세션별·종류별) : kind = 'qa' | 'welcome' | 'talk' | 'farewell'
create table if not exists otr_decks (
  id uuid primary key default gen_random_uuid(),
  season_no int not null default 1, salon_no int not null default 1,
  kind text not null, data jsonb not null default '{}'::jsonb,
  created_at timestamptz default now(), updated_at timestamptz default now()
);
alter table otr_decks enable row level security;

create or replace function otr_check_table(tbl text) returns void language plpgsql as $$
begin
  if tbl not in ('otr_meeting_notes','otr_speakers','otr_fees','otr_actions','otr_decisions','otr_plan_docs','otr_schedule','otr_surveys','otr_survey_responses','otr_seasons','otr_milestones','otr_messages','otr_checklist','otr_decks') then
    raise exception 'invalid table';
  end if;
end $$;
select 'done' as r;
