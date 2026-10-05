# PRD — FIX SISTEM UNO CALL & PENALTY UNO

## 1. TUJUAN

Perbaiki dan implementasikan sistem **UNO Call / UNO Penalty** pada game UNO Mercy agar mengikuti aturan permainan secara konsisten.

Fokus utama perbaikan:

* Mendeteksi ketika pemain hanya memiliki 1 kartu.
* Memastikan pemain wajib melakukan UNO Call.
* Memberikan kesempatan kepada pemain lain untuk melakukan **UNO Challenge** jika pemain lupa mengatakan UNO.
* Memberikan hukuman **Draw 2** jika pelanggaran berhasil di-claim.
* Tidak mengubah penalty menjadi Draw 4, Draw 6, Draw 10, atau penalty lainnya.
* Tidak menghubungkan jumlah kartu penalty UNO dengan jumlah kartu lawan.
* Tidak menganggap pemain otomatis aman hanya karena kartu terakhirnya tidak dapat dimainkan.
* Mencegah UNO Challenge dilakukan setelah pemain berikutnya sudah memulai gilirannya.

---

# 2. ATURAN DASAR UNO CALL

Ketika seorang pemain memainkan kartu dan setelah kartu tersebut dimainkan jumlah kartu di tangannya menjadi:

```text
1 kartu
```

maka pemain tersebut masuk ke kondisi:

```text
UNO REQUIRED
```

Pemain harus melakukan UNO Call dengan menekan tombol:

```text
UNO!
```

atau mekanisme UNO Call yang sudah tersedia di game.

Contoh:

```text
Sebelum bermain:
Player = 2 kartu

Player memainkan 1 kartu

Setelah bermain:
Player = 1 kartu

STATUS:
UNO REQUIRED
```

Pemain kemudian harus melakukan:

```text
UNO CALL
```

Jika berhasil:

```text
unoCalled = true
```

dan tidak mendapatkan penalty.

---

# 3. JANGAN SALAH MENGARTIKAN UNO

UNO Call hanya berlaku ketika pemain **berhasil mencapai 1 kartu setelah memainkan kartu**.

Jangan membuat sistem seperti:

```text
if player has 1 card:
    automatically call UNO
```

Karena hal tersebut menghilangkan fungsi tombol/aksi UNO Call.

Sistem harus membedakan:

```text
hasOneCard
```

dengan:

```text
unoCalled
```

Contoh:

```text
hasOneCard = true
unoCalled = false
```

berarti pemain memiliki satu kartu tetapi BELUM mengatakan UNO.

---

# 4. UNO CHALLENGE

Jika pemain memiliki 1 kartu dan belum melakukan UNO Call, pemain lain dapat melakukan:

```text
UNO CHALLENGE
```

selama pemain berikutnya **belum memulai turn**.

Jika challenge berhasil:

```text
UNO PENALTY = DRAW 2
```

Pemain yang lupa mengatakan UNO mengambil tepat:

```text
2 kartu
```

Tidak boleh mengambil:

```text
4 kartu
6 kartu
10 kartu
```

kecuali ada mekanisme penalty lain yang memang berasal dari kartu/aturan berbeda.

UNO Penalty selalu:

```text
+2 cards
```

---

# 5. TIMING UNO CHALLENGE

Ini merupakan bagian yang sangat penting.

UNO Challenge hanya valid pada window berikut:

```text
PLAYER A selesai memainkan kartu
        ↓
PLAYER A memiliki 1 kartu
        ↓
PLAYER A belum melakukan UNO
        ↓
PLAYER B belum memulai turn
        ↓
PLAYER B dapat melakukan UNO CHALLENGE
```

Jika PLAYER B sudah memulai turn, maka UNO Challenge tidak boleh lagi dilakukan terhadap PLAYER A.

Contoh:

```text
Player A:
memainkan kartu

Player A:
1 kartu tersisa
UNO belum dilakukan

Player B:
belum melakukan draw / play / action

→ UNO Challenge masih VALID
```

Tetapi:

```text
Player A:
memainkan kartu

Player A:
1 kartu tersisa

Player B:
sudah memulai turn
sudah draw / memilih kartu / memainkan kartu

→ UNO Challenge SUDAH TERLAMBAT
```

