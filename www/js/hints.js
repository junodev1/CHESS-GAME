function showHint() {
    if (!GameState.settings.hints) return;

    const moves = generateAllMoves(GameState.turn);

    if (!moves.length) return;

    const best = moves
        .map(move => ({
            move,
            score: evaluateMove(move)
        }))
        .sort((a, b) => b.score - a.score)[0];

    if (!best) return;

    const board = document.querySelector("#chessBoard");

    board
        ?.querySelector(
            `[data-row="${best.move.from.row}"][data-col="${best.move.from.col}"]`
        )
        ?.classList.add("hint-from");

    board
        ?.querySelector(
            `[data-row="${best.move.to.row}"][data-col="${best.move.to.col}"]`
        )
        ?.classList.add("hint-to");
}
