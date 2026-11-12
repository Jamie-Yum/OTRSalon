-- 시즌 단위 + 예산 관리 (회비 수입 · 지출)
create table if not exists otr_seasons (
  id uuid primary key default gen_random_uuid(),
  season_no int unique not null,
  name text,
  start_date date,
  end_date date,
  price int,          -- 시즌권 가격 (만원)
  capacity int,       -- 정원
  memo text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table otr_seasons enable row level security;
insert into otr_seasons (season_no, name, start_date, end_date, price)
values (1, 'Season 1', '2026-11-01', '2027-08-31', 25) on conflict (season_no) do nothing;

-- 기존 데이터는 모두 Season 1
alter table otr_applications add column if not exists season_no int not null default 1;
alter table otr_applications add column if not exists paid_date date;      -- 확정(입금 완료)일
alter table otr_applications add column if not exists refunded boolean not null default false;
alter table otr_fees add column if not exists season_no int not null default 1;
alter table otr_fees add column if not exists category text not null default '사례비';  -- 사례비/장소/식음/기념품/기타
alter table otr_schedule add column if not exists season_no int not null default 1;
alter table otr_speakers add column if not exists season_no int not null default 1;
alter table otr_surveys add column if not exists season_no int not null default 1;

create or replace function otr_check_table(tbl text) returns void language plpgsql as $$
begin
  if tbl not in ('otr_meeting_notes','otr_speakers','otr_fees','otr_actions','otr_decisions','otr_plan_docs','otr_schedule','otr_surveys','otr_survey_responses','otr_seasons') then
    raise exception 'invalid table';
  end if;
end $$;

-- 신청 수정: 확정으로 바꾸면 입금일 자동 기록, 입금일·환불·시즌 수정
drop function if exists public.otr_app_update(text,uuid,text,text);
create or replace function public.otr_app_update(pw text, rid uuid, new_status text default null, new_memo text default null,
  new_paid_date text default null, new_refunded boolean default null, new_season int default null)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not otr_auth(pw) then raise exception 'unauthorized'; end if;
  update otr_applications set
    status = coalesce(new_status, status),
    memo = coalesce(new_memo, memo),
    paid_date = case when new_paid_date is not null then nullif(new_paid_date,'')::date
                     when new_status = '확정' and status <> '확정' and paid_date is null then (now() at time zone 'Asia/Seoul')::date
                     else paid_date end,
    refunded = coalesce(new_refunded, refunded),
    season_no = coalesce(new_season, season_no)
  where id = rid;
end $$;
revoke all on function public.otr_app_update(text,uuid,text,text,text,boolean,int) from public;
grant execute on function public.otr_app_update(text,uuid,text,text,text,boolean,int) to anon, authenticated;
create or replace function public.otr_app_list(pw text) returns setof public.otr_applications
language plpgsql security definer set search_path = public as $$
begin
  if not otr_auth(pw) then raise exception 'unauthorized'; end if;
  return query select * from otr_applications order by created_at desc;
end $$;
select 'done' as r;
