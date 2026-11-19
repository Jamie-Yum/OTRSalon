-- 회차별 당일 시간표 (관리자 작성 → '공개' 체크 시 홈페이지 노출)
alter table otr_schedule add column if not exists timetable jsonb not null default '[]'::jsonb;
alter table otr_schedule add column if not exists timetable_public boolean not null default false;

create or replace function otr_public_schedule() returns jsonb
language sql security definer set search_path = public as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'salon_no', salon_no, 'year', year, 'month', month, 'event_date', event_date,
    'time_text', time_text, 'place', place, 'status', status, 'public_note', public_note,
    'timetable', case when timetable_public then timetable else null end
  ) order by salon_no), '[]') from otr_schedule;
$$;
revoke all on function otr_public_schedule() from public;
grant execute on function otr_public_schedule() to anon, authenticated;

update otr_schedule set timetable = '[
  {"t":"07:10","title":"입장 · 체크인","note":"간단한 조찬이 준비되어 있습니다"},
  {"t":"07:30","title":"오프닝","note":"진행자 소개와 오늘의 흐름"},
  {"t":"","title":"이야기","note":"연사가 걸어온 길"},
  {"t":"","title":"질문","note":"미리 남겨 주신 질문으로 묻습니다"},
  {"t":"","title":"깊은 대화","note":""},
  {"t":"","title":"현장 질문","note":""},
  {"t":"","title":"마무리 · 배웅","note":""}
]'::jsonb
where salon_no = 1 and season_no = 1 and timetable = '[]'::jsonb;
select salon_no, jsonb_array_length(timetable) n, timetable_public from otr_schedule order by salon_no;
