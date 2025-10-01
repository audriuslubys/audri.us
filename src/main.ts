import { createGame } from "./game";

const WIDTH = 20;
const HEIGHT = 20;

function main() {
	const root = document.querySelector<HTMLDivElement>(".js-root")!;

	root.innerHTML = `
		<div class="js-status status" style="width: 500px;"></div>
		<div class="screen" style="width: 500px; height: 500px;">
			<canvas class="js-canvas canvas" width="1000" height="1000"></canvas>
			<div class="js-end end hidden">
				<div class="card">
					<div class="title">Oops</div>
					<div class="js-score score">0</div>
					<div class="instruction">&lt;ENTER&gt;</div>
				</div>
			</div>
		</div>
	`;

	const canvas = document.querySelector<HTMLCanvasElement>(".js-canvas")!;
	const status = document.querySelector<HTMLDivElement>(".js-status")!;
	const gameOverScreen = document.querySelector<HTMLDivElement>(".js-end")!;
	const gameOverScore = document.querySelector<HTMLDivElement>(".js-score")!;

	createGame({
		canvas,
		width: WIDTH,
		height: HEIGHT,
		onScoreChange(score) {
			status.textContent = score.toString();
		},
		onStart() {
			gameOverScreen.classList.add("hidden");
		},
		onGameOver(finalScore) {
			gameOverScreen.classList.remove("hidden");
			gameOverScore.textContent = finalScore.toString();
		},
	});
}

main();
