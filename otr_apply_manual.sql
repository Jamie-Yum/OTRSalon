-- 마감 후 참가자 등록: 관리자 직접 추가(otr_app_add) + 추가 신청 링크(/apply/late, via='late')는 마감 중에도 허용
create or replace function public.otr_app_add(
  pw text, name text, phone text, role text default '', inviter text default '', pass text default '',
  question text default '', status text default '확정', memo text default null
) returns uuid
language plpgsql security definer set search_path = public as $$
declare rid uuid;
begin
  if not otr_auth(pw) then raise exception 'unauthorized'; end if;
  if coalesce(trim(name),'')='' or coalesce(trim(phone),'')='' then raise exception '이름과 연락처는 필수입니다.'; end if;
  insert into otr_applications(name,phone,role,inviter,pass,question,status,memo)
  values(trim(name),trim(phone),coalesce(trim(role),''),coalesce(trim(inviter),''),coalesce(trim(pass),''),
         coalesce(trim(question),''),coalesce(nullif(trim(status),''),'확정'),
         coalesce(nullif(trim(memo),''),'관리자 직접 등록')) returning id into rid;
  return rid;
end $$;
revoke all on function public.otr_app_add(text,text,text,text,text,text,text,text,text) from public;
grant execute on function public.otr_app_add(text,text,text,text,text,text,text,text,text) to anon, authenticated;

drop function if exists public.otr_apply(text,text,text,text,text,text);
create or replace function public.otr_apply(
  name text, phone text, role text, inviter text, pass text, question text, via text default null
) returns uuid
language plpgsql security definer set search_path = public as $$
declare rid uuid;
begin
  if coalesce((select (value->>'open')::boolean from otr_settings where key='apply'),true)=false
     and coalesce(pass,'') not like '리피움 주니어%' and coalesce(via,'')<>'late' then
    raise exception '참가 신청이 마감되었습니다.';
  end if;
  if coalesce(trim(name),'')='' or coalesce(trim(phone),'')='' or coalesce(trim(role),'')=''
     or coalesce(trim(inviter),'')='' or coalesce(trim(pass),'')='' or length(trim(question))<10 then
    raise exception '필수 항목이 비어 있습니다.';
  end if;
  if length(question)>4000 or length(name)>100 or length(phone)>40 or length(role)>200 or length(inviter)>100 or length(pass)>100 then
    raise exception '입력 길이를 초과했습니다.';
  end if;
  if exists (select 1 from otr_applications a where a.phone=otr_apply.phone and a.created_at>now()-interval '10 minutes') then
    raise exception '이미 접수된 신청입니다. 잠시 후 다시 시도해 주세요.';
  end if;
  insert into otr_applications(name,phone,role,inviter,pass,question,memo)
  values(trim(name),trim(phone),trim(role),trim(inviter),trim(pass),trim(question),
         case when via='late' then '추가 신청 링크로 접수' end) returning id into rid;
  return rid;
end $$;
revoke all on function public.otr_apply(text,text,text,text,text,text,text) from public;
grant execute on function public.otr_apply(text,text,text,text,text,text,text) to anon, authenticated;

-- 세션별 1부 참석 (2부 = after_party) : {"1":true,...}
alter table otr_applications add column if not exists attend jsonb not null default '{}'::jsonb;
drop function if exists public.otr_app_update(text,uuid,text,text,text,boolean,int,jsonb);
create or replace function public.otr_app_update(pw text, rid uuid, new_status text default null, new_memo text default null,
  new_paid_date text default null, new_refunded boolean default null, new_season int default null, new_after_party jsonb default null,
  new_attend jsonb default null)
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
    attend = coalesce(new_attend, attend)
  where id = rid;
end $$;
revoke all on function public.otr_app_update(text,uuid,text,text,text,boolean,int,jsonb,jsonb) from public;
grant execute on function public.otr_app_update(text,uuid,text,text,text,boolean,int,jsonb,jsonb) to anon, authenticated;
select 'done' as r;
