-- 설문 + 응답 (Supabase SQL Editor에서 실행, 재실행 가능)

create table if not exists otr_surveys (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  intro text,
  salon_no int,
  deadline timestamptz,
  is_open boolean default true,
  ask_name boolean default false,
  questions jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table otr_surveys enable row level security;

create table if not exists otr_survey_responses (
  id uuid primary key default gen_random_uuid(),
  survey_id uuid references otr_surveys(id) on delete cascade,
  name text,
  answers jsonb default '{}'::jsonb,
  picked jsonb default '{}'::jsonb,
  memo text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table otr_survey_responses enable row level security;

-- 관리자 공통 CRUD(otr_list/otr_save/otr_delete) 허용 테이블
create or replace function otr_check_table(tbl text) returns void language plpgsql as $$
begin
  if tbl not in ('otr_meeting_notes','otr_speakers','otr_fees','otr_actions','otr_decisions','otr_plan_docs','otr_schedule','otr_surveys','otr_survey_responses') then
    raise exception 'invalid table';
  end if;
end $$;

-- 공개: 설문 1개 읽기 (응답 데이터는 노출하지 않음)
alter table otr_surveys add column if not exists attach jsonb;

create or replace function otr_public_survey(sid uuid) returns jsonb
language sql security definer set search_path = public as $$
  select jsonb_build_object('id', id, 'title', title, 'intro', intro, 'salon_no', salon_no,
    'deadline', deadline, 'is_open', is_open and (deadline is null or deadline > now()),
    'ask_name', ask_name, 'questions', questions, 'attach', attach)
  from otr_surveys where id = sid;
$$;

-- 공개: 응답 제출
create or replace function otr_submit_survey(sid uuid, name text, answers jsonb) returns uuid
language plpgsql security definer set search_path = public as $$
declare rid uuid; s otr_surveys;
begin
  select * into s from otr_surveys where id = sid;
  if s.id is null then raise exception '설문을 찾을 수 없습니다.'; end if;
  if not s.is_open or (s.deadline is not null and s.deadline <= now()) then raise exception '마감된 설문입니다.'; end if;
  if answers is null or jsonb_typeof(answers) <> 'object' or length(answers::text) > 30000 then raise exception '응답 형식이 올바르지 않습니다.'; end if;
  if length(coalesce(name,'')) > 100 then raise exception '이름이 너무 깁니다.'; end if;
  insert into otr_survey_responses(survey_id, name, answers) values (sid, nullif(trim(name),''), answers) returning id into rid;
  return rid;
end $$;

revoke all on function otr_public_survey(uuid) from public;
revoke all on function otr_submit_survey(uuid, text, jsonb) from public;
grant execute on function otr_public_survey(uuid) to anon, authenticated;
grant execute on function otr_submit_survey(uuid, text, jsonb) to anon, authenticated;
