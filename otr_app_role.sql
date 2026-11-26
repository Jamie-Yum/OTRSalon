-- 관리자에서 신청자 소속/역할 수정 가능하게 (new_role 추가)
drop function if exists public.otr_app_update(text,uuid,text,text,text,boolean,int,jsonb,jsonb);
create or replace function public.otr_app_update(pw text, rid uuid, new_status text default null, new_memo text default null,
  new_paid_date text default null, new_refunded boolean default null, new_season int default null, new_after_party jsonb default null,
  new_attend jsonb default null, new_role text default null)
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
    after_party = coalesce(new_after_party, after_party),
    attend = coalesce(new_attend, attend),
    role = coalesce(nullif(trim(new_role),''), role)
  where id = rid;
end $$;
revoke all on function public.otr_app_update(text,uuid,text,text,text,boolean,int,jsonb,jsonb,text) from public;
grant execute on function public.otr_app_update(text,uuid,text,text,text,boolean,int,jsonb,jsonb,text) to anon, authenticated;
select 'done' as r;
