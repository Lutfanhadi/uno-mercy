# UNO MERCY — RULES SPECIFICATION

Implementasikan sistem permainan **UNO MERCY** berdasarkan aturan dasar permainan UNO klasik, dengan tambahan mekanisme khusus **Mercy Rule**.

Prioritas utama:

1. Aturan kartu harus konsisten.
2. Server harus menjadi sumber kebenaran.
3. Semua validasi dilakukan di server.
4. Client hanya mengirim aksi pemain.
5. Jangan membuat aturan tambahan yang tidak disebutkan di dokumen ini.

---

# 1. TUJUAN PERMAINAN

Tujuan utama pemain adalah menjadi pemain pertama yang menghabiskan seluruh kartu di tangan.

Pemain dapat memainkan kartu apabila kartu tersebut sesuai dengan kartu teratas pada discard pile berdasarkan:

* warna,
* angka,
* atau simbol/action,
* atau kartu Wild.

Game dapat dimainkan oleh:

```text
2–8 players
```

---

# 2. DECK KARTU

Gunakan deck UNO standar.

Untuk setiap warna:

```text
Red
Yellow
Green
Blue
```

Terdapat kartu:

```text
0
1
2
3
4
5
6
7
8
9
```

dan action cards:

```text
Skip
Reverse
Draw Two
```

Kartu Wild:

```text
Wild
Wild Draw Four
```

Untuk implementasi digital, setiap kartu harus mempunyai `unique cardId`.

Contoh:

```ts
interface Card {
  id: string;
  color: "red" | "yellow" | "green" | "blue" | "wild";
  type:
    | "number"
    | "skip"
    | "reverse"
    | "draw2"
    | "wild"
    | "wildDraw4";
  value?: number;
}
```

Jangan menggunakan posisi array sebagai identitas kartu.

---

# 3. JUMLAH KARTU

Gunakan deck standar:

```text
108 cards
```

Komposisi:

### Number Cards

Setiap warna:

```text
1 × 0
2 × 1
2 × 2
2 × 3
2 × 4
2 × 5
2 × 6
2 × 7
2 × 8
2 × 9
```

Total:

```text
19 cards per color
```

Empat warna:

```text
19 × 4 = 76
```

### Action Cards

Untuk setiap warna:

```text
2 × Skip
2 × Reverse
2 × Draw Two
```

Total:

```text
6 × 4 = 24
```

### Wild Cards

```text
4 × Wild
4 × Wild Draw Four
```

Total:

```text
8
```

Total deck:

```text
76 + 24 + 8 = 108
```

---

# 4. INITIAL HAND

Pada awal permainan, setiap pemain mendapatkan:

```text
7 cards
```

Contoh 4 pemain:

```text
4 × 7 = 28 cards
```

Contoh 8 pemain:

```text
8 × 7 = 56 cards
```

Sisa kartu menjadi:

```text
Draw Pile
```

---

# 5. DRAW PILE DAN DISCARD PILE

Setelah semua pemain mendapatkan 7 kartu:

```text
Draw Pile
```

dibuat dari sisa deck.

Kemudian satu kartu dibuka menjadi:

```text
Discard Pile
```

Kartu paling atas pada discard pile menentukan kartu yang sedang aktif.

---

# 6. FIRST DISCARD CARD

Kartu pertama yang dibuka harus mengikuti aturan awal permainan.

Jika kartu pertama adalah:

### Number Card

Tidak ada efek khusus.

Game dimulai dari pemain berikutnya.

### Skip

Pemain pertama kehilangan giliran.

### Reverse

Arah permainan berubah.

### Draw Two

Pemain berikutnya mengambil 2 kartu dan kehilangan giliran.

### Wild

Pemain pertama menentukan warna yang aktif.

### Wild Draw Four

Untuk menjaga implementasi tetap konsisten, kartu `Wild Draw Four` pada kartu pembuka harus diambil kembali ke deck dan diganti dengan kartu lain.

Server harus menangani kondisi ini sebelum game dimulai.

---

# 7. TURN ORDER

Permainan dimulai dari pemain setelah dealer/deal process.

Gunakan:

```ts
direction:
  | "clockwise"
  | "counterclockwise";
```

Secara default:

```text
clockwise
```

Contoh:

