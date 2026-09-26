# PRD — UNO MERCY MULTIPLAYER

## 1. ROLE

Kamu adalah Senior Full-Stack Game Developer, Multiplayer Game Developer, Game Designer, UI/UX Designer, Backend Engineer, Network Engineer, dan QA Engineer.

Tugas kamu adalah membangun sebuah game kartu digital bernama:

# UNO MERCY

Game harus dapat dimainkan secara:

* Single Player melawan Bot
* Multiplayer bersama teman
* Multiplayer menggunakan Room Code
* Jumlah pemain dapat dikonfigurasi oleh Host
* Minimum pemain: 2
* Maksimum pemain: 8

Game harus memiliki arsitektur multiplayer yang aman, stabil, realtime, responsive, dan server-authoritative.

Jangan membuat game hanya sebagai prototype visual.

Game harus benar-benar memiliki game logic yang dapat dimainkan.

---

# 2. KONSEP UTAMA

UNO MERCY adalah game kartu turn-based multiplayer.

Pemain dapat membuat room dan membagikan kode room kepada teman.

Contoh:

```text
Host membuat room

        ↓

ROOM CODE
A7K92P

        ↓

Host mengirim kode kepada teman

        ↓

Teman memasukkan kode

        ↓

Masuk Lobby

        ↓

Semua pemain Ready

        ↓

Host Start Game

        ↓

UNO MERCY GAME
```

---

# 3. JUMLAH PEMAIN

Game harus mendukung:

```text
Minimum: 2 pemain
Maximum: 8 pemain
```

Host dapat menentukan jumlah maksimal pemain ketika membuat room.

Pilihan:

```text
2 Players
3 Players
4 Players
5 Players
6 Players
7 Players
8 Players
```

Contoh:

```text
CREATE ROOM

Room Name:
[ Lutfan's Room ]

Max Players:
[ 8 ▼ ]

[ CREATE ROOM ]
```

Jika Host memilih 8:

```text
0 / 8 Players
```

Teman dapat masuk sampai jumlah pemain mencapai:

```text
8 / 8 Players
```

Setelah room penuh:

```text
ROOM FULL
```

Pemain lain tidak dapat bergabung.

---

# 4. ROOM SYSTEM

Setiap room memiliki:

```typescript
interface GameRoom {
    roomId: string;
    roomCode: string;
    hostId: string;
    maxPlayers: number;
    players: Player[];
    status: RoomStatus;
    createdAt: number;
}
```

Room status:

```text
waiting
starting
playing
finished
closed
```

---

# 5. ROOM CODE

Setiap room mendapatkan kode unik.

Contoh:

```text
A7K92P
X8M4QZ
UNO123
K9PL2A
```

Gunakan kombinasi:

* huruf kapital
* angka

Panjang default:

```text
6 karakter
```

Room code harus:

* unik
* mudah diketik
* tidak case-sensitive
* tidak menggunakan karakter ambigu jika memungkinkan

Contoh hindari:

```text
O / 0
I / 1
S / 5
```

---

# 6. CREATE ROOM

Menu:

```text
MULTIPLAYER

[ CREATE ROOM ]

[ JOIN ROOM ]
```

Ketika memilih Create Room:

```text
CREATE ROOM

Nickname
[ Lutfan ]

Max Players
[ 4 ▼ ]

Mercy Limit
[ 25 ▼ ]

[ CREATE ROOM ]
```

Host otomatis masuk ke lobby setelah room berhasil dibuat.

---

# 7. JOIN ROOM

Player memilih:

```text
JOIN ROOM
```

Kemudian:

```text
ENTER ROOM CODE

[ A7K92P ]

Nickname

[ Player 2 ]

[ JOIN ROOM ]
```

Server harus:

1. Memeriksa room code.
2. Memastikan room tersedia.
3. Memastikan room belum penuh.
4. Memastikan game belum dimulai.
5. Memastikan nickname valid.
6. Membuat player.
7. Mengirim player ke room.
8. Broadcast perubahan lobby.

---

# 8. LOBBY

Lobby merupakan tempat semua pemain berkumpul sebelum permainan dimulai.

Contoh:

```text
┌──────────────────────────────────────────┐
│             UNO MERCY                    │
│                                          │
│ ROOM CODE                                │
│                                          │
│             A7K92P                       │
│                                          │
│ Players 4 / 6                            │
│                                          │
│ 👑 Lutfan        HOST       READY        │
│    Budi                   READY          │
│    Andi                   READY          │
│    Sinta                  NOT READY      │
│                                          │
│ Max Players: 6                           │
│ Mercy Limit: 25                          │
│                                          │
│ [ COPY CODE ]                            │
│                                          │
│ Host: [ START GAME ]                     │
│ Player: [ READY ]                        │
└──────────────────────────────────────────┘
```

---

# 9. HOST

Host memiliki hak khusus:

* membuat room
* menentukan max player
* menentukan Mercy Limit
* start game
* kick player
* close room

Host tidak boleh memiliki kemampuan curang terhadap game.

Host tetap mengikuti aturan permainan normal.

---

# 10. KICK PLAYER

Host dapat mengeluarkan player dari lobby.

Contoh:

```text
Player Budi

[ KICK ]
```

Ketika kick:

```text
You have been removed from the room.
```

Player tersebut tidak dapat kembali menggunakan session lama.

---

# 11. READY SYSTEM

Setiap player memiliki status:

```text
READY
NOT READY
```

Host juga harus melakukan Ready.

Tombol:

```text
[ READY ]
```

berubah menjadi:

```text
[ UNREADY ]
```

Game hanya dapat dimulai jika:

```text
jumlah player >= 2
```

dan seluruh pemain:

```text
READY
```

---

# 12. START GAME

Host menekan:

```text
START GAME
```

Server melakukan validasi:

```text
Room valid?
Player >= 2?
Semua ready?
Host masih connected?
Game belum dimulai?
```

Jika valid:

```text
Starting game...

3
2
1

UNO MERCY!
```

---

# 13. DISCONNECT BEFORE GAME

Jika player keluar dari lobby:

* remove player
* update player count
* broadcast lobby update

Jika Host keluar:

Pilih salah satu mekanisme yang stabil:

```text
Host Migration
```

Player lain dengan urutan tertentu menjadi Host baru.

Contoh:

```text
Lutfan disconnected.

Budi is now Host.
```

---

# 14. GAME START

Setelah game dimulai:

Server membuat:

* deck
* discard pile
* player hands
* current player
* direction
* current color
* game state

---

# 15. CARD SYSTEM

Gunakan kartu:

## COLORS

```text
RED
YELLOW
GREEN
BLUE
```

## NUMBER

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

## ACTION

```text
SKIP
REVERSE
DRAW TWO
```

## WILD

```text
WILD
WILD DRAW FOUR
```

Game logic harus modular sehingga kartu baru dapat ditambahkan.

---

# 16. PLAYER HAND

Setiap player memiliki kartu di tangan.

Player hanya dapat melihat:

```text
kartu miliknya sendiri
```

Player tidak boleh mengetahui kartu lawan.

Pada game dengan 8 pemain:

```text
Player 1
Player 2
Player 3
Player 4
Player 5
Player 6
Player 7
Player 8
```

UI harus tetap dapat menampilkan semua pemain tanpa membuat layar berantakan.

---

# 17. GAME TABLE

Desain game table seperti permainan kartu.

Contoh:

```text
              PLAYER 3
                🃏🃏

      PLAYER 4          PLAYER 2

                ┌──────┐
                │ DISC │
                └──────┘

      PLAYER 5          PLAYER 1

                PLAYER
          🃏 🃏 🃏 🃏 🃏
```

Layout harus menyesuaikan jumlah pemain.

Untuk:

```text
2 pemain
```

gunakan layout sederhana.

Untuk:

```text
3–4 pemain
```

gunakan layout medium.

Untuk:

```text
5–8 pemain
```

gunakan layout multiplayer table.

---

# 18. PLAYER INFORMATION

Setiap player ditampilkan:

* nickname
* avatar
* jumlah kartu
* status UNO
* turn indicator
* connection indicator

Contoh:

