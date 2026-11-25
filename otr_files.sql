-- 진행 장표용 파일(강연 PDF 등). 관리자 비밀번호로만 읽고 쓴다. 공통 CRUD 목록에는 넣지 않음(본문이 커서).
create table if not exists otr_files (
  id uuid primary key default gen_random_uuid(),
  season_no int not null default 1, salon_no int not null default 1,
  kind text not null, name text, size int, b64 text not null,
  created_at timestamptz default now(),
  unique(season_no, salon_no, kind)
);
alter table otr_files enable row level security;

create or replace function otr_file_put(pw text, season int, salon int, fkind text, fname text, data text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not otr_auth(pw) then raise exception 'unauthorized'; end if;
  insert into otr_files(season_no,salon_no,kind,name,size,b64) values(season,salon,fkind,fname,(length(data)*3)/4,data)
  on conflict(season_no,salon_no,kind) do update set name=excluded.name,size=excluded.size,b64=excluded.b64,created_at=now();
end $$;

create or replace function otr_file_get(pw text, season int, salon int, fkind text)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  if not otr_auth(pw) then raise exception 'unauthorized'; end if;
  return (select jsonb_build_object('name',name,'b64',b64) from otr_files where season_no=season and salon_no=salon and kind=fkind);
end $$;

create or replace function otr_file_meta(pw text)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  if not otr_auth(pw) then raise exception 'unauthorized'; end if;
  return coalesce((select jsonb_agg(jsonb_build_object('season_no',season_no,'salon_no',salon_no,'kind',kind,'name',name,'size',size,'created_at',created_at)) from otr_files),'[]'::jsonb);
end $$;

create or replace function otr_file_delete(pw text, season int, salon int, fkind text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not otr_auth(pw) then raise exception 'unauthorized'; end if;
  delete from otr_files where season_no=season and salon_no=salon and kind=fkind;
end $$;

revoke all on function otr_file_put(text,int,int,text,text,text), otr_file_get(text,int,int,text), otr_file_meta(text), otr_file_delete(text,int,int,text) from public;
grant execute on function otr_file_put(text,int,int,text,text,text), otr_file_get(text,int,int,text), otr_file_meta(text), otr_file_delete(text,int,int,text) to anon, authenticated;
select 'done' as r;
