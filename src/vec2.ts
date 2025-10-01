export type Vec2 = [number, number];

export function vec2(x: number, y: number): Vec2 {
	return [x, y];
}

export function add([ax, ay]: Vec2, [bx, by]: Vec2): Vec2 {
	return [ax + bx, ay + by];
}

export function equals([ax, ay]: Vec2, [bx, by]: Vec2): boolean {
	return ax === bx && ay === by;
}

export function wrap([x, y]: Vec2, min: Vec2, max: Vec2): Vec2 {
	const width = max[0] - min[0];
	const height = max[1] - min[1];
	return [(x + width) % width, (y + height) % height];
}
