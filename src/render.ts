import type { System } from "./app";

interface Render {
	pixel(x: number, y: number): void;
};

type Options = {
	pixelSize: number;
};

const defaultOptions: Options = { pixelSize: 20 };

export function createRenderSystem(
	canvas: HTMLCanvasElement,
	options: Options = defaultOptions
): [Render, System] {
	const { pixelSize } = options;

	const drawingContext = canvas.getContext("2d");
	drawingContext!.fillStyle = "#333333";

	const pixels: { x: number; y: number }[] = [];

	function renderSystem() {
		drawingContext?.clearRect(0, 0, canvas.width, canvas.height);

		for (const pixel of pixels) {
			drawingContext?.fillRect(
				pixel.x * pixelSize + 1,
				pixel.y * pixelSize + 1,
				pixelSize - 2,
				pixelSize - 2
			);
		}

		pixels.length = 0;
	}

	const render: Render = {
		pixel(x, y) {
			pixels.push({ x, y });
		},
	};

	return [render, renderSystem];
}