```text
P1 → P2 → P3 → P4
```

Jika Reverse:

```text
P1 → P4 → P3 → P2
```

Player yang sudah eliminated karena Mercy tidak boleh mendapatkan giliran.

---

# 8. CARD PLAY VALIDATION

Pemain hanya dapat memainkan kartu jika:

```text
card belongs to player's hand
AND
player is current player
AND
game status = playing
AND
card is valid according to UNO rules
```

Kartu dapat dimainkan jika:

```text
card.color === currentColor
```

atau:

```text
card.value === topCard.value
```

atau:

```text
card.type === topCard.type
```

atau kartu merupakan:

```text
Wild
Wild Draw Four
```

Untuk number card, pencocokan berdasarkan angka.

Contoh:

```text
Top Card = Red 7
```

Valid:

```text
Red 3
Red 9
Blue 7
Green 7
Yellow 7
Wild
```

Tidak valid:

```text
Blue 3
Green 9
Yellow 5
```

---

# 9. NUMBER CARD

Number card:

```text
0–9
```

tidak mempunyai efek tambahan.

Setelah dimainkan:

```text
currentColor = card.color
```

Turn berpindah ke pemain berikutnya.

---

# 10. SKIP CARD

Jika pemain memainkan:

```text
Skip
```

maka pemain berikutnya kehilangan giliran.

Contoh:

```text
P1 plays Skip
```

Maka:

```text
P1 → P3
```

bukan:

```text
P1 → P2
```

Player yang di-skip tidak melakukan action.

---

# 11. REVERSE CARD

Kartu Reverse (Balik Arah) digunakan untuk membalik arah permainan.

Jika sebelumnya giliran berjalan searah jarum jam, setelah kartu Reverse dimainkan giliran akan berjalan berlawanan arah jarum jam, begitu juga sebaliknya.

Contoh:

```text
Sebelum Reverse (searah jarum jam):
P1 → P2 → P3 → P4

Setelah Reverse (berlawanan arah jarum jam):
P1 → P4 → P3 → P2
```

## 3 Pemain atau Lebih

Untuk permainan dengan 3 pemain atau lebih, giliran berikutnya mengikuti arah yang baru.

Contoh:

```text
P1 plays Reverse
```

Maka giliran berpindah ke arah sebaliknya:

```text
P1 → P4 → P3 → P2 (jika sebelumnya searah jarum jam)
```

## Special Case: 2 Players

Dalam permainan 2 pemain, kartu Reverse berfungsi seperti Skip, yaitu giliran lawan dilewati sehingga pemain yang memainkan kartu Reverse mendapatkan giliran lagi.

Contoh:

```text
P1 plays Reverse
→ P2 dilewati
→ P1 mendapatkan giliran lagi
```

Implementasikan behavior ini secara eksplisit di server.

---

# 12. DRAW TWO

Jika pemain memainkan:

```text
Draw Two
```

maka pemain berikutnya:

```text
draw 2 cards
```

dan:

```text
lose their turn
```

Contoh:

```text
P1 plays Draw Two
P2 draws 2
P2 is skipped
P3 plays
```

Default UNO MERCY tidak menggunakan stacking Draw Two.

Artinya:

Jika P2 mendapatkan Draw Two:

```text
P2 tidak dapat memainkan Draw Two untuk menghindari penalty
```

P2 wajib mengambil 2 kartu dan kehilangan giliran.

---

# 13. WILD

Wild dapat dimainkan kapan saja pada giliran pemain.

Setelah memainkan Wild, pemain harus memilih warna baru:

```text
Red
Yellow
Green
Blue
```

Contoh:

```text
P1 plays Wild
P1 chooses Blue
```

Maka:

```text
currentColor = Blue
```

Pemain berikutnya harus memainkan kartu yang sesuai dengan Blue atau memainkan Wild.

Server harus memvalidasi pilihan warna.

Tidak boleh:

```text
currentColor = wild
```

Setelah Wild dimainkan.

Harus selalu ada:

```text
Red
Yellow
Green
Blue
```

sebagai active color.

---

# 14. WILD DRAW FOUR

Wild Draw Four:

```text
+4 cards
```

dan pemain berikutnya:

```text
loses their turn
```

Setelah dimainkan, pemain yang memainkan kartu memilih warna baru.

