# UNO Mercy Game — Product Requirements Document

## 1. Project Overview
Game kartu UNO Show 'Em No Mercy berbasis web multiplayer menggunakan Node.js, Express, Socket.io, dan React (Vite). Game dirancang untuk mengizinkan permainan kompetitif yang lebih brutal dengan aturan khusus seperti Mercy Rule (eliminasi), Stacking Draw cards, dan Action cards yang mematikan.

## 2. Objective
Tujuan utama PRD ini adalah untuk menyelaraskan implementasi yang ada dengan aturan (rules) game UNO No Mercy yang benar, konsisten, dan deterministik. Semua perilaku game, edge cases, dan mekanika khusus didokumentasikan di sini sebagai source of truth.

## 3. Scope
Ruang lingkup mencakup refaktorisasi pada backend (`server/index.js`) dan frontend (`client/src/App.jsx`) untuk memperbaiki mekanisme yang menyimpang dari aturan resmi (seperti kartu Wild berwarna, pemilihan warna, 7 Swap, Color Roulette) tanpa merombak arsitektur atau UI secara keseluruhan.

## 4. Existing System Audit

| RULE | IMPLEMENTASI SAAT INI | STATUS | MASALAH | PERBAIKAN |
| --- | --- | --- | --- | --- |
| Kartu Angka (0-9) | Ada dalam deck, 0 memutar hand | PASS | Tidak ada | - |
| Kartu Skip / Reverse | Ada, logika 2 pemain jalan | PASS | Tidak ada | - |
| Wild Draw Four berwarna | Dibuat sebagai `color: 'ANY'` | FAIL | Kartu Wild harus memiliki warna saat di-generate (Merah, Kuning, Hijau, Biru) | Ubah generator deck untuk memberi warna varian pada kartu Wild Draw Four |
| Wild Draw Six / Ten berwarna | Dibuat sebagai `color: 'ANY'` | FAIL | Sama seperti Wild Draw Four, harus ada warnanya | Ubah generator deck |
| Wild Reverse + Draw Four | Dibuat `color: 'ANY'`, tidak bisa stack | FAIL | Bukan kartu hitam universal, efek stack +4 tidak jalan karena tidak masuk `DRAW_CARD_VALUES` | Beri warna, tambahkan ke `DRAW_AMOUNTS` (+4) dan `DRAW_CARD_VALUES` |
| 7 Swap Hands | Menukar otomatis dengan next player | FAIL | Pemain tidak memilih target | Modifikasi event play agar pemain memilih target |
| Wild Color Roulette | Server pilih warna acak untuk next player | FAIL | Next player (target) harus memilih warna sendiri sebelum draw | Tambahkan state pemilihan warna untuk pemain yang kena Roulette |
| Stacking | Ada, tapi tidak mencakup Wild Reverse + Draw 4 | PARTIAL | Kartu Reverse + Draw 4 tidak diakui sebagai kartu penalti saat dicek | Tambahkan ke daftar validasi stacking |
| Discard All | Membuang warna sama | PASS | Tidak ada | - |
| Mercy Rule / Win | Eliminasi pada 25 kartu | PASS | Tidak ada | - |

## 5. Card System

### 5.1 Number Cards
Kartu angka biasa (1-6, 8-9). Dimainkan berdasarkan warna atau angka yang sama.

### 5.2 Kartu Skip
Pemain berikutnya kehilangan giliran. Pada 2 pemain, pemain lawan dilewati (pemain yang main dapat giliran lagi).

### 5.3 Kartu Reverse
Membalik arah permainan. Pada 2 pemain, berfungsi seperti Skip.

### 5.4 Kartu Draw Two
Pemain berikutnya terkena penalti +2 dan kehilangan giliran. Bisa di-stack dengan Draw lain yang bernilai sama atau lebih besar.

### 5.5 Wild Draw Four
Kartu ini memiliki varian warna spesifik (Red, Yellow, Green, Blue) bukan hitam. Pemain yang memainkan harus memilih warna berikutnya (selectedColor). Memberi +4 ke pemain berikutnya.

### 5.6 Wild Reverse + Draw Four
Kombinasi Reverse dan Draw Four (+4). Arah berbalik, lalu penalti diterapkan ke pemain berikutnya di arah baru. Harus ada proses pemilihan warna.

### 5.7 Wild Draw Six
Kartu Wild berwarna (Red, Yellow, Green, Blue). Meminta pemain memilih warna berikutnya, lalu memberikan +6 ke pemain berikutnya.

### 5.8 Wild Draw Ten
Kartu Wild berwarna (Red, Yellow, Green, Blue). Meminta pemain memilih warna, memberikan +10 ke pemain berikutnya.

### 5.9 Skip Everyone
Semua pemain lain dilewati. Pemain yang memainkannya mendapat giliran lagi.

### 5.10 Discard All
Membuang semua kartu dari tangan pemain yang memiliki warna yang sama dengan kartu Discard All yang dimainkan. Top card menjadi kartu Discard All tersebut.

### 5.11 Wild Color Roulette
Pemain yang terkena kartu ini (pemain berikutnya) HARUS memilih warna terlebih dahulu, lalu mengambil kartu dari deck hingga mendapatkan kartu dengan warna tersebut. Semua kartu yang diambil masuk ke tangannya.

## 6. Card Matching Rules
Kartu bisa dimainkan jika:
A. Warna kartu sama dengan kartu teratas.
B. Angka/Simbol sama dengan kartu teratas.
C. Kartu Wild (dengan aturan warna/selectedColor yang sesuai).

