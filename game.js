function initSnake(length, headPosition) {
    return [...Array(length).keys()].map((index) => {
        return {
            x: headPosition.x - index,
            y: headPosition.y,
        };
    });
}

function initFood(gridLength, snakeSections) {
    let food;
    do {
        food = {
            x: Math.floor(Math.random() * gridLength),
            y: Math.floor(Math.random() * gridLength),
        };
    } while (snakeSections.includes(food));
    return food;
}

function createCellDiv(htmlClassName, position, size) {
    const cell = document.createElement("div");
    cell.className = htmlClassName;
    cell.style.left = position.x * size + "px";
    cell.style.top = position.y * size + "px";
    return cell;
}

function gameFunction() {
    const fixedElements = document.getElementById("fixed-elements");
    const dynamicElements = document.getElementById("dynamic-elements");
    const FPS = 5;
    const gridLength = 20;
    const cellSize = 20;
    let snakeSections = initSnake(5, {
        x: gridLength / 2,
        y: gridLength / 2,
    });
    let food = initFood(gridLength, snakeSections);
    let direction = "right";
    let lockMovement = false;
    let running = true;

    function handlePause(event) {
        const { code } = event;
        if (code == "Space") {
            running = !running;
            const displayWrapper = document.getElementById("overlay");
            displayWrapper.className = running ? "" : "pause";
        }
    }

    function handleControls(event) {
        const { key } = event;
        if (lockMovement) {
            return;
        }
        let lastDirection = direction.toString();

        switch (key) {
            case "w":
            case "ArrowUp":
                if (direction != "down") {
                    direction = "up";
                }
                break;
            case "s":
            case "ArrowDown":
                if (direction != "up") {
                    direction = "down";
                }
                break;
            case "a":
            case "ArrowLeft":
                if (direction != "right") {
                    direction = "left";
                }
                break;
            case "d":
            case "ArrowRight":
                if (direction != "left") {
                    direction = "right";
                }
                break;
        }
        if (lastDirection != direction) {
            lockMovement = true;
            console.log(key, direction);
        }
    }

    function handleKeyDown(event) {
        handlePause(event);
        if (running) {
            handleControls(event);
        }
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
        if (head.x == food.x && head.y == food.y) {
            food = initFood(gridLength, snakeSections);
        } else {
            snakeSections.pop();
        }
        lockMovement = false;
    }

    function render() {
        //clear HTML elements
        dynamicElements.innerHTML = "";

        snakeSections.forEach((section) =>
            dynamicElements.appendChild(
                createCellDiv("snake-cell", section, cellSize)
            )
        );

        dynamicElements.appendChild(createCellDiv("food-cell", food, cellSize));
    }

    function gameLoop() {
        if (running) {
            moveSnake();
            render();
        }
    }

    document.addEventListener("keydown", handleKeyDown);

    setInterval(gameLoop, parseInt(1000 / FPS));

    for (let x = 0; x < gridLength; x++) {
        for (let y = 0; y < gridLength; y++) {
            fixedElements.appendChild(
                createCellDiv("empty-cell", { x, y }, cellSize)
            );
        }
    }

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
