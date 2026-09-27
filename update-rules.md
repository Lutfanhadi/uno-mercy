# PROMPT UNTUK ANTIGRAVITY — ANALISIS & PERBAIKAN RULES UNO SHOW ’EM NO MERCY

Kamu bertindak sebagai **Senior Game Developer, Game Logic Architect, dan Product Requirements Analyst**.

Saya sudah memiliki project game kartu berbasis **UNO Show ’Em No Mercy / UNO Mercy**, tetapi rules dan implementasi game saat ini masih belum konsisten.

Tugas utama kamu adalah:

1. Membaca dan memahami seluruh struktur project yang sudah ada.
2. Jangan langsung mengubah kode.
3. Audit terlebih dahulu seluruh implementasi game.
4. Bandingkan implementasi yang ada dengan rules yang saya tentukan di bawah.
5. Identifikasi semua bagian yang tidak sesuai.
6. Buat/update file `prd.md` yang sangat detail sebagai spesifikasi resmi untuk perbaikan game.
7. Gunakan nama kartu sesuai nama yang SUDAH digunakan oleh project saya.
8. Jangan mengganti nama kartu hanya karena nama resmi/umum berbeda.
9. Jika ada perbedaan antara implementasi saat ini dengan rules di bawah, rules di prompt ini menjadi sumber kebenaran utama.
10. Jangan merusak fitur yang sudah berjalan dan jangan melakukan perubahan UI yang tidak diperlukan.

---

# 1. TUJUAN PROJECT

Game harus merepresentasikan permainan **UNO Show ’Em No Mercy** dengan rules yang konsisten.

Fokus utama:

* Card matching
* Turn management
* Action card
* Wild card
* Draw card
* Stacking
* 0 Pass
* 7 Swap
* Discard All
* Skip Everyone
* Wild Color Roulette
* Mercy Rule
* UNO call
* Win condition
* Elimination
* Multiplayer synchronization
* Validasi kartu
* Sinkronisasi state antar pemain

Game harus mencegah pemain melakukan aksi yang tidak diperbolehkan oleh rules.

---

# 2. NAMA KARTU — WAJIB MENGIKUTI PROJECT

Gunakan nama kartu berikut secara konsisten di seluruh:

* source code
* database
* game state
* UI
* log
* notification
* validation
* PRD
* API/payload jika relevan

## Kartu angka

Angka:

* 0
* 1
* 2
* 3
* 4
* 5
* 6
* 7

Nama angka tetap menggunakan angka tersebut.

---

## Kartu Action

### Skip

Nama di project:

`Kartu Skip`

Efek:

* Pemain berikutnya kehilangan giliran.
* Pada 2 pemain, lawan dilewati dan pemain yang memainkan `Kartu Skip` mendapatkan giliran lagi.

---

### Reverse

Nama di project:

`Kartu Reverse`

Efek:

* Membalik arah permainan.
* Jika terdapat lebih dari 2 pemain, giliran berpindah mengikuti arah baru.
* Jika hanya terdapat 2 pemain, efeknya menyebabkan pemain lawan dilewati sehingga pemain yang memainkan kartu mendapatkan giliran lagi.

---

### Draw Two

Nama di project:

`Kartu Draw Two`

Efek:

* Pemain berikutnya mendapatkan penalti +2.
* Kartu ini dapat digunakan dalam mekanisme stacking sesuai aturan Draw Card.

---

# 3. WILD / DRAW CARD

## Wild Draw Four

Nama di project:

`Wild Draw Four`

### PENTING

Implementasi project saat ini diduga salah.

Saat ini `Wild Draw Four` kemungkinan dibuat sebagai kartu hitam/universal.

IMPLEMENTASI TERSEBUT HARUS DIAUDIT DAN DIPERBAIKI.

Untuk game ini:

`Wild Draw Four` harus menjadi **kartu berwarna**, bukan kartu hitam netral.

Artinya kartu harus memiliki varian warna:

