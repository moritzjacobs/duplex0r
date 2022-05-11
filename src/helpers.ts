export const makeArray = (length: number, offset = 1) =>
	[...new Array(length)].map((_, i) => i + offset);

export const timeout = async (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms));
