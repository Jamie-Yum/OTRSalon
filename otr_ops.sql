-- 운영 체크리스트: 할 일 카테고리 · 준비 마일스톤 · 안내 문자 · 현장 운영
alter table otr_actions add column if not exists season_no int not null default 1;
alter table otr_actions add column if not exists category text;
alter table otr_actions add column if not exists support text;     -- 지원 / 승인
alter table otr_actions add column if not exists date_text text;   -- '수시', '11/09–10' 등 원문 표기
alter table otr_actions add column if not exists sort_order int;
alter table otr_seasons add column if not exists budget jsonb;

create table if not exists otr_milestones (
  id uuid primary key default gen_random_uuid(),
  season_no int not null default 1, salon_no int default 1,
  period text, start_date date, end_date date,
  title text not null, owner text, criteria text,
  done boolean not null default false, sort_order int,
  created_at timestamptz default now(), updated_at timestamptz default now()
);
create table if not exists otr_messages (
  id uuid primary key default gen_random_uuid(),
  season_no int not null default 1, salon_no int default 1,
  kind text not null, timing text, send_date date,
  body text, feedback text, approver text, executor text,
  status text default '작성 중', sent_date date, sort_order int,
  created_at timestamptz default now(), updated_at timestamptz default now()
);
create table if not exists otr_checklist (
  id uuid primary key default gen_random_uuid(),
  season_no int not null default 1, salon_no int default 1,
  kind text not null,          -- '답사' | '당일'
  slot text,                   -- 답사: 카테고리 / 당일: 시각
  item text not null, owner text, result text,
  done boolean not null default false, sort_order int,
  created_at timestamptz default now(), updated_at timestamptz default now()
);
alter table otr_milestones enable row level security;
alter table otr_messages enable row level security;
alter table otr_checklist enable row level security;

create or replace function otr_check_table(tbl text) returns void language plpgsql as $$
begin
  if tbl not in ('otr_meeting_notes','otr_speakers','otr_fees','otr_actions','otr_decisions','otr_plan_docs','otr_schedule','otr_surveys','otr_survey_responses','otr_seasons','otr_milestones','otr_messages','otr_checklist') then
    raise exception 'invalid table';
  end if;
end $$;
select 'done' as r;
