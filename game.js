function initSnake(length, headPosition) {
    return [...Aray(length).keys()].map((index) => {
        return {
            x: headPosition.x + index,
            y: headPosition.y,
        };
    });
}

function gameFunction() {
    const gameDisplay = document.getElementById("game-display");
    const FPS = parseInt(1000 / 30);
    const gridLength = 20;
    const cellSize = 20;
    let snakeSections = initSnake(5, {
        x: gridLength / 2,
        y: gridLength / 2,
    });

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
