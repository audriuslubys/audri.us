import type { System } from "./app";
import { vec2 } from "./vec2";

export interface Input {
	justPressed(key: string): boolean;
	justPressed(keys: string[]): boolean;
	pressed(key: string): boolean;
}

export function createInputSystem(): [Input, System] {
	let justPressedKeys = new Set<string>();
	const pressedKeys = new Set<string>();

	const justPressedRegistry = new Set<string>();

	window.addEventListener("keydown", (event) => {
		justPressedRegistry.add(event.key);
		pressedKeys.add(event.key);
	});

	window.addEventListener("keyup", (event) => {
		pressedKeys.delete(event.key);
	});

	let touchStart = vec2(0, 0);
	let isTouching = false;
	const minSwipeDistance = 15;
	const maxTapDistance = 10;

	window.addEventListener("touchstart", (event) => {
		touchStart = vec2(event.touches[0].clientX, event.touches[0].clientY);
		isTouching = true;
	});

	window.addEventListener("touchend", (event) => {
		if (isTouching) {
			const touchEnd = vec2(
				event.changedTouches[0].clientX,
				event.changedTouches[0].clientY
			);

			const deltaX = touchEnd[0] - touchStart[0];
			const deltaY = touchEnd[1] - touchStart[1];
			const totalDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

			if (totalDistance >= minSwipeDistance) {
				const absDeltaX = Math.abs(deltaX);
				const absDeltaY = Math.abs(deltaY);

				if (absDeltaX > absDeltaY) {
					if (deltaX > 0) {
						justPressedRegistry.add("SwipeRight");
					} else {
						justPressedRegistry.add("SwipeLeft");
					}
				} else {
					if (deltaY > 0) {
						justPressedRegistry.add("SwipeDown");
					} else {
						justPressedRegistry.add("SwipeUp");
					}
				}
			} else if (totalDistance <= maxTapDistance) {
				justPressedRegistry.add("Tap");
			}

			isTouching = false;
		}
	});

	function inputSystem() {
		justPressedKeys = new Set(justPressedRegistry);
		justPressedRegistry.clear();
	}

	const input: Input = {
		justPressed(keys) {
			if (Array.isArray(keys)) {
				return keys.some((key) => justPressedKeys.has(key));
			}
			return justPressedKeys.has(keys);
		},
		pressed(key) {
			return pressedKeys.has(key);
		},
	};

	return [input, inputSystem];
}
