-- 운영멤버·리피움 멤버 명단 (참석 여부·연락처·명찰용). 관리자 전용(otr_list/otr_save/otr_delete).
create table if not exists otr_members (
  id uuid primary key default gen_random_uuid(),
  season_no int not null default 1,
  grp text not null default '운영',
  name text not null default '',
  role text, phone text, memo text,
  attend jsonb not null default '{}'::jsonb,
  after_party jsonb not null default '{}'::jsonb,
  sort int not null default 0,
  created_at timestamptz default now(), updated_at timestamptz default now()
);
alter table otr_members enable row level security;

create or replace function otr_check_table(tbl text) returns void language plpgsql as $$
begin
  if tbl not in ('otr_meeting_notes','otr_speakers','otr_fees','otr_actions','otr_decisions','otr_plan_docs','otr_schedule','otr_surveys','otr_survey_responses','otr_seasons','otr_milestones','otr_messages','otr_checklist','otr_decks','otr_members') then
    raise exception 'invalid table';
  end if;
end $$;

-- 운영멤버 이름만 미리 채움 (비어 있을 때만)
insert into otr_members(season_no,grp,name,sort)
select 1,'운영',n,i from unnest(array['신다혜','조영주','염제명','김나라','위현민','김덕환','윤혜준','배강우']) with ordinality t(n,i)
where not exists (select 1 from otr_members);
select 'done' as r;