```text
┌───────────────┐
│ 🟢 Budi       │
│ Cards: 5      │
│ 🔥 UNO        │
└───────────────┘
```

Jangan menampilkan isi kartu pemain lain.

---

# 19. TURN SYSTEM

Server menentukan:

```text
currentPlayerId
```

Hanya player tersebut yang dapat melakukan action.

Jika bukan turn player:

```text
WAIT FOR YOUR TURN
```

Server harus menolak action ilegal.

---

# 20. CARD PLAY

Player memilih kartu.

Client mengirim:

```text
play_card
```

Server memvalidasi:

```text
Apakah player benar?
Apakah turn benar?
Apakah card dimiliki player?
Apakah card valid?
Apakah game sedang berjalan?
```

Jika valid:

```text
Update game state
Broadcast action
```

---

# 21. DRAW

Player dapat:

```text
DRAW CARD
```

Server mengambil kartu.

Client menerima:

```text
card_drawn
```

Kemudian UI memainkan draw animation.

---

# 22. UNO SYSTEM

Ketika player tinggal memiliki 1 kartu:

```text
UNO!
```

Player harus menekan:

```text
[ UNO! ]
```

Server mencatat:

```text
unoCalled = true
```

UI menampilkan:

```text
🔥 UNO!
```

---

# 23. CALL UNO

Player lain dapat melakukan:

```text
CALL UNO
```

Jika player lain lupa memanggil UNO:

```text
UNO PENALTY
```

Penalty harus configurable.

Default:

```text
+2 cards
```

---

# 24. MERCY RULE

Ini merupakan mekanisme utama game.

Default:

```text
MERCY LIMIT = 25
```

Host dapat menentukan:

```text
15
20
25
30
```

atau pilihan konfigurasi lain yang ditentukan game.

Jika:

```text
player.hand.length >= mercyLimit
```

maka:

```text
MERCY RULE ACTIVATED
```

Player langsung:

```text
ELIMINATED
```

---

# 25. MERCY ELIMINATION

Ketika player terkena Mercy:

```text
💀 MERCY!

Budi has reached the Mercy Limit.

Budi has been eliminated.
```

Player:

* tidak dapat bermain lagi
* tidak mendapat turn
* status menjadi eliminated
* kartu mereka dikeluarkan dari permainan
* player lain menerima event elimination

---

# 26. MERCY ANIMATION

Buat efek:

* card shake
* screen shake ringan
* particle
* sound effect
* large MERCY text
* player elimination animation

Gunakan animasi yang tetap performant.

---

# 27. WIN CONDITION

Player menang ketika:

```text
hand.length === 0
```

atau kondisi kemenangan lain berdasarkan aturan game yang telah didefinisikan.

Jika hanya satu player tersisa karena pemain lain terkena Mercy:

```text
PLAYER WINS
```

Server menentukan winner.

---

# 28. GAME OVER

Tampilkan:

```text
┌───────────────────────────────┐
│          GAME OVER            │
│                               │
│       🏆 LUTFAN WINS          │
│                               │
│  1. Lutfan                    │
│  2. Budi                      │
│  3. Andi                      │
│  4. Sinta - MERCY             │
│                               │
│ [ PLAY AGAIN ]                │
│ [ BACK TO LOBBY ]             │
│ [ MAIN MENU ]                 │
└───────────────────────────────┘
```

Ranking harus berdasarkan hasil game, bukan asumsi client.

---

# 29. PLAY AGAIN

Setelah game selesai:

Host dapat memilih:

```text
PLAY AGAIN
```

Semua player kembali ke lobby.

Room code tetap sama.

Player tidak perlu membuat room baru.

Host dapat:

```text
mengubah Mercy Limit
```

Jika memungkinkan, Host juga dapat mengubah:

```text
Max Players
```

selama tidak lebih kecil dari jumlah player yang sudah berada di room.

---

# 30. ROOM CODE SHARING

Lobby harus memiliki tombol:

```text
COPY ROOM CODE
```

dan:

```text
SHARE ROOM
```

Jika Clipboard API tersedia, gunakan untuk menyalin kode.

Jika tidak tersedia, tetap tampilkan kode agar dapat disalin manual.

Contoh:

```text
Join my UNO Mercy game!

Room Code:
A7K92P
```

---

# 31. NETWORK ARCHITECTURE

Gunakan:

```text
CLIENT
TypeScript + Phaser
       │
       │ WebSocket
       ▼
SERVER
Node.js + TypeScript
       │
       ▼
GAME ENGINE
```

Socket.IO digunakan untuk realtime communication.

---

# 32. SERVER AUTHORITATIVE

SERVER adalah sumber kebenaran utama.

Client tidak boleh menentukan:

* kartu yang dimiliki
* deck order
* turn
* winner
* score
* Mercy elimination
* card validity

Client hanya mengirim request.

Contoh:

```text
CLIENT:

Saya ingin memainkan kartu ID 123.
```

Server:

```text
Apakah kartu 123 dimiliki player?
Apakah sekarang turn player?
Apakah kartu valid?

YES

→ update state
→ broadcast
```

---

# 33. SOCKET EVENTS

Gunakan event yang terstruktur.

## ROOM

```text
create_room
room_created

join_room
room_joined
room_error

leave_room
player_joined
player_left

kick_player
player_kicked

host_changed
```

## LOBBY

```text
player_ready
player_unready

lobby_updated
start_game
game_starting
```

## GAME

```text
game_state
turn_changed

play_card
card_played

draw_card
card_drawn

call_uno
uno_called

challenge_uno
uno_penalty

mercy_triggered
player_eliminated

game_over
```

## CONNECTION

```text
player_connected
player_disconnected
player_reconnected
```

---

# 34. GAME STATE SYNCHRONIZATION

Server harus mengirim state yang sesuai kepada setiap player.

Jangan mengirim hidden information.

Contoh:

Player A menerima:

```text
cards: [own cards]
opponents: [
    { id: B, cardCount: 5 },
    { id: C, cardCount: 3 }
]
```

Bukan:

```text
Player B cards:
RED 5
BLUE 8
WILD
...
```

---

# 35. RECONNECT SYSTEM

Jika koneksi player terputus:

```text
CONNECTION LOST

Reconnecting...
```

Server menyimpan player session sementara.

Berikan waktu:

```text
30 seconds
```

untuk reconnect.

Jika berhasil:

```text
CONNECTED

Restoring game...
```

Player mendapatkan kembali:

* nickname
* hand
* turn
* room
* game state

---

# 36. ROOM VALIDATION

Server harus memvalidasi:

### Room tidak ditemukan

```text
ROOM NOT FOUND
```

### Room penuh

```text
ROOM FULL
```

### Game sudah berjalan

```text
GAME ALREADY STARTED
```

### Nickname digunakan

```text
NICKNAME ALREADY USED
```

### Invalid room code

```text
INVALID ROOM CODE
```

---

# 37. BOT

Jika game Single Player:

Player dapat bermain melawan Bot.

Bot memiliki:

```text
Easy
Normal
Hard
```

AI harus menggunakan game state yang memang dapat diketahui bot.

Bot tidak boleh mengetahui hidden information lawan.

---

# 38. BOT DI MULTIPLAYER

Jika player disconnect terlalu lama, opsional:

```text
BOT TAKEOVER
```

Bot dapat menggantikan player yang disconnect.

Namun mekanisme ini harus configurable.

Contoh:

```text
BOT TAKEOVER:
ON / OFF
```

---

# 39. CHAT

Tambahkan fitur chat sederhana di lobby/game.

Contoh:

```text
┌──────────────────────┐
│ CHAT                 │
│                      │
│ Budi: siap           │
│ Andi: gas            │
│ Lutfan: bentar       │
│                      │
│ [ Type message... ]  │
│ [ SEND ]             │
└──────────────────────┘
```

Chat hanya boleh digunakan oleh player dalam room yang sama.

Tambahkan rate limit agar tidak dapat spam.

---

# 40. EMOTE

Tambahkan quick emote:

```text
😂
🔥
😱
GG
UNO!
😭
```

Player dapat mengirim emote tanpa mengetik.

Emote ditampilkan di dekat avatar player.

---

# 41. SETTINGS

Settings:

```text
Music
Sound Effect
Master Volume
Animation
Screen Shake
Nickname
```

Simpan pengaturan lokal.

---

# 42. STATISTICS

Simpan statistik lokal:

```text
Games Played
Games Won
Games Lost
UNO Calls
UNO Penalties
Mercy Eliminations
Cards Played
```

Untuk multiplayer online, statistik permanen dapat dikembangkan menggunakan database.

---

# 43. UI RESPONSIVE

Game harus mendukung:

```text
Desktop
Laptop
Tablet
Mobile Landscape
```

Untuk 8 pemain, UI harus tetap terbaca.

Jangan memaksakan semua player card berukuran besar.

Gunakan:

* compact player cards
* responsive positioning
* card scaling
* horizontal hand scrolling jika diperlukan

---

# 44. MOBILE

Pada mobile:

* gameplay diprioritaskan landscape
* tombol touch-friendly
* minimum touch target sekitar 44px
* kartu mudah dipilih
* jangan membuat tombol terlalu kecil

---

# 45. ANIMATION

Tambahkan:

### Lobby

* player join animation
* player leave animation
* ready animation

### Game

* card draw
* card play
* card discard
* turn indicator
* UNO
* Mercy
* victory
* defeat

---

# 46. AUDIO

Tambahkan:

* background music
* button click
* card draw
* card play
* UNO
* penalty
* Mercy
* victory
* defeat
* player join
* player leave

Semua audio dapat dimatikan melalui Settings.

---

# 47. SECURITY

Jangan mempercayai data dari client.

Server harus memvalidasi:

```text
roomId
playerId
cardId
turn
action
game state
```

Jangan menerima:

```text
client says "I won"
```

Server sendiri menentukan:

```text
winner
```

---

# 48. RATE LIMIT

Tambahkan rate limit untuk:

* create room
* join room
* chat
* emote
* card action
* UNO call

Tujuannya mencegah spam dan duplicate request.

---

# 49. DUPLICATE ACTION PROTECTION

Jika player mengirim:

```text
play_card
```

dua kali dengan cepat:

Server hanya boleh memproses action yang valid pertama.

Action berikutnya harus ditolak jika state sudah berubah.

---

# 50. GAME TIMER

Tambahkan timer turn.

Contoh:

```text
YOUR TURN

Time:
28
27
26
...
```

Default:

```text
30 seconds
```

Jika timer habis:

```text
AUTO DRAW
```

Konfigurasi timer harus modular.

---

# 51. ROOM SETTINGS

Host dapat menentukan:

```text
Max Players:
2–8

Mercy Limit:
15 / 20 / 25 / 30

Turn Timer:
15 / 30 / 45 / 60 seconds

Bot Takeover:
ON / OFF
```

Jangan membuat terlalu banyak pengaturan yang membingungkan.

---

# 52. GAME FLOW

Implementasikan flow berikut:

```text
MAIN MENU
   │
   ├── SOLO
   │      ↓
   │    GAME
   │
   └── MULTIPLAYER
          │
          ├── CREATE ROOM
          │      ↓
          │    LOBBY
          │      ↓
          │    SHARE CODE
          │      ↓
          │    FRIENDS JOIN
          │      ↓
          │    READY
          │      ↓
          │    START
          │      ↓
          │    GAME
          │      ↓
          │    GAME OVER
          │      ↓
          │    PLAY AGAIN
          │
          └── JOIN ROOM
                 ↓
               CODE
                 ↓
               LOBBY
```

---

# 53. PROJECT STRUCTURE

Gunakan struktur project modular dan pisahkan antara client, server, dan shared game logic.

```text
uno-mercy/
│
├── client/
│   │
│   ├── public/
│   │   └── assets/
│   │       ├── cards/
│   │       ├── avatars/
│   │       ├── sounds/
│   │       ├── music/
│   │       ├── images/
│   │       └── fonts/
│   │
│   ├── src/
│   │   │
│   │   ├── game/
│   │   │   ├── scenes/
│   │   │   │   ├── BootScene.ts
│   │   │   │   ├── PreloadScene.ts
│   │   │   │   ├── MainMenuScene.ts
│   │   │   │   ├── LobbyScene.ts
│   │   │   │   ├── GameScene.ts
│   │   │   │   └── GameOverScene.ts
│   │   │   │
│   │   │   ├── cards/
│   │   │   │   ├── Card.ts
│   │   │   │   ├── CardFactory.ts
│   │   │   │   ├── CardRenderer.ts
│   │   │   │   └── CardAnimation.ts
│   │   │   │
│   │   │   ├── entities/
│   │   │   │   ├── Player.ts
│   │   │   │   ├── PlayerAvatar.ts
│   │   │   │   └── PlayerHand.ts
│   │   │   │
│   │   │   ├── systems/
│   │   │   │   ├── GameClient.ts
│   │   │   │   ├── TurnSystem.ts
│   │   │   │   ├── AnimationSystem.ts
│   │   │   │   └── AudioSystem.ts
│   │   │   │
│   │   │   └── effects/
│   │   │       ├── UnoEffect.ts
│   │   │       ├── MercyEffect.ts
│   │   │       └── VictoryEffect.ts
│   │   │
│   │   ├── multiplayer/
│   │   │   ├── SocketManager.ts
│   │   │   ├── RoomClient.ts
│   │   │   ├── LobbyClient.ts
│   │   │   ├── ReconnectManager.ts
│   │   │   └── NetworkState.ts
│   │   │
│   │   ├── ui/
│   │   │   ├── MainMenu.ts
│   │   │   ├── CreateRoom.ts
│   │   │   ├── JoinRoom.ts
│   │   │   ├── LobbyUI.ts
│   │   │   ├── ChatUI.ts
│   │   │   ├── SettingsUI.ts
│   │   │   └── NotificationUI.ts
│   │   │
│   │   ├── state/
│   │   │   ├── GameState.ts
│   │   │   ├── PlayerState.ts
│   │   │   └── SettingsState.ts
│   │   │
│   │   ├── audio/
│   │   ├── utils/
│   │   ├── config/
│   │   └── main.ts
│   │
│   └── package.json
│
├── server/
│   │
│   ├── src/
│   │   │
│   │   ├── game/
│   │   │   ├── GameEngine.ts
│   │   │   ├── GameState.ts
│   │   │   ├── DeckManager.ts
│   │   │   ├── TurnManager.ts
│   │   │   ├── RuleEngine.ts
│   │   │   ├── UnoManager.ts
│   │   │   ├── MercyManager.ts
│   │   │   ├── ScoreManager.ts
│   │   │   └── WinManager.ts
│   │   │
│   │   ├── rooms/
│   │   │   ├── Room.ts
│   │   │   ├── RoomManager.ts
│   │   │   ├── RoomCodeGenerator.ts
│   │   │   └── HostManager.ts
│   │   │
│   │   ├── players/
│   │   │   ├── Player.ts
│   │   │   ├── PlayerManager.ts
│   │   │   └── SessionManager.ts
│   │   │
│   │   ├── socket/
│   │   │   ├── SocketServer.ts
│   │   │   ├── RoomEvents.ts
│   │   │   ├── LobbyEvents.ts
│   │   │   └── GameEvents.ts
│   │   │
│   │   ├── middleware/
│   │   │   ├── Validation.ts
│   │   │   ├── RateLimit.ts
│   │   │   └── ErrorHandler.ts
│   │   │
│   │   ├── config/
│   │   └── server.ts
│   │
│   └── package.json
│
├── shared/
│   │
│   ├── types/
│   │   ├── CardTypes.ts
│   │   ├── PlayerTypes.ts
│   │   ├── RoomTypes.ts
│   │   ├── GameTypes.ts
│   │   └── SocketTypes.ts
│   │
│   ├── constants/
│   │   ├── CardConstants.ts
│   │   ├── GameConstants.ts
│   │   └── RoomConstants.ts
│   │
│   ├── rules/
│   │   ├── CardRules.ts
│   │   ├── UnoRules.ts
│   │   └── MercyRules.ts
│   │
│   └── events/
│       └── SocketEvents.ts
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── multiplayer/
│
├── README.md
├── package.json
└── .gitignore
```

---

