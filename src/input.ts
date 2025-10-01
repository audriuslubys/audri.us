import type { System } from "./app";

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