Contoh:

```text
P1 plays Wild Draw Four
P1 chooses Green
P2 draws 4
P2 loses turn
P3 plays
```

---

# 15. WILD DRAW FOUR LEGALITY

Wild Draw Four memiliki aturan khusus.

Pemain hanya boleh memainkan Wild Draw Four apabila pemain tersebut **tidak memiliki kartu yang cocok dengan current color**.

Contoh:

```text
Current Color = Red
```

Hand:

```text
Blue 5
Green 7
Wild Draw Four
```

Wild Draw Four:

```text
VALID
```

Tetapi:

```text
Current Color = Red

Hand:
Red 5
Blue 7
Wild Draw Four
```

Wild Draw Four:

```text
INVALID
```

karena pemain masih memiliki kartu Red.

Server harus memeriksa seluruh hand pemain sebelum menerima `wildDraw4`.

---

# 16. WILD DRAW FOUR CHALLENGE

Pemain berikutnya dapat melakukan:

```text
Challenge
```

jika merasa Wild Draw Four dimainkan secara ilegal.

Flow:

```text
P1 plays Wild Draw Four
        ↓
P1 chooses color
        ↓
P2 receives challenge option
        ↓
P2 chooses:
Challenge
atau
Accept
```

Jika challenge dilakukan:

### Jika P1 memang memiliki kartu current color

P1 terbukti memainkan Wild Draw Four secara ilegal.

Penalty:

```text
P1 draws 4 cards
```

dan P2 tetap mendapatkan giliran.

### Jika P1 tidak memiliki kartu current color

Challenge gagal.

P2 mendapatkan penalty:

```text
draw 6 cards
```

dan P2 kehilangan giliran.

Server harus melakukan pemeriksaan terhadap hand P1 yang sebenarnya.

Client tidak boleh menentukan hasil challenge.

---

# 17. CARD DRAW

Pada giliran normal, jika pemain tidak ingin atau tidak dapat memainkan kartu:

```text
Draw 1 card
```

Setelah mengambil kartu:

Jika kartu tersebut dapat dimainkan, pemain **boleh** memainkan kartu tersebut pada giliran yang sama.

Jika tidak ingin memainkan kartu tersebut:

```text
turn ends
```

Tidak boleh mengambil kartu berkali-kali pada satu giliran.

Flow:

```text
Player Turn
    ↓
Draw 1
    ↓
Card playable?
    ↓
Yes → player may play it
    ↓
No → turn ends
```

---

# 18. DRAW PILE EMPTY

Jika Draw Pile kosong:

```text
ambil seluruh discard pile
kecuali top card
```

Kemudian:

```text
shuffle
```

dan menjadi Draw Pile baru.

Top card tetap berada di discard pile.

Contoh:

```text
Discard:
[Card A]
[Card B]
[Card C]
[Card D] ← top
```

Yang dikembalikan ke draw pile:

```text
A
B
C
```

Sedangkan:

```text
D
```

tetap menjadi top card.

---

# 19. UNO RULE

Ketika pemain memainkan kartu sehingga hand menjadi:

```text
1 card
```

pemain harus mengatakan:

```text
UNO
```

Dalam game digital, gunakan tombol:

```text
[ UNO ]
```

Server mencatat:

```ts
unoCalled = true;
```

---

# 20. UNO TIMING

UNO harus dipanggil ketika pemain hanya memiliki:

```text
1 card
```

atau sebelum pemain melakukan action berikutnya sesuai implementation timing.

Game digital harus memberikan UI yang jelas ketika pemain memasuki UNO state.

Contoh:

```text
1 CARD LEFT!
[ UNO ]
```

---

# 21. MISSED UNO

Jika pemain memiliki 1 kartu tetapi belum melakukan UNO:

```text
unoCalled = false
```

Pemain lain dapat melakukan:

```text
Challenge UNO
```

jika challenge dilakukan dalam UNO window yang valid.

Jika terbukti player belum melakukan UNO:

```text
player draws 2 cards
```

dan:

```text
unoPenalty += 1
```

---

# 22. UNO SUCCESS

Jika player berhasil melakukan UNO:

```text
hand.length === 1
unoCalled === true
```

maka tidak mendapatkan penalty UNO.

Tampilkan:

```text
UNO!
```

