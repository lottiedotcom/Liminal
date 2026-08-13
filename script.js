let scores = { nostalgia: 0, survival: 0, drive: 0 };
let currentSceneData = null;
let typeInterval = null;
let isTyping = false;
let fullText = "";

const story = {
    start: {
        text: "You open your eyes to see a dimly lit gray carpet, it reeks of dust and old plastic. Endless shelves stretch into dim corners packed with forgotten boxes. Silent toys stare back from dark corners..\n\nA girl in a sickly sweet plum colored dress turns around, her solemn eyes locking directly onto yours through the screen.\n\n\"Oh. Great. Another one,\" she says, crossing her arms and sighing. \"You're just sitting there staring at me, aren't you? Well, you're stuck in this endless toy aisle now too.\"",
        choices: [
            { text: "Have I been here before... This looks so familiar..", next: "node_nostalgia", stat: "nostalgia" },
            { text: "Where are we? Why is it so quiet? What do you mean stuck here?!", next: "node_survival", stat: "survival" },
            { text: "Forget it, just tell me where the exit is.", next: "node_drive", stat: "drive" }
        ]
    },
    node_nostalgia: {
        text: "She tilts her head, watching you closely as you scan the endless aisles. A faint, melancholic shadow passes over her solemn expression.\n\n\"You're looking at the past,\" she murmurs, stepping a little closer. \"You think if you remember hard enough, this place will turn back into somewhere safe.\"",
        choices: [
            { text: "Maybe if I touch one of these old toys, everything will snap back...", next: "ending", stat: "nostalgia" }
        ]
    },
    node_survival: {
        text: "She flinches slightly at your panic, her hands tightening into fists inside her dress pockets.\n\n\"Stop shouting. The quiet here has teeth,\" she snaps, though her voice trembles. \"You're panicking because you can't control the immediate second.\"",
        choices: [
            { text: "I can't breathe... I need to find a way out right now!", next: "ending", stat: "survival" }
        ]
    },
    node_drive: {
        text: "A sharp, knowing smirk touches the corners of her mouth.\n\n\"Straight to the point, huh? You hate wasting time,\" she says, tapping her foot. \"You don't care about the toys. You just want the goal. You want the exit.\"",
        choices: [
            { text: "I don't care if it resets, I'm finding that exit.", next: "ending", stat: "drive" }
        ]
    },
    ending: {
        text: "",
        choices: [] 
    }
};

function showScene(sceneKey) {
    currentSceneData = story[sceneKey];
    const dialogueDiv = document.getElementById("dialogue-text");
    const choicesDiv = document.getElementById("choices-container");

    // Clear previous screen
    choicesDiv.innerHTML = "";
    dialogueDiv.innerText = "";

    if (sceneKey === "ending") {
        let highestStat = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
        
        if (highestStat === "nostalgia") {
            fullText = "SYSTEM RESULT: You are stuck looking backward (Nostalgia/Melancholy). You find comfort in old memories even when they haunt you.";
        } else if (highestStat === "survival") {
            fullText = "SYSTEM RESULT: You are hyper-fixated on the immediate moment (Survival/Anxiety). You feel every shift in your environment intensely.";
        } else {
            fullText = "SYSTEM RESULT: You are solely focused on finding the exit (Impatience/Drive). You refuse to let liminal spaces slow you down.";
        }
    } else {
        fullText = currentSceneData.text;
    }

    startTyping(dialogueDiv, choicesDiv);
}

function startTyping(dialogueDiv, choicesDiv) {
    isTyping = true;
    let i = 0;
    clearInterval(typeInterval);
    
    typeInterval = setInterval(() => {
        dialogueDiv.innerText += fullText.charAt(i);
        i++;
        if (i >= fullText.length) {
            finishTyping(choicesDiv);
        }
    }, 25); // Lower number = faster typing speed
}

function finishTyping(choicesDiv) {
    clearInterval(typeInterval);
    document.getElementById("dialogue-text").innerText = fullText;
    isTyping = false;
    
    // Inject buttons only after typing finishes
    if (currentSceneData && currentSceneData.choices) {
        currentSceneData.choices.forEach(choice => {
            let btn = document.createElement("button");
            btn.className = "choice-btn";
            btn.innerText = "> " + choice.text;
            btn.onclick = (e) => {
                e.stopPropagation(); // Prevents the click from triggering the skip function
                scores[choice.stat]++;
                showScene(choice.next);
            };
            choicesDiv.appendChild(btn);
        });
    }
}

// Click anywhere on the UI box to skip the typing animation
document.getElementById("ui-box").addEventListener("click", () => {
    if (isTyping) {
        finishTyping(document.getElementById("choices-container"));
    }
});

window.onload = () => showScene("start");