* Merah
* Kuning
* Hijau
* Biru

Jangan mengubah nama `Wild Draw Four`.

Contoh:

```text
Red Wild Draw Four
Yellow Wild Draw Four
Green Wild Draw Four
Blue Wild Draw Four
```

Namun secara UI/data name tetap menggunakan:

`Wild Draw Four`

Warna kartu harus menjadi property/state tersendiri.

---

# 4. Wild Reverse + Draw Four

Nama di project:

`Wild Reverse + Draw Four`

Kartu ini memiliki dua efek sekaligus:

1. Reverse
2. Draw Four

Ketika dimainkan:

* arah permainan berubah
* penalti +4 diterapkan ke pemain berikutnya berdasarkan arah permainan yang baru
* kartu dapat digunakan dalam stacking
* efek Draw Four tetap dihitung sebagai +4

Jika dimainkan sebagai respons terhadap +4:

```text
+4
+
Wild Reverse + Draw Four
=
+8
```

Jangan menganggap kartu ini hanya sebagai Reverse.

Kartu ini adalah:

```text
Reverse + Draw Four
```

---

# 5. DRAW SIX

Nama/konsep project:

`Wild Draw Six`

Efek:

* Pemain berikutnya menerima penalti +6.
* Dapat digunakan dalam stacking jika memenuhi aturan stacking.
* Merupakan Wild card.
* Sebelum efek kartu diterapkan, pemain yang memainkan kartu harus memilih warna berikutnya.

Warna pilihan harus menjadi warna yang harus diikuti pemain berikutnya.

---

# 6. DRAW TEN

Nama/konsep project:

`Wild Draw Ten`

Efek:

* Pemain berikutnya menerima penalti +10.
* Dapat digunakan dalam stacking jika memenuhi aturan stacking.
* Merupakan Wild card.
* Sebelum efek kartu diterapkan, pemain yang memainkan kartu harus memilih warna berikutnya.

Warna pilihan harus menjadi warna yang harus diikuti pemain berikutnya.

---

# 7. ATURAN WILD CARD BERWARNA HITAM

Untuk kartu Wild:

* `Wild Draw Four`
* `Wild Reverse + Draw Four`
* `Wild Draw Six`
* `Wild Draw Ten`

jangan menganggap kartu tersebut memiliki warna hitam sebagai warna permainan.

Kartu-kartu tersebut mempunyai mekanisme pemilihan warna.

Ketika pemain memilih kartu Wild tersebut:

## Urutan aksi:

```text
Pemain memilih kartu
        ↓
Sistem meminta pemain memilih warna
        ↓
Pemain memilih:
RED / YELLOW / GREEN / BLUE
        ↓
Sistem menyimpan selectedColor
        ↓
Efek kartu diterapkan
        ↓
Turn berpindah sesuai rules
```

`selectedColor` harus disimpan di game state.

Contoh:

```js
selectedColor: "red"
```

Setelah itu pemain berikutnya harus mengikuti warna `red`, kecuali memiliki kartu yang sah sebagai Wild/Draw response sesuai rules.

---

# 8. PENTING — WILD COLOR ROULETTE

`Wild Color Roulette` adalah pengecualian dari mekanisme pemilihan warna di atas.

JANGAN membuat Wild Color Roulette meminta pemain yang memainkan kartu memilih warna terlebih dahulu.

Ketika:

```text
Pemain A memainkan Wild Color Roulette
```

maka:

```text
Pemain B
```

yang harus menjalankan roulette.

Urutannya:

```text
A memainkan Wild Color Roulette
        ↓
B memilih warna
        ↓
B mengambil kartu satu per satu
        ↓
Jika warna belum sesuai
        ↓
ambil kartu lagi
        ↓
Jika mendapatkan kartu dengan warna yang dipilih
        ↓
kartu tersebut juga masuk ke tangan B
        ↓
semua kartu yang diambil masuk ke tangan B
        ↓
efek selesai
        ↓
giliran selesai
```

