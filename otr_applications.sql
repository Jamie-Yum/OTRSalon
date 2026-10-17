-- Off the Record Salon — 참가 신청 테이블 + RPC
-- Supabase SQL Editor에서 실행. 기존 otr_auth(pw) 함수를 관리자 인증에 재사용한다.

create table if not exists public.otr_applications (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  phone       text not null,
  role        text not null,
  inviter     text not null,
  pass        text not null,
  question    text not null,
  status      text not null default '접수',   -- 접수 / 확정 / 대기 / 취소
  memo        text,
  salon_no    int default 1
);
alter table public.otr_applications enable row level security;
-- RLS 정책 없음: anon/authenticated는 테이블에 직접 접근 불가. 아래 RPC(security definer)로만 접근.

-- 홈페이지 신청 (anon 호출 가능)
create or replace function public.otr_apply(
  name text, phone text, role text, inviter text, pass text, question text
) returns uuid
language plpgsql security definer set search_path = public as $$
declare rid uuid;
begin
  if coalesce(trim(name),'')='' or coalesce(trim(phone),'')='' or coalesce(trim(role),'')=''
     or coalesce(trim(inviter),'')='' or coalesce(trim(pass),'')='' or length(trim(question))<10 then
    raise exception '필수 항목이 비어 있습니다.';
  end if;
  if length(question)>4000 or length(name)>100 or length(phone)>40 or length(role)>200 or length(inviter)>100 or length(pass)>100 then
    raise exception '입력 길이를 초과했습니다.';
  end if;
  -- 같은 연락처로 10분 내 중복 제출 방지
  if exists (select 1 from otr_applications a where a.phone=otr_apply.phone and a.created_at>now()-interval '10 minutes') then
    raise exception '이미 접수된 신청입니다. 잠시 후 다시 시도해 주세요.';
  end if;
  insert into otr_applications(name,phone,role,inviter,pass,question)
  values(trim(name),trim(phone),trim(role),trim(inviter),trim(pass),trim(question)) returning id into rid;
  return rid;
end $$;
revoke all on function public.otr_apply(text,text,text,text,text,text) from public;
grant execute on function public.otr_apply(text,text,text,text,text,text) to anon, authenticated;

-- 관리자: 목록
create or replace function public.otr_app_list(pw text) returns setof public.otr_applications
language plpgsql security definer set search_path = public as $$
begin
  if not otr_auth(pw) then raise exception 'unauthorized'; end if;
  return query select * from otr_applications order by created_at desc;
end $$;

-- 관리자: 상태/메모 수정
create or replace function public.otr_app_update(pw text, rid uuid, new_status text default null, new_memo text default null)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not otr_auth(pw) then raise exception 'unauthorized'; end if;
  update otr_applications set status=coalesce(new_status,status), memo=coalesce(new_memo,memo) where id=rid;
end $$;

-- 관리자: 삭제
create or replace function public.otr_app_delete(pw text, rid uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not otr_auth(pw) then raise exception 'unauthorized'; end if;
  delete from otr_applications where id=rid;
end $$;

grant execute on function public.otr_app_list(text) to anon, authenticated;
grant execute on function public.otr_app_update(text,uuid,text,text) to anon, authenticated;
grant execute on function public.otr_app_delete(text,uuid) to anon, authenticated;

-- ─────────────────────────────────────────────
-- 사이트 설정 (히어로 배경 사진/영상 등)
-- ─────────────────────────────────────────────
create table if not exists public.otr_settings (
  key        text primary key,
  value      jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.otr_settings enable row level security;

-- 홈페이지: 공개 설정 읽기 (anon)
create or replace function public.otr_public_settings() returns jsonb
language sql security definer set search_path = public stable as $$
  select coalesce(jsonb_object_agg(key, value), '{}'::jsonb) from otr_settings;
$$;
grant execute on function public.otr_public_settings() to anon, authenticated;

-- 관리자: 설정 저장
create or replace function public.otr_set_setting(pw text, skey text, sval jsonb) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not otr_auth(pw) then raise exception 'unauthorized'; end if;
  insert into otr_settings(key,value,updated_at) values(skey,sval,now())
  on conflict(key) do update set value=excluded.value, updated_at=now();
end $$;
grant execute on function public.otr_set_setting(text,text,jsonb) to anon, authenticated;
