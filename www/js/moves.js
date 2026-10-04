function getPieceColor(piece) {
    if (!piece) return null;
    return piece[0] === "w" ? "white" : "black";
}

function getPieceType(piece) {
    return piece ? piece[1] : null;
}

function isInsideBoard(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
}

function getLegalMoves(row, col) {
    const piece = GameState.board[row][col];

    if (!piece) return [];

    const color = getPieceColor(piece);

    if (color !== GameState.turn) return [];

    const type = getPieceType(piece);

    switch (type) {
        case "p":
            return pawnMoves(row, col, color);
        case "r":
            return slidingMoves(row, col, color, [
                [1, 0],
                [-1, 0],
                [0, 1],
                [0, -1]
            ]);
        case "b":
            return slidingMoves(row, col, color, [
                [1, 1],
                [1, -1],
                [-1, 1],
                [-1, -1]
            ]);
        case "q":
            return slidingMoves(row, col, color, [
                [1, 0],
                [-1, 0],
                [0, 1],
                [0, -1],
                [1, 1],
                [1, -1],
                [-1, 1],
                [-1, -1]
            ]);
        case "k":
            return kingMoves(row, col, color);
        case "n":
            return knightMoves(row, col, color);
        default:
            return [];
    }
}

function pawnMoves(row, col, color) {
    const moves = [];
    const direction = color === "white" ? -1 : 1;
    const startRow = color === "white" ? 6 : 1;

    const nextRow = row + direction;

    if (
        isInsideBoard(nextRow, col) &&
        !GameState.board[nextRow][col]
    ) {
        moves.push({ row: nextRow, col });

        const doubleRow = row + direction * 2;

        if (
            row === startRow &&
            !GameState.board[doubleRow][col]
        ) {
            moves.push({ row: doubleRow, col });
        }
    }

    for (const offset of [-1, 1]) {
        const targetCol = col + offset;

        if (!isInsideBoard(nextRow, targetCol)) continue;

        const target = GameState.board[nextRow][targetCol];

        if (
            target &&
            getPieceColor(target) !== color
        ) {
            moves.push({
                row: nextRow,
                col: targetCol
            });
        }
    }

    return moves;
}

function knightMoves(row, col, color) {
    const moves = [];

    const offsets = [
        [-2, -1],
        [-2, 1],
        [-1, -2],
        [-1, 2],
        [1, -2],
        [1, 2],
        [2, -1],
        [2, 1]
    ];

    for (const [dr, dc] of offsets) {
        const targetRow = row + dr;
        const targetCol = col + dc;

        if (!isInsideBoard(targetRow, targetCol)) continue;

        const target = GameState.board[targetRow][targetCol];

        if (!target || getPieceColor(target) !== color) {
            moves.push({
                row: targetRow,
                col: targetCol
            });
        }
    }

    return moves;
}

function kingMoves(row, col, color) {
    const moves = [];

    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (!dr && !dc) continue;

            const targetRow = row + dr;
            const targetCol = col + dc;

            if (!isInsideBoard(targetRow, targetCol)) continue;

            const target = GameState.board[targetRow][targetCol];

            if (!target || getPieceColor(target) !== color) {
                moves.push({
                    row: targetRow,
                    col: targetCol
                });
            }
        }
    }

    return moves;
}

function slidingMoves(row, col, color, directions) {
    const moves = [];

    for (const [dr, dc] of directions) {
        let targetRow = row + dr;
        let targetCol = col + dc;

        while (isInsideBoard(targetRow, targetCol)) {
            const target = GameState.board[targetRow][targetCol];

            if (!target) {
                moves.push({
                    row: targetRow,
                    col: targetCol
                });
            } else {
                if (getPieceColor(target) !== color) {
                    moves.push({
                        row: targetRow,
                        col: targetCol
                    });
                }

                break;
            }

            targetRow += dr;
            targetCol += dc;
        }
    }

    return moves;
}
