
export function areArrayContentsMatching<T>(a: T[], b: T[]): boolean {
	if (a.length !== b.length) {
		return false;
	}

	for (let item of a) {
		if (!b.includes(item)) {
			return false;
		}
	}

	for (let item of b) {
		if (!a.includes(item)) {
			return false;
		}
	}

	return true;
}
