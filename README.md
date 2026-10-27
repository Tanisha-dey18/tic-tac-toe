# ❌⭕ Tic-Tac-Toe vs AI

A browser tic-tac-toe game against an AI that uses the **minimax** algorithm. On "Unbeatable" it plays perfectly: the best you can do is draw.

## Features

- Three difficulties: **Easy**, **Medium**, **Unbeatable**
- Option to let the AI go first
- Winning line highlighted
- Score (wins / draws / losses) saved in your browser
- No dependencies, no build step

## How the AI works

Minimax tries every possible sequence of moves to the end of the game and scores each final position from the AI's point of view:

| Outcome  | Score        |
|----------|--------------|
| AI wins  | `10 - depth` |
| Draw     | `0`          |
| AI loses | `depth - 10` |

On its own turns the AI picks the move with the **highest** score. On the human's turns it assumes the human picks the **lowest**, i.e. plays perfectly too. Subtracting `depth` makes the AI prefer faster wins and slower losses.

Tic-tac-toe is small (fewer than 9! = 362,880 move sequences), so a full search is instant without pruning.

Easier levels play a random move some of the time (`MISTAKE_RATE` in `ai.js`): 75% on Easy, 35% on Medium.

## Project structure

| File         | Purpose                                         |
|--------------|-------------------------------------------------|
| `index.html` | Page layout                                     |
| `style.css`  | Styling                                         |
| `ai.js`      | Game rules + minimax (no DOM, testable in Node) |
| `script.js`  | UI: board, turns, score                         |
| `ai.test.js` | Tests, including a proof that the AI never loses |

## Run it

Open `index.html` in a browser, or serve it locally:

```bash
python -m http.server 8000
```

## Run the tests

Requires Node.js 18+:

```bash
node --test
```

The last test plays the unbeatable AI against **every possible** human strategy (going first and second) and checks it never loses.

## License

[MIT](LICENSE)
