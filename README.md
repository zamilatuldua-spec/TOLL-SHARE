# AutoWeb Traffic Booster

Website statis pribadi untuk menyiapkan materi promosi dan membuka halaman share platform sosial.

## Deploy ke Vercel (cara sederhana)
1. Ekstrak ZIP ini di komputer.
2. Buka https://vercel.com lalu daftar/masuk.
3. Buat repository GitHub baru, misalnya `autoweb-traffic-booster`.
4. Upload tiga file/folder dari hasil ekstrak: `index.html`, `style.css`, `app.js` (serta file `vercel.json`).
5. Di Vercel pilih **Add New → Project**, hubungkan repository GitHub tadi, lalu klik **Deploy**.
6. Setelah selesai, Vercel memberikan alamat `*.vercel.app`.

## Catatan penting
- Tidak perlu build command; ini website statis.
- Data daftar website dan kampanye disimpan di localStorage browser yang digunakan. Data tidak otomatis tersinkron ke perangkat lain.
- Tombol share hanya membuka halaman berbagi resmi. Pengguna harus menekan kirim/posting sendiri.
- Angka "Halaman dibagikan" menghitung pembukaan tombol share dari tool, bukan posting berhasil atau pengunjung website.
- Tool ini tidak membuat bot pengunjung, tidak menjamin jutaan traffic, dan tidak melakukan posting massal.
- Untuk statistik pengunjung sebenarnya, pasang Google Analytics dan Google Search Console pada website yang dipromosikan.
