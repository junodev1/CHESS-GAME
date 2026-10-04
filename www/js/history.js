function renderHistory() {
    const container = document.querySelector("#moveHistory");

    if (!container) return;

    container.innerHTML = "";

    const rows = [];

    for (let i = 0; i < GameState.history.length; i += 2) {
        const white = GameState.history[i];
        const black = GameState.history[i + 1];

        const row = document.createElement("div");

        row.className = "history-row";

        if (white) {
            const whiteMove = document.createElement("button");

            whiteMove.className = "history-move";
            whiteMove.dataset.index = i;
            whiteMove.textContent = `${Math.floor(i / 2) + 1}. ${white.notation}`;

            if (i === GameState.history.length - 1) {
                whiteMove.classList.add("active");
            }

            row.appendChild(whiteMove);
        }

        if (black) {
            const blackMove = document.createElement("button");

            blackMove.className = "history-move";
            blackMove.dataset.index = i + 1;
            blackMove.textContent = black.notation;

            if (i + 1 === GameState.history.length - 1) {
                blackMove.classList.add("active");
            }

            row.appendChild(blackMove);
        }

        container.appendChild(row);
        rows.push(row);
    }
}