Contoh:

B memilih:

`RED`

Draw:

```text
Blue 5
Green 8
Yellow 2
Blue Skip
Red 7
```

Maka seluruh kartu:

```text
Blue 5
Green 8
Yellow 2
Blue Skip
Red 7
```

masuk ke tangan B.

`Red 7` juga masuk ke tangan B.

Jangan memainkan `Red 7` ke Discard Pile.

Setelah itu giliran selesai.

---

# 9. ATURAN 0 — PASS HANDS

Kartu angka `0` memiliki efek khusus.

Ketika pemain memainkan `0`:

Semua pemain memberikan seluruh kartu di tangan kepada pemain berikutnya sesuai arah permainan saat ini.

Contoh:

```text
A → B → C → D
```

A memainkan:

`0`

Maka:

```text
A → B
B → C
C → D
D → A
```

Seluruh hand harus dipindahkan.

PENTING:

* bukan hanya satu kartu
* bukan memilih pemain
* bukan menukar dua pemain
* seluruh hand berpindah
* arah permainan tidak berubah

---

# 10. ATURAN 7 — SWAP HANDS

Kartu angka `7` memiliki efek Swap.

Ketika pemain memainkan `7`:

Pemain tersebut WAJIB memilih satu pemain lain.

Kemudian:

```text
seluruh kartu pemain aktif
```

ditukar dengan:

```text
seluruh kartu pemain yang dipilih
```

Contoh:

```text
A = 3 kartu
B = 7 kartu
C = 12 kartu
```

A memainkan `7`.

A bebas memilih:

```text
B
```

atau:

```text
C
```

Jika A memilih C:

```text
A = 12 kartu
B = 7 kartu
C = 3 kartu
```

PENTING:

* tidak harus memilih pemain berikutnya
* tidak mengikuti urutan perputaran
* pemain bebas memilih pemain lain yang masih aktif
* seluruh kartu di tangan ditukar
* posisi pemain tidak berubah
* arah permainan tidak berubah
* giliran tidak berpindah berdasarkan pemain yang dipilih

Setelah efek selesai:

giliran tetap bergerak ke pemain berikutnya berdasarkan arah permainan.

---

# 11. SKIP EVERYONE

Nama project:

`Skip Everyone`

Efek:

* Semua pemain lain dilewati.
* Pemain yang memainkan kartu mendapatkan giliran lagi.

Contoh:

```text
A → B → C → D
```

A memainkan:

`Skip Everyone`

Maka:

```text
B skipped
C skipped
D skipped
A mendapatkan giliran lagi
```

Pada 2 pemain:

```text
A → B
```

A memainkan `Skip Everyone`.

Hasil:

```text
B skipped
A bermain lagi
```

---

# 12. DISCARD ALL

Nama project:

`Discard All`

Efek:

Ketika pemain memainkan `Discard All`, pemain dapat membuang seluruh kartu dari tangannya yang memiliki warna sama dengan kartu `Discard All`.

Contoh:

Tangan:

```text
Red 4
Red 2
Red 3
Red Discard All
Blue 7
```

Pemain memainkan:

```text
Red Discard All
```

Maka:

```text
Red 4
Red 2
Red 3
```

ikut dibuang.

Yang tersisa:

```text
Blue 7
```

## ATURAN PENTING

Setelah Discard All dijalankan:

Kartu acuan untuk pemain berikutnya adalah:

```text
Red Discard All
```

BUKAN:

```text
Red 4
Red 2
Red 3
```

Pemain berikutnya tidak dianggap sedang mengikuti angka 4, 2, atau 3.

Jadi:

```text
Top Card = Red Discard All
```

Pemain berikutnya dapat memainkan kartu merah yang valid atau kartu Wild yang valid.

Jangan membuat sistem memilih salah satu kartu yang dibuang sebagai `topCard`.

---

# 13. SATU GILIRAN = SATU KARTU

