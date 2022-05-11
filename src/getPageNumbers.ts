import { makeArray } from "./helpers.js";

export const getPageNumbers = (pagesTotal: number) => {
	const fronts = makeArray(pagesTotal).slice(0, pagesTotal / 2);
	const backs = makeArray(pagesTotal)
		.slice(pagesTotal / 2)
		.reverse();

	const merged: Array<number> = fronts.map((f, i) => [f, backs[i]!]).flat();

	return merged;
};
