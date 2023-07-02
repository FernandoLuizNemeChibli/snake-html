function gameFunction() {
    const gameDisplay = document.getElementById("game-display");
    const FPS = parseInt(1000 / 30);

    function render() {
        //clear HTML elements
        gameDisplay.innerHTML = "";
    }

    function gameLoop() {
        render();
    }

    const loopInterval = setInterval(gameLoop, FPS);
}

document.addEventListener("DOMContentLoaded", gameFunction);
