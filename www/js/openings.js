const OPENINGS = {
    "e4 c5": "Sicilian Defense",
    "e4 e5 Nf3 Nc6 Bc4": "Italian Game",
    "e4 e5 Nf3 Nc6 Bb5": "Ruy Lopez",
    "d4 d5 c4": "Queen's Gambit",
    "e4 e5 Nf3": "King's Knight Opening",
    "d4 Nf6 c4": "Indian Game",
    "e4 c6": "Caro-Kann Defense",
    "e4 e6": "French Defense",
    "d4 Nf6 c4 g6": "King's Indian Defense"
};

function detectOpening() {
    const moves = GameState.history.map(move => move.notation).slice(0, 8);
    let bestName = "Unknown Opening";
    let bestLength = 0;

    for (const [sequence, name] of Object.entries(OPENINGS)) {
        const openingMoves = sequence.split(" ");
        if (openingMoves.length <= bestLength || openingMoves.length > moves.length) continue;

        const matches = openingMoves.every((move, index) => moves[index] === move);
        if (matches) {
            bestName = name;
            bestLength = openingMoves.length;
        }
    }

    return bestName;
}