Secara default:

**Satu pemain hanya boleh memainkan satu kartu dalam satu giliran.**

Tidak boleh melakukan:

```text
Red 9
+
Blue 9
```

secara bersamaan.

Walaupun memiliki dua atau lebih kartu dengan:

* angka sama
* simbol sama
* action sama
* draw value sama

tetap hanya satu kartu yang boleh dimainkan.

Contoh:

```text
Red 9
Blue 9
Green 9
```

Pemain hanya boleh memainkan satu `9`.

Hal yang sama berlaku untuk:

```text
0
7
Kartu Skip
Kartu Reverse
Kartu Draw Two
Wild Draw Four
Wild Reverse + Draw Four
Wild Draw Six
Wild Draw Ten
Skip Everyone
Discard All
Wild Color Roulette
```

Tidak boleh membuang dua kartu sekaligus hanya karena kartu tersebut identik.

---

# 14. PENGECUALIAN — DISCARD ALL

`Discard All` adalah pengecualian karena efek kartunya memang memungkinkan beberapa kartu dibuang sekaligus.

Namun kartu yang dibuang harus memenuhi warna yang sesuai dengan `Discard All`.

Jangan menganggap ini sebagai fitur:

```text
play multiple same cards
```

Ini adalah:

```text
Discard All effect
```

---

# 15. MATCHING RULE

Sistem harus menentukan apakah sebuah kartu dapat dimainkan berdasarkan:

## A. Warna

Jika warna kartu sama dengan warna kartu teratas:

```text
Red 4
Red 8
Red Skip
Red Reverse
```

dapat dimainkan sesuai rules.

## B. Angka

Jika angka sama dengan kartu angka teratas:

```text
Red 4
Blue 4
Green 4
Yellow 4
```

dapat dimainkan.

## C. Symbol / Action

Action card dengan symbol yang sesuai dapat dimainkan sesuai struktur game.

## D. Wild

Wild card dapat dimainkan sesuai rules dan stacking.

---

# 16. STACKING RULE

Stacking hanya berlaku untuk Draw Card.

Kategori:

```text
Draw Two = +2
Wild Draw Four = +4
Wild Reverse + Draw Four = +4
Wild Draw Six = +6
Wild Draw Ten = +10
```

Aturan:

Kartu Draw berikutnya harus memiliki nilai Draw yang **sama atau lebih besar** daripada Draw Card terakhir.

Contoh:

```text
+2
→ +2
→ +4
→ +6
→ +10
```

VALID.

Total:

```text
2 + 2 + 4 + 6 + 10 = 24
```

Jika pemain berikutnya tidak dapat melanjutkan stacking:

```text
ambil 24 kartu
```

---

# 17. CONTOH STACKING INVALID

Jika kartu terakhir:

```text
+6
```

maka pemain berikutnya tidak boleh membalas dengan:

```text
+2
```

karena:

```text
2 < 6
```

Tetapi boleh:

```text
+6
+10
```

---

# 18. REVERSE DRAW FOUR DALAM STACKING

`Wild Reverse + Draw Four` dihitung sebagai:

```text
+4
```

tetapi juga memiliki efek:

```text
Reverse
```

Contoh:

```text
+4
→ Wild Reverse + Draw Four
```

Total:

```text
+8
```

Namun arah permainan juga berubah ketika `Wild Reverse + Draw Four` dimainkan.

Jangan menghilangkan salah satu efek.

---

# 19. DUA PEMAIN

Game harus mempunyai rules khusus untuk permainan 2 pemain.

## Skip

```text
A → B

A memainkan Skip

B dilewati

A bermain lagi
```

## Reverse

```text
A → B

A memainkan Reverse

arah dibalik

A bermain lagi
```

## Skip Everyone

```text
A → B

A memainkan Skip Everyone

B dilewati

A bermain lagi
```

## 7 Swap

A tetap dapat memilih B.

Seluruh hand A dan B ditukar.

