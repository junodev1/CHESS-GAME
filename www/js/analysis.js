function analyzeGame() {
    const opening = detectOpening();

    const captures = GameState.history.filter(
        move => move.captured
    ).length;

    const duration = GameState.gameEndedAt
        ? GameState.gameEndedAt - GameState.gameStartedAt
        : 0;

    return {
        opening,
        moves: GameState.history.length,
        captures,
        duration,
        result: GameState.result
    };
}

function showGameAnalysis() {
    const analysis = analyzeGame();

    const modal = document.querySelector("#analysisModal");

    if (!modal) return;

    modal.querySelector("[data-analysis-opening]").textContent =
        analysis.opening;

    modal.querySelector("[data-analysis-moves]").textContent =
        analysis.moves;

    modal.querySelector("[data-analysis-captures]").textContent =
        analysis.captures;

    modal.querySelector("[data-analysis-result]").textContent =
        analysis.result || "Draw";

    modal.classList.add("open");
}
