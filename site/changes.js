const DATA_URL = "https://raw.githubusercontent.com/hearthdesktop/hearth/site-data/changes.json";
const COMMIT_URL_PREFIX = "https://github.com/hearthdesktop/hearth/commit/";
const MAX_FIXES = 8;

const summary = document.querySelector("[data-added-summary]");
const groups = document.querySelector(".added");

function formatDate(iso) {
    return new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

function renderChange(change) {
    const item = document.createElement("li");

    if (change.scope) {
        const scope = document.createElement("span");
        scope.className = "change-scope";
        scope.textContent = change.scope;
        item.append(scope);
    }

    const link = document.createElement("a");
    if (change.url.startsWith(COMMIT_URL_PREFIX)) link.href = change.url;
    link.textContent = change.summary;

    const time = document.createElement("time");
    time.dateTime = change.date;
    time.textContent = formatDate(change.date);

    item.append(link, time);
    return item;
}

async function loadChanges() {
    try {
        const response = await fetch(DATA_URL, { cache: "no-cache" });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();

        for (const [key, max] of [["features", Infinity], ["fixes", MAX_FIXES]]) {
            document.querySelector(`[data-changes="${key}"]`).replaceChildren(...data[key].slice(0, max).map(renderChange));
        }

        summary.textContent = `${data.commitsAhead} commits on top of Vesktop so far, updated ${formatDate(data.generatedAt)}.`;
        groups.hidden = false;
    } catch {
        summary.textContent = "Couldn't load the latest changes. Every change is on GitHub.";
    }
}

loadChanges();
