import { run } from "./app";
import { vec2, wrap, add, equals, type Vec2 } from "./vec2";
import { createCounter } from "./counter";
import { createInputSystem, type Input } from "./input";
import { createRenderSystem } from "./render";

const SPEED = 11;

type Options = {
	canvas: HTMLCanvasElement;
	width: number;
	height: number;
	onStart?: () => void;
	onGameOver?: () => void;
	onPause?: () => void;
	onResume?: () => void;
	onScoreChange?: (score: number) => void;
};

export function createGame(options: Options) {
	const {
		canvas,
		width,
		height,
		onStart,
		onGameOver,
		onPause,
		onResume,
		onScoreChange,
	} = options;

	const min = vec2(0, 0);
	const max = vec2(width, height);

	const pixelSize = canvas.width / width;

	const [input, inputSystem] = createInputSystem();
	const [render, renderSystem] = createRenderSystem(canvas, { pixelSize });

	const moveCounter = createCounter(1000 / SPEED);

	function getRandomFoodPosition(): Vec2 {
		return getRandomPosition(min, max, [...snake.body, snake.head]);
	}

	let state: "game" | "gameover" | "paused" = "game";

	const snake = {
		head: vec2(4, 4),
		body: [vec2(3, 4), vec2(2, 4)],
	};

	let pendingDirection = vec2(1, 0);
	let currentDirection = vec2(1, 0);

	let food = getRandomFoodPosition();

	let score = 0;

	function reset() {
		state = "game";
		snake.head = vec2(4, 4);
		snake.body = [vec2(3, 4), vec2(2, 4)];
		pendingDirection = vec2(1, 0);
		currentDirection = vec2(1, 0);
		score = 0;
		food = getRandomFoodPosition();
	}

	function game(delta: number) {
		render.pixel(...snake.head);
		for (const segment of snake.body) {
			render.pixel(...segment);
		}
		render.pixel(...food);

		if (input.justPressed("Escape")) {
			if (state === "paused") {
				state = "game";
				onResume?.();
			} else {
				state = "paused";
				onPause?.();
			}
		}

		if (state === "gameover" && input.justPressed("Enter")) {
			reset();
			onStart?.();
			onScoreChange?.(score);
			return;
		}

		if (state !== "game") {
			return;
		}

		if (moveCounter(delta)) {
			const moveHeadTo = wrap(add(snake.head, pendingDirection), min, max);

			if (snake.body.some((segment) => equals(segment, moveHeadTo))) {
				state = "gameover";
				onGameOver?.();
				return;
			}

			if (equals(moveHeadTo, food)) {
				food = getRandomFoodPosition();
				snake.body.push(snake.head);
				score++;
				onScoreChange?.(score);
			}

			snake.body = snake.body.map((_, index) => {
				const moveTo = index === 0 ? snake.head : snake.body[index - 1];
				return vec2(...moveTo);
			});

			snake.head = vec2(...moveHeadTo);
			currentDirection = pendingDirection;
		}

		pendingDirection = getDirection(input) ?? pendingDirection;
		// can't switch to an opposite direction
		if (equals(add(pendingDirection, currentDirection), vec2(0, 0))) {
			pendingDirection = currentDirection;
		}
	}

	onStart?.();
	onScoreChange?.(score);
	run([inputSystem, game, renderSystem]);
}

function getDirection(input: Input): Vec2 | undefined {
	if (input.justPressed(["ArrowUp", "w"])) {
		return vec2(0, -1);
	} else if (input.justPressed(["ArrowDown", "s"])) {
		return vec2(0, 1);
	} else if (input.justPressed(["ArrowLeft", "a"])) {
		return vec2(-1, 0);
	} else if (input.justPressed(["ArrowRight", "d"])) {
		return vec2(1, 0);
	}
}

function getRandomPosition(
	[minX, minY]: Vec2,
	[maxX, maxY]: Vec2,
	exclude: Vec2[]
): Vec2 {
	const freeCoords: Vec2[] = [];
	for (let i = minX; i < maxX; i++) {
		for (let j = minY; j < maxY; j++) {
			if (!exclude.some(([x, y]) => x === i && y === j)) {
				freeCoords.push(vec2(i, j));
			}
		}
	}
	return freeCoords[Math.floor(Math.random() * freeCoords.length)];
}
