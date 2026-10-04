const ACHIEVEMENTS = [
    {
        id: "first-win",
        name: "First Victory",
        condition: stats => stats.wins >= 1
    },
    {
        id: "five-wins",
        name: "Rising Star",
        condition: stats => stats.wins >= 5
    },
    {
        id: "ten-wins",
        name: "Chess Master",
        condition: stats => stats.wins >= 10
    },
    {
        id: "first-draw",
        name: "Peace Treaty",
        condition: stats => stats.draws >= 1
    }
];

let unlockedAchievements = [];

function loadAchievements() {
    unlockedAchievements =
        loadJSON(STORAGE_KEYS.achievements, []);
}

function saveAchievements() {
    saveJSON(
        STORAGE_KEYS.achievements,
        unlockedAchievements
    );
}

function checkAchievements() {
    for (const achievement of ACHIEVEMENTS) {
        if (
            achievement.condition(statistics) &&
            !unlockedAchievements.includes(achievement.id)
        ) {
            unlockedAchievements.push(achievement.id);

            showAchievement(achievement);
        }
    }
}

function showAchievement(achievement) {
    const toast = document.querySelector("#achievementToast");

    if (!toast) return;

    toast.textContent =
        `${achievement.name} unlocked`;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}
