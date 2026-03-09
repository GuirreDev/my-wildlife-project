const orangCanvas = document.getElementById("orangutanCanvas");
const orangCtx = orangCanvas.getContext("2d");
const orangScoreEl = document.getElementById("orangutanScore");

let orangAnimationId;
let orangutan;
let machines = [];
let trees = [];
let orangFrames = 0;
let orangDistance = 0;
let gameSpeed = 4;

function startOrangutanGame() {
    cancelAnimationFrame(orangAnimationId);
    
    orangutan = { 
        x: 50, y: 300, width: 40, height: 40, 
        dy: 0, gravity: 0.8, jumpPower: -14, grounded: false, rotation: 0 
    };
    machines = [];
    trees = [];
    orangFrames = 0;
    orangDistance = 0;
    gameSpeed = 4;
    orangScoreEl.innerText = orangDistance;

    for(let i=0; i<5; i++) {
        trees.push({ x: Math.random() * orangCanvas.width, size: Math.random() * 30 + 30 });
    }

    updateOrangutanGame();
}

function stopOrangutanGame() {
    cancelAnimationFrame(orangAnimationId);
}

function updateOrangutanGame() {
    let skyGradient = orangCtx.createLinearGradient(0, 0, 0, 340);
    skyGradient.addColorStop(0, "#82E0AA");
    skyGradient.addColorStop(1, "#FAD7A1");
    orangCtx.fillStyle = skyGradient;
    orangCtx.fillRect(0, 0, orangCanvas.width, orangCanvas.height);
    
    orangCtx.fillStyle = "#27AE60";
    trees.forEach(tree => {
        tree.x -= gameSpeed * 0.3; 
        if(tree.x + tree.size < 0) tree.x = orangCanvas.width;
        orangCtx.beginPath();
        orangCtx.moveTo(tree.x, 340);
        orangCtx.lineTo(tree.x + tree.size/2, 340 - tree.size*1.5);
        orangCtx.lineTo(tree.x + tree.size, 340);
        orangCtx.fill();
    });

    orangCtx.fillStyle = "#6E2C00";
    orangCtx.fillRect(0, 340, orangCanvas.width, 60);

    orangutan.dy += orangutan.gravity;
    orangutan.y += orangutan.dy;

    if (orangutan.y + orangutan.height >= 340) {
        orangutan.y = 340 - orangutan.height;
        orangutan.dy = 0;
        orangutan.grounded = true;
        orangutan.rotation = 0;
    } else {
        orangutan.grounded = false;
        orangutan.rotation += 0.1; 
    }

    orangCtx.save();
    orangCtx.translate(orangutan.x + orangutan.width/2, orangutan.y + orangutan.height/2);
    orangCtx.rotate(orangutan.rotation);
    orangCtx.font = "40px Arial";
    orangCtx.textAlign = "center";
    orangCtx.textBaseline = "middle";
    orangCtx.fillText("🦧", 0, 0);
    orangCtx.restore();

    if (orangFrames % Math.floor(Math.random() * 40 + 60) === 0) {
        machines.push({ x: orangCanvas.width, y: 300, width: 40, height: 40 });
    }

    for (let i = 0; i < machines.length; i++) {
        machines[i].x -= gameSpeed;
        
        orangCtx.font = "40px Arial";
        orangCtx.fillText("🚜", machines[i].x, machines[i].y + 35);

        if (orangutan.x + 10 < machines[i].x + machines[i].width - 10 &&
            orangutan.x + orangutan.width - 10 > machines[i].x + 10 &&
            orangutan.y + 10 < machines[i].y + machines[i].height - 10 &&
            orangutan.y + orangutan.height - 10 > machines[i].y + 10) {
            
            stopOrangutanGame();
            alert(`Game Over! The forest is shrinking. You traveled ${Math.floor(orangDistance / 10)} meters.`);
            return;
        }
    }

    machines = machines.filter(m => m.x + m.width > 0);

    orangDistance++;
    if (orangDistance % 10 === 0) orangScoreEl.innerText = Math.floor(orangDistance / 10);
    if (orangDistance % 200 === 0) gameSpeed += 0.5;

    orangFrames++;
    orangAnimationId = requestAnimationFrame(updateOrangutanGame);
}

window.addEventListener("keydown", (e) => {
    if ((e.code === "Space" || e.code === "ArrowUp") && orangutan.grounded) {
        e.preventDefault();
        orangutan.dy = orangutan.jumpPower;
        orangutan.grounded = false;
    }
});

orangCanvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    if (orangutan.grounded) {
        orangutan.dy = orangutan.jumpPower;
        orangutan.grounded = false;
    }
}, {passive: false});
