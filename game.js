const FOOD_TYPES = {
    normal: {
        speed: 0,
        score: 2,
    },
    hot: {
        speed: +1,
        score: 3,
    },
    chill: {
        speed: -1,
        score: 1,
    },
    superhot: {
        speed: +15,
        score: 5,
    },
    superchill: {
        speed: -15,
        score: 0,
    },
};

let recordScore = 0;

function setNewScore(newScore) {
    if (newScore > recordScore) {
        const recordScoreDisplay = document.getElementById("record-score");
        recordScore = newScore;
        let strRecordScore = "00000" + recordScore;
        recordScoreDisplay.innerHTML = strRecordScore.substring(
            strRecordScore.length - 5
        );
    }
}

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
    const displayWrapper = document.getElementById("overlay");
    const fixedElements = document.getElementById("fixed-elements");
    const dynamicElements = document.getElementById("dynamic-elements");
    const currentScore = document.getElementById("current-score");
    const FPS = 5;
    let increasedFPS = 2;
    const gridLength = 20;
    const cellSize = 20;
    let snakeSections = initSnake(5, {
        x: gridLength / 2,
        y: gridLength / 2,
    });
    let food = initFood(gridLength, snakeSections);
    let foodType = "normal";
    let direction = "right";
    let lockMovement = false;
    let running = true;
    let gameOver = false;
    let score = 0;
    currentScore.innerHTML = "00000";
    let reset = false;

    function createButtons() {
        const resetButton = document.getElementById("reset-button");
        const pauseButton = document.getElementById("pause-button");
        resetButton.onclick = resetGame;
        pauseButton.onclick = pauseGame;
    }

    function pauseGame() {
        running = !running;
        const ledPause = document.getElementById("led-pause");
        const ledRunning = document.getElementById("led-running");
        if (running) {
            displayWrapper.className = "";
            ledPause.className = "";
            ledRunning.className = "active";
        } else {
            displayWrapper.className = "pause";
            ledPause.className = "active";
            ledRunning.className = "";
        }
    }

    function resetGame() {
        reset = true;
        const displayWrapper = document.getElementById("overlay");
        const ledGameOver = document.getElementById("led-game-over");
        const ledPause = document.getElementById("led-pause");
        const ledRunning = document.getElementById("led-running");
        displayWrapper.className = "reset";
        ledGameOver.className = "";
        ledPause.className = "";
        ledRunning.className = "active";
    }

    function setGameOver() {
        gameOver = true;
        running = false;
        const ledGameOver = document.getElementById("led-game-over");
        const ledPause = document.getElementById("led-pause");
        const ledRunning = document.getElementById("led-running");
        displayWrapper.className = "game-over";
        ledGameOver.className = "active";
        ledPause.className = "";
        ledRunning.className = "";
        setNewScore(score);
    }

    function changeCurrentScore(entryValue) {
        score += entryValue;
        const strScore = "0000" + score;
        currentScore.innerHTML = strScore.substring(strScore.length - 5);
    }

    function changeGameSpeed(entryValue) {
        if (increasedFPS + entryValue < 0) {
            increasedFPS = 0;
        } else if (increasedFPS + entryValue > 15) {
            increasedFPS = 15;
        } else {
            increasedFPS += entryValue;
        }
    }

    function eatFruit() {
        const foodStats = FOOD_TYPES[foodType];
        const foodKeys = Object.keys(FOOD_TYPES);
        console.log(foodStats.speed, foodType);

        changeGameSpeed(foodStats.speed);
        changeCurrentScore(foodStats.score);

        foodType = foodKeys[Math.floor(Math.random() * foodKeys.length)];
        food = initFood(gridLength, snakeSections);
    }

    function handleReset(event) {
        const { code } = event;
        if (code == "Escape") {
            resetGame();
        }
    }

    function handlePause(event) {
        const { code } = event;
        if (code == "Space") {
            pauseGame();
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
        handleReset(event);
        if (!gameOver) {
            handlePause(event);
            if (running) {
                handleControls(event);
            }
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

        handleCollisions(head);
        if (gameOver) {
            return;
        }

        snakeSections.unshift(head);

        if (head.x == food.x && head.y == food.y) {
            eatFruit();
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

        dynamicElements.appendChild(
            createCellDiv(`${foodType}-food-cell`, food, cellSize)
        );
    }

    function handleCollisions(head) {
        if (
            head.x >= gridLength ||
            head.y >= gridLength ||
            head.x < 0 ||
            head.y < 0
        ) {
            console.log("outbounds");
            setGameOver();
        }
        snakeSections.forEach((section) => {
            if (head.x == section.x && head.y == section.y) {
                console.log("itself");
                setGameOver();
            }
        });
    }

    function gameLoop() {
        if (running) {
            moveSnake();
            render();
        }
        if (reset) {
            console.log("reset");
            setTimeout(gameFunction, 500);
            reset = false;
            return;
        }
        setTimeout(gameLoop, parseInt(1000 / (FPS + increasedFPS)));
    }

    document.addEventListener("keydown", handleKeyDown);

    for (let x = 0; x < gridLength; x++) {
        for (let y = 0; y < gridLength; y++) {
            fixedElements.appendChild(
                createCellDiv("empty-cell", { x, y }, cellSize)
            );
        }
    }

    displayWrapper.className = "";
    console.log("start!");
    createButtons();
    gameLoop();
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