# 54. SHARED TYPE SYSTEM

Client dan server harus menggunakan type yang sama untuk menghindari ketidaksesuaian data.

Gunakan TypeScript.

Contoh:

```typescript
type CardColor =
    | "red"
    | "yellow"
    | "green"
    | "blue"
    | "wild";

type CardType =
    | "number"
    | "skip"
    | "reverse"
    | "draw2"
    | "wild"
    | "wildDraw4";

type PlayerStatus =
    | "connected"
    | "disconnected"
    | "eliminated"
    | "winner"
    | "loser";

type RoomStatus =
    | "waiting"
    | "starting"
    | "playing"
    | "finished"
    | "closed";
```

---

# 55. CARD DATA MODEL

Setiap kartu harus mempunyai ID unik.

Contoh:

```typescript
interface Card {
    id: string;
    color: CardColor;
    type: CardType;
    value?: number;
}
```

Jangan menggunakan index array sebagai identitas kartu.

Contoh ID:

```text
red-0-01
red-5-02
blue-skip-01
wild-01
wild-draw4-01
```

---

# 56. PLAYER DATA MODEL

Gunakan:

```typescript
interface Player {
    id: string;
    nickname: string;
    avatar: string;
    hand: Card[];
    status: PlayerStatus;
    ready: boolean;
    connected: boolean;
    isHost: boolean;
    unoCalled: boolean;
}
```

Untuk client multiplayer, jangan mengirim isi `hand` pemain lain.

---

# 57. ROOM DATA MODEL

Gunakan:

```typescript
interface Room {
    id: string;
    code: string;
    hostId: string;
    maxPlayers: number;
    players: Player[];
    mercyLimit: number;
    turnTimer: number;
    botTakeover: boolean;
    status: RoomStatus;
    createdAt: number;
}
```

Validasi:

```text
maxPlayers >= 2
maxPlayers <= 8
```

---

# 58. GAME STATE

Gunakan game state terpusat.

```typescript
interface GameState {
    roomId: string;
    drawPile: Card[];
    discardPile: Card[];
    currentPlayerId: string;
    currentColor: CardColor;
    direction: "clockwise" | "counterclockwise";
    turnNumber: number;
    status: "starting" | "playing" | "finished";
    winnerId?: string;
}
```

Server merupakan sumber kebenaran game state.

---

# 59. GAME ENGINE

Buat `GameEngine` yang bertanggung jawab terhadap:

* start game
* player turn
* play card
* draw card
* action card
* UNO
* penalty
* Mercy
* elimination
* winner
* game over

UI tidak boleh menangani business logic utama.

---

# 60. ROOM MANAGER

Buat `RoomManager`.

Tanggung jawab:

* create room
* generate room code
* find room
* join room
* leave room
* remove room
* kick player
* update host
* close room

Contoh:

```typescript
createRoom()
joinRoom()
leaveRoom()
kickPlayer()
findRoomByCode()
transferHost()
```

---

# 61. ROOM CODE GENERATOR

Buat generator kode room.

Requirement:

* 6 karakter
* uppercase
* angka
* mudah dibaca
* tidak boleh duplicate
* tidak menggunakan karakter ambigu

Contoh:

```text
A7K92P
B4X8MQ
R9T2LK
```

Sebelum membuat room:

```text
generate code
       ↓
check uniqueness
       ↓
if exists → generate again
       ↓
create room
```

---

# 62. MAX PLAYER VALIDATION

Host hanya dapat memilih:

```text
2
3
4
5
6
7
8
```

Server harus tetap melakukan validasi walaupun client sudah melakukan validasi.

Tidak boleh menerima:

```text
0
1
9
10
-1
```

---

# 63. LOBBY SYNCHRONIZATION

Ketika player masuk:

```text
player_joined
```

Server broadcast:

```text
lobby_updated
```

Semua player mendapatkan:

* player list
* jumlah player
* max player
* ready status
* host
* room settings

---

# 64. GAME START SYNCHRONIZATION

Ketika host memulai:

```text
start_game
```

Server mengubah:

```text
waiting
```

menjadi:

```text
starting
```

Kemudian:

```text
3
2
1
```

Setelah itu:

```text
playing
```

Semua client harus berpindah ke GameScene secara sinkron.

---

# 65. INITIAL CARD DEAL

Server membagikan kartu.

Default:

```text
7 kartu setiap player
```

Untuk 8 pemain:

```text
8 × 7 = 56 kartu
```

Semua pembagian dilakukan oleh server.

Client hanya menerima hasil pembagian yang boleh dilihat.

---

# 66. FIRST DISCARD CARD

Setelah kartu dibagikan:

Server menentukan kartu pertama.

Pastikan aturan kartu awal ditentukan dengan jelas.

Jika kartu pertama adalah kartu action/wild yang membutuhkan perlakuan khusus, buat aturan khusus di `RuleEngine`.

Jangan membiarkan client menentukan perlakuannya.

---

# 67. DRAW PILE MANAGEMENT

Jika draw pile kosong:

```text
discard pile
      ↓
ambil semua kecuali kartu paling atas
      ↓
shuffle
      ↓
draw pile
```

Jika tidak ada kartu yang dapat direcycle, game harus menangani kondisi tersebut tanpa crash.

---

# 68. TURN TIMER

Server memiliki timer turn.

Default:

```text
30 seconds
```

Timer:

```text
30
29
28
...
1
0
```

Jika mencapai 0:

```text
AUTO DRAW
```

Server yang menentukan timeout.

Client hanya menampilkan countdown berdasarkan server timestamp/state.

---

# 69. TURN ORDER

Turn order harus mendukung:

```text
clockwise
counterclockwise
```

Contoh 4 pemain:

```text
A → B → C → D
```

Setelah Reverse:

```text
A → D → C → B
```

Jika player terkena Mercy:

Player tersebut dikeluarkan dari turn order.

---

# 70. REVERSE RULE

Untuk:

```text
2 players
```

tentukan perilaku Reverse secara eksplisit agar konsisten dengan ruleset yang digunakan.

Implementasikan aturan tersebut di server, bukan di UI.

---

# 71. ACTION CARD SYSTEM

Implementasikan:

```text
SKIP
REVERSE
DRAW TWO
```

Setiap kartu memiliki efek yang terpisah.

Contoh:

```typescript
applySkip()
applyReverse()
applyDrawTwo()
```

Jangan membuat seluruh action card menjadi satu conditional besar.

---

# 72. WILD SYSTEM

Ketika player memainkan Wild:

Tampilkan:

```text
CHOOSE COLOR

🔴 RED
🟡 YELLOW
🟢 GREEN
🔵 BLUE
```

Player memilih warna.

Client mengirim:

```text
choose_color
```

Server memvalidasi bahwa player memang sedang memainkan kartu Wild.

---

# 73. WILD DRAW FOUR

Wild Draw Four harus mempunyai validasi aturan.

Jangan otomatis menganggap kartu selalu valid.

Buat fungsi:

```typescript
canPlayWildDrawFour(player, gameState)
```

Aturan validasi harus dipusatkan di `RuleEngine`.

---

# 74. UNO TIMING

Sistem UNO harus menangani kondisi:

```text
player plays card
       ↓
player now has 1 card
       ↓
UNO window opens
       ↓
player calls UNO
```

Jika player tidak memanggil UNO dalam window yang ditentukan:

```text
opponent may call UNO
```

Server menentukan valid/tidaknya penalty.

---

# 75. MERCY TIMING

Mercy Rule harus dievaluasi setelah setiap action yang dapat mengubah jumlah kartu player.

Contoh:

```text
draw
draw two
penalty
wild draw four
```

Setelah update hand:

```typescript
checkMercy(player)
```

Jika:

```text
hand.length >= mercyLimit
```

maka:

```text
eliminatePlayer(player)
```

---

# 76. MERCY + TURN HANDLING

Jika player yang terkena Mercy sedang mendapat turn:

1. Eliminate player.
2. Remove player dari turn order.
3. Tentukan next active player.
4. Broadcast Mercy event.
5. Broadcast new turn.

Jangan sampai turn berhenti karena player tereliminasi.

---

# 77. MERCY + WIN CONDITION

Setelah setiap elimination:

