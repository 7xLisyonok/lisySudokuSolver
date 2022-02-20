// TODO: Привести в соответствие с Random.js, исопльзовать там же
export function createRange(from: number, to: number) {
    const length = to - from + 1;
    return Array.from({ length }, (x, i) => i + from);
}

export function createRangeSet(from: number, to: number) {
    return new Set(createRange(from, to));
}