dan sound effect.

---

# 23. FINAL CARD

Jika pemain memainkan kartu terakhir:

```text
hand.length === 0
```

maka pemain memenangkan round/game sesuai win condition.

Server langsung menentukan:

```text
winnerId
```

Client tidak boleh mengirim:

```text
winnerId
```

sebagai sumber kebenaran.

---

# 24. UNO DAN FINAL CARD

Jika player memainkan kartu terakhir tanpa melakukan UNO ketika sebelumnya memiliki 2 kartu:

```text
Player:
2 cards
    ↓
plays one
    ↓
1 card
```

Player harus melakukan UNO.

Jika tidak:

```text
opponent may challenge
```

Jika tidak ada challenge yang valid sebelum game berakhir menurut UNO timing yang digunakan server, game dapat berakhir berdasarkan final-card condition.

Implementasikan timing UNO secara konsisten dan server-authoritative.

---

# 25. MERCY RULE — CUSTOM UNO MERCY

**Mercy Rule adalah aturan khusus UNO MERCY dan bukan bagian dari aturan dasar UNO klasik.**

Default:

```text
Mercy Limit = 25 cards
```

Host dapat memilih:

```text
15
20
25
30
```

Jika hand pemain mencapai:

```text
hand.length >= mercyLimit
```

maka pemain terkena:

```text
MERCY
```

---

# 26. MERCY TRIGGER

Setiap kali jumlah kartu pemain berubah, server wajib menjalankan:

```ts
checkMercy(player)
```

Contoh perubahan hand:

```text
draw
draw2
wildDraw4
UNO penalty
challenge penalty
```

Flow:

```text
Hand Updated
      ↓
checkMercy()
      ↓
hand.length >= mercyLimit?
      ↓
YES
      ↓
MERCY
      ↓
Player Eliminated
```

---

# 27. MERCY ELIMINATION

Player yang terkena Mercy:

```ts
status = "eliminated";
```

Player:

* tidak dapat mengambil giliran
* tidak dapat memainkan kartu
* tidak dapat melakukan UNO
* tidak dapat challenge
* tidak dapat memengaruhi game
* tetap dapat melihat hasil game

Server broadcast:

```text
mercy_triggered
player_eliminated
```

---

# 28. MERCY DAN TURN

Jika player terkena Mercy pada saat gilirannya:

```text
eliminate player
↓
remove from active turn order
↓
find next active player
↓
continue game
```

Jika player terkena Mercy akibat penalty dari pemain lain, server tetap melakukan pengecekan setelah hand berubah.

---

# 29. MERCY WARNING

Berikan warning visual ketika pemain mendekati limit.

Contoh:

```text
Mercy Limit = 25

20 cards → normal
21 cards → warning
22 cards → warning
23 cards → warning
24 cards → critical warning
25 cards → MERCY
```

Threshold warning dapat dikonfigurasi client-side untuk visual.

Namun trigger Mercy tetap:

```text
hand.length >= mercyLimit
```

dan ditentukan server.

---

# 30. WIN CONDITION

Game berakhir apabila:

### Condition A — Empty Hand

Player berhasil memiliki:

```text
0 cards
```

Player tersebut menjadi winner.

### Condition B — Last Active Player

Jika semua pemain lain telah terkena Mercy:

```text
activePlayers.length === 1
```

maka satu-satunya active player menjadi winner.

Server harus menangani kedua kondisi tersebut.

---

# 31. ELIMINATED PLAYER

Player dengan status:

```text
eliminated
```

tidak dihitung sebagai active player.

Contoh:

```text
8 Players

P1 active
P2 active
P3 eliminated
P4 active
P5 eliminated
P6 active
P7 active
P8 eliminated
```

Active players:

```text
P1
P2
P4
P6
P7
```

Total:

```text
5 active players
```

---

# 32. GAME END

Saat server menentukan winner:

```text
game.status = "finished";
game.winnerId = player.id;
```

Kemudian broadcast:

```text
game_over
```

Semua client harus menerima result yang sama.

---

# 33. SCORING — OPTIONAL

Jika scoring digunakan, gunakan sistem score terpisah dari win condition.

Nilai kartu:

```text
Number cards = face value
Skip = 20
Reverse = 20
Draw Two = 20
Wild = 50
Wild Draw Four = 50
```