```text
checkWinCondition()
```

Jika hanya tersisa satu active player:

```text
game over
```

Jika player mencapai:

```text
hand.length === 0
```

maka player menjadi winner sesuai ruleset.

---

# 78. PLAYER RECONNECT

Gunakan session identifier yang aman.

Saat disconnect:

```text
connected = false
```

Jangan langsung menghapus player ketika game sedang berlangsung.

Simpan state selama:

```text
30 seconds
```

Player dapat reconnect ke room yang sama.

---

# 79. RECONNECT VALIDATION

Ketika reconnect:

Server memverifikasi:

```text
session valid?
room masih ada?
player masih berada di game?
session belum expired?
```

Jika valid:

```text
restore player state
```

Jika tidak:

```text
RECONNECT FAILED
```

---

# 80. HOST MIGRATION

Jika Host disconnect:

```text
Host disconnected
       ↓
find next eligible player
       ↓
assign new host
       ↓
broadcast host_changed
```

Player baru menjadi host tidak boleh mendapatkan keuntungan gameplay.

---

# 81. PLAYER DISCONNECT DURING TURN

Jika player disconnect ketika mendapat turn:

Gunakan timer reconnect.

Jika reconnect:

```text
continue turn
```

Jika timeout:

Gunakan konfigurasi:

```text
Bot Takeover
```

atau:

```text
Auto Draw
```

Implementasikan satu mekanisme default yang konsisten.

---

# 82. MULTIPLAYER CHAT

Chat harus menggunakan Socket.IO.

Pesan memiliki:

```typescript
interface ChatMessage {
    id: string;
    playerId: string;
    nickname: string;
    message: string;
    timestamp: number;
}
```

Server harus memastikan player hanya dapat mengirim chat ke room tempat dia berada.

---

# 83. CHAT SECURITY

Tambahkan:

* message length limit
* rate limit
* sanitize message
* anti-spam
* validasi room

Jangan mengizinkan HTML mentah dari user.

---

# 84. EMOTE SYSTEM

Emote tidak perlu menggunakan database.

Contoh:

```text
😂
🔥
😱
😭
GG
UNO
```

Server cukup broadcast:

```text
player_emote
```

---

# 85. CLIENT NETWORK STATE

Client harus memiliki status:

```text
CONNECTED
CONNECTING
RECONNECTING
DISCONNECTED
```

Tampilkan indikator:

```text
🟢 Connected
🟡 Reconnecting...
🔴 Disconnected
```

---

# 86. SERVER ERROR FORMAT

Gunakan format error yang konsisten.

```typescript
interface ServerError {
    code: string;
    message: string;
}
```

Contoh:

```text
ROOM_NOT_FOUND
ROOM_FULL
GAME_STARTED
INVALID_CARD
NOT_YOUR_TURN
INVALID_ACTION
PLAYER_NOT_FOUND
INVALID_ROOM_CODE
```

---

# 87. DATABASE PREPARATION

Versi MVP tidak wajib menggunakan database untuk game state aktif.

Game room dapat disimpan di memory server.

Namun struktur harus memungkinkan database ditambahkan di masa depan.

Database dapat digunakan untuk:

* account
* profile
* statistics
* leaderboard
* friends
* match history

Jangan menyimpan seluruh realtime game state ke database pada setiap action jika tidak diperlukan.

---

# 88. ROOM CLEANUP

Server harus menghapus room yang tidak digunakan.

Contoh:

```text
Room kosong
+
tidak aktif selama beberapa waktu
=
room dihapus
```

Room yang sudah selesai juga dapat dibersihkan setelah semua player keluar.

---

# 89. ROOM CODE COLLISION

Jika dua room mendapatkan kode sama:

Server harus mendeteksi collision.

Jangan menimpa room yang sudah ada.

Generate ulang code.

---

# 90. MULTIPLAYER STATE SECURITY

Jangan mengirim:

```text
drawPile lengkap
```

kepada client.

Jangan mengirim:

```text
kartu pemain lain
```

kepada client.

Server menyimpan hidden information.

Client hanya menerima:

```text
own hand
opponent card count
top discard
current color
current turn
public player information
```

---

# 91. CLIENT ACTION VALIDATION

Walaupun server melakukan validasi, client juga boleh melakukan pre-validation untuk UX.

Contoh:

Kartu tidak valid:

```text
disabled
```

Tetapi server tetap melakukan validasi.

Client validation:

```text
UX
```

Server validation:

```text
SECURITY + GAME AUTHORITY
```

---

# 92. ANIMATION SYNCHRONIZATION

Animasi tidak menjadi sumber kebenaran.

Contoh:

Server:

```text
card_played
```

Client:

```text
play card animation
```

Jika animasi gagal, game state server tetap benar.

---

# 93. LOADING STATE

Buat loading state:

```text
Connecting...
Creating room...
Joining room...
Loading game...
Reconnecting...
Synchronizing...
```

Jangan menampilkan layar kosong.

---

# 94. MAIN MENU

Main Menu:

```text
UNO MERCY

[ PLAY SOLO ]

[ MULTIPLAYER ]

[ HOW TO PLAY ]

[ SETTINGS ]
```

Multiplayer:

```text
[ CREATE ROOM ]

[ JOIN ROOM ]
```

---

# 95. CREATE ROOM UI

Form:

```text
Nickname
[____________]

Max Players
[ 4 ▼ ]

Mercy Limit
[ 25 ▼ ]

Turn Timer
[ 30 ▼ ]

Bot Takeover
[ OFF ]

[ CREATE ROOM ]
```

Validasi input sebelum request dikirim.

---

# 96. JOIN ROOM UI

Form:

```text
Nickname
[____________]

Room Code
[______]

[ JOIN ROOM ]
```

Room code otomatis diubah menjadi uppercase.

---

# 97. LOBBY UI

Lobby harus menampilkan:

```text
UNO MERCY

ROOM CODE
A7K92P

4 / 8 PLAYERS
```

Player list:

```text
👑 Lutfan       HOST     READY
   Budi                  READY
   Andi                  READY
   Sinta                 NOT READY
```

Settings:

```text
Max Players: 8
Mercy Limit: 25
Turn Timer: 30s
```

---

# 98. HOST CONTROLS

Host:

```text
[ START GAME ]
[ KICK ]
[ CLOSE ROOM ]
```

Player biasa:

```text
[ READY ]
[ LEAVE ROOM ]
```

Host tidak boleh melihat kartu lawan atau mengubah game state ketika permainan sudah dimulai.

---

# 99. GAME HUD

Game HUD menampilkan:

```text
Room Code
Current Color
Current Turn
Turn Timer
Player Count
Game Status
```

Jangan memenuhi layar dengan informasi yang tidak diperlukan.

---

# 100. PLAYER SEAT SYSTEM

Gunakan sistem seat berdasarkan jumlah player.

Contoh:

```text
2 player
3 player
4 player
5 player
6 player
7 player
8 player
```

Seat harus dihitung secara dinamis.

Jangan membuat 8 layout terpisah yang seluruhnya hardcoded.

Gunakan algoritma positioning.

---

# 101. EIGHT PLAYER LAYOUT

Untuk 8 pemain:

```text
              P3   P4   P5

          P2               P6


          P1               P7

                 P8
```

Player lokal harus mendapatkan posisi utama.

Pemain lain disusun mengelilingi meja.

UI harus tetap nyaman dimainkan pada desktop.

---

# 102. CARD HAND LAYOUT

Kartu player lokal:

* dapat dipilih
* dapat di-hover
* dapat di-tap
* dapat di-scroll jika terlalu banyak
* kartu aktif terlihat jelas

Jika memiliki banyak kartu karena Mercy hampir tercapai, gunakan:

```text
horizontal scroll
```

atau:

```text
dynamic card scaling
```

agar tidak keluar layar.

---

# 103. PLAYER CARD COUNT

Pemain lain hanya menampilkan:

```text
Budi
🃏 12
```

Bukan isi kartu.

Ketika player memiliki:

```text
1 card
```

tampilkan:

```text
🔥 UNO
```

---

# 104. MERCY WARNING

Sebelum Mercy:

```text
20 / 25 cards
```

