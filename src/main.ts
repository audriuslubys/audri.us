import { createGame } from "./game";

const WIDTH = 20;
const HEIGHT = 20;

function main() {
	const root = document.querySelector<HTMLDivElement>(".js-root")!;

	root.innerHTML = `
		<div class="js-status status" style="width: 500px;"></div>
		<canvas
			class="js-screen screen"
			width="1000"
			height="1000"
			style="width: 500px; height: 500px;"
		></canvas>
	`;

	const canvas = document.querySelector<HTMLCanvasElement>(".js-screen")!;
	const status = document.querySelector<HTMLDivElement>(".js-status")!;

	createGame({
		canvas,
		width: WIDTH,
		height: HEIGHT,
		onScoreChange: (score) => {
			status.textContent = score.toString();
		},
	});
}

main();
