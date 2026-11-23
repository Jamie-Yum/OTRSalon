-- 시간표 줄별 공개: 항목의 pub=false 인 줄은 홈페이지(공개 RPC)에서 제외
create or replace function otr_public_schedule() returns jsonb
language sql security definer set search_path = public as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'salon_no', salon_no, 'year', year, 'month', month, 'event_date', event_date,
    'time_text', time_text, 'place', place, 'status', status, 'public_note', public_note,
    'timetable', case when timetable_public then
      (select coalesce(jsonb_agg(x - 'pub'), '[]'::jsonb) from jsonb_array_elements(timetable) x
        where coalesce((x->>'pub')::boolean, true))
    else null end
  ) order by salon_no), '[]') from otr_schedule;
$$;
revoke all on function otr_public_schedule() from public;
grant execute on function otr_public_schedule() to anon, authenticated;
select 'ok';
