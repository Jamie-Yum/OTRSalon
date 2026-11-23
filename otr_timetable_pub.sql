-- 시간표 홈페이지 공개용: pub=false 줄 제외 + 괄호 안 사람 이름(한글 3자) 제거
create or replace function otr_public_schedule() returns jsonb
language sql security definer set search_path = public as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'salon_no', salon_no, 'year', year, 'month', month, 'event_date', event_date,
    'time_text', time_text, 'place', place, 'status', status, 'public_note', public_note,
    'timetable', case when timetable_public then
      (select coalesce(jsonb_agg(jsonb_build_object(
          't', x->>'t',
          'title', btrim(regexp_replace(coalesce(x->>'title',''), '\s*\([가-힣]{3}\)', '', 'g')),
          'note', btrim(regexp_replace(coalesce(x->>'note',''), '\s*\([가-힣]{3}\)', '', 'g'))
        ) order by i), '[]'::jsonb)
       from jsonb_array_elements(timetable) with ordinality e(x,i) where coalesce((x->>'pub')::boolean, true))
    else null end
  ) order by salon_no), '[]') from otr_schedule;
$$;
revoke all on function otr_public_schedule() from public;
grant execute on function otr_public_schedule() to anon, authenticated;
select jsonb_pretty(otr_public_schedule()->0->'timetable');