Jika sistem scoring digunakan, hitung score berdasarkan kartu yang masih dimiliki pemain lain setelah winner ditemukan.

Namun untuk MVP:

```text
Winner = player who empties hand
```

lebih dahulu harus diutamakan.

Jangan membuat score menentukan winner jika rule utama menggunakan empty hand.

---

# 34. STACKING RULE

Untuk menjaga game mengikuti ruleset yang ditentukan:

```text
Draw Two stacking = OFF
Wild Draw Four stacking = OFF
```

Contoh:

```text
P1 → Draw Two
P2 → wajib Draw 2
```

P2 tidak boleh:

```text
Draw Two → P3
```

Hal yang sama berlaku untuk:

```text
Wild Draw Four
```

Challenge Wild Draw Four tetap tersedia.

---

# 35. JUMP-IN

Jangan implementasikan:

```text
Jump-In
```

Artinya pemain tidak boleh memainkan kartu di luar gilirannya walaupun mempunyai kartu yang sama.

Server harus menolak:

```text
play_card
```

jika:

```text
player.id !== currentPlayerId
```

---

# 36. 7-0 RULE

Jangan implementasikan:

```text
7-0 rule
```

kecuali fitur tersebut secara eksplisit diaktifkan sebagai house rule.

Default:

```text
7-0 = OFF
```

---

# 37. STACKING HOUSE RULE

Jangan implementasikan stacking sebagai default.

Default:

```text
Stacking = OFF
```

Jika suatu saat ingin dibuat configurable, tambahkan sebagai room setting:

```text
stackingEnabled
```

Tetapi untuk MVP:

```text
stackingEnabled = false
```

---

# 38. HOUSE RULES

Jangan mencampurkan house rules dengan core UNO rules.

Core rules:

```text
Number
Skip
Reverse
Draw Two
Wild
Wild Draw Four
UNO
Challenge
Draw
Win Condition
```

Custom UNO MERCY:

```text
Mercy Limit
Mercy Warning
Mercy Elimination
```

Optional house rules harus diberi status:

```text
OFF
```

secara default.

---

# 39. SERVER RULE ENGINE

Semua aturan harus berada di server.

Buat:

```text
RuleEngine
```

Minimal functions:

```ts
canPlayCard()
canPlayWildDrawFour()
applyCardEffect()
getNextPlayer()
applySkip()
applyReverse()
applyDrawTwo()
applyWild()
applyWildDrawFour()
canCallUno()
canChallengeUno()
canChallengeWildDrawFour()
checkMercy()
checkWinCondition()
```

---

# 40. GAME ACTION FLOW

Semua action mengikuti:

```text
PLAYER ACTION
      ↓
SOCKET REQUEST
      ↓
AUTHENTICATION
      ↓
TURN VALIDATION
      ↓
CARD OWNERSHIP VALIDATION
      ↓
RULE VALIDATION
      ↓
RULE ENGINE
      ↓
UPDATE GAME STATE
      ↓
CHECK UNO
      ↓
CHECK MERCY
      ↓
CHECK WIN CONDITION
      ↓
BROADCAST RESULT
```

---

# 41. CARD PLAY EXAMPLE

Contoh:

```text
Top Card:
Red 7

Player Hand:
Blue 7
Green 4
Red 2
Wild
```

Player memainkan:

```text
Blue 7
```

Server:

```text
ownership = valid
turn = valid
color/number match = valid
```

Maka:

```text
remove Blue 7 from hand
add Blue 7 to discard
currentColor = Blue
next player
```

---

# 42. WILD EXAMPLE

Top card:

```text
Red 7
```

Player:

```text
Wild
```

Player memilih:

```text
Green
```

Server:

```text
remove Wild
add Wild to discard
currentColor = Green
next player
```

---

# 43. WILD DRAW FOUR EXAMPLE

Current color:

```text
Blue
```

Player hand:

```text
Red 5
Yellow 8
Wild Draw Four
```

Tidak ada Blue card.

Maka:

```text
Wild Draw Four = valid
```

Player chooses:

```text
Yellow
```

Next player:

```text
draw 4
lose turn
```

Current color:

```text
Yellow
```

---

# 44. INVALID WILD DRAW FOUR

Current color:

```text
Blue
```

