const API = "http://127.0.0.1:8000";

const input = document.getElementById("inputText");
const output = document.getElementById("output");
const saveBtn = document.getElementById("saveBtn");

// Attach actions to buttons
document.querySelectorAll(".action-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
        const action = btn.dataset.action;
        const text = input.value;

        if (!text && action !== "tips") {
            output.textContent = "Please enter text first.";
            return;
        }

        let route = "";
        let payload = { text };

        switch (action) {
            case "summarize": route = "/transform/summarize"; break;
            case "rephrase": route = "/transform/rephrase"; break;
            case "encrypt": route = "/crypto/encrypt"; break;
            case "decrypt": route = "/crypto/decrypt"; break;
            case "safety": route = "/safety/check"; break;
            case "tips": route = "/awareness/tips"; payload = {}; break;
        }

        const res = await fetch(API + route, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: Object.keys(payload).length ? JSON.stringify(payload) : null
        });

        const data = await res.json();
        output.textContent = JSON.stringify(data, null, 2);
    });
});

// Save to Repo
saveBtn.addEventListener("click", async () => {
    const text = input.value;
    const result = output.textContent;

    if (!text || !result) return alert("Nothing to save!");

    await fetch(API + "/repo/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: text, output: result })
    });

    alert("Saved successfully!");
});

// Modal logic
const repoBtn = document.getElementById("repoBtn");
const repoModal = document.getElementById("repoModal");
const repoContent = document.getElementById("repoContent");
const closeRepo = document.getElementById("closeRepo");

// View Repository
repoBtn.addEventListener("click", async () => {
    const res = await fetch(API + "/repo/");
    const data = await res.json();
    repoContent.textContent = JSON.stringify(data, null, 2);
    repoModal.classList.remove("hidden");
});

// Close Modal
closeRepo.addEventListener("click", () => {
    repoModal.classList.add("hidden");
});
