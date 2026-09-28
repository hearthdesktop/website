const copyStatus = document.querySelector(".copy-status");

for (const button of document.querySelectorAll("button.copy")) {
    button.addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(button.dataset.copy);
            button.textContent = "Copied";
            copyStatus.textContent = `Copied ${button.dataset.copy}`;
        } catch {
            copyStatus.textContent = "Couldn't copy. Select the command and copy it instead.";
        }
        setTimeout(() => (button.textContent = "Copy"), 1600);
    });
}
