const STORAGE_KEYS = {
    game: "chess_game",
    settings: "chess_settings",
    stats: "chess_stats",
    achievements: "chess_achievements"
};

function saveJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function loadJSON(key, fallback = null) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : fallback;
    } catch {
        return fallback;
    }
}

function saveGame() {
    if (!GameState.settings.autoSave) return;

    saveJSON(STORAGE_KEYS.game, {
        board: GameState.board,
        turn: GameState.turn,
        history: GameState.history,
        captured: GameState.captured,
        gameMode: GameState.gameMode,
        aiDifficulty: GameState.aiDifficulty,
        gameStartedAt: GameState.gameStartedAt,
        players: GameState.players
    });
}

function loadGame() {
    const data = loadJSON(STORAGE_KEYS.game);

    if (!validateGameData(data)) {
        localStorage.removeItem(STORAGE_KEYS.game);
        return false;
    }

    Object.assign(GameState, data);
    return true;
}

function deleteSavedGame() {
    localStorage.removeItem(STORAGE_KEYS.game);
}

function saveSettings() {
    saveJSON(STORAGE_KEYS.settings, GameState.settings);
}

function loadSettings() {
    const settings = loadJSON(STORAGE_KEYS.settings);

    if (!settings || typeof settings !== "object") return;

    GameState.settings = {
        ...GameState.settings,
        ...settings
    };
}

function validateGameData(data) {
    if (!data || typeof data !== "object") return false;

    if (!Array.isArray(data.board)) return false;
    if (data.board.length !== 8) return false;

    if (!data.board.every(row =>
        Array.isArray(row) &&
        row.length === 8 &&
        row.every(piece =>
            piece === null ||
            /^[wb][prnbqk]$/.test(piece)
        )
    )) return false;

    if (!["white", "black"].includes(data.turn)) return false;
    if (!Array.isArray(data.history)) return false;

    return true;
}
