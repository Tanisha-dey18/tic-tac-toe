// Run with: node --test
const test = require("node:test");
const assert = require("node:assert");
const { getResult, bestMove } = require("./ai.js");

const _ = null;

test("detects a row win", () => {
  assert.deepStrictEqual(getResult(["X", "X", "X", _, "O", "O", _, _, _]), { winner: "X", line: [0, 1, 2] });
});

test("detects a draw", () => {
  assert.deepStrictEqual(getResult(["X", "O", "X", "X", "O", "O", "O", "X", "X"]), { winner: "draw" });
});

test("game in progress returns null", () => {
  assert.strictEqual(getResult(Array(9).fill(null)), null);
});

test("AI takes a winning move", () => {
  assert.strictEqual(bestMove(["O", "O", _, "X", "X", _, _, _, _], "O", "X"), 2);
});

test("AI blocks the human's winning move", () => {
  assert.strictEqual(bestMove(["X", "X", _, _, "O", _, _, _, _], "O", "X"), 2);
});

test("unbeatable AI never loses, against every possible human strategy", () => {
  let losses = 0;
  function play(board, turn) {
    const result = getResult(board);
    if (result) {
      if (result.winner === "X") losses++;
      return;
    }
    if (turn === "O") {
      const move = bestMove(board, "O", "X");
      board[move] = "O";
      play(board, "X");
      board[move] = null;
    } else {
      for (let i = 0; i < 9; i++) {
        if (board[i]) continue;
        board[i] = "X";
        play(board, "O");
        board[i] = null;
      }
    }
  }
  play(Array(9).fill(null), "X"); // human first
  play(Array(9).fill(null), "O"); // AI first
  assert.strictEqual(losses, 0);
});