tampilkan warning.

Contoh:

```text
⚠ MERCY WARNING

20 / 25
```

Ketika mencapai limit:

```text
💀 MERCY
```

---

# 105. GAME NOTIFICATION

Gunakan notification system:

```text
Lutfan played Red 7
Budi drew 2 cards
Andi called UNO
Sinta reached Mercy Limit
Budi is now Host
```

Notification tidak boleh menghalangi kartu.

---

# 106. GAME OVER UI

Game Over harus menampilkan:

```text
GAME OVER

🏆 WINNER

LUTFAN

RESULT

1. Lutfan
2. Budi
3. Andi
4. Sinta - MERCY

[ PLAY AGAIN ]

[ BACK TO LOBBY ]

[ MAIN MENU ]
```

---

# 107. PLAY AGAIN SYNCHRONIZATION

Implementasikan fitur **Play Again** secara realtime dan server-authoritative.

## 107.1 Setelah Game Selesai

Ketika game masuk status `finished`:

* Semua client menampilkan Game Over Screen.
* Server menyimpan hasil akhir game.
* Semua pemain dapat melihat:

  * pemenang
  * ranking pemain
  * jumlah kartu terakhir
  * jumlah Mercy elimination
  * statistik game
* Tombol `PLAY AGAIN` hanya dapat digunakan sesuai aturan room.
* Tombol `BACK TO MENU` tersedia untuk keluar dari room.

## 107.2 Play Again oleh Host

Default behavior:

* Hanya host yang dapat menekan `PLAY AGAIN`.
* Ketika host menekan tombol:

  * client mengirim `play_again`.
  * server memvalidasi bahwa requester adalah host.
  * server memastikan game memang berstatus `finished`.
  * server melakukan reset game.
  * room kembali ke status `waiting`.
  * seluruh player dikembalikan ke lobby.

Broadcast:

```text
game_reset
lobby_updated
```

## 107.3 Reset Data Game

Saat Play Again:

Reset:

```text
drawPile
discardPile
currentPlayerId
currentColor
direction
turnNumber
winnerId
game status
UNO states
Mercy states
turn timer
temporary penalties
```

Tetap dipertahankan:

```text
roomId
roomCode
players
player IDs
nicknames
avatars
host
maxPlayers
room settings
```

## 107.4 Ready State Setelah Play Again

Setelah kembali ke lobby:

```text
ready = false
```

Semua pemain wajib Ready kembali sebelum game dimulai.

Host juga harus Ready.

Flow:

```text
Game Over
    ↓
Host PLAY AGAIN
    ↓
Server Reset Game
    ↓
Lobby
    ↓
All Players Not Ready
    ↓
Players Ready
    ↓
Host Ready
    ↓
Host START GAME
```

## 107.5 Perubahan Room Settings

Setelah kembali ke lobby, host dapat mengubah:

```text
Max Players
Mercy Limit
Turn Timer
Bot Takeover
```

Validasi:

```text
2 <= maxPlayers <= 8
```

`maxPlayers` tidak boleh lebih kecil dari jumlah pemain yang sedang berada di room.

Contoh:

```text
Players: 6

Max Players:
5 ❌
6 ✅
7 ✅
8 ✅
```

---

# 108. LOCAL STATISTICS

Implementasikan statistik lokal menggunakan `localStorage`.

Statistik minimal:

```ts
interface LocalStats {
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  unoCalls: number;
  unoPenalties: number;
  mercyEliminations: number;
  cardsPlayed: number;
}
```

## 108.1 Statistik Game

Setelah game selesai:

```text
gamesPlayed += 1
```

Jika player menang:

```text
gamesWon += 1
```

Jika player kalah:

```text
gamesLost += 1
```

Setiap kartu yang berhasil dimainkan:

```text
cardsPlayed += 1
```

Setiap UNO berhasil dipanggil:

```text
unoCalls += 1
```

Setiap mendapatkan penalty UNO:

```text
unoPenalties += 1
```

Setiap terkena Mercy:

```text
mercyEliminations += 1
```

## 108.2 Statistik Tidak Boleh Menentukan Game

Statistik lokal hanya untuk tampilan.

Server tidak boleh mempercayai statistik dari client untuk:

* menentukan winner
* menentukan score
* menentukan ranking
* menentukan Mercy
* menentukan validitas game

---

# 109. AUDIO MANAGER

Buat sistem audio terpusat:

```text
AudioManager
```

Fitur:

* background music
* sound effects
* volume master
* volume music
* volume SFX
* mute
* enable/disable audio

## 109.1 Sound Events

Minimal:

```text
button_click
card_draw
card_play
skip
reverse
draw_two
wild
wild_draw_four
uno
uno_penalty
mercy_warning
mercy_trigger
player_join
player_leave
turn_start
victory
defeat
countdown
```

## 109.2 Audio Settings

Contoh:

```ts
interface AudioSettings {
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  musicEnabled: boolean;
  sfxEnabled: boolean;
}
```

Simpan setting:

```text
localStorage
```

Jangan membuat audio object baru setiap event jika tidak diperlukan.

Gunakan audio pooling/cache untuk menghindari memory leak.

---

# 110. ACCESSIBILITY

Game harus tetap dapat digunakan oleh sebanyak mungkin pemain.

Implementasikan:

* readable font
* sufficient contrast
* visible focus state
* keyboard navigation
* touch-friendly controls
* descriptive button labels
* status text
* jangan mengandalkan warna saja

Contoh:

Jangan hanya:

```text
RED
```

Gunakan:

```text
RED • Current Color
```

Card juga harus memiliki informasi:

```text
Red 7
Blue Skip
Wild Draw Four
```

Target touch minimum:

```text
44px x 44px
```

---

# 111. RESPONSIVE DESIGN

Target device:

```text
Desktop
Laptop
Tablet
Mobile Landscape
```

Prioritas:

```text
Mobile Landscape
```

## 111.1 Breakpoint

Gunakan responsive layout berdasarkan viewport.

Jangan mengandalkan fixed pixel layout untuk seluruh game.

## 111.2 2 Player

Layout dapat menggunakan:

```text
Opponent
   ↑

Table

Player Hand
   ↓
```

## 111.3 4 Player

Gunakan:

```text
       Player 2

Player 3   TABLE   Player 1

       Player 4
```

## 111.4 8 Player

Gunakan seat system dinamis:

```text
        P2   P3

    P1         P4

       TABLE

    P8         P5

        P7   P6
```

Posisi harus dihitung berdasarkan jumlah player.

Jangan membuat 8 layout terpisah secara manual jika dapat menggunakan algoritma seat positioning.

---

# 112. PERFORMANCE TARGET

Target:

```text
60 FPS
```

pada device yang mampu menjalankan aplikasi secara normal.

Hindari:

* unnecessary rendering
* infinite loops
* duplicate event listeners
* duplicate socket listeners
* excessive particle effects
* memory leaks
* creating unnecessary objects setiap frame

Gunakan:

```text
object pooling
texture caching
audio caching
event cleanup
```

Jika terdapat 8 pemain:

* game tetap playable
* UI tidak overlap
* animation tidak menyebabkan freeze
* socket event tidak diduplikasi

---

# 113. SOCKET CLEANUP

Setiap scene/component yang memasang listener wajib membersihkan listener ketika tidak digunakan.

Contoh lifecycle:

```text
scene created
    ↓
register listeners
    ↓
scene active
    ↓
scene destroyed
    ↓
remove listeners
```

Jangan melakukan:

```ts
socket.on("game_state", handler);
```

berulang kali tanpa:

```ts
socket.off("game_state", handler);
```

Pastikan perpindahan:

```text
Main Menu
→ Lobby
→ Game
→ Game Over
→ Lobby
```

tidak membuat duplicate event.

---

# 114. ROOM TESTING

Test room lifecycle:

### Test 1

Host membuat room.

Expected:

```text
room created
room code generated
host masuk lobby
```

### Test 2

Player join menggunakan code valid.

Expected:

```text
player_joined
lobby_updated
```

### Test 3

Player join room penuh.

Expected:

```text
ROOM_FULL
```

### Test 4

Player menggunakan room code invalid.

Expected:

```text
ROOM_NOT_FOUND
```

### Test 5

Nickname duplicate.

Expected:

```text
NICKNAME_ALREADY_USED
```

### Test 6

Player keluar sebelum game.

Expected:

```text
player_left
lobby_updated
```

---

# 115. 2–8 PLAYER TESTING

Game harus diuji pada:

```text
2 players
3 players
4 players
5 players
6 players
7 players
8 players
```

Setiap jumlah pemain harus memastikan:

* seat position benar
* turn order benar
* card distribution benar
* UI tidak overlap
* player count benar
* opponent card count benar
* ready state benar
* game start benar
* elimination benar
* winner detection benar

---

# 116. NETWORK TESTING

Simulasikan kondisi:

```text
normal connection
slow connection
high latency
temporary disconnect
reconnect
duplicate packet/action
late packet
server restart
```

Pastikan client tidak membuat keputusan game berdasarkan data lokal yang sudah obsolete.

Jika terjadi konflik:

```text
SERVER STATE > CLIENT STATE
```

Server menjadi sumber kebenaran utama.

---

# 117. SECURITY TESTING

Test client mencoba melakukan:

### Illegal Card

```text
play_card(card_not_owned)
```

Expected:

```text
INVALID_CARD
```

### Wrong Turn

```text
play_card(other_player_card)
```

Expected:

```text
NOT_YOUR_TURN
```

### Double Draw

```text
draw_card
draw_card
```

Expected:

```text
second request rejected
```

### Fake UNO

Player dengan 4 kartu mencoba:

```text
call_uno
```

Server harus menolak.

### Fake Winner

Client mencoba mengirim:

```text
winnerId = attacker
```

Server mengabaikan.

### Fake Score

Client mengirim:

```text
score = 999999
```

Server tidak menggunakan nilai tersebut.

### Fake Player ID

Client mengirim:

```text
playerId = anotherPlayer
```

Server menggunakan session/socket authentication yang valid, bukan percaya `playerId` dari payload.

---

# 118. MERCY TESTING

Mercy Limit default:

```text
25
```

Test kondisi:

```text
24 cards → active
25 cards → eliminated
26 cards → eliminated
```

Test sumber penambahan kartu:

```text
draw
draw2
wildDraw4
UNO penalty
other penalty
```

Setelah hand berubah:

```text
update hand
↓
checkMercy()
↓
if hand.length >= mercyLimit
↓
eliminate player
```

Pastikan Mercy tidak terlambat dieksekusi.

---

# 119. TURN TESTING

Test:

### Normal

```text
P1 → P2 → P3 → P4
```

### Reverse

```text
P1 → P4 → P3 → P2
```

### Skip

```text
P1 → P3
```

### Draw Two

Pastikan aturan Draw Two diterapkan konsisten sesuai RuleEngine.

### Wild

Current color berubah sesuai pilihan pemain.

### Wild Draw Four

Validasi legality di server.

### Eliminated Player

Player eliminated tidak boleh mendapatkan turn.

### Disconnected Player

Ikuti aturan reconnect/timeout.

### Reconnected Player

Player kembali ke state game yang benar.

---

# 120. WIN TESTING

Test:

```text
Player plays final card
```

Expected:

```text
hand.length === 0
↓
server determines winner
↓
game_over
```

Test:

```text
Only one active player remains
```

Expected:

```text
remaining active player = winner
```

Jangan menentukan winner berdasarkan client UI.

---

# 121. ERROR RECOVERY

Semua error network dan gameplay harus memiliki recovery mechanism.

Contoh:

```text
Socket disconnected
↓
RECONNECTING
↓
Reconnect success
↓
request_game_snapshot
↓
restore state
```

Jika reconnect gagal:

```text
DISCONNECTED
↓
show message
↓
Leave / Retry
```

Server error tidak boleh menyebabkan seluruh client crash.

---

# 122. SERVER LOGGING

Implementasikan structured logging.

Contoh:

```text
[ROOM_CREATED]
[PLAYER_JOINED]
[GAME_STARTED]
[CARD_PLAYED]
[UNO_CALLED]
[MERCY_TRIGGERED]
[PLAYER_ELIMINATED]
[GAME_OVER]
```

Jangan log informasi rahasia seperti:

```text
full opponent hand
draw pile contents
private card information
session secrets
```

Production logs harus aman.

---

# 123. ENVIRONMENT VARIABLES

Server:

```env
PORT=3000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Production:

```env
PORT=3000
CLIENT_URL=https://your-client-domain.com
NODE_ENV=production
```

Jangan hardcode:

* secret
* database credential
* private key
* API key
* production origin

---

# 124. DEPLOYMENT ARCHITECTURE

Architecture:

```text
                    INTERNET
                       │
                       ▼
              ┌─────────────────┐
              │   Web Browser   │
              │ Phaser Client   │
              └────────┬────────┘
                       │
                 WebSocket
                       │
                       ▼
              ┌─────────────────┐
              │ Node.js Server  │
              │ Socket.IO       │
              │ Game Engine     │
              └─────────────────┘
```

Client:

```text
Vite + TypeScript + Phaser
```

Server:

```text
Node.js + TypeScript + Socket.IO
```

Shared:

```text
TypeScript
```

---

# 125. CORS CONFIGURATION

Development:

```text
http://localhost:5173
```

Production harus menggunakan domain client yang sebenarnya.

Gunakan:

```ts
origin: process.env.CLIENT_URL
```

Jangan menggunakan:

```ts
origin: "*"
```

untuk production multiplayer server.

Pastikan WebSocket dan HTTP handshake memiliki konfigurasi CORS yang konsisten.

---

# 126. PRODUCTION SOCKET.IO

Pastikan production environment mendukung:

```text
WebSocket
HTTP polling fallback
long-lived connections
sticky sessions jika diperlukan
```

Untuk MVP satu server:

```text
Single Node.js instance
```

sudah cukup.

Jika nantinya menggunakan beberapa server instance:

```text
Load Balancer
        ↓
Multiple Socket.IO Servers
        ↓
Redis Adapter
```

Gunakan shared adapter agar room state/event dapat tersinkronisasi.

---

# 127. README

README harus menjelaskan:

```text
Project Overview
Features
Tech Stack
Architecture
Folder Structure
Installation
Environment Variables
Development
Testing
Production Build
Deployment
Game Rules
Multiplayer Flow
Socket Events
Security
Known Limitations
Future Development
```

Contoh installation:

```bash
git clone <repository>
cd uno-mercy
npm install
```

Client:

```bash
cd client
npm install
npm run dev
```

Server:

```bash
cd server
npm install
npm run dev
```

---

# 128. LOCAL DEVELOPMENT COMMANDS

Root:

```bash
npm install
npm run dev
npm run build
npm run test
npm run lint
npm run typecheck
```

Client:

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run typecheck
```

Server:

```bash
npm run dev
npm run build
npm run start
npm run test
npm run lint
npm run typecheck
```

Sesuaikan command dengan package manager dan konfigurasi project.

---

# 129. PRODUCTION BUILD

Sebelum deployment:

```text
npm install
↓
typecheck
↓
lint
↓
unit tests
↓
integration tests
↓
build
↓
production verification
```

Tidak boleh deployment jika terdapat:

```text
TypeScript error
build error
critical test failure
critical lint error
```

---

# 130. GAME ENGINE PRINCIPLE

Pisahkan:

```text
Game Logic
```

dari:

```text
Rendering
```

Contoh:

```text
GameEngine
    ↓
RuleEngine
    ↓
GameState
```

Client:

```text
GameState
    ↓
Phaser
    ↓
Visual Rendering
```

Jangan menaruh rule penting langsung di:

```text
Phaser Scene
```

Contoh buruk:

```ts
if (card.color === currentColor) {
   // langsung mengubah winner
}
```

Rule harus berada di server:

```text
RuleEngine
```

---

# 131. NO FAKE FEATURES

Semua fitur yang dinyatakan selesai harus benar-benar berfungsi.

Tidak boleh menggunakan:

```text
fake multiplayer
fake room code
fake opponent
fake card movement
fake winner
fake synchronization
```

Jika multiplayer diaktifkan:

```text
Player A Browser
        ↕
     Server
        ↕
Player B Browser
```

harus benar-benar berkomunikasi realtime.

---

# 132. NO PLACEHOLDER LOGIC

Jangan menyelesaikan fitur menggunakan:

```ts
// TODO
return true;
```

atau:

```ts
// temporary
setTimeout(...)
```

untuk menggantikan logic multiplayer yang seharusnya.

Placeholder hanya diperbolehkan untuk asset visual/audio yang memang belum tersedia, bukan untuk game logic inti.

---

# 133. STATE CONSISTENCY

Semua pemain harus memiliki pemahaman state game yang sama.

Contoh:

```text
P1 melihat:
Current Turn = P2

P2 melihat:
Current Turn = P2

P3 melihat:
Current Turn = P2
```

Jika P2 memainkan kartu:

```text
Server
  ↓
validate
  ↓
update GameState
  ↓
broadcast
  ↓
all clients update
```

Client tidak boleh mengubah state final secara independen.

---

# 134. ACTION IDs

Setiap action penting memiliki unique action ID.

Contoh:

```ts
interface GameAction {
  actionId: string;
  playerId: string;
  type: string;
  timestamp: number;
}
```

Server menyimpan action yang sudah diproses dalam window tertentu.

Jika:

```text
actionId = ABC123
```

dikirim dua kali:

```text
first  → process
second → ignore/reject
```

Tujuannya mencegah duplicate action.

---

# 135. SERVER TIMESTAMPS

Server menjadi sumber waktu untuk turn timer.

Game state dapat mengandung:

```ts
turnStartedAt: number;
turnEndsAt: number;
```

Client menghitung display countdown berdasarkan:

```text
server timestamp
```

bukan berdasarkan timer lokal yang dimulai sendiri.

Contoh:

```text
turnEndsAt = 1750000000000
```

Client:

```text
remaining = turnEndsAt - Date.now()
```

Untuk production, pertimbangkan sinkronisasi clock jika diperlukan.

---

# 136. RECONNECT SNAPSHOT

Saat player reconnect, server mengirim snapshot khusus player tersebut.

Contoh:

```ts
interface ReconnectSnapshot {
  roomId: string;
  roomCode: string;
  player: Player;
  opponents: PublicPlayer[];
  topDiscard: Card;
  currentColor: CardColor;
  currentPlayerId: string;
  direction: Direction;
  turnEndsAt?: number;
  mercyLimit: number;
  gameStatus: GameStatus;
}
```

Snapshot harus:

* berisi hand milik player
* tidak berisi hand lawan
* tidak berisi draw pile
* tidak membocorkan private state

---

# 137. OBSERVABILITY

Implementasikan observability dasar.

Minimal monitor:

```text
active rooms
active players
connected sockets
game count
errors
disconnects
reconnects
game duration
```

Server juga harus mencatat event penting:

```text
room created
room closed
game started
game finished
player disconnected
player reconnected
Mercy triggered
server errors
```

---

# 138. ANTI-CHEAT FLOW

Semua action mengikuti:

```text
CLIENT INPUT
     ↓
CLIENT PRE-VALIDATION
     ↓
SEND SOCKET EVENT
     ↓
SERVER AUTHENTICATION
     ↓
SERVER VALIDATION
     ↓
RULE ENGINE
     ↓
GAME STATE UPDATE
     ↓
SERVER BROADCAST
     ↓
CLIENT RENDER
```

Contoh:

```text
Player click card
        ↓
Client checks whether card looks playable
        ↓
play_card
        ↓
Server checks player
        ↓
Server checks turn
        ↓
Server checks ownership
        ↓
Server checks card rule
        ↓
Card played
        ↓
Broadcast card_played
        ↓
All clients render
```

---

# 139. FINAL ACCEPTANCE TEST

Project dianggap memenuhi MVP jika skenario berikut berhasil.

## Scenario

### Step 1

Host membuat room.

```text
Max Players = 8
Mercy Limit = 25
Turn Timer = 30
```

### Step 2

Host mendapatkan:

```text
6-character Room Code
```

### Step 3

Player B sampai H join.

Total:

```text
8 / 8
```

### Step 4

Semua player Ready.

Expected:

```text
8 / 8 READY
```

### Step 5

Host Start Game.

Expected:

```text
3
2
1
GO
```

### Step 6

Server membuat:

```text
deck
discard pile
hands
turn
direction
current color
```

### Step 7

Semua client menerima state yang sesuai.

### Step 8

Setiap player hanya melihat hand sendiri.

### Step 9

Player mencoba memainkan kartu.

Server melakukan validation.

### Step 10

Player Draw.

Server memproses Draw.

### Step 11

Action cards diuji:

```text
Skip
Reverse
Draw Two
Wild
Wild Draw Four
```

### Step 12

Player memiliki satu kartu.

Player menekan:

```text
UNO
```

### Step 13

Player lupa UNO.

Opponent melakukan:

```text
Call UNO / Challenge
```

Server menentukan apakah penalty valid.

### Step 14

Player mencapai:

```text
25 cards
```

Server menjalankan:

```text
MERCY
```

Player:

```text
eliminated
```

### Step 15

Turn order melewati player eliminated.

### Step 16

Game mencapai win condition.

Server menentukan winner.

### Step 17

Semua client menerima:

```text
game_over
```

### Step 18

Host menekan:

```text
PLAY AGAIN
```

### Step 19

Semua player kembali ke lobby.

Expected:

```text
0 / 8 READY
```

### Step 20

Semua Ready kembali.

Host Start.

Game kedua berjalan tanpa membuat room baru.

---

# 140. FINAL DEVELOPMENT PRIORITY

Implementasikan fitur dalam urutan berikut:

```text
1. Core Game Engine
2. Card System
3. Turn System
4. UNO
5. Mercy Rule
6. Win Condition
7. Single Player
8. Room System
9. Room Code
10. Lobby
11. Ready System
12. Multiplayer Synchronization
13. Server Authority
14. Reconnect
15. Host Migration
16. 8 Player Support
17. Chat
18. Emote
19. Animation
20. Audio
21. Responsive UI
22. Accessibility
23. Security
24. Testing
25. Deployment
```

Jangan mengerjakan fitur tingkat lanjut sebelum core gameplay stabil.

---

# 141. FINAL INSTRUCTION TO AI DEVELOPER

Anda harus membaca dan memahami seluruh PRD **UNO MERCY dari section 1 sampai section 140** sebelum melakukan implementasi.

Sebelum coding, hasilkan:

```text
1. Technical Architecture
2. Multiplayer Flow Diagram
3. Game State Machine
4. Socket Event Contract
5. Data Model
6. Folder Structure
7. Development Roadmap
8. Risk Analysis
```

Setelah itu mulai implementasi berdasarkan priority.

Setiap phase harus mengikuti workflow:

```text
IMPLEMENT
    ↓
TYPECHECK
    ↓
LINT
    ↓
UNIT TEST
    ↓
INTEGRATION TEST
    ↓
FIX ERROR
    ↓
VERIFY
    ↓
NEXT PHASE
```

Jangan melompati testing.

## FINAL PRODUCT GOAL

Hasil akhir harus berupa **UNO MERCY yang benar-benar playable**, bukan sekadar UI prototype.

Minimum multiplayer requirement:

```text
2–8 Real Players
Room Code
Realtime WebSocket
Lobby
Ready System
Server Authoritative Game
Private Hands
Turn Synchronization
Card Validation
Draw
Action Cards
Wild Cards
UNO
UNO Penalty
Mercy Limit
Player Elimination
Win Condition
Game Over
Play Again
Reconnect
Host Migration
Responsive UI
Audio
Animation
Security
Testing
Deployment
```

Target pengalaman:

```text
Create Room
     ↓
Share Room Code
     ↓
Friends Join
     ↓
Ready
     ↓
Start Game
     ↓
Play Realtime
     ↓
UNO
     ↓
Mercy
     ↓
Elimination
     ↓
Winner
     ↓
Play Again
     ↓
Back to Lobby
```

Semua fitur multiplayer harus benar-benar berkomunikasi melalui server.

**Server adalah sumber kebenaran utama untuk seluruh game state dan hasil permainan.**