Jangan memberikan penalty setelah turn pemain berikutnya sudah dimulai.

---

# 6. CASE KHUSUS YANG HARUS DIPERBAIKI

Implementasikan kasus berikut secara eksplisit sebagai test case.

### CASE A — Pemain memiliki 1 kartu

Kondisi:

```text
Player A = 1 kartu
Player B = 10 kartu
```

Kartu Player A:

```text
RED 5
```

Kartu yang baru dimainkan Player B:

```text
YELLOW 6
```

Player A tidak memiliki kartu yang cocok untuk dimainkan.

Player A belum mengatakan UNO.

JANGAN menganggap:

```text
Player A aman karena tidak memiliki kartu yang dapat dimainkan.
```

Status UNO harus tetap mengikuti state sebelumnya.

Jika Player A sebelumnya sudah memiliki 1 kartu karena berhasil memainkan kartu dan belum melakukan UNO Call, maka Player A masih dapat terkena UNO Challenge selama window challenge belum berakhir.

---

# 7. CONTOH CASE A SECARA LENGKAP

State awal:

```text
Player A:
1 kartu → RED 5

Player B:
10 kartu
```

Player B memainkan:

```text
YELLOW 6
```

Sekarang giliran Player A.

Player A memiliki:

```text
RED 5
```

RED 5 tidak cocok dengan YELLOW 6 berdasarkan warna maupun angka.

Namun hal tersebut **tidak menghapus status UNO**.

Jika Player A sebelumnya gagal melakukan UNO Call dan Player B melakukan UNO Challenge pada waktu yang masih valid:

```text
Player A → +2 cards
```

Maka jumlah kartu Player A:

```text
1 + 2 = 3 kartu
```

Setelah penalty:

```text
Player A = 3 kartu
```

---

# 8. JUMLAH KARTU LAWAN TIDAK BOLEH MEMPENGARUHI UNO PENALTY

Jangan membuat formula seperti:

```text
penalty = opponent.cardCount
```

atau:

```text
penalty = cardsOpponentHas
```

Contoh:

```text
Opponent = 10 cards
```

TIDAK berarti:

```text
UNO penalty = 10 cards
```

Penalty tetap:

```text
+2
```

Berapa pun jumlah kartu lawan:

```text
Opponent = 2 cards → UNO penalty +2
Opponent = 10 cards → UNO penalty +2
Opponent = 20 cards → UNO penalty +2
Opponent = 50 cards → UNO penalty +2
```

---

# 9. UNO PENALTY TIDAK BOLEH DIANGGAP SEBAGAI CARD PENALTY BIASA

UNO penalty berbeda dengan penalty yang berasal dari kartu seperti:

```text
Draw Two
Wild Draw Four
Wild Reverse + Draw Four
Wild Draw Six
Wild Draw Ten
```

UNO penalty harus mempunyai event/state sendiri.

Contoh:

```text
UNO_CHALLENGE
UNO_PENALTY
UNO_PENALTY_DRAW
```

Jangan memasukkan UNO penalty ke dalam stacking system kartu Draw.

Contoh:

```text
UNO penalty +2
```

TIDAK berarti pemain dapat melakukan:

```text
+2 → +4 → +6
```

UNO penalty adalah penalty khusus karena gagal melakukan UNO Call.

---

# 10. STATE YANG DIREKOMENDASIKAN

Gunakan state yang jelas, misalnya:

```javascript
unoState = {
    required: false,
    called: false,
    challengeable: false,
    challenged: false
}
```

Atau sesuaikan dengan arsitektur state yang sudah ada.

Minimal sistem harus dapat membedakan:

```text
1. Player memiliki 1 kartu
2. UNO belum dipanggil
3. UNO sudah dipanggil
4. UNO Challenge masih tersedia
5. UNO Challenge sudah dilakukan
6. Window UNO Challenge sudah ditutup
```

---

# 11. EVENT FLOW

Implementasikan flow berikut:

```text
PLAYER PLAYS CARD
        ↓
CHECK HAND SIZE
        ↓
HAND SIZE == 1 ?
        ↓ YES
UNO REQUIRED
        ↓
START UNO CHALLENGE WINDOW
        ↓
PLAYER CALLS UNO?
     /           \
   YES            NO
   ↓              ↓
UNO SUCCESS    CHALLENGE WINDOW
                ↓
       OPPONENT CHALLENGES?
          /           \
        YES            NO
        ↓              ↓
     DRAW 2       WINDOW CLOSES
```

