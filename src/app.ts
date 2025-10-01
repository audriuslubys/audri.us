export type System = (delta: number) => void;

export function run(systems: System[]) {
	let start: number | undefined;

	function tick(timestamp: number) {
		if (start === undefined) {
			start = timestamp;
		}
		const delta = timestamp - start;
		start = timestamp;

		for (const system of systems) {
			system(delta);
		}
		requestAnimationFrame(tick);
	}
	requestAnimationFrame(tick);
}
