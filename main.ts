/*
**  Somerled Pages - A program for creating family encyclopedias
**  Copyright (C) 2023-2024 Jack J. Miller
**  Licensed under version 3 of the GNU General Public License
*/

import { build, initialiseBuildData } from "./src/functions";
import { colourString, createBuildData, createInitialMetadata, shouldBeBuilt, throwError, updateBuildData } from "./src/functions";

const PROJECT_DIRECTORY = process.argv[2];
const ARGS = process.argv.slice(3);

if (ARGS[0] === "build") {

    let buildName = ARGS[1];

    const START = Date.now();

    let buildData = initialiseBuildData(PROJECT_DIRECTORY, buildName);

    build(buildData);

    const END = Date.now();
    let elapsed = (END - START) / 1000;

    if (buildData.errors === 0) {
        console.log(`${colourString("BUILD SUCCESSFUL:", 32, true)} Completed in ${elapsed} seconds${buildData.warnings === 0 ? "" : ` (${buildData.warnings} warnings)`}`);
        process.exit(0);
    }
    else {
        console.log(`${colourString("BUILD UNSUCCESSFUL:", 31, true)} ${buildData.errors} errors${buildData.uniqueErrorFiles.length > 1 ? ` across ${buildData.uniqueErrorFiles.length} files` : ""}`);
        process.exit(1);
    }
}

