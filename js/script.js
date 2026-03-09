const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const h1 = document.querySelector("h1");

const audio = new Audio('../assets/hitHurt.wav');
const audioCoin = new Audio('../assets/pickupCoin.wav');

const size = 30;

let gameOver = false

const snake = [
    { x: 270, y: 240 },
    { x: 300, y: 240 },
    { x: 330, y: 240 },
]

const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min);
}

const randomPosition = () => {
    const number = randomNumber(0, canvas.width - size);
    return Math.round(number / 30) * 30
}

const randomColor = () => {
    const red = randomNumber(0, 255)
    const green = randomNumber(0, 255)
    const blue = randomNumber(0, 255)

    return `rgb(${red}, ${green}, ${blue})`
}

h1.innerText = randomNumber(5, 10)

const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: randomColor()
}

let direction, loopId

const drawFood = () => {

    const { x, y, color } = food
    ctx.shadowColor = color
    ctx.shadowBlur = 50
    ctx.fillStyle = food.color
    ctx.fillRect(x, y, size, size);
    ctx.shadowBlur = 0

}

const drawSnake = () => {
    ctx.fillStyle = "#30ca70"
    snake.forEach((position, index) => {

        if (index == snake.length - 1) {
            ctx.fillStyle = "#0e9135"
        }
        ctx.fillRect(position.x, position.y, size, size);
    })
}

const moveSnake = () => {

    if (!direction) return

    const head = snake[snake.length - 1]

    snake.shift();

    if (direction == "right") {
        snake.push({ x: head.x + size, y: head.y });
    }

    if (direction == "left") {
        snake.push({ x: head.x - size, y: head.y });
    }

    if (direction == "down") {
        snake.push({ x: head.x, y: head.y + size });
    }
    if (direction == "up") {
        snake.push({ x: head.x, y: head.y - size });
    }

}

const grid = () => {
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#333333"

    for (let i = 30; i < canvas.width; i += 30) {
        ctx.beginPath();
        ctx.lineTo(i, 0);
        ctx.lineTo(i, 600);
        ctx.stroke();

        ctx.beginPath();
        ctx.lineTo(0, i);
        ctx.lineTo(600, i);
        ctx.stroke();
    }
}

const checkEat = () => {
    const head = snake[snake.length - 1]

    if (head.x == food.x && head.y == food.y) {
        snake.push(head);
        audioCoin.play();

        let x = randomPosition();
        let y = randomPosition();

        while (snake.find((position) => position.x == x && position.y == y)) {
            let x = randomPosition();
            let y = randomPosition();
        }

        food.x = x
        food.y = y
        food.color = randomColor();

    }
}

const checkColision = () => {
    const head = snake[snake.length - 1]
    const neckIndex = snake.length - 2

    const wallColision = head.x < 0 || head.x > 600 || head.y < 0 || head.y > 600

    const selfColision = snake.find((position, index) => {
        return index < neckIndex &&
            position.x === head.x &&
            position.y === head.y
    });

    if (wallColision || selfColision) {
        audio.play()
        gameOver = true
    }
}

const drawGameOver = () => {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white"
    ctx.textAlign = "center"

    ctx.font = "50px Arial"
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 20);

    ctx.font = "20px Arial"
    ctx.fillText("Pressione ENTER para reiniciar", canvas.width / 2, canvas.height / 2 + 30);
}

const resetGame = () => {
    snake.length = 0

    snake.push(
        { x: 270, y: 240 },
        { x: 300, y: 240 },
        { x: 330, y: 240 }
    )

    direction = undefined
    gameOver = false

    food.x = randomPosition();
    food.y = randomPosition();
    food.color = randomColor();

    gameLoop();
}

const gameLoop = () => {
    ctx.clearRect(0, 0, 600, 600);

    grid();
    drawFood();
    drawSnake();
    moveSnake();
    checkEat();
    checkColision();

    if (gameOver) {
        drawGameOver();
        return
    }

    loopId = setTimeout(() => {
        gameLoop();
    }, 230)
}

gameLoop();

document.addEventListener("keydown", ({ key }) => {

    if (gameOver && key === "Enter") {
        resetGame()
        return
    }

    if (key == "ArrowRight" && direction != "left") {
        direction = "right"
    }
    if (key == "ArrowLeft" && direction != "right") {
        direction = "left"
    }
    if (key == "ArrowDown" && direction != "up") {
        direction = "down"
    }
    if (key == "ArrowUp" && direction != "down") {
        direction = "up"
    }
});