let scores = { nostalgia: 0, survival: 0, drive: 0 };
let currentSceneData = null;
let currentPageIndex = 0;
let typeInterval = null;
let isTyping = false;
let fullText = "";

// The story is now broken into individual "pages" that you click through!
const story = {
    start: {
        pages: [
            { type: "narration", text: "You open your eyes to see a dimly lit gray carpet, it reeks of dust and old plastic. Endless shelves stretch into dim corners packed with forgotten boxes. Silent toys stare back from dark corners.." },
            { type: "narration", text: "A girl in a sickly sweet plum colored dress turns around, her solemn eyes locking directly onto yours through the screen." },
            { type: "dialogue", text: "Oh. Great. Another one." },
            { type: "dialogue", text: "You're just sitting there staring at me, aren't you? Well, you're stuck in this endless toy aisle now too." }
        ],
        choices: [
            { text: "Have I been here before... This looks so familiar..", next: "node_nostalgia", stat: "nostalgia" },
            { text: "Where are we? Why is it so quiet? What do you mean stuck here?!", next: "node_survival", stat: "survival" },
            { text: "Forget it, just tell me where the exit is.", next: "node_drive", stat: "drive" }
        ]
    },
    node_nostalgia: {
        pages: [
            { type: "narration", text: "She tilts her head, watching you closely as you scan the endless aisles. A faint, melancholic shadow passes over her solemn expression." },
            { type: "dialogue", text: "You're looking at the past. You think if you remember hard enough, this place will turn back into somewhere safe." }
        ],
        choices: [
            { text: "Maybe if I touch one of these old toys, everything will snap back...", next: "ending", stat: "nostalgia" }
        ]
    },
    node_survival: {
        pages: [
            { type: "narration", text: "She flinches slightly at your panic, her hands tightening into fists inside her dress pockets." },
            { type: "dialogue", text: "Stop shouting. The quiet here has teeth. You're panicking because you can't control the immediate second." }
        ],
        choices: [
            { text: "I can't breathe... I need to find a way out right now!", next: "ending", stat: "survival" }
        ]
    },
    node_drive: {
        pages: [
            { type: "narration", text: "A sharp, knowing smirk touches the corners of her mouth." },
            { type: "dialogue", text: "Straight to the point, huh? You hate wasting time. You don't care about the toys. You just want the goal. You want the exit." }
        ],
        choices: [
            { text: "I don't care if it resets, I'm finding that exit.", next: "ending", stat: "drive" }
        ]
    },
    ending: {
        pages: [], 
        choices: [] 
    }
};

function showScene(sceneKey) {
    currentSceneData = story[sceneKey];
    currentPageIndex = 0;
    
    // Clear old choices
    document.getElementById("choices-container").innerHTML = "";
    document.getElementById("next-indicator").style.display = "none";

    // Handle psychological test results at the end
    if (sceneKey === "ending") {
        let highestStat = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
        let resultText = "";
        
        if (highestStat === "nostalgia") {
            resultText = "SYSTEM RESULT: You are stuck looking backward (Nostalgia/Melancholy). You find comfort in old memories even when they haunt you.";
        } else if (highestStat === "survival") {
            resultText = "SYSTEM RESULT: You are hyper-fixated on the immediate moment (Survival/Anxiety). You feel every shift in your environment intensely.";
        } else {
            resultText = "SYSTEM RESULT: You are solely focused on finding the exit (Impatience/Drive). You refuse to let liminal spaces slow you down.";
        }
        
        currentSceneData.pages = [{ type: "narration", text: resultText }];
    }

    renderPage();
}

function renderPage() {
    const dialogueDiv = document.getElementById("dialogue-text");
    const uiBox = document.getElementById("ui-box");
    const indicator = document.getElementById("next-indicator");
    const currentPageData = currentSceneData.pages[currentPageIndex];
    
    dialogueDiv.textContent = ""; 
    fullText = currentPageData.text;
    indicator.style.display = "none"; // Hide arrow while typing

    // Swaps the background color instantly!
    if (currentPageData.type === "dialogue") {
        uiBox.className = "dialogue-bg";
    } else {
        uiBox.className = "narration-bg";
    }

    startTyping(dialogueDiv);
}

function startTyping(dialogueDiv) {
    isTyping = true;
    let i = 0;
    clearInterval(typeInterval);
    
    typeInterval = setInterval(() => {
        i++;
        dialogueDiv.textContent = fullText.slice(0, i);
        if (i >= fullText.length) {
            finishTyping();
        }
    }, 25);
}

function finishTyping() {
    clearInterval(typeInterval);
    document.getElementById("dialogue-text").textContent = fullText;
    isTyping = false;
    
    // If it's NOT the last page, show the blinking arrow
    if (currentPageIndex < currentSceneData.pages.length - 1) {
        document.getElementById("next-indicator").style.display = "block";
    } 
    // If it IS the last page, show the choices
    else {
        showChoices();
    }
}

function showChoices() {
    const choicesDiv = document.getElementById("choices-container");
    choicesDiv.innerHTML = ""; 
    
    if (currentSceneData.choices && currentSceneData.choices.length > 0) {
        currentSceneData.choices.forEach(choice => {
            let btn = document.createElement("button");
            btn.className = "choice-btn";
            btn.innerText = "> " + choice.text;
            btn.onclick = (e) => {
                e.stopPropagation(); 
                scores[choice.stat]++;
                showScene(choice.next);
            };
            choicesDiv.appendChild(btn);
        });
    }
}

// Click anywhere on the box to advance the text
document.getElementById("ui-box").addEventListener("click", () => {
    // 1. If currently typing, click to instantly finish typing
    if (isTyping) {
        finishTyping();
    } 
    // 2. If finished typing, and there's another page left, go to next page
    else if (currentPageIndex < currentSceneData.pages.length - 1) {
        currentPageIndex++;
        renderPage();
    }
    // (If finished typing and on the last page, wait for them to click a choice button)
});

window.onload = () => showScene("start");