Setelah Swap selesai, turn logic harus tetap konsisten.

---

# 20. WILD COLOR SELECTION

Untuk:

* Wild Draw Four
* Wild Reverse + Draw Four
* Wild Draw Six
* Wild Draw Ten

pemain yang memainkan kartu harus memilih warna.

UI harus memberikan pilihan:

```text
RED
YELLOW
GREEN
BLUE
```

Jangan otomatis memilih warna kecuali project memang memiliki fallback khusus.

Sistem harus memastikan:

```text
selectedColor !== null
```

sebelum kartu Wild diterapkan.

Jika pemain belum memilih warna:

```text
card play belum boleh diselesaikan
```

---

# 21. COLOR YANG DIPILIH MENJADI TOP COLOR

Setelah Wild dimainkan:

```text
selectedColor
```

menjadi warna yang harus diikuti pemain berikutnya.

Contoh:

Pemain memainkan:

```text
Wild Draw Ten
```

memilih:

```text
BLUE
```

Maka state harus menyimpan:

```js
selectedColor: "blue"
```

Pemain berikutnya harus menggunakan kartu biru atau kartu yang valid berdasarkan rules Wild/Draw.

---

# 22. DRAW RULE

Jika pemain tidak mempunyai kartu yang dapat dimainkan:

Pemain harus mengambil kartu dari Draw Pile sampai mendapatkan kartu yang dapat dimainkan.

Urutan:

```text
Check playable card
        ↓
Tidak ada
        ↓
Draw 1
        ↓
Apakah playable?
        ↓
Tidak
        ↓
Draw lagi
        ↓
ulang
```

Ketika mendapatkan kartu yang playable:

```text
kartu langsung dimainkan
```

Jangan menghentikan proses hanya setelah mengambil satu kartu jika rules game menetapkan draw-until-playable.

---

# 23. UNO RULE

Jika pemain tinggal memiliki:

```text
1 kartu
```

pemain harus melakukan:

```text
UNO
```

Jika pemain lupa memanggil UNO dan pemain lain berhasil melakukan valid challenge sebelum giliran berikutnya dimulai:

```text
penalti +2
```

Pastikan state UNO disinkronkan dalam multiplayer.

---

# 24. MERCY RULE

Ini merupakan salah satu rules utama UNO No Mercy.

Jika seorang pemain mempunyai:

```text
25 kartu atau lebih
```

pemain langsung tereliminasi.

Contoh:

```text
23 kartu
+ 2
= 25
```

langsung:

```text
ELIMINATED
```

Contoh:

```text
18 kartu
+ 10
= 28
```

langsung:

```text
ELIMINATED
```

Sistem harus memeriksa Mercy Rule setelah setiap aksi yang dapat mengubah jumlah kartu pemain.

Termasuk:

* Draw
* Stacking
* Color Roulette
* 0 Pass
* 7 Swap
* efek lainnya yang menyebabkan jumlah kartu berubah

---

# 25. ELIMINATION

Ketika pemain mencapai 25+ kartu:

```text
isEliminated = true
```

Pemain tidak boleh:

* mendapatkan giliran
* memainkan kartu
* melakukan draw
* melakukan action
* menjadi target Swap
* menjadi target Pass

sesuai kebutuhan game state.

Urutan pemain harus otomatis melewati pemain yang telah eliminated.

---

# 26. WIN CONDITION

Pemain dapat menang dengan dua cara:

## Cara 1

Jumlah kartu menjadi:

```text
0
```

Pemain menang.

## Cara 2

Semua pemain lain tereliminasi karena Mercy Rule.

Pemain terakhir yang masih aktif menang.

---

# 27. TURN ORDER

Sistem harus mempunyai turn state yang jelas.

Minimal state:

```text
currentPlayer
direction
players
discardPile
drawPile
pendingDraw
selectedColor
lastAction
gameStatus
```

Jangan mengandalkan UI untuk menentukan siapa yang mendapat giliran.

