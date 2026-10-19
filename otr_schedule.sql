-- 일정 테이블 추가 (Supabase SQL Editor에서 실행, 재실행 가능)

create table if not exists otr_schedule (
  id uuid primary key default gen_random_uuid(),
  salon_no int not null,
  year int,
  month int,
  event_date date,
  time_text text,
  place text,
  host text,
  status text default '예정',
  public_note text,
  memo text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table otr_schedule enable row level security;

create or replace function otr_check_table(tbl text) returns void language plpgsql as $$
begin
  if tbl not in ('otr_meeting_notes','otr_speakers','otr_fees','otr_actions','otr_decisions','otr_plan_docs','otr_schedule') then
    raise exception 'invalid table';
  end if;
end $$;

-- 고객용: 공개 필드만 (host·memo 제외)
create or replace function otr_public_schedule() returns jsonb
language sql security definer set search_path = public as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'salon_no', salon_no, 'year', year, 'month', month, 'event_date', event_date,
    'time_text', time_text, 'place', place, 'status', status, 'public_note', public_note
  ) order by salon_no), '[]') from otr_schedule;
$$;
revoke all on function otr_public_schedule() from public;
grant execute on function otr_public_schedule() to anon, authenticated;

insert into otr_schedule (salon_no, year, month, status, public_note)
select * from (values
  (1, 2026, 11, '모집 중', '세부 일정 추후 공지'),
  (2, 2027, 3, '예정', '시간대 추후 공지'),
  (3, 2027, 6, '예정', '시간대 추후 공지'),
  (4, 2027, 9, '예정', '시간대 추후 공지')
) v where not exists (select 1 from otr_schedule);
