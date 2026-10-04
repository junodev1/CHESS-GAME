const AI_VALUES = {
    p: 100,
    n: 320,
    b: 330,
    r: 500,
    q: 900,
    k: 20000
};

function makeAIMove() {
    if (GameState.turn !== "black") return;

    inputLocked = true;

    const moves = generateAllMoves("black");

    if (!moves.length) {
        inputLocked = false;
        finishGame();
        return;
    }

    let selected;

    if (GameState.aiDifficulty === "easy") {
        selected = randomMove(moves);
    } else if (GameState.aiDifficulty === "medium") {
        selected = mediumMove(moves);
    } else {
        selected = hardMove(moves);
    }

    makeMove(
        selected.from.row,
        selected.from.col,
        selected.to.row,
        selected.to.col
    );

    inputLocked = false;
}

function generateAllMoves(color) {
    const moves = [];

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = GameState.board[row][col];

            if (!piece || getPieceColor(piece) !== color) {
                continue;
            }

            const legalMoves = getLegalMovesForColor(row, col, color);

            for (const target of legalMoves) {
                moves.push({
                    from: {
                        row,
                        col
                    },
                    to: target
                });
            }
        }
    }

    return moves;
}

function getLegalMovesForColor(row, col, color) {
    const oldTurn = GameState.turn;

    GameState.turn = color;

    const moves = getLegalMoves(row, col);

    GameState.turn = oldTurn;

    return moves;
}

function randomMove(moves) {
    return moves[Math.floor(Math.random() * moves.length)];
}

function mediumMove(moves) {
    const scored = moves.map(move => ({
        move,
        score: evaluateMove(move)
    }));

    scored.sort((a, b) => b.score - a.score);

    const top = scored.slice(
        0,
        Math.max(1, Math.ceil(scored.length * 0.25))
    );

    return randomMove(top).move;
}

function hardMove(moves) {
    let best = null;
    let bestScore = -Infinity;

    for (const move of moves) {
        const score = evaluateMove(move);

        if (score > bestScore) {
            bestScore = score;
            best = move;
        }
    }

    return best || randomMove(moves);
}

function evaluateMove(move) {
    const target = GameState.board[
        move.to.row
    ][
        move.to.col
    ];

    let score = 0;

    if (target) {
        score += AI_VALUES[target[1]];
    }

    const centerDistance =
        Math.abs(3.5 - move.to.row) +
        Math.abs(3.5 - move.to.col);

    score += 10 - centerDistance;

    return score;
}
