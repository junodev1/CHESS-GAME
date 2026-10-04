let inputLocked = false;

function handleSquare(row, col) {
    if (inputLocked) return;

    const piece = GameState.board[row][col];

    if (!GameState.selected) {
        if (
            piece &&
            getPieceColor(piece) === GameState.turn
        ) {
            GameState.selected = { row, col };
            GameState.legalMoves = getLegalMoves(row, col);
            renderBoard();
        }

        return;
    }

    const legal = GameState.legalMoves.some(
        move => move.row === row && move.col === col
    );

    if (legal) {
        makeMove(
            GameState.selected.row,
            GameState.selected.col,
            row,
            col
        );

        return;
    }

    if (
        piece &&
        getPieceColor(piece) === GameState.turn
    ) {
        GameState.selected = { row, col };
        GameState.legalMoves = getLegalMoves(row, col);
        renderBoard();
        return;
    }

    GameState.selected = null;
    GameState.legalMoves = [];
    renderBoard();
}

function makeMove(fromRow, fromCol, toRow, toCol) {
    const piece = GameState.board[fromRow][fromCol];
    const captured = GameState.board[toRow][toCol];

    GameState.board[toRow][toCol] = piece;
    GameState.board[fromRow][fromCol] = null;

    if (captured) {
        GameState.captured[GameState.turn].push(captured);
    }

    const notation = createMoveNotation(
        piece,
        fromRow,
        fromCol,
        toRow,
        toCol,
        captured
    );

    GameState.history.push({
        move: GameState.history.length + 1,
        color: GameState.turn,
        piece,
        from: {
            row: fromRow,
            col: fromCol
        },
        to: {
            row: toRow,
            col: toCol
        },
        captured,
        notation,
        timestamp: Date.now()
    });

    GameState.selected = null;
    GameState.legalMoves = [];

    GameState.turn =
        GameState.turn === "white"
            ? "black"
            : "white";

    renderBoard();
    renderHistory();
    saveGame();

    if (checkGameEnd()) {
        finishGame();
        return;
    }

    if (
        GameState.gameMode === "ai" &&
        GameState.turn === "black"
    ) {
        setTimeout(makeAIMove, 250);
    }
}

function createMoveNotation(
    piece,
    fromRow,
    fromCol,
    toRow,
    toCol,
    captured
) {
    const files = "abcdefgh";
    const pieceNames = {
        p: "",
        r: "R",
        n: "N",
        b: "B",
        q: "Q",
        k: "K"
    };

    const destination =
        files[toCol] + (8 - toRow);

    return (
        pieceNames[piece[1]] +
        (captured ? "x" : "") +
        destination
    );
}

function finishGame() {
    GameState.gameEndedAt = Date.now();

    if (GameState.result === null) {
        GameState.result = "draw";
    }

    updateStatistics();
    checkAchievements();
    saveStatistics();
    saveAchievements();
    deleteSavedGame();

    showGameAnalysis();
}
