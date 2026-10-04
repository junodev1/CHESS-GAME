const PIECES = {
    wp: "♙",
    wr: "♖",
    wn: "♘",
    wb: "♗",
    wq: "♕",
    wk: "♔",
    bp: "♟",
    br: "♜",
    bn: "♞",
    bb: "♝",
    bq: "♛",
    bk: "♚"
};

function createBoard() {
    const board = document.querySelector("#chessBoard");

    if (!board) return;

    board.innerHTML = "";

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement("button");

            square.className = "square";
            square.dataset.row = row;
            square.dataset.col = col;

            square.addEventListener("click", handleSquareClick);

            board.appendChild(square);
        }
    }

    renderBoard();
}

function renderBoard() {
    const board = document.querySelector("#chessBoard");

    if (!board) return;

    const squares = board.querySelectorAll(".square");

    squares.forEach(square => {
        const row = Number(square.dataset.row);
        const col = Number(square.dataset.col);
        const piece = GameState.board[row][col];

        square.classList.toggle("dark", (row + col) % 2 === 1);
        square.classList.toggle("light", (row + col) % 2 === 0);
        square.classList.toggle(
            "selected",
            GameState.selected?.row === row &&
            GameState.selected?.col === col
        );

        square.classList.toggle(
            "legal",
            GameState.legalMoves.some(
                move => move.row === row && move.col === col
            )
        );

        square.innerHTML = "";

        if (piece) {
            const pieceElement = document.createElement("span");

            pieceElement.className = `piece ${piece[0]}`;
            pieceElement.textContent = PIECES[piece];

            square.appendChild(pieceElement);
        }
    });
}

function handleSquareClick(event) {
    const square = event.currentTarget;

    const row = Number(square.dataset.row);
    const col = Number(square.dataset.col);

    handleSquare(row, col);
}
