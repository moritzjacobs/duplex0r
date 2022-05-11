import path from "path";
import PDFMerger from "pdf-merger-js";
import { PdfReader } from "pdfreader";
import { getPageNumbers } from "./getPageNumbers.js";
import { timeout } from "./helpers.js";

const pdfSorter = new PDFMerger();
const pdfReader = new PdfReader();

export const transformFile = async (filePath: string) => {
	let pagesTotal = 0;

	pdfReader.parseFileItems(filePath, () => {
		pagesTotal++;
	});
	pagesTotal -= 2;

	await timeout(1000);

	if (pagesTotal % 2 === 1) {
		throw new Error("Number of pages must be even");
	}

	const { name, base } = path.parse(filePath);
	const targetPath = filePath.replace(base, `${name}-duplex0r.pdf`);

	const order = getPageNumbers(pagesTotal);

	console.log(
		`${base}: Writing ${order.length} pages like: ${JSON.stringify(order)}`
	);

	pdfSorter.add(
		filePath,
		order.map((n) => n.toString())
	);
	await pdfSorter.save(targetPath);
};
