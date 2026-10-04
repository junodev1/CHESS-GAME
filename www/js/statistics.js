const DEFAULT_STATS = {
    wins: 0,
    losses: 0,
    draws: 0,
    fastestWin: null,
    games: 0
};

let statistics = {
    ...DEFAULT_STATS
};

function loadStatistics() {
    statistics = {
        ...DEFAULT_STATS,
        ...loadJSON(STORAGE_KEYS.stats, {})
    };
}

function saveStatistics() {
    saveJSON(STORAGE_KEYS.stats, statistics);
}

function updateStatistics() {
    statistics.games++;

    if (GameState.result === "win") {
        statistics.wins++;

        const duration =
            GameState.gameEndedAt -
            GameState.gameStartedAt;

        if (
            statistics.fastestWin === null ||
            duration < statistics.fastestWin
        ) {
            statistics.fastestWin = duration;
        }
    }

    if (GameState.result === "loss") {
        statistics.losses++;
    }

    if (GameState.result === "draw") {
        statistics.draws++;
    }

    renderStatistics();
}

function renderStatistics() {
    document.querySelector("[data-wins]")?.replaceChildren(
        document.createTextNode(statistics.wins)
    );

    document.querySelector("[data-losses]")?.replaceChildren(
        document.createTextNode(statistics.losses)
    );

    document.querySelector("[data-draws]")?.replaceChildren(
        document.createTextNode(statistics.draws)
    );

    document.querySelector("[data-fastest-win]")?.replaceChildren(
        document.createTextNode(
            statistics.fastestWin
                ? formatDuration(statistics.fastestWin)
                : "—"
        )
    );
}

function formatDuration(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);

    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;

    return `${minutes}:${String(remaining).padStart(2, "0")}`;
}
