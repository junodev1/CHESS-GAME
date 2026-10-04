function validateSettings(settings) {
    if (!settings || typeof settings !== "object") {
        return false;
    }

    const validThemes = [
        "classic",
        "dark",
        "light"
    ];

    const validBoards = [
        "green",
        "blue",
        "brown",
        "gray"
    ];

    if (!validThemes.includes(settings.theme)) {
        return false;
    }

    if (!validBoards.includes(settings.boardTheme)) {
        return false;
    }

    return true;
}

function sanitizePlayerName(name) {
    return String(name || "")
        .replace(/[<>]/g, "")
        .trim()
        .slice(0, 30);
}
