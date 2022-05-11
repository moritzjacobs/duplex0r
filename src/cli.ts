#!/usr/bin/env node

import arg from "arg";
import { transformFile } from "./transformFile.js";
import { help } from "./help.js";

const { _: files, "--help": showHelp } = arg({
	"--help": Boolean,
	"-h": "--help",
});

(async () => {
	if (showHelp || files.length < 1) {
		help();

		return;
	}

	files.forEach(transformFile);
})();