Player hand:

```text
Blue 5
Red 7
Wild Draw Four
```

Karena player memiliki:

```text
Blue 5
```

maka:

```text
Wild Draw Four = invalid
```

Server harus menolak action.

---

# 45. DRAW EXAMPLE

Player tidak memainkan kartu.

Player memilih:

```text
DRAW
```

Server:

```text
draw 1 card
```

Jika card playable:

```text
player may play the drawn card
```

Jika tidak:

```text
turn ends
```

---

# 46. MERCY EXAMPLE

Mercy Limit:

```text
25
```

Player memiliki:

```text
23 cards
```

Kemudian mendapat Draw Two:

```text
23 + 2 = 25
```

Server:

```text
checkMercy()
```

Hasil:

```text
MERCY TRIGGERED
```

Player:

```text
status = eliminated
```

Player dikeluarkan dari turn order.

---

# 47. MERCY + WIN EXAMPLE

Misalnya tersisa:

```text
P1 active
P2 active
P3 eliminated
P4 eliminated
```

Jika P2 terkena Mercy:

```text
P2 eliminated
```

Maka:

```text
activePlayers = [P1]
```

Server:

```text
P1 = winner
```

Game selesai.

---

# 48. RULE PRIORITY

Jika terdapat beberapa event dalam satu action, gunakan urutan:

```text
1. Validate Action
2. Apply Card
3. Apply Card Effect
4. Update Hand
5. Check UNO State
6. Check Mercy
7. Remove Eliminated Player
8. Check Win Condition
9. Determine Next Turn
10. Broadcast State
```

Jika game selesai karena winner ditemukan, jangan membuat turn baru.

---

# 49. CLIENT UI RULES

Client harus memberikan feedback untuk:

```text
Playable Card
Unplayable Card
Current Turn
UNO State
Mercy Warning
Mercy Trigger
Wild Color Selection
Wild Draw Four Challenge
Draw
Penalty
Game Over
```

Tetapi visual client bukan sumber kebenaran.

Contoh:

```text
Card terlihat playable
```

tidak berarti server wajib menerima.

Server tetap melakukan validation.

---

# 50. FINAL RULE CONFIGURATION

Default configuration:

```ts
const UNO_MERCY_RULES = {
  initialHandSize: 7,

  deckSize: 108,

  mercyLimit: 25,

  allowDrawAfterPlayableCard: true,

  drawTwoStacking: false,

  wildDrawFourStacking: false,

  jumpIn: false,

  sevenZero: false,

  reverseAsSkipForTwoPlayers: true,

  wildDrawFourChallenge: true,

  unoPenaltyCards: 2,

  failedWildDrawFourChallengePenalty: 6,

  wildDrawFourRequiredNoMatchingColor: true,
};
```

---

# 51. IMPORTANT IMPLEMENTATION RULE

Jangan mengubah rules hanya karena UI atau client menginginkannya.

Server harus selalu menentukan:

```text
whether card can be played
whose turn it is
how many cards must be drawn
whether UNO is valid
whether challenge is valid
whether Mercy is triggered
who is eliminated
who wins
when game ends
```

Client hanya mengirim:

```text
play_card
draw_card
call_uno
challenge_uno
challenge_wild_draw_four
choose_color
```

Server menentukan hasil akhirnya.

---

# 52. FINAL RULE SUMMARY

UNO MERCY menggunakan:

```text
108-card UNO-style deck
7 starting cards
2–8 players
4 colors
Number Cards
Skip
Reverse
Draw Two
Wild
Wild Draw Four
UNO
UNO penalty
Wild Draw Four Challenge
Draw 1
No stacking
No Jump-In
No 7-0
Mercy Limit
Mercy Elimination
Empty Hand Win
Last Active Player Win
```

Custom feature utama:

```text
MERCY LIMIT
```

Default:

```text
25 cards
```

Jika:

```text
hand.length >= 25
```

maka:

```text
MERCY
→ ELIMINATED
```

Semua rules harus diimplementasikan pada **server-authoritative RuleEngine**, diuji melalui unit test dan integration test, serta disinkronkan ke seluruh client melalui Socket.IO.

**Jangan membuat variasi aturan UNO lain kecuali dinyatakan secara eksplisit sebagai configurable house rule.**
