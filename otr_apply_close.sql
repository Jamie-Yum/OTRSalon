-- 참가 신청 마감 스위치(otr_settings.apply.open) + 리피움 주니어 전용 신청은 마감 중에도 허용
insert into otr_settings(key,value,updated_at) values('apply','{"open":false}'::jsonb,now())
on conflict(key) do update set value=excluded.value, updated_at=now();

create or replace function public.otr_apply(
  name text, phone text, role text, inviter text, pass text, question text
) returns uuid
language plpgsql security definer set search_path = public as $$
declare rid uuid;
begin
  if coalesce((select (value->>'open')::boolean from otr_settings where key='apply'),true)=false
     and coalesce(pass,'') not like '리피움 주니어%' then
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
  insert into otr_applications(name,phone,role,inviter,pass,question)
  values(trim(name),trim(phone),trim(role),trim(inviter),trim(pass),trim(question)) returning id into rid;
  return rid;
end $$;
revoke all on function public.otr_apply(text,text,text,text,text,text) from public;
grant execute on function public.otr_apply(text,text,text,text,text,text) to anon, authenticated;
select key, value from otr_settings where key='apply';