Turn harus ditentukan oleh game engine/state.

---

# 28. DRAW PENALTY STATE

Jika terjadi stacking:

Contoh:

```text
+2
+4
+6
```

maka:

```text
pendingDraw = 12
```

Pemain berikutnya:

* dapat melanjutkan stacking dengan kartu Draw valid
* atau harus mengambil 12 kartu

Setelah pemain mengambil penalti:

```text
pendingDraw = 0
```

kemudian turn selesai sesuai rules.

---

# 29. CARD DATA MODEL

Audit model kartu saat ini.

Pastikan setiap kartu memiliki informasi yang cukup, minimal konsep seperti:

```js
{
  id,
  type,
  color,
  value,
  action,
  drawValue,
  isWild
}
```

Tidak harus menggunakan property dengan nama persis tersebut jika project saat ini menggunakan struktur berbeda.

Prioritaskan reuse architecture yang sudah ada.

Namun data harus mampu membedakan:

```text
number
skip
reverse
drawTwo
wildDrawFour
wildReverseDrawFour
wildDrawSix
wildDrawTen
skipEveryone
discardAll
wildColorRoulette
```

---

# 30. JANGAN GUNAKAN WARNA HITAM SEBAGAI GAME COLOR

Untuk Wild:

```text
Wild Draw Four
Wild Reverse + Draw Four
Wild Draw Six
Wild Draw Ten
```

warna hitam hanya boleh dianggap sebagai **visual/background/design jika memang diperlukan**, bukan sebagai `game color`.

Game color hanya:

```text
RED
YELLOW
GREEN
BLUE
```

Wild card harus memiliki selected color ketika dimainkan.

---

# 31. AUDIT IMPLEMENTASI SAAT INI

Sebelum melakukan perubahan, periksa:

1. Card model
2. Deck generation
3. Card distribution
4. Card color
5. Card type
6. Action execution
7. Turn calculation
8. Reverse logic
9. Skip logic
10. Skip Everyone
11. Draw Two
12. Draw Four
13. Reverse Draw Four
14. Draw Six
15. Draw Ten
16. Stacking
17. 0 Pass
18. 7 Swap
19. Discard All
20. Color Roulette
21. Wild color selection
22. Draw pile
23. Discard pile
24. UNO call
25. Mercy Rule
26. Elimination
27. Win condition
28. Multiplayer synchronization
29. Reconnection/state recovery jika tersedia
30. Database synchronization jika tersedia

---

# 32. JANGAN LANGSUNG REWRITE PROJECT

Jika menemukan implementasi yang salah:

JANGAN:

* membuat ulang game dari nol
* menghapus architecture existing
* mengganti framework
* mengganti database
* mengganti API
* mengganti UI
* mengganti struktur folder tanpa alasan
* menghapus fitur yang sudah bekerja

Lakukan perubahan seminimal mungkin.

Gunakan architecture yang sudah ada.

---

# 33. EDGE CASE YANG WAJIB DIPERIKSA

Audit dan dokumentasikan behavior untuk:

### Edge Case 1

2 pemain + Skip.

### Edge Case 2

2 pemain + Reverse.

### Edge Case 3

2 pemain + Skip Everyone.

### Edge Case 4

2 pemain + 7 Swap.

### Edge Case 5

3 pemain + 7 Swap.

### Edge Case 6

0 dengan 3+ pemain.

### Edge Case 7

Discard All dengan banyak kartu warna yang sama.

### Edge Case 8

Discard All sebagai top card setelah beberapa kartu ikut dibuang.

### Edge Case 9

+4 dilawan Wild Reverse + Draw Four.

### Edge Case 10

+6 dilawan +10.

### Edge Case 11

+6 dilawan +2.

Harus ditolak.

### Edge Case 12

+10 tidak dapat dilawan +6.

### Edge Case 13

Player mencapai tepat 25 kartu.

Harus eliminated.

### Edge Case 14