## 7. Turn System
Turn ditentukan oleh variabel `currentTurnIndex`, `direction`, `players`. Urutan akan melompati pemain yang sudah tereliminasi (`eliminated`).

## 8. Two Player Rules
- **Skip / Skip Everyone / Reverse**: Pemain lawan dilewati, pemain aktif mendapat giliran lagi.
- **7 Swap**: Tetap menukar kartu antara 2 pemain tersebut, giliran berpindah secara normal.

## 9. Stacking System
Hanya untuk Draw Card (+2, +4, +6, +10). Kartu balasan harus memiliki nilai Draw yang SAMA atau LEBIH BESAR dari kartu draw terakhir. Total diakumulasi di `pendingDraw`.

## 10. Wild Color Selection
Setiap memainkan kartu Wild (kecuali Roulette), pemain aktif harus memilih warna (RED, YELLOW, GREEN, BLUE). Action tidak akan selesai sebelum warna dipilih.

## 11. Draw System
Jika tidak punya kartu, draw 1 kartu. Jika bisa dimainkan, bisa langsung dimainkan. Jika tidak, pemain harus terus mengambil (draw until playable) dalam satu giliran.

## 12. 0 Pass Rule
Semua pemain memberikan seluruh hand mereka ke pemain berikutnya searah `direction`.

## 13. 7 Swap Rule
Pemain yang memainkan kartu WAJIB memilih salah satu pemain lain yang aktif. Seluruh kartu di tangan kedua pemain ditukar.

## 14. Discard All Rule
Kartu-kartu dengan warna sama akan ikut terbuang ke discard pile. Kartu yang menjadi patokan target/topCard adalah Discard All.

## 15. Color Roulette Rule
Pemain target (bukan yang memainkan) memilih warna. Tarik dari draw pile sampai mendapatkan warna tersebut. Semua kartu masuk ke tangan.

## 16. UNO Rule
Ketika tersisa 1 kartu, wajib memanggil UNO. Jika lupa dan di-challenge sebelum gilirannya usai/sebelum giliran selanjutnya, kena +2.

## 17. Mercy Rule
Jika total kartu pemain mencapai 25 atau lebih, pemain langsung tereliminasi. Dievaluasi setelah setiap kali kartu bertambah.

## 18. Elimination System
Pemain dengan `isEliminated = true` dilewati dalam turn order, tidak bisa di-target Swap, tidak ikut Pass, tidak dapat giliran.

## 19. Win Conditions
1. Tangan habis (0 kartu).
2. Hanya tersisa 1 pemain yang tidak tereliminasi (menang default).

## 20. Multiplayer Synchronization
Game state (termasuk currentColor, discardPile, pendingDraw) disinkronisasikan melalui Socket.io dengan object sanitasi.

## 21. Game State
Minimal state: `roomCode`, `hostId`, `players`, `status`, `deck`, `discardPile`, `direction`, `pendingDraw`, `currentColor`, `currentTurnIndex`.

## 22. Validation Rules
Sistem wajib menolak:
- Main 2 kartu bersamaan (kecuali efek Discard All).
- Main kartu Draw yang lebih kecil saat stacking (misal menumpuk +2 di atas +6).
- Pemilihan warna otomatis di roulette (target harus memilih).

## 23. Edge Cases
- **0 dengan 3+ pemain**: Seluruh hand pindah arah searah direction.
- **Stacking Reverse Draw Four**: Menambah +4 dan memutar arah.
- **Mendapat kartu hingga 25+ pas Roulette**: Pemain langsung eliminasi.

## 24. Error Handling
Jika koneksi putus, pemain bisa dikeluarkan jika status waiting. Jika sedang bermain, sistem belum meng-handle reconnect.

## 25. Acceptance Criteria
- **AC-001**: Given 2 pemain, When main Reverse, Then pemain sama dapat giliran lagi.
- **AC-002**: Given pemain main 7, When milih target, Then hand bertukar tanpa ubah giliran.
- **AC-003**: Given pemain main Wild Draw Four berwarna Merah, When belum pilih selectedColor, Then giliran belum selesai.
- **AC-004**: Given stacking +6, When pemain balas +2, Then ditolak sistem.
- **AC-005**: Given pemain main Wild Color Roulette, When pemain berikutnya milih Biru, Then pemain tarik kartu hingga dapat Biru.
- **AC-006**: Given kartu 24, When draw 1 kartu, Then pemain ELIMINATED.

## 26. Testing Scenarios
1. Skenario eliminasi 25 kartu dari draw penalty.
2. Skenario Stacking beruntun (+2 -> +4 -> +6 -> +10).
3. Skenario 7 Swap memilih player acak.
4. Skenario Roulette color selection by target.
5. Skenario Discard All membuang 5 kartu merah sekaligus.

## 27. Implementation Notes
- Ubah deck generation di `server/index.js` untuk membuat variasi warna pada Wild cards.
- Tambahkan logic "target selection" pada UI `App.jsx` untuk kartu 7.
- Tambahkan logic "target color selection" pada Roulette di frontend.
- Update `DRAW_CARD_VALUES` di backend untuk memasukkan `WILD_REVERSE_DRAW_FOUR`.

## 28. Existing Code Compatibility
- Socket.io events seperti `play_card`, `draw_card`, `call_uno` tetap digunakan.
- Struktur UI Card di `App.jsx` dapat menggunakan variabel color yang dikirim dari deck.
- Jangan merusak bot logic yang ada, pastikan bot dapat memilih target saat main angka 7.