Setelah window challenge ditutup:

```text
unoChallengeable = false
```

dan pemain tidak dapat lagi terkena penalty UNO untuk kejadian tersebut.

---

# 12. MULTIPLAYER SERVER AUTHORITATIVE

Karena game menggunakan multiplayer, jangan hanya memproses UNO penalty di frontend.

Server harus menjadi sumber kebenaran.

Frontend hanya mengirim action:

```text
CALL_UNO
```

atau:

```text
CHALLENGE_UNO
```

Server melakukan validasi:

```text
Apakah pemain memang memiliki 1 kartu?
Apakah pemain memang belum melakukan UNO?
Apakah challenge masih berada dalam valid challenge window?
Apakah challenger bukan pemain yang sedang terkena challenge?
```

Jika valid:

```text
Apply UNO penalty
```

Jika tidak valid:

```text
Reject action
```

Jangan mempercayai state dari client.

---

# 13. VALIDASI CALL_UNO

Ketika pemain menekan tombol UNO:

```text
CALL_UNO
```

server harus memastikan:

```text
player.hand.length === 1
```

dan:

```text
unoRequired === true
```

Jika valid:

```text
unoCalled = true
```

dan:

```text
unoChallengeable = false
```

atau menandai bahwa pemain sudah aman dari challenge untuk kartu tersebut.

Jika tidak valid, jangan mengubah state game.

---

# 14. VALIDASI CHALLENGE_UNO

Ketika pemain lain melakukan:

```text
CHALLENGE_UNO
```

server harus memeriksa:

```text
targetPlayer.hand.length === 1
targetPlayer.unoCalled === false
unoChallengeable === true
currentTurn belum dimulai oleh pemain berikutnya
```

Jika semua kondisi terpenuhi:

```text
targetPlayer.hand += 2 cards
```

dan:

```text
unoChallengeable = false
unoChallenged = true
```

Jika salah satu kondisi tidak terpenuhi:

```text
Reject challenge
```

Jangan memberikan kartu tambahan.

---

# 15. UI/UX

Ketika pemain berada dalam kondisi UNO Required:

Tampilkan indikator yang jelas:

```text
UNO!
```

Contoh:

```text
┌─────────────────────┐
│      UNO!           │
│  You have 1 card    │
│                     │
│   [ CALL UNO ]      │
└─────────────────────┘
```

Jika pemain lain dapat melakukan challenge:

```text
Player Lutfan has 1 card!

[ CALL UNO ]
```

atau:

```text
UNO CHALLENGE
```

Gunakan UI yang sudah ada dan jangan mengubah desain utama game secara drastis.

---

# 16. NOTIFIKASI PENALTY

Ketika challenge berhasil, tampilkan informasi:

```text
UNO CHALLENGE!
Player Lutfan forgot to call UNO.

Penalty: Draw 2 cards
```

Setelah penalty:

```text
Player Lutfan drew 2 cards.
```

Jangan menampilkan:

```text
Draw 4
Draw 6
Draw 10
```

untuk UNO penalty.

---

# 17. EDGE CASE

Pastikan sistem menangani kondisi berikut.

### Edge Case 1

Player memiliki 2 kartu.

Memainkan 1 kartu.

Hasil:

```text
1 card
```

UNO wajib dilakukan.

---

### Edge Case 2

Player memiliki 2 kartu.

Memainkan kartu.

Langsung menekan UNO.

Hasil:

```text
UNO berhasil.
No penalty.
```

---

### Edge Case 3

Player memiliki 2 kartu.

Memainkan kartu.

Tidak menekan UNO.

Opponent melakukan challenge sebelum turn berikutnya dimulai.

Hasil:

```text
Player +2 cards
```

---

### Edge Case 4

Player lupa UNO.

Opponent tidak melakukan challenge.

Turn berikutnya sudah dimulai.

Hasil:

```text
No UNO penalty.
```

---

### Edge Case 5

Player memiliki 1 kartu tetapi tidak bisa memainkan kartu pada turn berikutnya.

Jangan otomatis menghapus atau mengubah status UNO hanya karena player harus draw.

