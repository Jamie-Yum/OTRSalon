-- 애프터 파티 참석 여부 (세션별) : {"1":true,"2":false,...}
alter table otr_applications add column if not exists after_party jsonb not null default '{}'::jsonb;

drop function if exists public.otr_app_update(text,uuid,text,text,text,boolean,int);
create or replace function public.otr_app_update(pw text, rid uuid, new_status text default null, new_memo text default null,
  new_paid_date text default null, new_refunded boolean default null, new_season int default null, new_after_party jsonb default null)
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
    season_no = coalesce(new_season, season_no),
    after_party = coalesce(new_after_party, after_party)
  where id = rid;
end $$;
revoke all on function public.otr_app_update(text,uuid,text,text,text,boolean,int,jsonb) from public;
grant execute on function public.otr_app_update(text,uuid,text,text,text,boolean,int,jsonb) to anon, authenticated;
select count(*) from otr_applications where after_party = '{}'::jsonb;
