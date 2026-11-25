-- 진행 장표 공유 링크 (연사·구성원 확인용). 세션별 추측 불가 토큰, 관리자가 새로 만들면 이전 링크는 끊김.
create table if not exists otr_share (
  token uuid primary key default gen_random_uuid(),
  season_no int not null default 1, salon_no int not null,
  created_at timestamptz default now(),
  unique(season_no, salon_no)
);
alter table otr_share enable row level security;

create or replace function otr_share_list(pw text) returns jsonb
language plpgsql security definer set search_path = public as $$
begin
  if not otr_auth(pw) then raise exception 'unauthorized'; end if;
  return coalesce((select jsonb_agg(to_jsonb(s)) from otr_share s),'[]'::jsonb);
end $$;

create or replace function otr_share_reset(pw text, season int, salon int) returns uuid
language plpgsql security definer set search_path = public as $$
declare t uuid := gen_random_uuid();
begin
  if not otr_auth(pw) then raise exception 'unauthorized'; end if;
  insert into otr_share(token,season_no,salon_no) values(t,season,salon)
  on conflict(season_no,salon_no) do update set token=excluded.token, created_at=now();
  return t;
end $$;

-- 링크 소유자용 데이터: 참가자 공개 시간표(이름 제거), 확정 연사, 다음 세션, 장표 데이터
create or replace function otr_share_get(tok uuid) returns jsonb
language plpgsql security definer set search_path = public as $$
declare s otr_share; sc otr_schedule; nx otr_schedule;
begin
  select * into s from otr_share where token=tok;
  if not found then raise exception '링크가 만료되었거나 올바르지 않습니다.'; end if;
  select * into sc from otr_schedule where coalesce(season_no,1)=s.season_no and salon_no=s.salon_no limit 1;
  select * into nx from otr_schedule where coalesce(season_no,1)=s.season_no and salon_no=s.salon_no+1 limit 1;
  return jsonb_build_object(
    'n', s.salon_no, 'season', s.season_no, 'date', sc.event_date,
    'timetable', (select coalesce(jsonb_agg(jsonb_build_object(
        't', x->>'t',
        'title', btrim(regexp_replace(coalesce(x->>'title',''), '\s*\([가-힣]{3}\)', '', 'g')),
        'note', btrim(regexp_replace(coalesce(x->>'note',''), '\s*\([가-힣]{3}\)', '', 'g'))) order by i), '[]'::jsonb)
      from jsonb_array_elements(coalesce(sc.timetable,'[]'::jsonb)) with ordinality e(x,i) where coalesce((x->>'pub')::boolean, true)),
    'speaker', (select jsonb_build_object('name',name,'role',role,'photo',photo_url) from otr_speakers
      where coalesce(season_no,1)=s.season_no and salon_no=s.salon_no order by (status='확정') desc limit 1),
    'next', case when nx.id is null then null else jsonb_build_object('n',s.salon_no+1,'date',nx.event_date) ||
      coalesce((select jsonb_build_object('name',name,'role',role,'photo',photo_url) from otr_speakers
        where coalesce(season_no,1)=s.season_no and salon_no=s.salon_no+1 order by (status='확정') desc limit 1),'{}'::jsonb) end,
    'decks', coalesce((select jsonb_object_agg(kind,data) from otr_decks where season_no=s.season_no and salon_no=s.salon_no),'{}'::jsonb),
    'pdf', exists(select 1 from otr_files where season_no=s.season_no and salon_no=s.salon_no and kind='talk'));
end $$;

create or replace function otr_share_pdf(tok uuid) returns text
language plpgsql security definer set search_path = public as $$
declare s otr_share;
begin
  select * into s from otr_share where token=tok;
  if not found then raise exception '링크가 만료되었거나 올바르지 않습니다.'; end if;
  return (select b64 from otr_files where season_no=s.season_no and salon_no=s.salon_no and kind='talk');
end $$;

revoke all on function otr_share_list(text), otr_share_reset(text,int,int), otr_share_get(uuid), otr_share_pdf(uuid) from public;
grant execute on function otr_share_list(text), otr_share_reset(text,int,int), otr_share_get(uuid), otr_share_pdf(uuid) to anon, authenticated;
select 'done' as r;