Player memiliki 24 kartu kemudian mendapatkan 1 kartu.

Harus eliminated.

### Edge Case 15

Color Roulette mendapatkan target color pada kartu pertama.

Tetap kartu tersebut masuk ke tangan.

### Edge Case 16

Color Roulette membutuhkan banyak draw.

Semua kartu yang ditarik masuk ke tangan.

### Edge Case 17

Player mempunyai:

```text
Red 9
Blue 9
```

Tidak boleh memainkan keduanya sekaligus.

### Edge Case 18

Player memiliki:

```text
Red 4
Red 2
Red 3
Red Discard All
```

Semua kartu merah harus dibuang sesuai efek Discard All.

Top card tetap:

```text
Red Discard All
```

---

# 34. PRIORITAS RULES

Jika terdapat konflik antara implementasi project saat ini dengan spesifikasi prompt ini:

```text
SPESIFIKASI INI
        ↓
GAME LOGIC
        ↓
UI
```

Rules ini menjadi source of truth.

Namun sebelum melakukan perubahan kode, dokumentasikan konflik yang ditemukan.

---

# 35. FORMAT PRD.MD

Buat/update `prd.md` dengan struktur profesional:

```md
# UNO Mercy Game — Product Requirements Document

## 1. Project Overview

## 2. Objective

## 3. Scope

## 4. Existing System Audit

## 5. Card System

### 5.1 Number Cards
### 5.2 Kartu Skip
### 5.3 Kartu Reverse
### 5.4 Kartu Draw Two
### 5.5 Wild Draw Four
### 5.6 Wild Reverse + Draw Four
### 5.7 Wild Draw Six
### 5.8 Wild Draw Ten
### 5.9 Skip Everyone
### 5.10 Discard All
### 5.11 Wild Color Roulette

## 6. Card Matching Rules

## 7. Turn System

## 8. Two Player Rules

## 9. Stacking System

## 10. Wild Color Selection

## 11. Draw System

## 12. 0 Pass Rule

## 13. 7 Swap Rule

## 14. Discard All Rule

## 15. Color Roulette Rule

## 16. UNO Rule

## 17. Mercy Rule

## 18. Elimination System

## 19. Win Conditions

## 20. Multiplayer Synchronization

## 21. Game State

## 22. Validation Rules

## 23. Edge Cases

## 24. Error Handling

## 25. Acceptance Criteria

## 26. Testing Scenarios

## 27. Implementation Notes

## 28. Existing Code Compatibility
```

---

# 36. ACCEPTANCE CRITERIA

PRD harus memiliki acceptance criteria yang dapat diuji.

Contoh:

```text
AC-001
Given game mempunyai 2 pemain
When pemain memainkan Kartu Skip
Then pemain lawan dilewati
And pemain yang memainkan kartu mendapatkan giliran lagi.
```

```text
AC-002
Given game mempunyai 2 pemain
When pemain memainkan Kartu Reverse
Then arah permainan berubah
And pemain yang sama mendapatkan giliran lagi.
```

```text
AC-003
Given pemain memainkan 7
When pemain memilih pemain lain
Then seluruh hand kedua pemain ditukar.
```

```text
AC-004
Given pemain memainkan Discard All merah
When pemain memiliki beberapa kartu merah
Then seluruh kartu merah yang valid dibuang
And top card tetap Discard All merah.
```

```text
AC-005
Given pemain memainkan Wild Draw Four
When pemain belum memilih warna
Then efek kartu belum boleh diselesaikan.
```

```text
AC-006
Given pemain memilih BLUE
When Wild Draw Four selesai dimainkan
Then selectedColor = BLUE.
```

```text
AC-007
Given stacking bernilai 10
When pemain berikutnya memiliki Draw 6
Then Draw 6 tidak dapat dimainkan.
```

```text
AC-008
Given pemain mempunyai 24 kartu
When pemain mendapatkan 1 kartu
Then pemain langsung eliminated.
```

