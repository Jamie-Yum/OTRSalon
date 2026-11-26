-- 현장 질의응답: 참가자가 QR로 질문을 보내고, 진행 장표에 실시간으로 뜸.
-- 질문 받기는 관리자가 열어야만 가능(open). 코드는 세션별 무작위, 새로 만들면 이전 QR은 끊김.
create table if not exists otr_live (
  season_no int not null default 1, salon_no int not null,
  code text not null unique, open boolean not null default false,
  created_at timestamptz default now(),
  primary key (season_no, salon_no)
);
create table if not exists otr_live_q (
  id uuid primary key default gen_random_uuid(),
  season_no int not null default 1, salon_no int not null,
  body text not null, hidden boolean not null default false,
  created_at timestamptz default now()
);
create index if not exists otr_live_q_s on otr_live_q(season_no, salon_no, created_at);
alter table otr_live enable row level security;
alter table otr_live_q enable row level security;

create or replace function otr_live_qs(s int, n int, all_ boolean) returns jsonb
language sql security definer set search_path = public as $$
  select coalesce(jsonb_agg(jsonb_build_object('id',id,'body',body,'hidden',hidden,'at',created_at) order by created_at desc),'[]'::jsonb)
  from otr_live_q where season_no=s and salon_no=n and (all_ or not hidden);
$$;

-- 관리자: 상태 + 전체 질문(숨김 포함)
create or replace function otr_live_admin(pw text, season int, salon int) returns jsonb
language plpgsql security definer set search_path = public as $$
declare l otr_live;
begin
  if not otr_auth(pw) then raise exception 'unauthorized'; end if;
  select * into l from otr_live where season_no=season and salon_no=salon;
  if not found then
    insert into otr_live(season_no,salon_no,code) values(season,salon,substr(md5(gen_random_uuid()::text),1,8)) returning * into l;
  end if;
  return jsonb_build_object('code',l.code,'open',l.open,'qs',otr_live_qs(season,salon,true));
end $$;

-- 관리자: 열기/닫기, 새 코드
create or replace function otr_live_set(pw text, season int, salon int, is_open boolean, new_code boolean default false) returns jsonb
language plpgsql security definer set search_path = public as $$
begin
  if not otr_auth(pw) then raise exception 'unauthorized'; end if;
  perform otr_live_admin(pw,season,salon);
  update otr_live set open=is_open, code=case when new_code then substr(md5(gen_random_uuid()::text),1,8) else code end
  where season_no=season and salon_no=salon;
  return otr_live_admin(pw,season,salon);
end $$;

-- 관리자: 숨기기/되살리기/삭제
create or replace function otr_live_mod(pw text, qid uuid, hide boolean default null, del boolean default false) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not otr_auth(pw) then raise exception 'unauthorized'; end if;
  if del then delete from otr_live_q where id=qid;
  else update otr_live_q set hidden=coalesce(hide,hidden) where id=qid; end if;
end $$;

-- 공유 링크(연사·구성원): 코드 + 숨기지 않은 질문
create or replace function otr_live_share(tok uuid) returns jsonb
language plpgsql security definer set search_path = public as $$
declare s otr_share; l otr_live;
begin
  select * into s from otr_share where token=tok;
  if not found then raise exception '링크가 만료되었거나 올바르지 않습니다.'; end if;
  select * into l from otr_live where season_no=s.season_no and salon_no=s.salon_no;
  return jsonb_build_object('code',l.code,'open',coalesce(l.open,false),'qs',otr_live_qs(s.season_no,s.salon_no,false));
end $$;

-- 참가자(QR): 세션 정보
create or replace function otr_live_info(c text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare l otr_live; sp text; rl text;
begin
  select * into l from otr_live where code=c;
  if not found then raise exception '올바르지 않은 주소입니다.'; end if;
  select name, role into sp, rl from otr_speakers where coalesce(season_no,1)=l.season_no and salon_no=l.salon_no order by (status='확정') desc limit 1;
  return jsonb_build_object('season',l.season_no,'n',l.salon_no,'open',l.open,'speaker',sp,'role',rl);
end $$;

-- 참가자(QR): 질문 보내기
create or replace function otr_live_ask(c text, q text) returns void
language plpgsql security definer set search_path = public as $$
declare l otr_live; t text := btrim(coalesce(q,''));
begin
  select * into l from otr_live where code=c;
  if not found then raise exception '올바르지 않은 주소입니다.'; end if;
  if not l.open then raise exception '지금은 질문을 받고 있지 않습니다.'; end if;
  if char_length(t) < 2 then raise exception '질문을 적어 주세요.'; end if;
  if char_length(t) > 300 then raise exception '300자 이내로 적어 주세요.'; end if;
  if (select count(*) from otr_live_q where season_no=l.season_no and salon_no=l.salon_no) >= 300 then raise exception '질문이 너무 많아 더 받을 수 없습니다.'; end if;
  insert into otr_live_q(season_no,salon_no,body) values(l.season_no,l.salon_no,t);
end $$;

revoke all on function otr_live_qs(int,int,boolean) from public, anon, authenticated;
revoke all on function otr_live_admin(text,int,int), otr_live_set(text,int,int,boolean,boolean), otr_live_mod(text,uuid,boolean,boolean),
  otr_live_share(uuid), otr_live_info(text), otr_live_ask(text,text) from public;
grant execute on function otr_live_admin(text,int,int), otr_live_set(text,int,int,boolean,boolean), otr_live_mod(text,uuid,boolean,boolean),
  otr_live_share(uuid), otr_live_info(text), otr_live_ask(text,text) to anon, authenticated;
select 'done' as r;
