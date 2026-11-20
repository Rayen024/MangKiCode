/**
 * Sumber Data Terstruktur Materi Belajar mangkiCode
 * Berdasarkan modul-mangkicode.md
 * Untuk siswa SMA/SMK Kelas X (Fase E)
 */

export const MODUL_BELAJAR = [
  // ══════════════════════════════════════════════════════════════════
  // MODUL 1: PENGENALAN ALGORITMA (9 Pelajaran, 3 Set Latihan)
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'modul-1',
    urutan: 1,
    judul: 'Pengenalan Algoritma',
    deskripsi: 'Pahami logika berpikir komputasional, flowchart, input/output, variabel, dan operator.',
    ikon: 'IconLightbulb',
    estimasiMenit: 35,
    pelajaran: [
      // ── Kelompok 1: Konsep Algoritma (Pelajaran 1 - 3) ────────────
      {
        id: 'p-1-1',
        urutan: 1,
        judul: 'Apa itu Algoritma?',
        kelompok: 'Konsep Algoritma',
        blok: [
          {
            halaman: 1,
            tipe: 'teks',
            isi: 'Algoritma adalah urutan langkah yang jelas dan terbatas untuk menyelesaikan suatu masalah.\n\nContoh dalam kehidupan sehari-hari: resep masakan, cara menyeberang jalan, atau langkah membuat mi instan.',
          },
          {
            halaman: 1,
            tipe: 'catatan',
            isi: 'Ciri-ciri algoritma yang baik:\n• **Jelas**: setiap langkah tidak membingungkan.\n• **Berurutan**: langkah dijalankan dari atas ke bawah.\n• **Terbatas**: ada titik awal dan titik akhir.\n• **Menghasilkan keluaran**: ada hasil yang diharapkan.',
          },
          {
            halaman: 2,
            tipe: 'teks',
            isi: 'Mari perhatikan contoh sederhana: langkah monyet makan pisang berikut ini.',
          },
          {
            halaman: 2,
            tipe: 'pseudocode',
            baris: [
              '1. Mulai',
              '2. Panjat pohon',
              '3. Petik pisang',
              '4. Kupas pisang',
              '5. Makan pisang',
              '6. Selesai',
            ],
          },
          {
            halaman: 2,
            tipe: 'catatan',
            isi: '**Coba pikirkan:** apa yang terjadi jika langkah 3 dan 4 ditukar? Urutan sangat menentukan hasil!',
          },
        ],
      },
      {
        id: 'p-1-2',
        urutan: 2,
        judul: 'Pseudocode dan Diagram Alur',
        kelompok: 'Konsep Algoritma',
        blok: [
          {
            halaman: 1,
            tipe: 'teks',
            isi: '**Pseudocode** adalah cara menulis algoritma dengan bahasa sehari-hari yang mirip kode, tetapi tidak terikat bahasa pemrograman tertentu.\n\n**Diagram alur (flowchart)** adalah gambar visual dari jalannya algoritma.',
          },
          {
            halaman: 1,
            tipe: 'tabel',
            kolom: ['Simbol', 'Nama', 'Fungsi'],
            baris: [
              ['Oval', 'Terminator', 'Awal (Mulai) dan akhir (Selesai)'],
              ['Persegi panjang', 'Proses', 'Langkah aksi atau perintah'],
              ['Jajar genjang', 'Input/Output', 'Membaca data atau menampilkan hasil'],
              ['Belah ketupat', 'Keputusan', 'Pertanyaan ya atau tidak'],
              ['Panah', 'Alur', 'Arah jalannya langkah'],
            ],
          },
          {
            halaman: 2,
            tipe: 'teks',
            isi: 'Berikut adalah contoh algoritma monyet mencari pisang dalam bentuk **pseudocode** dan **diagram alur**.',
          },
          {
            halaman: 2,
            tipe: 'pseudocode',
            baris: [
              'MULAI',
              '  maju 2 kali',
              '  belok kanan',
              '  maju 2 kali',
              '  ambil pisang',
              'SELESAI',
            ],
          },
          {
            halaman: 2,
            tipe: 'diagram',
            node: [
              { id: '1', jenis: 'mulai', label: 'Mulai' },
              { id: '2', jenis: 'proses', label: 'Maju 2 kali' },
              { id: '3', jenis: 'proses', label: 'Belok kanan' },
              { id: '4', jenis: 'proses', label: 'Maju 2 kali' },
              { id: '5', jenis: 'proses', label: 'Ambil pisang' },
              { id: '6', jenis: 'selesai', label: 'Selesai' },
            ],
            sambungan: [
              { dari: '1', ke: '2' },
              { dari: '2', ke: '3' },
              { dari: '3', ke: '4' },
              { dari: '4', ke: '5' },
              { dari: '5', ke: '6' },
            ],
          },
        ],
      },
      {
        id: 'p-1-3',
        urutan: 3,
        judul: 'Tiga Struktur Dasar Algoritma',
        kelompok: 'Konsep Algoritma',
        blok: [
          {
            halaman: 1,
            tipe: 'teks',
            isi: 'Semua program komputer, sesederhana atau sekompleks apa pun, selalu tersusun dari tiga struktur dasar:\n\n1. **Urutan (Sequence)**: langkah dijalankan satu per satu dari atas ke bawah.\n2. **Percabangan (Selection)**: memilih langkah berdasarkan syarat (misal: jika hujan, bawa payung).\n3. **Perulangan (Iteration)**: mengulang langkah beberapa kali (misal: maju sampai tiba di pohon).',
          },
          {
            halaman: 1,
            tipe: 'catatan',
            isi: 'Modul 2 akan membahas **urutan** lebih dalam, sedangkan Modul 3 dan 4 membahas **percabangan** dan **perulangan**. Pada modul awal ini, fokus utama kita adalah memahami urutan.',
          },
          {
            halaman: 2,
            tipe: 'teks',
            isi: '**Ringkasan Konsep Algoritma:**\nAlgoritma adalah langkah berurutan yang jelas dan terbatas. Pseudocode dan flowchart membantu kita merancang solusi logis sebelum menulis kode program.',
          },
        ],
      },

      // ── Kelompok 2: Input dan Output (Pelajaran 4 - 6) ────────────
      {
        id: 'p-1-4',
        urutan: 4,
        judul: 'Output dengan print()',
        kelompok: 'Input dan Output',
        blok: [
          {
            halaman: 1,
            tipe: 'teks',
            isi: 'Program perlu menampilkan hasil kepada pengguna. Di Python, perintah untuk menampilkan teks atau data ke layar adalah `print()`.',
          },
          {
            halaman: 1,
            tipe: 'kode',
            bahasa: 'python',
            isi: 'print("Halo, Monyet!")\nprint("Aku mencari pisang")',
          },
          {
            halaman: 2,
            tipe: 'catatan',
            isi: '**Catatan penting perintah print:**\n• Teks harus diapit tanda kutip `"..."` atau `\'...\'`.\n• Setiap perintah `print()` otomatis berpindah ke baris baru.\n• Angka dapat dicetak langsung tanpa tanda kutip: `print(5 + 3)` menghasilkan `8`.\n• Komentar diawali tanda `#` dan tidak akan dijalankan oleh komputer.',
          },
          {
            halaman: 2,
            tipe: 'kode',
            bahasa: 'python',
            isi: '# Ini komentar, tidak ditampilkan ke layar\nprint("Pisang ada " + "3 buah")',
          },
        ],
      },
      {
        id: 'p-1-5',
        urutan: 5,
        judul: 'Input dengan input()',
        kelompok: 'Input dan Output',
        blok: [
          {
            halaman: 1,
            tipe: 'teks',
            isi: 'Untuk menerima data atau masukan dari pengguna, gunakan perintah `input()`. Program akan berhenti sejenak menunggu pengguna mengetik dan menekan tombol Enter.',
          },
          {
            halaman: 1,
            tipe: 'kode',
            bahasa: 'python',
            isi: 'nama = input("Siapa namamu? ")\nprint("Halo, " + nama)',
          },
          {
            halaman: 2,
            tipe: 'catatan',
            isi: '**Hal yang sering membingungkan pemula:**\nPerintah `input()` selalu menghasilkan data bertipe **teks (string)**, meskipun pengguna mengetik angka! Untuk keperluan perhitungan matematika, teks harus diubah menjadi angka terlebih dahulu.',
          },
          {
            halaman: 2,
            tipe: 'kode',
            bahasa: 'python',
            isi: 'umur = int(input("Umurmu? "))          # bilangan bulat\ntinggi = float(input("Tinggi (m)? "))  # bilangan desimal',
          },
          {
            halaman: 2,
            tipe: 'tabel',
            kolom: ['Fungsi', 'Hasil', 'Contoh'],
            baris: [
              ['int()', 'Bilangan bulat', 'int("7") menjadi 7'],
              ['float()', 'Bilangan desimal', 'float("1.5") menjadi 1.5'],
              ['str()', 'Teks (string)', 'str(7) menjadi "7"'],
            ],
          },
        ],
      },
      {
        id: 'p-1-6',
        urutan: 6,
        judul: 'Pola Masukan, Proses, Keluaran',
        kelompok: 'Input dan Output',
        blok: [
          {
            halaman: 1,
            tipe: 'teks',
            isi: 'Hampir semua program komputer mengikuti pola dasar: **Input (Masukan) → Proses → Output (Keluaran)**.\n\nMari kita hitung total pisang yang dikumpulkan monyet di pagi dan sore hari.',
          },
          {
            halaman: 1,
            tipe: 'pseudocode',
            baris: [
              'MULAI',
              '  baca jumlah_pisang_pagi',
              '  baca jumlah_pisang_sore',
              '  total = jumlah_pisang_pagi + jumlah_pisang_sore',
              '  tampilkan total',
              'SELESAI',
            ],
          },
          {
            halaman: 1,
            tipe: 'diagram',
            node: [
              { id: '1', jenis: 'mulai', label: 'Mulai' },
              { id: '2', jenis: 'io', label: 'Baca pisang pagi' },
              { id: '3', jenis: 'io', label: 'Baca pisang sore' },
              { id: '4', jenis: 'proses', label: 'total = pagi + sore' },
              { id: '5', jenis: 'io', label: 'Tampilkan total' },
              { id: '6', jenis: 'selesai', label: 'Selesai' },
            ],
            sambungan: [
              { dari: '1', ke: '2' },
              { dari: '2', ke: '3' },
              { dari: '3', ke: '4' },
              { dari: '4', ke: '5' },
              { dari: '5', ke: '6' },
            ],
          },
          {
            halaman: 2,
            tipe: 'teks',
            isi: 'Berikut adalah implementasi programnya dalam bahasa Python, termasuk cara memformat teks menggunakan **f-string** modern:',
          },
          {
            halaman: 2,
            tipe: 'kode',
            bahasa: 'python',
            isi: 'pagi = int(input("Pisang pagi: "))\nsore = int(input("Pisang sore: "))\ntotal = pagi + sore\n\n# Format f-string\nprint(f"Monyet makan {total} pisang hari ini")',
          },
          {
            halaman: 2,
            tipe: 'catatan',
            isi: '**Ringkasan:** `print()` menampilkan keluaran, `input()` menerima masukan sebagai teks, dan `int()` atau `float()` mengubah teks menjadi angka.',
          },
        ],
      },

      // ── Kelompok 3: Variabel (Pelajaran 7 - 9) ────────────────────
      {
        id: 'p-1-7',
        urutan: 7,
        judul: 'Konsep Variabel',
        kelompok: 'Variabel',
        blok: [
          {
            halaman: 1,
            tipe: 'teks',
            isi: 'Variabel adalah **wadah bernama** untuk menyimpan data di memori komputer. Bayangkan keranjang berlabel "pisang" yang isinya bisa diambil atau diganti kapan saja.',
          },
          {
            halaman: 1,
            tipe: 'kode',
            bahasa: 'python',
            isi: 'pisang = 5\nnama = "Mangki"\nprint(nama, "punya", pisang, "pisang")',
          },
          {
            halaman: 1,
            tipe: 'catatan',
            isi: 'Tanda sama dengan (`=`) dalam pemrograman berarti **mengisi nilai**, bukan "sama dengan" matematika. Nilai di sebelah kanan disimpan ke dalam wadah di sebelah kiri.',
          },
          {
            halaman: 2,
            tipe: 'teks',
            isi: 'Isi variabel dapat diperbarui kapan saja selama program dijalankan:',
          },
          {
            halaman: 2,
            tipe: 'kode',
            bahasa: 'python',
            isi: 'pisang = 5\npisang = pisang + 2   # sekarang pisang bernilai 7\nprint(pisang)',
          },
          {
            halaman: 2,
            tipe: 'catatan',
            isi: '**Aturan penamaan variabel di Python:**\n• Boleh berisi huruf, angka, dan garis bawah `_`.\n• Tidak boleh diawali angka (`1pisang` salah, `pisang1` benar).\n• Tidak boleh menggunakan spasi (gunakan `jumlah_pisang`).\n• Bersifat *case-sensitive* (`Pisang` dan `pisang` berbeda).\n• Beri nama yang bermakna (misal: `umur` lebih jelas daripada `x`).',
          },
        ],
      },
      {
        id: 'p-1-8',
        urutan: 8,
        judul: 'Tipe Data Dasar',
        kelompok: 'Variabel',
        blok: [
          {
            halaman: 1,
            tipe: 'teks',
            isi: 'Setiap nilai yang disimpan di dalam variabel memiliki tipe data tertentu. Python mengenali tipe data secara otomatis (*dynamic typing*).',
          },
          {
            halaman: 1,
            tipe: 'tabel',
            kolom: ['Tipe', 'Nama Python', 'Contoh', 'Kegunaan'],
            baris: [
              ['Bilangan bulat', 'int', '5, -3, 100', 'Jumlah, hitungan'],
              ['Bilangan desimal', 'float', '3.14, 1.5', 'Tinggi, harga, nilai pecahan'],
              ['Teks', 'str', '"Mangki"', 'Nama, kalimat'],
              ['Benar / Salah', 'bool', 'True, False', 'Hasil pengujian syarat'],
            ],
          },
          {
            halaman: 2,
            tipe: 'teks',
            isi: 'Kita dapat memeriksa jenis tipe data suatu nilai dengan fungsi bawaan `type()`:',
          },
          {
            halaman: 2,
            tipe: 'kode',
            bahasa: 'python',
            isi: 'print(type(5))        # <class \'int\'>\nprint(type(1.5))      # <class \'float\'>\nprint(type("halo"))   # <class \'str\'>\nprint(type(True))     # <class \'bool\'>',
          },
          {
            halaman: 2,
            tipe: 'catatan',
            isi: 'Karena Python menentukan tipe data secara otomatis, kita tidak perlu mendeklarasikan tipe data di depan nama variabel seperti pada bahasa C atau Java.',
          },
        ],
      },
      {
        id: 'p-1-9',
        urutan: 9,
        judul: 'Operator',
        kelompok: 'Variabel',
        blok: [
          {
            halaman: 1,
            tipe: 'teks',
            isi: 'Operator adalah simbol khusus untuk melakukan manipulasi nilai, seperti menghitung angka atau membandingkan dua nilai.',
          },
          {
            halaman: 1,
            tipe: 'tabel',
            kolom: ['Operator', 'Fungsi', 'Contoh', 'Hasil'],
            baris: [
              ['+', 'Tambah', '7 + 2', '9'],
              ['-', 'Kurang', '7 - 2', '5'],
              ['*', 'Kali', '7 * 2', '14'],
              ['/', 'Bagi', '7 / 2', '3.5'],
              ['//', 'Bagi bulat', '7 // 2', '3'],
              ['%', 'Sisa bagi (modulo)', '7 % 2', '1'],
              ['**', 'Pangkat', '7 ** 2', '49'],
            ],
          },
          {
            halaman: 2,
            tipe: 'teks',
            isi: '**Operator Perbandingan** digunakan untuk membandingkan dua nilai. Hasilnya selalu bertipe boolean (`True` atau `False`):',
          },
          {
            halaman: 2,
            tipe: 'tabel',
            kolom: ['Operator', 'Arti', 'Contoh'],
            baris: [
              ['==', 'Sama dengan', '5 == 5  → True'],
              ['!=', 'Tidak sama dengan', '5 != 3  → True'],
              ['> dan <', 'Lebih besar, lebih kecil', '5 > 3   → True'],
              ['>= dan <=', 'Lebih besar/kecil atau sama', '5 <= 3  → False'],
            ],
          },
          {
            halaman: 3,
            tipe: 'teks',
            isi: '**Studi Kasus: Menukar Isi Dua Variabel**\nBagaimana cara menukar isi variabel `a` dan `b`? Kita butuh wadah pembantu sementara (`temp`):',
          },
          {
            halaman: 3,
            tipe: 'kode',
            bahasa: 'python',
            isi: 'a = 10\nb = 20\n\ntemp = a   # simpan nilai a ke temp\na = b      # isi a dengan nilai b\nb = temp   # isi b dengan nilai awal a\n\nprint(a, b)  # Hasil: 20 10',
          },
          {
            halaman: 3,
            tipe: 'catatan',
            isi: '**Ringkasan:** Variabel menyimpan data, tipe data menentukan jenis nilai, dan operator dipakai untuk menghitung serta membandingkan data.',
          },
        ],
      },
    ],
    latihan: [
      // Set 1: Latihan Pelajaran 1-3 (setelahPelajaran: 3)
      {
        id: 'soal-1-1',
        setelahPelajaran: 3,
        jenis: 'pilihan_ganda',
        pertanyaan: 'Manakah di bawah ini yang BUKAN merupakan ciri algoritma yang baik?',
        opsi: [
          'Setiap langkah jelas dan tidak ambigu',
          'Langkah dijalankan secara berurutan',
          'Berjalan terus-menerus dan tidak pernah berhenti',
          'Menghasilkan keluaran atau solusi yang diharapkan',
        ],
        kunci: 'Berjalan terus-menerus dan tidak pernah berhenti',
        penjelasan: 'Algoritma yang baik harus terbatas (memiliki titik awal dan akhir yang jelas), sehingga tidak boleh berjalan tanpa batas.',
      },
      {
        id: 'soal-1-2',
        setelahPelajaran: 3,
        jenis: 'susun_urutan',
        pertanyaan: 'Susun langkah-langkah membuat teh manis berikut dalam urutan yang tepat:',
        opsi: [
          'Masukkan teh celup',
          'Tuang air panas',
          'Tambah gula',
          'Aduk hingga larut',
          'Minum teh manis',
        ],
        kunci: [
          'Masukkan teh celup',
          'Tuang air panas',
          'Tambah gula',
          'Aduk hingga larut',
          'Minum teh manis',
        ],
        penjelasan: 'Urutan logis: masukkan kantong teh, tuang air panas, tambahkan gula, aduk rata, lalu minum.',
      },
      {
        id: 'soal-1-3',
        setelahPelajaran: 3,
        jenis: 'buat_program',
        pertanyaan: 'Tulis pseudocode agar monyet berjalan dari titik A ke pohon yang berada 3 langkah di depan, lalu memetik pisang.',
        petunjukKode: 'MULAI\n  # Tulis langkah monyet di sini\nSELESAI',
        kunci: 'MULAI\n  maju 3 langkah\n  petik pisang\nSELESAI',
        penjelasan: 'Urutan langkah yang jelas: Mulai, maju 3 langkah menuju pohon, petik pisang, lalu Selesai.',
      },

      // Set 2: Latihan Pelajaran 4-6 (setelahPelajaran: 6)
      {
        id: 'soal-1-4',
        setelahPelajaran: 6,
        jenis: 'tebak_keluaran',
        pertanyaan: 'Apa keluaran yang tampil di layar dari kode Python berikut?\n\nprint("2" + "3")',
        opsi: ['5', '23', 'Error', '"23"'],
        kunci: '23',
        penjelasan: 'Karena "2" dan "3" diapit tanda kutip, keduanya bertipe string (teks). Operator + pada string akan menggabungkan teks, bukan menjumlahkannya.',
      },
      {
        id: 'soal-1-5',
        setelahPelajaran: 6,
        jenis: 'perbaiki_kode',
        pertanyaan: 'Kode berikut menghasilkan error saat dijalankan. Perbaiki agar input angka berhasil dijumlahkan dengan 5:',
        petunjukKode: 'a = input("Angka: ")\nprint(a + 5)',
        kunci: 'a = int(input("Angka: "))\nprint(a + 5)',
        penjelasan: 'Fungsi input() menghasilkan teks (str). Kita harus membungkusnya dengan int(input(...)) agar menjadi angka bulat sebelum dijumlahkan.',
      },
      {
        id: 'soal-1-6',
        setelahPelajaran: 6,
        jenis: 'buat_program',
        pertanyaan: 'Buat program yang meminta input nama dan jumlah pisang, lalu menampilkan: "Budi memiliki 5 pisang"',
        petunjukKode: 'nama = input("Nama: ")\njumlah = input("Jumlah pisang: ")\n# Tampilkan hasil dengan print\n',
        kunci: 'nama = input("Nama: ")\njumlah = input("Jumlah pisang: ")\nprint(f"{nama} memiliki {jumlah} pisang")',
        penjelasan: 'Gunakan print(f"{nama} memiliki {jumlah} pisang") atau print(nama, "memiliki", jumlah, "pisang").',
      },

      // Set 3: Latihan Pelajaran 7-9 (setelahPelajaran: 9)
      {
        id: 'soal-1-7',
        setelahPelajaran: 9,
        jenis: 'pilihan_ganda',
        pertanyaan: 'Nama variabel manakah yang valid dalam aturan bahasa Python?',
        opsi: ['2pisang', 'jumlah pisang', 'jumlah_pisang', 'pisang-1'],
        kunci: 'jumlah_pisang',
        penjelasan: 'Nama variabel di Python tidak boleh diawali angka, tidak boleh mengandung spasi, dan tidak boleh memakai strip (-). Menggunakan garis bawah (_) diperbolehkan.',
      },
      {
        id: 'soal-1-8',
        setelahPelajaran: 9,
        jenis: 'tebak_keluaran',
        pertanyaan: 'Berapakah hasil dari operasi modulo 17 % 5 dalam Python?',
        opsi: ['3', '2', '3.4', '1'],
        kunci: '2',
        penjelasan: 'Operator % menghitung sisa bagi. 17 dibagi 5 adalah 3 dengan sisa 2 (karena 5 × 3 = 15, dan 17 - 15 = 2).',
      },
      {
        id: 'soal-1-9',
        setelahPelajaran: 9,
        jenis: 'tebak_keluaran',
        pertanyaan: 'Apa tipe data berturut-turut dari nilai "7", 7, dan 7.0?',
        opsi: [
          'str, int, float',
          'int, int, float',
          'str, float, int',
          'str, int, int',
        ],
        kunci: 'str, int, float',
        penjelasan: '"7" diapit kutip bertipe string (str), 7 adalah bilangan bulat (int), dan 7.0 memiliki titik desimal (float).',
      },
      {
        id: 'soal-1-10',
        setelahPelajaran: 9,
        jenis: 'buat_program',
        pertanyaan: 'Hitung total harga: harga sebuah pisang Rp3.000 dan dibeli sebanyak 4 buah. Hitung totalnya menggunakan variabel dan tampilkan hasilnya:',
        petunjukKode: 'harga = 3000\njumlah = 4\n# Hitung total dan cetak\n',
        kunci: 'harga = 3000\njumlah = 4\ntotal = harga * jumlah\nprint(total)',
        penjelasan: 'Kalikan variabel harga dengan jumlah (harga * jumlah), simpan ke variabel total, lalu cetak dengan print(total).',
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // MODUL 2: URUTAN PERINTAH (SEQUENCE) (3 Pelajaran, 1 Set Latihan)
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'modul-2',
    urutan: 2,
    judul: 'Urutan Perintah (Sequence)',
    deskripsi: 'Menyusun perintah dalam urutan yang tepat, menelusuri jalannya kode, dan memperbaiki kesalahan urutan.',
    ikon: 'IconSteps',
    estimasiMenit: 12,
    pelajaran: [
      {
        id: 'p-2-1',
        urutan: 1,
        judul: 'Urutan Itu Penting',
        blok: [
          {
            halaman: 1,
            tipe: 'teks',
            isi: '**Urutan (sequence)** adalah struktur paling mendasar dalam algoritma: perintah dijalankan **satu per satu dari atas ke bawah**.\n\nKomputer tidak melompat dan tidak menebak maksud kita. Jika urutan salah, hasilnya pasti keliru.',
          },
          {
            halaman: 1,
            tipe: 'catatan',
            isi: 'Contoh dalam kehidupan sehari-hari: memakai kaus kaki dan sepatu. Jika sepatu dipakai lebih dahulu baru kaus kaki, hasilnya tentu salah.',
          },
          {
            halaman: 2,
            tipe: 'teks',
            isi: 'Tiga aturan utama urutan:\n1. Satu perintah mengerjakan satu aksi.\n2. Perintah dijalankan dari baris atas ke baris bawah.\n3. Hasil perintah sebelumnya menjadi bahan untuk perintah berikutnya.',
          },
          {
            halaman: 2,
            tipe: 'kode',
            bahasa: 'python',
            isi: 'pisang = 5\npisang = pisang + 3\nprint(pisang)   # Menghasilkan 8',
          },
          {
            halaman: 2,
            tipe: 'catatan',
            isi: 'Bandingkan jika dua baris awal ditukar:\n```python\npisang = pisang + 3\npisang = 5\n```\nProgram akan langsung **error** (`NameError`), karena variabel `pisang` belum dibuat saat baris pertama dijalankan!',
          },
        ],
      },
      {
        id: 'p-2-2',
        urutan: 2,
        judul: 'Contoh: Monyet Mencari Pisang',
        blok: [
          {
            halaman: 1,
            tipe: 'teks',
            isi: 'Monyet berdiri di titik (0, 0) dan menghadap ke atas. Pisang berada di titik (2, 2). Perintah yang tersedia hanya `maju()` dan `belokKanan()`.',
          },
          {
            halaman: 1,
            tipe: 'grid_monyet',
            monyet: { x: 0, y: 0, arah: 'atas' },
            target: { x: 2, y: 2, label: 'Pisang' },
            ukuran: 3,
          },
          {
            halaman: 2,
            tipe: 'pseudocode',
            baris: [
              '1. maju()',
              '2. maju()',
              '3. belokKanan()',
              '4. maju()',
              '5. maju()',
            ],
          },
          {
            halaman: 2,
            tipe: 'diagram',
            node: [
              { id: '1', jenis: 'mulai', label: 'Mulai' },
              { id: '2', jenis: 'proses', label: 'Maju 2 kali' },
              { id: '3', jenis: 'proses', label: 'Belok kanan' },
              { id: '4', jenis: 'proses', label: 'Maju 2 kali' },
              { id: '5', jenis: 'selesai', label: 'Selesai' },
            ],
            sambungan: [
              { dari: '1', ke: '2' },
              { dari: '2', ke: '3' },
              { dari: '3', ke: '4' },
              { dari: '4', ke: '5' },
            ],
          },
          {
            halaman: 3,
            tipe: 'tabel',
            kolom: ['Langkah', 'Perintah', 'Posisi', 'Menghadap'],
            baris: [
              ['Awal', '-', '(0, 0)', 'Atas'],
              ['1', 'maju()', '(0, 1)', 'Atas'],
              ['2', 'maju()', '(0, 2)', 'Atas'],
              ['3', 'belokKanan()', '(0, 2)', 'Kanan'],
              ['4', 'maju()', '(1, 2)', 'Kanan'],
              ['5', 'maju()', '(2, 2)', 'Kanan'],
            ],
          },
          {
            halaman: 3,
            tipe: 'catatan',
            isi: 'Monyet berhasil tiba di koordinat (2, 2) dan menemukan pisang!',
          },
        ],
      },
      {
        id: 'p-2-3',
        urutan: 3,
        judul: 'Menelusuri dan Memperbaiki Urutan',
        blok: [
          {
            halaman: 1,
            tipe: 'teks',
            isi: '**Menelusuri (tracing)** adalah teknik menjalankan program di kepala atau di kertas, baris demi baris, sambil mencatat perubahan nilai variabel. Ini cara terbaik untuk menemukan bug.',
          },
          {
            halaman: 1,
            tipe: 'kode',
            bahasa: 'python',
            isi: 'a = 2\nb = 3\na = a + b\nb = a * 2\nprint(a, b)',
          },
          {
            halaman: 1,
            tipe: 'tabel',
            kolom: ['Baris', 'Perintah', 'Nilai a', 'Nilai b'],
            baris: [
              ['1', 'a = 2', '2', '-'],
              ['2', 'b = 3', '2', '3'],
              ['3', 'a = a + b', '5', '3'],
              ['4', 'b = a * 2', '5', '10'],
              ['5', 'print(a, b)', '5', '10'],
            ],
          },
          {
            halaman: 2,
            tipe: 'teks',
            isi: 'Tiga kesalahan urutan yang paling sering terjadi:\n• **Urutan terbalik**: memakai data sebelum dibuat.\n• **Langkah hilang**: lupa berbelok sehingga tidak sampai ke tujuan.\n• **Langkah berlebih**: melangkah terlalu jauh melebihi target.',
          },
          {
            halaman: 2,
            tipe: 'catatan',
            isi: '**Ringkasan:** Urutan menentukan hasil akhir. Komputer menjalankan instruksi dari atas ke bawah, dan tabel penelusuran sangat membantu menemukan letak kesalahan.',
          },
        ],
      },
    ],
    latihan: [
      {
        id: 'soal-2-1',
        setelahPelajaran: 3,
        jenis: 'susun_urutan',
        pertanyaan: 'Susun langkah-langkah mengirim pesan berikut dalam urutan yang tepat:',
        opsi: [
          'Buka aplikasi pesan',
          'Pilih kontak tujuan',
          'Ketik pesan yang ingin dikirim',
          'Tekan tombol kirim',
        ],
        kunci: [
          'Buka aplikasi pesan',
          'Pilih kontak tujuan',
          'Ketik pesan yang ingin dikirim',
          'Tekan tombol kirim',
        ],
        penjelasan: 'Urutan logis: buka aplikasi, cari kontak, tulis pesannya, lalu tekan kirim.',
      },
      {
        id: 'soal-2-2',
        setelahPelajaran: 3,
        jenis: 'pilihan_ganda',
        pertanyaan: 'Monyet berada di (0, 0) menghadap atas, lalu menjalankan perintah: maju(), belokKanan(), maju(), maju(), maju(). Di manakah monyet berhenti?',
        opsi: [
          '(3, 1), menghadap kanan',
          '(1, 3), menghadap atas',
          '(3, 0), menghadap kanan',
          '(1, 1), menghadap atas',
        ],
        kunci: '(3, 1), menghadap kanan',
        penjelasan: 'Maju pertama ke (0, 1). Belok kanan menghadap kanan. Lalu maju 3 kali ke arah sumbu X: (1, 1), (2, 1), (3, 1).',
      },
      {
        id: 'soal-2-3',
        setelahPelajaran: 3,
        jenis: 'tebak_keluaran',
        pertanyaan: 'Apa keluaran program berikut?\n\nx = 4\ny = x + 1\nx = y * 2\nprint(x, y)',
        opsi: ['10 5', '8 5', '10 4', '5 10'],
        kunci: '10 5',
        penjelasan: 'x = 4. Lalu y = 4 + 1 = 5. Kemudian x = 5 * 2 = 10. Baris terakhir mencetak "10 5".',
      },
      {
        id: 'soal-2-4',
        setelahPelajaran: 3,
        jenis: 'perbaiki_kode',
        pertanyaan: 'Kode berikut error karena urutan terbalik. Susun ulang barisnya agar menghasilkan 12000:',
        petunjukKode: 'total = harga * jumlah\nharga = 3000\njumlah = 4\nprint(total)',
        kunci: 'harga = 3000\njumlah = 4\ntotal = harga * jumlah\nprint(total)',
        penjelasan: 'Variabel harga dan jumlah harus didefinisikan terlebih dahulu sebelum dihitung di dalam variabel total.',
      },
      {
        id: 'soal-2-5',
        setelahPelajaran: 3,
        jenis: 'buat_program',
        pertanyaan: 'Monyet di (0, 0) menghadap atas. Tulis urutan perintah agar monyet tiba di pisang pada titik (3, 1):',
        petunjukKode: '# Gunakan perintah maju() dan belokKanan()\n',
        kunci: 'maju()\nbelokKanan()\nmaju()\nmaju()\nmaju()',
        penjelasan: 'Maju 1 langkah ke atas (0, 1), belok kanan menghadap kanan, lalu maju 3 langkah ke (3, 1).',
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // MODUL 3: PERCABANGAN (CONDITIONALS) (3 Pelajaran, 1 Set Latihan)
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'modul-3',
    urutan: 3,
    judul: 'Percabangan (Conditionals)',
    deskripsi: 'Membuat program mengambil keputusan menggunakan if, elif, else, dan operator logika.',
    ikon: 'IconBranch',
    estimasiMenit: 15,
    pelajaran: [
      {
        id: 'p-3-1',
        urutan: 1,
        judul: 'if dan else',
        blok: [
          {
            halaman: 1,
            tipe: 'teks',
            isi: 'Percabangan memungkinkan program mengambil keputusan berdasarkan syarat tertentu.\n\nContoh: **jika** pohon berbuah, monyet memanjat pohon. **Jika tidak**, monyet mencari pohon lain.',
          },
          {
            halaman: 1,
            tipe: 'pseudocode',
            baris: [
              'JIKA pohon_berbuah MAKA',
              '  panjat pohon',
              'JIKA TIDAK',
              '  cari pohon lain',
            ],
          },
          {
            halaman: 1,
            tipe: 'diagram',
            node: [
              { id: '1', jenis: 'mulai', label: 'Mulai' },
              { id: '2', jenis: 'keputusan', label: 'Pohon berbuah?' },
              { id: '3', jenis: 'proses', label: 'Panjat pohon' },
              { id: '4', jenis: 'proses', label: 'Cari pohon lain' },
              { id: '5', jenis: 'selesai', label: 'Selesai' },
            ],
            sambungan: [
              { dari: '1', ke: '2' },
              { dari: '2', ke: '3', label: 'ya' },
              { dari: '2', ke: '4', label: 'tidak' },
              { dari: '3', ke: '5' },
              { dari: '4', ke: '5' },
            ],
          },
          {
            halaman: 2,
            tipe: 'kode',
            bahasa: 'python',
            isi: 'pohon_berbuah = True\n\nif pohon_berbuah:\n    print("Panjat pohon")\nelse:\n    print("Cari pohon lain")',
          },
          {
            halaman: 2,
            tipe: 'catatan',
            isi: '**Aturan Penting Python:**\nSetelah baris `if` dan `else` wajib ada tanda titik dua (`:`) dan baris instruksi di bawahnya harus menjorok ke dalam (**indentasi**, 4 spasi).',
          },
          {
            halaman: 3,
            tipe: 'teks',
            isi: 'Jika kita hanya ingin melakukan aksi saat kondisi bernilai benar, bagian `else` boleh dihilangkan sama sekali:',
          },
          {
            halaman: 3,
            tipe: 'kode',
            bahasa: 'python',
            isi: 'kapasitas_bus = 60\npenumpang = int(input("Jumlah penumpang: "))\n\nif penumpang <= kapasitas_bus:\n    print("Silakan masuk!")\n\nprint("Terima kasih sudah bertanya")',
          },
        ],
      },
      {
        id: 'p-3-2',
        urutan: 2,
        judul: 'elif dan Banyak Pilihan',
        blok: [
          {
            halaman: 1,
            tipe: 'teks',
            isi: 'Jika ada lebih dari dua kemungkinan pilihan, gunakan `elif` (singkatan dari *else if*). Python memeriksa kondisi dari atas ke bawah dan langsung berhenti pada syarat pertama yang benar.',
          },
          {
            halaman: 1,
            tipe: 'kode',
            bahasa: 'python',
            isi: 'nilai = int(input("Nilai: "))\n\nif nilai >= 85:\n    print("A")\nelif nilai >= 70:\n    print("B")\nelif nilai >= 55:\n    print("C")\nelse:\n    print("D")',
          },
          {
            halaman: 1,
            tipe: 'catatan',
            isi: '**Hati-hati urutan syarat:** Jika `nilai >= 55` diletakkan paling atas, maka siswa dengan nilai 90 akan tetap mendapatkan nilai "C" karena syarat pertama langsung terpenuhi.',
          },
          {
            halaman: 2,
            tipe: 'teks',
            isi: 'Contoh lain dengan tiga kemungkinan status penumpang bus:',
          },
          {
            halaman: 2,
            tipe: 'diagram',
            node: [
              { id: '1', jenis: 'keputusan', label: 'penumpang < kapasitas?' },
              { id: '2', jenis: 'proses', label: 'Silakan masuk' },
              { id: '3', jenis: 'keputusan', label: 'penumpang == kapasitas?' },
              { id: '4', jenis: 'proses', label: 'Bus penuh, tunggu bus berikutnya' },
              { id: '5', jenis: 'proses', label: 'Penumpang melebihi kapasitas' },
            ],
            sambungan: [
              { dari: '1', ke: '2', label: 'ya' },
              { dari: '1', ke: '3', label: 'tidak' },
              { dari: '3', ke: '4', label: 'ya' },
              { dari: '3', ke: '5', label: 'tidak' },
            ],
          },
          {
            halaman: 2,
            tipe: 'kode',
            bahasa: 'python',
            isi: 'if penumpang < kapasitas_bus:\n    print("Silakan masuk!")\nelif penumpang == kapasitas_bus:\n    print("Bus sudah penuh, tunggu bus berikutnya!")\nelse:\n    print("Penumpang melebihi kapasitas!")',
          },
        ],
      },
      {
        id: 'p-3-3',
        urutan: 3,
        judul: 'Operator Logika',
        blok: [
          {
            halaman: 1,
            tipe: 'teks',
            isi: 'Operator logika digunakan untuk menggabungkan beberapa syarat sekaligus dalam satu percabangan.',
          },
          {
            halaman: 1,
            tipe: 'tabel',
            kolom: ['Operator', 'Arti', 'Contoh', 'Hasil'],
            baris: [
              ['and', 'Keduanya harus benar', 'True and False', 'False'],
              ['or', 'Salah satu benar sudah cukup', 'True or False', 'True'],
              ['not', 'Membalik nilai kebenaran', 'not True', 'False'],
            ],
          },
          {
            halaman: 2,
            tipe: 'kode',
            bahasa: 'python',
            isi: 'ada_pisang = True\nsudah_lapar = True\n\nif ada_pisang and sudah_lapar:\n    print("Monyet makan pisang")\nelif ada_pisang and not sudah_lapar:\n    print("Monyet menyimpan pisang")\nelse:\n    print("Monyet mencari pisang")',
          },
          {
            halaman: 2,
            tipe: 'teks',
            isi: 'Percabangan juga dapat dibuat **bersarang** (*nested if*), yaitu menempatkan blok `if` di dalam blok `if` lainnya:',
          },
          {
            halaman: 2,
            tipe: 'kode',
            bahasa: 'python',
            isi: 'if penumpang <= kapasitas_bus:\n    print("Bus masih tersedia!")\n    if penumpang <= 10:\n        print("Silakan masuk ke bus kecil")\nelse:\n    print("Bus penuh, silakan tunggu")',
          },
          {
            halaman: 2,
            tipe: 'catatan',
            isi: '**Ringkasan:** `if` mengecek syarat, `elif` menambah pilihan baru, dan `else` menangani kondisi lainnya. Jangan lupa titik dua dan indentasi!',
          },
        ],
      },
    ],
    latihan: [
      {
        id: 'soal-3-1',
        setelahPelajaran: 3,
        jenis: 'pilihan_ganda',
        pertanyaan: 'Tanda baca apa yang WAJIB ada di akhir baris pernyataan if dalam Python?',
        opsi: [';', ':', '.', ','],
        kunci: ':',
        penjelasan: 'Di Python, setiap struktur kontrol seperti if, elif, else, for, dan while wajib diakhiri dengan tanda titik dua (:).',
      },
      {
        id: 'soal-3-2',
        setelahPelajaran: 3,
        jenis: 'tebak_keluaran',
        pertanyaan: 'Apa keluaran program berikut jika x = 8?\n\nx = 8\nif x > 10:\n    print("A")\nelif x > 5:\n    print("B")\nelse:\n    print("C")',
        opsi: ['A', 'B', 'C', 'Error'],
        kunci: 'B',
        penjelasan: 'Kondisi pertama x > 10 bernilai False. Kondisi kedua elif x > 5 bernilai True (karena 8 > 5), sehingga mencetak "B" dan percabangan selesai.',
      },
      {
        id: 'soal-3-3',
        setelahPelajaran: 3,
        jenis: 'buat_program',
        pertanyaan: 'Minta sebuah bilangan bulat, lalu tampilkan apakah bilangan tersebut "genap" atau "ganjil" menggunakan operator modulo % 2:',
        petunjukKode: 'bil = int(input("Masukkan angka: "))\n# Tulis if else pengecekan genap ganjil\n',
        kunci: 'bil = int(input("Masukkan angka: "))\nif bil % 2 == 0:\n    print("genap")\nelse:\n    print("ganjil")',
        penjelasan: 'Jika bil % 2 == 0 bernilai benar, bilangan habis dibagi 2 (genap). Selain itu bilangan bernilai ganjil.',
      },
      {
        id: 'soal-3-4',
        setelahPelajaran: 3,
        jenis: 'buat_program',
        pertanyaan: 'Program tiket kebun binatang: usia di bawah 5 tahun gratis (0), 5 sampai 17 tahun Rp10.000, 18 tahun ke atas Rp20.000. Tampilkan harga tiketnya:',
        petunjukKode: 'usia = int(input("Usia: "))\nif usia < 5:\n    print(0)\n# Lengkapi bagian elif dan else\n',
        kunci: 'usia = int(input("Usia: "))\nif usia < 5:\n    print(0)\nelif usia <= 17:\n    print(10000)\nelse:\n    print(20000)',
        penjelasan: 'Gunakan if usia < 5 untuk gratis, elif usia <= 17 untuk 10000, dan else untuk 20000.',
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // MODUL 4: PERULANGAN (LOOPS) (3 Pelajaran, 1 Set Latihan)
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'modul-4',
    urutan: 4,
    judul: 'Perulangan (Loops)',
    deskripsi: 'Mengulang perintah efisien dengan for dan while, serta mengendalikan alur dengan break dan continue.',
    ikon: 'IconRepeat',
    estimasiMenit: 15,
    pelajaran: [
      {
        id: 'p-4-1',
        urutan: 1,
        judul: 'Mengapa Perlu Perulangan? dan for',
        blok: [
          {
            halaman: 1,
            tipe: 'teks',
            isi: 'Bayangkan jika monyet harus melompat 5 kali. Tanpa perulangan, kita terpaksa menulis perintah yang sama berulang kali.\n\nDengan perulangan `for`, perintah cukup ditulis sekali saja:',
          },
          {
            halaman: 1,
            tipe: 'kode',
            bahasa: 'python',
            isi: 'for i in range(5):\n    print("Lompat!")',
          },
          {
            halaman: 2,
            tipe: 'teks',
            isi: 'Fungsi `range()` digunakan untuk menghasilkan deret urutan angka:',
          },
          {
            halaman: 2,
            tipe: 'tabel',
            kolom: ['Penulisan', 'Menghasilkan'],
            baris: [
              ['range(5)', '0, 1, 2, 3, 4'],
              ['range(1, 6)', '1, 2, 3, 4, 5'],
              ['range(0, 10, 2)', '0, 2, 4, 6, 8 (lompat 2)'],
            ],
          },
          {
            halaman: 2,
            tipe: 'catatan',
            isi: 'Perhatikan bahwa angka batas akhir pada `range()` **tidak diikutkan**, dan indeks awal secara default dimulai dari 0.',
          },
          {
            halaman: 3,
            tipe: 'teks',
            isi: 'Contoh program menjumlahkan angka 1 sampai 5 menggunakan variabel penyimpan total:',
          },
          {
            halaman: 3,
            tipe: 'kode',
            bahasa: 'python',
            isi: 'total = 0\nfor i in range(1, 6):\n    total = total + i\nprint("Total:", total)   # Menghasilkan 15',
          },
        ],
      },
      {
        id: 'p-4-2',
        urutan: 2,
        judul: 'while',
        blok: [
          {
            halaman: 1,
            tipe: 'teks',
            isi: 'Perulangan `while` berjalan **selama syarat tertentu masih bernilai benar**. Struktur ini sangat cocok jika jumlah pengulangan belum diketahui secara pasti di awal.',
          },
          {
            halaman: 1,
            tipe: 'pseudocode',
            baris: [
              'SELAMA perut_belum_kenyang',
              '  makan 1 pisang',
            ],
          },
          {
            halaman: 1,
            tipe: 'diagram',
            node: [
              { id: '1', jenis: 'mulai', label: 'Mulai' },
              { id: '2', jenis: 'keputusan', label: 'Belum kenyang?' },
              { id: '3', jenis: 'proses', label: 'Makan 1 pisang' },
              { id: '4', jenis: 'selesai', label: 'Selesai' },
            ],
            sambungan: [
              { dari: '1', ke: '2' },
              { dari: '2', ke: '3', label: 'ya' },
              { dari: '3', ke: '2' },
              { dari: '2', ke: '4', label: 'tidak' },
            ],
          },
          {
            halaman: 2,
            tipe: 'kode',
            bahasa: 'python',
            isi: 'kenyang = 0\n\nwhile kenyang < 3:\n    print("Makan 1 pisang")\n    kenyang = kenyang + 1\n\nprint("Monyet kenyang!")',
          },
          {
            halaman: 2,
            tipe: 'catatan',
            isi: '**Awas infinite loop (perulangan tak terhingga):** Jika nilai syarat tidak pernah berubah (misal baris `kenyang = kenyang + 1` dihapus), program akan terus berjalan tanpa henti!',
          },
          {
            halaman: 3,
            tipe: 'tabel',
            kolom: ['Situasi Pemakaian', 'Pilihan'],
            baris: [
              ['Jumlah perulangan sudah diketahui dengan pasti', 'for'],
              ['Perulangan berlangsung sampai suatu kondisi tercapai', 'while'],
            ],
          },
        ],
      },
      {
        id: 'p-4-3',
        urutan: 3,
        judul: 'break, continue, dan Perulangan Bersarang',
        blok: [
          {
            halaman: 1,
            tipe: 'teks',
            isi: 'Kita dapat mengontrol alur perulangan dengan dua kata kunci khusus:\n• **`break`**: menghentikan perulangan seketika.\n• **`continue`**: melewati sisa baris pada putaran saat ini dan langsung melompat ke putaran berikutnya.',
          },
          {
            halaman: 1,
            tipe: 'kode',
            bahasa: 'python',
            isi: '# Contoh break:\nfor i in range(1, 10):\n    if i == 4:\n        print("Ketemu pisang di pohon 4!")\n        break\n    print("Cek pohon ke-", i)',
          },
          {
            halaman: 2,
            tipe: 'teks',
            isi: 'Contoh penggunaan `continue` (melewati pohon ke-3):',
          },
          {
            halaman: 2,
            tipe: 'kode',
            bahasa: 'python',
            isi: 'for i in range(1, 6):\n    if i == 3:\n        continue\n    print("Pohon ke-", i)',
          },
          {
            halaman: 2,
            tipe: 'teks',
            isi: '**Perulangan bersarang (nested loop)** adalah perulangan di dalam perulangan, contohnya untuk mencetak pola bintang segitiga:',
          },
          {
            halaman: 2,
            tipe: 'kode',
            bahasa: 'python',
            isi: 'for baris in range(1, 4):\n    for kolom in range(baris):\n        print("*", end="")\n    print()',
          },
          {
            halaman: 2,
            tipe: 'catatan',
            isi: '**Ringkasan:** `for` dipakai saat jumlah iterasi pasti, `while` saat menunggu kondisi terpenuhi, sedangkan `break` dan `continue` mengatur jalannya putaran.',
          },
        ],
      },
    ],
    latihan: [
      {
        id: 'soal-4-1',
        setelahPelajaran: 3,
        jenis: 'tebak_keluaran',
        pertanyaan: 'Berapa kali kata "Hai" akan tercetak oleh kode berikut?\n\nfor i in range(3):\n    print("Hai")',
        opsi: ['2 kali', '3 kali', '4 kali', '0 kali'],
        kunci: '3 kali',
        penjelasan: 'Fungsi range(3) menghasilkan 3 elemen (0, 1, 2), sehingga perulangan berjalan sebanyak 3 kali.',
      },
      {
        id: 'soal-4-2',
        setelahPelajaran: 3,
        jenis: 'tebak_keluaran',
        pertanyaan: 'Apa deret angka yang dihasilkan dari:\n\nfor i in range(2, 8, 2):\n    print(i)',
        opsi: ['2, 4, 6, 8', '2, 4, 6', '2, 3, 4, 5, 6, 7', '4, 6, 8'],
        kunci: '2, 4, 6',
        penjelasan: 'Dimulai dari 2, melangkah 2 angka: 2, 4, 6. Angka 8 tidak diikutkan karena batas akhir bersifat eksklusif.',
      },
      {
        id: 'soal-4-3',
        setelahPelajaran: 3,
        jenis: 'perbaiki_kode',
        pertanyaan: 'Kode berikut mengalami infinite loop (tidak pernah berhenti). Perbaiki kodenya agar berhenti di angka 5:',
        petunjukKode: 'n = 1\nwhile n <= 5:\n    print(n)\n    # Tambahkan baris penambah nilai n\n',
        kunci: 'n = 1\nwhile n <= 5:\n    print(n)\n    n = n + 1',
        penjelasan: 'Variabel n harus ditambahkan 1 pada setiap putaran (n = n + 1) agar syarat n <= 5 suatu saat bernilai False.',
      },
      {
        id: 'soal-4-4',
        setelahPelajaran: 3,
        jenis: 'buat_program',
        pertanyaan: 'Gunakan perulangan for untuk menampilkan tabel perkalian 7 dari 1 sampai 10 (contoh: 7 * 1 = 7):',
        petunjukKode: 'for i in range(1, 11):\n    # Cetak hasil perkalian 7 dengan i\n',
        kunci: 'for i in range(1, 11):\n    print(f"7 * {i} = {7 * i}")',
        penjelasan: 'Gunakan range(1, 11) untuk menghasilkan angka 1 sampai 10, lalu cetak hasil kali dengan print(f"7 * {i} = {7 * i}").',
      },
    ],
  },
];
