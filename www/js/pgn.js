function exportPGN() {
    const headers = [
        `[Event "CHESS-GAME"]`,
        `[White "${GameState.players.white}"]`,
        `[Black "${GameState.players.black}"]`,
        `[Result "${getPGNResult()}"]`,
        `[Opening "${detectOpening()}"]`
    ];

    const moves = [];

    for (let i = 0; i < GameState.history.length; i += 2) {
        const white = GameState.history[i];
        const black = GameState.history[i + 1];

        let line = `${Math.floor(i / 2) + 1}. ${white?.notation || ""}`;

        if (black) {
            line += ` ${black.notation}`;
        }

        moves.push(line);
    }

    return `${headers.join("\n")}\n\n${moves.join(" ")} ${getPGNResult()}`;
}

function getPGNResult() {
    if (GameState.result === "win") return "1-0";
    if (GameState.result === "loss") return "0-1";
    return "1/2-1/2";
}

function downloadPGN() {
    const blob = new Blob(
        [exportPGN()],
        {
            type: "application/x-chess-pgn"
        }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "chess-game.pgn";

    link.click();

    URL.revokeObjectURL(url);
}

function importPGN(text) {
    if (typeof text !== "string") {
        throw new Error("Invalid PGN");
    }

    const moves = text
        .split(/\s+/)
        .filter(token =>
            !token.startsWith("[") &&
            !/^\d+\.$/.test(token) &&
            !["1-0", "0-1", "1/2-1/2", "*"].includes(token)
        );

    return moves;
}
