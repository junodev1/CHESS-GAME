function initializeApp() {
    initializeSettings();

    loadStatistics();
    loadAchievements();

    if (!loadGame()) {
        resetGameState();
    }

    createBoard();
    renderHistory();
    renderStatistics();
    applySettings();
    setupSettings();

    setupControls();
}

function setupControls() {
    document
        .querySelector("#settingsButton")
        ?.addEventListener("click", toggleSettings);

    document
        .querySelector("#newGameButton")
        ?.addEventListener("click", () => {
            deleteSavedGame();
            resetGameState();
            renderBoard();
            renderHistory();
        });

    document
        .querySelector("#hintButton")
        ?.addEventListener("click", showHint);

    document
        .querySelector("#exportPGNButton")
        ?.addEventListener("click", downloadPGN);

    document
        .querySelector("#closeAnalysisButton")
        ?.addEventListener("click", () => {
            document
                .querySelector("#analysisModal")
                ?.classList.remove("open");
        });
}

document.addEventListener(
    "DOMContentLoaded",
    initializeApp
);
