-- SEED DATA UNTUK MANGKICODE
-- Menambahkan Course dan Lesson awal sesuai referensi tampilan aplikasi

-- 1. Kursus Utama: Pengenalan Coding (Level 1)
insert into public.courses (slug, title, description, level, order_index, is_published)
values
  ('pengenalan-coding', 'Pengenalan Coding', 'Mulai petualangan belajarmu memahami dasar dunia pemrograman bersama MangKi!', 'beginner', 1, true),
  ('pengenalan-algoritma', 'Pengenalan Algoritma', 'Pelajari alur berpikir komputasional dan pemecahan masalah bertahap.', 'beginner', 2, true),
  ('level-2-struktur-data', 'Level 2: Struktur Data', 'Pelajari cara menyimpan dan mengolah data seperti List dan Array.', 'intermediate', 3, true)
on conflict (slug) do nothing;

-- 2. Materi Pelajaran (Lessons) untuk Kursus "Pengenalan Coding"
do $$
declare
  v_course_id bigint;
begin
  select id into v_course_id from public.courses where slug = 'pengenalan-coding' limit 1;
  
  if v_course_id is not null then
    insert into public.lessons (course_id, title, content, code_example, order_index, xp_reward, is_published)
    values
      (v_course_id, 'Dasar Pemrograman', 'Coding adalah seni memberi instruksi yang jelas kepada komputer agar dapat menyelesaikan tugas secara otomatis.', 'print("Halo Dunia Coding!")', 1, 10, true),
      (v_course_id, 'Variabel dan Tipe Data', 'Variabel ibarat kotak berlabel untuk menyimpan informasi berharga seperti angka dan teks.', 'nama = "MangKi"\npisang = 3', 2, 15, true),
      (v_course_id, 'Logika dan Percabangan', 'Dengan logika if-else, program kita bisa mengambil keputusan cerdas saat berjalan.', 'if pisang > 0:\n    print("MangKi kenyang!")', 3, 20, true)
    on conflict do nothing;
  end if;
end $$;

-- 3. Materi Pelajaran untuk "Pengenalan Algoritma"
do $$
declare
  v_course_id bigint;
begin
  select id into v_course_id from public.courses where slug = 'pengenalan-algoritma' limit 1;
  
  if v_course_id is not null then
    insert into public.lessons (course_id, title, content, code_example, order_index, xp_reward, is_published)
    values
      (v_course_id, 'Langkah Logis Algoritma', 'Algoritma adalah urutan langkah logis demi menyelesaikan persoalan secara efisien.', '# Langkah 1: Buka pisang\n# Langkah 2: Makan pisang', 1, 10, true),
      (v_course_id, 'Alur Keputusan Flowchart', 'Memetakan alur program dengan simbol visual sebelum menulis kode.', '# START -> DECISION -> END', 2, 15, true)
    on conflict do nothing;
  end if;
end $$;
