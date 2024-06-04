import snakeSprite from "./assets/images/snake-sprite.png";
import snakeLogo from "./assets/images/snake-logo.png";

window.onload = () => {
    const canvas = document.getElementById("gamepad");

    const scoreValue = document.querySelector(".score");
    const highscoreValue = document.querySelector(".highscore");

    const CANVAS_WIDTH = 900;
    const CANVAS_HEIGHT = 900;
    const GAME_COLUMNS = 25;
    const GAME_ROWS = 25;

    const context = canvas.getContext("2d");

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    let lastFrame = 0;
    let fpsTime = 0;
    let frameCount = 0;

    let initialized = false;

    // Images
    let tileImage;

    let preloaded = false;

    const loadImage = (imageUrl) => {
        preloaded = false;
        const image = new Image();
        image.src = imageUrl;
        image.onload = () => {
            preloaded = true;
        };
        return image;
    };

    class Level {
        constructor(columns, rows, tileWidth, tileHeight) {
            this.columns = columns;
            this.rows = rows;
            this.tilewidth = tileWidth;
            this.tileheight = tileHeight;
            this.tiles = Array.from({ length: columns }, () => Array(rows).fill(0));
        }

        generate() {
            for (let i = 0; i < this.columns; i++) {
                for (let j = 0; j < this.rows; j++) {
                    this.tiles[i][j] = 0;
                }
            }
        }
    }

    // Snake
    class Snake {
        constructor() {
            this.directions = [
                [0, -1], // up
                [1, 0], // right
                [0, 1], // down
                [-1, 0], // left
            ];
            this.init(0, 0, 1, 10, 1);
        }

        init(x, y, direction, speed, nSegments) {
            this.x = x;
            this.y = y;
            this.direction = direction;
            this.speed = speed;
            this.movedelay = 0;
            this.segments = Array.from({ length: nSegments }, (_, i) => ({
                x: this.x - i * this.directions[direction][0],
                y: this.y - i * this.directions[direction][1],
            }));
            this.growSegments = 0;
        }

        grow() {
            this.growSegments++;
        }

        tryMove(dt) {
            this.movedelay += dt;
            const maxmovedelay = 1 / this.speed;
            return this.movedelay > maxmovedelay;
        }

        nextMove() {
            const [dx, dy] = this.directions[this.direction];
            return { x: this.x + dx, y: this.y + dy };
        }

        move() {
            const nextmove = this.nextMove();
            this.x = nextmove.x;
            this.y = nextmove.y;

            const lastseg = this.segments[this.segments.length - 1];
            const growx = lastseg.x;
            const growy = lastseg.y;

            for (let i = this.segments.length - 1; i >= 1; i--) {
                this.segments[i] = { ...this.segments[i - 1] };
            }

            if (this.growSegments > 0) {
                this.segments.push({ x: growx, y: growy });
                this.growSegments--;
            }

            this.segments[0] = { x: this.x, y: this.y };
            this.movedelay = 0;
        }
    }

    const snake = new Snake();
    const level = new Level(GAME_COLUMNS, GAME_ROWS, CANVAS_WIDTH / GAME_COLUMNS, CANVAS_HEIGHT / GAME_ROWS);

    let score = 0;
    let highscore = 0;
    let gameover = true;
    let gameovertime = 1;
    const gameoverdelay = 0.5;

    const init = () => {
        tileImage = loadImage(snakeSprite);

        document.addEventListener("keydown", onKeyDown);

        newGame();
        gameover = true;

        main(0);
    };

    const tryNewGame = () => {
        if (gameovertime > gameoverdelay) {
            newGame();
            gameover = false;
        }
    };

    const newGame = () => {
        snake.init(10, 10, 1, 10, 4);
        level.generate();
        addApple();
        score = 0;
        scoreValue.textContent = `${score}`;
        gameover = false;
    };

    const addApple = () => {
        let valid = false;
        while (!valid) {
            const ax = randRange(0, level.columns - 1);
            const ay = randRange(0, level.rows - 1);

            const overlap = snake.segments.some(({ x, y }) => x === ax && y === ay);

            if (!overlap && level.tiles[ax][ay] === 0) {
                level.tiles[ax][ay] = 2;
                valid = true;
            }
        }
    };

    const main = (tframe) => {
        window.requestAnimationFrame(main);

        if (!initialized) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            if (preloaded) {
                initialized = true;
            }
        } else {
            update(tframe);
            render();
        }
    };

    const update = (tframe) => {
        const dt = (tframe - lastFrame) / 1000;
        lastFrame = tframe;

        updateFps(dt);

        if (!gameover) {
            updateGame(dt);
        } else {
            gameovertime += dt;
        }
    };

    const updateGame = (dt) => {
        if (snake.tryMove(dt)) {
            const nextmove = snake.nextMove();
            const { x: nx, y: ny } = nextmove;

            if (nx >= 0 && nx < level.columns && ny >= 0 && ny < level.rows) {
                if (level.tiles[nx][ny] === 1) {
                    gameover = true;
                }

                if (!gameover) {
                    const collision = snake.segments.some(({ x, y }) => x === nx && y === ny);

                    if (collision) {
                        gameover = true;
                    } else {
                        snake.move();

                        if (level.tiles[nx][ny] === 2) {
                            level.tiles[nx][ny] = 0;
                            addApple();
                            snake.grow();
                            score++;
                            scoreValue.textContent = `${score}`;
                            if (score > highscore) {
                                highscoreValue.textContent = `${score}`;
                            }
                        }
                    }
                }
            } else {
                gameover = true;
            }

            if (gameover) {
                gameovertime = 0;
            }
        }
    };

    const updateFps = (dt) => {
        if (fpsTime > 0.25) {
            const fps = Math.round(frameCount / fpsTime);
            fpsTime = 0;
            frameCount = 0;
        }

        fpsTime += dt;
        frameCount++;
    };

    const render = () => {
        drawLevel();
        drawSnake();

        if (gameover) {
            context.clearRect(0, 0, canvas.width, canvas.height);

            context.fillStyle = "rgba(0, 0, 200, 0.4 )";
            context.fillRect(0, 0, canvas.width, canvas.height);

            const logo = loadImage(snakeLogo);
            context.drawImage(logo, CANVAS_WIDTH / 2 - 200, 150, 400, 400);

            context.fillStyle = "#eee";
            context.font = "36px Bungee";
            drawCenterText("Press any key to start!", 0, CANVAS_HEIGHT / 1.5, CANVAS_WIDTH);
        }
    };

    const drawLevel = () => {
        context.fillStyle = "rgba(238,238,238,0.4)";

        for (let i = 0; i < level.columns; i++) {
            for (let j = 0; j < level.rows; j++) {
                const tile = level.tiles[i][j];
                const tilex = i * level.tilewidth;
                const tiley = j * level.tileheight;

                context.clearRect(tilex, tiley, level.tilewidth, level.tileheight);
                context.fillRect(tilex, tiley, level.tilewidth, level.tileheight);

                if (tile === 2) {
                    const [tx, ty] = [0, 3];
                    const [tilew, tileh] = [64, 64];
                    context.globalAlpha = 1;
                    context.filter = "none";
                    context.drawImage(tileImage, tx * tilew, ty * tileh, tilew, tileh, tilex, tiley, level.tilewidth, level.tileheight);
                }
            }
        }
    };

    /*
    Tile-Typen:
        [3, 0]: Kopf nach oben
        [4, 0]: Kopf nach rechts
        [3, 1]: Kopf nach links
        [4, 1]: Kopf nach unten
        [1, 0]: Gerade horizontale Linie
        [2, 0]: Rechtskurve von Horizontal zu Vertikal (links nach unten)
        [2, 1]: Gerade vertikale Linie
        [2, 2]: Linkskurve von Vertikal zu Horizontal (oben nach links)
        [0, 1]: Linkskurve von Horizontal zu Vertikal (rechts nach oben)
        [0, 0]: Rechtskurve von Vertikal zu Horizontal (unten nach rechts)
     */
    const drawSnake = () => {
        snake.segments.forEach((segment, i) => {
            const { x: segx, y: segy } = segment;
            const tilex = segx * level.tilewidth;
            const tiley = segy * level.tileheight;

            let tx = 0,
                ty = 0;

            if (i === 0) {
                // head
                const nseg = snake.segments[i + 1];
                [tx, ty] = segy < nseg.y ? [3, 0] : segx > nseg.x ? [4, 0] : segy > nseg.y ? [4, 1] : [3, 1];
            } else if (i === snake.segments.length - 1) {
                // tail
                const pseg = snake.segments[i - 1];
                [tx, ty] = pseg.y < segy ? [3, 2] : pseg.x > segx ? [4, 2] : pseg.y > segy ? [4, 3] : [3, 3];
            } else {
                const pseg = snake.segments[i - 1];
                const nseg = snake.segments[i + 1];
                [tx, ty] =
                    (pseg.x < segx && nseg.x > segx) || (nseg.x < segx && pseg.x > segx)
                        ? [1, 0]
                        : (pseg.x < segx && nseg.y > segy) || (nseg.x < segx && pseg.y > segy)
                        ? [2, 0]
                        : (pseg.y < segy && nseg.y > segy) || (nseg.y < segy && pseg.y > segy)
                        ? [2, 1]
                        : (pseg.y < segy && nseg.x < segx) || (nseg.y < segy && pseg.x < segx)
                        ? [2, 2]
                        : (pseg.x > segx && nseg.y < segy) || (nseg.x > segx && pseg.y < segy)
                        ? [0, 1]
                        : [0, 0];
            }

            context.globalAlpha = 1;
            context.filter = "none";
            context.drawImage(tileImage, tx * 64, ty * 64, 64, 64, tilex, tiley, level.tilewidth, level.tileheight);
        });
    };

    const drawCenterText = (text, x, y, width) => {
        const textdim = context.measureText(text);
        context.fillText(text, x + (width - textdim.width) / 2, y);
    };

    const randRange = (low, high) => Math.floor(low + Math.random() * (high - low + 1));

    const onKeyDown = (e) => {
        if (gameover) {
            tryNewGame();
        } else {
            switch (e.keyCode) {
                case 37:
                    if (snake.direction !== 1) snake.direction = 3;
                    break;
                case 38:
                    if (snake.direction !== 2) snake.direction = 0;
                    break;
                case 39:
                    if (snake.direction !== 3) snake.direction = 1;
                    break;
                case 40:
                    if (snake.direction !== 0) snake.direction = 2;
                    break;
                case 32:
                    snake.grow();
                    break;
            }
        }
    };

    init();
};
