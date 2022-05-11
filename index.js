const PDFMerger = require("pdf-merger-js");
const { PdfReader } = require("pdfreader");
const path = require("path");
const arg = require("arg");

const pdfSorter = new PDFMerger();
const pdfReader = new PdfReader();

const { _: files } = arg({});

const makeArray = (length, offset = 1) =>
  [...new Array(length)].map((_, i) => i + offset);

const timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getPageNumbers = (pagesTotal) => {
  const fronts = makeArray(pagesTotal).slice(0, pagesTotal / 2);
  const backs = makeArray(pagesTotal)
    .slice(pagesTotal / 2)
    .reverse();

  const merged = fronts.map((f, i) => [f, backs[i]]).flat();
  return merged;
};

(async () => {
  files.forEach(async (filePath) => {
    let pagesTotal = 0;
    pdfReader.parseFileItems(filePath, (err, item) => {
      pagesTotal++;
    });
    pagesTotal -= 2;

    await timeout(1000);

    if (pagesTotal % 2 === 1) {
      throw new Error("Number of pages must be even");
    }

    const { name, base } = path.parse(filePath);
    const targetPath = filePath.replace(base, `${name}-unduplexed.pdf`);

    const order = getPageNumbers(pagesTotal);
    console.log(
      `${base}: Writing ${order.length} pages like: ${JSON.stringify(order)}`
    );

    pdfSorter.add(filePath, order);
    await pdfSorter.save(targetPath);
  });
})();
