const DRAW_CARD_VALUES = ['DRAW_TWO', 'WILD_DRAW_FOUR', 'WILD_DRAW_SIX', 'WILD_DRAW_TEN', 'WILD_REVERSE_DRAW_FOUR'];
const DRAW_AMOUNTS = {
  DRAW_TWO: 2, WILD_DRAW_FOUR: 4, WILD_DRAW_SIX: 6, WILD_DRAW_TEN: 10, WILD_REVERSE_DRAW_FOUR: 4
};

let room = {
  pendingDraw: 0,
  players: [
    { nickname: 'P1', hand: [{value: 'WILD_DRAW_SIX'}] },
    { nickname: 'P2', hand: [{value: 'WILD_DRAW_TEN'}] },
    { nickname: 'P3', hand: [] }, // no stack
  ],
  currentTurnIndex: 0
};

function applyCardEffect(playerIndex, card) {
  const drawAmt = DRAW_AMOUNTS[card.value];
  if (drawAmt) {
    room.currentTurnIndex = (room.currentTurnIndex + 1) % 3;
    const nextPlayer = room.players[room.currentTurnIndex];
    const canStack = nextPlayer.hand.some(c =>
      DRAW_CARD_VALUES.includes(c.value) && (DRAW_AMOUNTS[c.value] || 0) >= drawAmt
    );
    if (canStack) {
      room.pendingDraw = (room.pendingDraw || 0) + drawAmt;
      console.log(`[+] ${nextPlayer.nickname} can stack. pendingDraw becomes ${room.pendingDraw}`);
    } else {
      const total = (room.pendingDraw || 0) + drawAmt;
      room.pendingDraw = 0;
      console.log(`[-] ${nextPlayer.nickname} CANNOT stack. Draws ${total} cards! pendingDraw resets to 0.`);
      room.currentTurnIndex = (room.currentTurnIndex + 1) % 3; // advance turn
    }
  }
}

console.log("P1 plays +6");
applyCardEffect(0, room.players[0].hand[0]);
console.log("P2 plays +10");
applyCardEffect(1, room.players[1].hand[0]);
