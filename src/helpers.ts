
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

/**
 * Gets the element from the given collection with the smallest value returned by {@link getValue}.
 * If the collection is empty, returns undefined.
 */
export function minBy<T>(collection: Iterable<T>, getValue: { (item: T): number }): T | undefined {
    let bestValue = Number.MAX_VALUE;
    let bestItem: T = undefined;

    for (let item of collection) {
        const value = getValue(item);

        if (value < bestValue) {
            bestValue = value;
            bestItem = item;
        }
    }

    return bestItem;
}

/**
 * Gets the element from the given collection with the largest value returned by {@link getValue}.
 * If the collection is empty, returns undefined.
 */
export function maxBy<T>(collection: Iterable<T>, getValue: { (item: T): number }): T | undefined {
    let bestValue = -Number.MAX_VALUE;
    let bestItem: T = undefined;

    for (let item of collection) {
        const value = getValue(item);

        if (value > bestValue) {
            bestValue = value;
            bestItem = item;
        }
    }

    return bestItem;
}