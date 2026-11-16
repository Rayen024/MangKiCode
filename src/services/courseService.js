import { supabase } from './supabase';

// Data bawaan sesuai schema supabase/migrations/001_init.sql & 002_seed_data.sql
export const FALLBACK_COURSES = [
  {
    id: 1,
    slug: 'pengenalan-coding',
    title: 'Pengenalan Coding',
    description: 'Mulai petualangan belajarmu memahami dasar dunia pemrograman bersama MangKi!',
    level: 'beginner',
    order_index: 1,
    is_published: true,
    lessons: [
      {
        id: 1,
        course_id: 1,
        title: 'Dasar Pemrograman',
        content: 'Coding adalah seni memberi instruksi yang jelas kepada komputer.',
        order_index: 1,
        xp_reward: 10,
        is_published: true,
      },
      {
        id: 2,
        course_id: 1,
        title: 'Variabel dan Tipe Data',
        content: 'Variabel ibarat kotak berlabel untuk menyimpan informasi.',
        order_index: 2,
        xp_reward: 15,
        is_published: true,
      },
      {
        id: 3,
        course_id: 1,
        title: 'Logika dan Percabangan',
        content: 'Dengan logika if-else, program bisa mengambil keputusan.',
        order_index: 3,
        xp_reward: 20,
        is_published: true,
      },
    ],
  },
  {
    id: 2,
    slug: 'pengenalan-algoritma',
    title: 'Pengenalan Algoritma',
    description: 'Pelajari alur berpikir komputasional dan pemecahan masalah bertahap.',
    level: 'beginner',
    order_index: 2,
    is_published: true,
    lessons: [
      {
        id: 4,
        course_id: 2,
        title: 'Langkah Logis Algoritma',
        content: 'Algoritma adalah urutan langkah logis demi menyelesaikan persoalan.',
        order_index: 1,
        xp_reward: 10,
        is_published: true,
      },
    ],
  },
];

/**
 * Mengambil semua kursus yang dipublikasikan beserta daftar pelajarannya
 */
export async function getCourses() {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*, lessons(*)')
      .eq('is_published', true)
      .order('order_index', { ascending: true });

    if (error || !data || data.length === 0) {
      return FALLBACK_COURSES;
    }

    return data;
  } catch (err) {
    console.warn('Gagal memuat courses dari Supabase, menggunakan data default:', err.message);
    return FALLBACK_COURSES;
  }
}

/**
 * Mengambil kursus aktif pertama atau berdasarkan slug
 */
export async function getActiveCourse(slug = 'pengenalan-coding') {
  try {
    const courses = await getCourses();
    const active = courses.find(c => c.slug === slug);
    return active || courses[0] || FALLBACK_COURSES[0];
  } catch (err) {
    return FALLBACK_COURSES[0];
  }
}
