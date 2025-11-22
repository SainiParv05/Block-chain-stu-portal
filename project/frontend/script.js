const API = "http://127.0.0.1:8000";

function getInput() {
    return document.getElementById("userInput").value;
}

function show(res) {
    document.getElementById("output").innerText = JSON.stringify(res, null, 2);
}

async function encrypt() {
    let res = await fetch(API + "/crypto/encrypt", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({text: getInput()})
    });
    show(await res.json());
}

async function summarize() {
    let res = await fetch(API + "/transform/summarize", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({text: getInput()})
    });
    show(await res.json());
}

async function checkMisinfo() {
    let res = await fetch(API + "/safety/misinformation", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({text: getInput()})
    });
    show(await res.json());
}
