import { createGame } from "./game";

const WIDTH = 20;
const HEIGHT = 20;

function main() {
	const root = document.querySelector<HTMLDivElement>(".js-root")!;

	root.innerHTML = `
		<div class="js-status status"></div>
		<div class="screen">
			<canvas class="js-canvas canvas" width="1000" height="1000"></canvas>
			<div class="js-end end hidden">
				<div class="card">
					<div class="title">Oops</div>
					<div class="final-score">
						<div class="js-score score">0</div>
						<div class="js-highscore">Best: 0</div>
					</div>
					<div class="instruction">&lt;ENTER&gt;</div>
				</div>
			</div>
		</div>
	`;

	const canvas = document.querySelector<HTMLCanvasElement>(".js-canvas")!;
	const status = document.querySelector<HTMLDivElement>(".js-status")!;
	const gameOverScreen = document.querySelector<HTMLDivElement>(".js-end")!;
	const gameOverScore = document.querySelector<HTMLDivElement>(".js-score")!;
	const gameOverHighscore =
		document.querySelector<HTMLDivElement>(".js-highscore")!;

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

			const highscore = getHighscore();
			if (finalScore >= highscore) {
				localStorage.setItem("highscore", JSON.stringify(finalScore));
				gameOverHighscore.textContent = "New best score";
			} else {
				gameOverHighscore.textContent = `Best: ${highscore}`;
			}
		},
	});
}

function getHighscore() {
	const highscore = localStorage.getItem("highscore");
	try {
		const parsed = highscore ? JSON.parse(highscore) : 0;
		if (typeof parsed !== "number") {
			return 0;
		}
		return parsed;
	} catch {
		return 0;
	}
}

main();