```text
AC-009
Given pemain memainkan Wild Color Roulette
When pemain berikutnya memilih RED
Then pemain tersebut draw sampai memperoleh kartu RED.
```

```text
AC-010
Given pemain memiliki dua kartu angka 9
When pemain memainkan satu 9
Then kartu 9 lainnya tetap berada di hand.
```

---

# 37. TESTING

Buat test scenario untuk minimal:

* 2 player
* 3 player
* 4 player
* Skip
* Reverse
* Draw Two
* Draw Four
* Reverse Draw Four
* Draw Six
* Draw Ten
* Skip Everyone
* Discard All
* Wild Color Roulette
* 0
* 7
* stacking
* Mercy Rule
* UNO
* elimination
* win
* Wild color selection

Jika project sudah mempunyai test framework, gunakan framework yang sudah ada.

Jangan menambahkan framework baru tanpa alasan.

---

# 38. OUTPUT YANG SAYA INGINKAN

Setelah membaca project:

## STEP 1

Berikan ringkasan struktur project.

## STEP 2

Berikan daftar file yang berkaitan dengan:

```text
card
deck
game state
turn
player
action
multiplayer
database/API
```

## STEP 3

Buat audit:

```text
RULE
IMPLEMENTASI SAAT INI
STATUS
MASALAH
PERBAIKAN
```

Gunakan status:

```text
PASS
PARTIAL
FAIL
MISSING
```

## STEP 4

Buat/update:

```text
prd.md
```

## STEP 5

Jangan melakukan perubahan kode terlebih dahulu sebelum PRD selesai dan seluruh konflik rules terdokumentasi.

---

# 39. ATURAN PALING PENTING

Jangan berasumsi bahwa implementasi existing benar.

Baca source code.

Jangan berasumsi bahwa nama kartu existing sama dengan nama rules.

Gunakan mapping yang sudah ditentukan di prompt ini.

Jangan mengubah:

```text
Wild Draw Four
```

menjadi nama lain.

Jangan membuat:

```text
Wild Draw Four
```

sebagai kartu hitam universal.

Kembalikan mekanisme warnanya menjadi:

```text
RED
YELLOW
GREEN
BLUE
```

dengan mekanisme pemilihan warna.

Jangan menerapkan pemilihan warna pemain untuk:

```text
Wild Color Roulette
```

karena kartu tersebut mempunyai mekanisme khusus.

Jangan mengizinkan multi-card play hanya karena kartu memiliki angka/simbol sama.

Gunakan satu kartu per giliran kecuali efek kartu memang secara eksplisit memungkinkan beberapa kartu dibuang, seperti:

```text
Discard All
```

Pastikan:

```text
7 = pemain bebas memilih target Swap
0 = semua hand berpindah mengikuti arah
Skip = next player skipped
Reverse = direction reversed
2-player Reverse = current player mendapatkan giliran lagi
Skip Everyone = semua pemain lain dilewati
Stacking = Draw value sama atau lebih besar
25+ cards = eliminated
0 cards = win
```

---

# 40. FINAL REQUIREMENT

Tujuan akhir dari PRD ini adalah agar developer/coding agent dapat mengimplementasikan game UNO Mercy dengan **rules yang deterministik, konsisten, dapat diuji, dan tidak ambigu**.

Setiap efek kartu harus mempunyai:

```text
Trigger
↓
Precondition
↓
Player Input
↓
State Mutation
↓
Effect
↓
Turn Resolution
↓
Validation
↓
Synchronization
```

Jangan meninggalkan rules yang ambigu.

Jika ada bagian dari source code yang tidak dapat dipastikan behavior-nya, tandai:

```text
NEEDS_REVIEW
```

dan jelaskan file, fungsi, serta alasan ketidakpastiannya.

Jangan mengarang behavior yang tidak ditemukan dalam project.

Gunakan rules dalam dokumen ini sebagai source of truth untuk rules game.
