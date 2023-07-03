function initSnake(length, headPosition) {
    return [...Array(length).keys()].map((index) => {
        return {
            x: headPosition.x - index,
            y: headPosition.y,
        };
    });
}

function createCellDiv(htmlClassName, position, size) {
    const cell = document.createElement("div");
    cell.className = htmlClassName;
    cell.style.left = position.x * size + "px";
    cell.style.top = position.y * size + "px";
    return cell;
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
    console.log("snake: " + snakeSections);

    function render() {
        //clear HTML elements
        gameDisplay.innerHTML = "";

        snakeSections.forEach((section) =>
            gameDisplay.appendChild(
                createCellDiv("snake-cell", section, cellSize)
            )
        );
    }

    function gameLoop() {
        render();
    }

    setInterval(gameLoop, FPS);
    console.log("start!");
}

if (document.readyState != "loading") {
    console.log("document ready");
    gameFunction();
} else {
    console.log("document not ready");
    document.addEventListener("DOMContentLoaded", () => {
        console.log("event called");
        gameFunction();
    });
}
