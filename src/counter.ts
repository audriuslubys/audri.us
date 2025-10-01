export function createCounter(tick: number): (delta: number) => boolean {
	let count = 0;

	return function advance(delta: number): boolean {
		count += delta;
		if (count >= tick) {
			count = 0;
			return true;
		}
		return false;
	};
}