Status UNO harus tetap mengikuti event ketika player sebelumnya mencapai 1 kartu.

---

### Edge Case 6

Player terkena UNO penalty.

Sebelumnya:

```text
1 card
```

Penalty:

```text
+2
```

Hasil:

```text
3 cards
```

---

# 18. JANGAN MERUSAK RULES KARTU LAIN

Perbaikan ini hanya berhubungan dengan:

```text
UNO CALL
UNO CHALLENGE
UNO PENALTY
```

Jangan mengubah mekanisme:

```text
Draw Two
Wild Draw Four
Wild Reverse + Draw Four
Wild Draw Six
Wild Draw Ten
Skip
Reverse
Skip Everyone
Discard All
```

dan jangan mengubah sistem stacking yang sudah ada.

---

# 19. ACCEPTANCE CRITERIA

Feature dianggap berhasil jika semua kondisi berikut terpenuhi:

* [ ] Pemain yang mencapai 1 kartu wajib melakukan UNO Call.
* [ ] Sistem membedakan `1 card` dan `UNO already called`.
* [ ] Pemain lain dapat melakukan UNO Challenge pada waktu yang valid.
* [ ] UNO Challenge hanya berlaku sebelum turn pemain berikutnya dimulai.
* [ ] UNO penalty selalu **Draw 2**.
* [ ] Jumlah kartu lawan tidak mempengaruhi UNO penalty.
* [ ] UNO penalty tidak dianggap sebagai Draw card biasa.
* [ ] UNO penalty tidak dapat di-stack dengan kartu Draw.
* [ ] Pemain yang terkena penalty 1 → 3 kartu.
* [ ] Jika pemain sudah memulai turn berikutnya, challenge lama tidak dapat dilakukan.
* [ ] Server menjadi sumber kebenaran pada multiplayer.
* [ ] Client tidak dapat memalsukan `unoCalled`.
* [ ] Tidak ada perubahan tidak diperlukan terhadap rules kartu lainnya.
* [ ] Tidak ada perubahan besar terhadap desain UI yang sudah ada.

---

# 20. TEST SCENARIO UTAMA

WAJIB lakukan pengujian berikut:

```text
Scenario:

Player A = 2 cards
Player B = 10 cards

Player A plays one card.

Player A = 1 card.

Player A DOES NOT call UNO.

Player B has not started the next turn yet.

Player B presses UNO CHALLENGE.

EXPECTED:

Player A = 3 cards
Penalty = +2
UNO challenge accepted
```

Kemudian test:

```text
Player A = 2 cards
Player A plays one card
Player A = 1 card
Player A DOES NOT call UNO

Player B starts turn.

Player B draws/plays a card.

Player B attempts UNO Challenge.

EXPECTED:

Challenge rejected.
No UNO penalty.
```

Kemudian test:

```text
Player A = 2 cards
Player A plays one card
Player A = 1 card

Player A presses CALL UNO.

EXPECTED:

UNO successful.
No penalty.
Challenge unavailable.
```

---

# 21. FINAL REQUIREMENT

Sebelum melakukan perubahan kode:

1. Inspect seluruh implementasi game yang berkaitan dengan:

   * turn system
   * player hand
   * card play
   * draw system
   * UNO button
   * multiplayer synchronization
   * server validation
   * game state

2. Jangan membuat sistem UNO baru jika sistem UNO sudah tersedia.

3. Cari terlebih dahulu bug pada implementasi existing.

4. Pertahankan arsitektur dan naming convention project yang sudah digunakan.

5. Jangan mengubah UI yang tidak berkaitan dengan feature ini.

6. Setelah implementasi selesai, jalankan test untuk seluruh scenario di atas.

7. Pastikan tidak ada regression terhadap card rules lainnya.

8. Jika ditemukan konflik antara implementasi lama dan requirement ini, prioritaskan requirement UNO Call/Challenge di dokumen ini tanpa merusak rule kartu lainnya.

Tujuan akhir:

> Pemain yang memiliki 1 kartu harus dapat melakukan UNO Call. Jika lupa dan pemain lain melakukan UNO Challenge pada window yang valid, pemain tersebut mengambil tepat 2 kartu. Jika turn berikutnya sudah dimulai, challenge tidak lagi valid.
