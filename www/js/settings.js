function initializeSettings() {
    loadSettings();
    applySettings();
}

function applySettings() {
    document.documentElement.dataset.theme = GameState.settings.theme;
    document.documentElement.dataset.boardTheme = GameState.settings.boardTheme;

    document.body.classList.toggle(
        "no-animations",
        !GameState.settings.animations
    );

    const coordinates = document.querySelector(".coordinates");

    if (coordinates) {
        coordinates.hidden = !GameState.settings.showCoordinates;
    }

    const animationToggle = document.querySelector("#animationsToggle");
    const soundToggle = document.querySelector("#soundToggle");
    const hintToggle = document.querySelector("#hintToggle");
    const coordinateToggle = document.querySelector("#coordinatesToggle");
    const autosaveToggle = document.querySelector("#autosaveToggle");

    if (animationToggle) {
        animationToggle.checked = GameState.settings.animations;
    }

    if (soundToggle) {
        soundToggle.checked = GameState.settings.sounds;
    }

    if (hintToggle) {
        hintToggle.checked = GameState.settings.hints;
    }

    if (coordinateToggle) {
        coordinateToggle.checked = GameState.settings.showCoordinates;
    }

    if (autosaveToggle) {
        autosaveToggle.checked = GameState.settings.autoSave;
    }
}

function setupSettings() {
    document.querySelector("#themeSelect")?.addEventListener("change", event => {
        GameState.settings.theme = event.target.value;
        saveSettings();
        applySettings();
    });

    document.querySelector("#boardThemeSelect")?.addEventListener("change", event => {
        GameState.settings.boardTheme = event.target.value;
        saveSettings();
        applySettings();
    });

    document.querySelector("#animationsToggle")?.addEventListener("change", event => {
        GameState.settings.animations = event.target.checked;
        saveSettings();
        applySettings();
    });

    document.querySelector("#soundToggle")?.addEventListener("change", event => {
        GameState.settings.sounds = event.target.checked;
        saveSettings();
    });

    document.querySelector("#hintToggle")?.addEventListener("change", event => {
        GameState.settings.hints = event.target.checked;
        saveSettings();
    });

    document.querySelector("#coordinatesToggle")?.addEventListener("change", event => {
        GameState.settings.showCoordinates = event.target.checked;
        saveSettings();
        applySettings();
        renderBoard();
    });

    document.querySelector("#autosaveToggle")?.addEventListener("change", event => {
        GameState.settings.autoSave = event.target.checked;
        saveSettings();
    });
}

function toggleSettings() {
    const panel = document.querySelector("#settingsPanel");
    panel?.classList.toggle("open");
}
