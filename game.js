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
    const FPS = 5;
    const gridLength = 20;
    const cellSize = 20;
    let snakeSections = initSnake(5, {
        x: gridLength / 2,
        y: gridLength / 2,
    });
    let direction = "right";

    function handleControls(event) {
        const { key } = event;

        switch (key) {
            case "w":
            case "ArrowUp":
                direction = "up";
                break;
            case "s":
            case "ArrowDown":
                direction = "down";
                break;
            case "a":
            case "ArrowLeft":
                direction = "left";
                break;
            case "d":
            case "ArrowRight":
                direction = "right";
                break;
        }
        console.log(key, direction);
    }

    function moveSnake() {
        const head = { ...snakeSections[0] };

        switch (direction) {
            case "up":
                head.y--;
                break;
            case "down":
                head.y++;
                break;
            case "left":
                head.x--;
                break;
            case "right":
                head.x++;
                break;
        }

        snakeSections.unshift(head);
        snakeSections.pop();
    }

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
        moveSnake();
        render();
    }

    document.addEventListener("keydown", handleControls);

    setInterval(gameLoop, parseInt(1000 / FPS));

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
