/*
**  Somerled Pages - A program for creating family encyclopedias
**  Copyright (C) 2023 Jack J. Miller
**  Licensed under version 3 of the GNU General Public License
*/

import { build, initialiseBuildData } from "./src/functions";
import { colourString, createBuildData, createEmptyInfobox, createInitialMetadata, shouldBeBuilt, throwError, updateBuildData } from "./src/functions";

const PROJECT_DIRECTORY = process.argv[2];

const args = process.argv.slice(3);

const start = Date.now();

if (args[0] === "build") {

    const buildName = (args.length === 1 ? "full" : args[1]);
    const buildData = initialiseBuildData(PROJECT_DIRECTORY, buildName);

    build(buildData);

    const end = Date.now();
    const elapsed = (end - start) / 1000;
    if (buildData.errors === 0) {
        console.log(`${colourString("BUILD SUCCESSFUL:", 32, true)} Completed in ${elapsed} seconds${buildData.warnings === 0 ? "" : ` (${buildData.warnings} warnings)`}`);
        process.exit(0);
    }
    else {
        console.log(`${colourString("BUILD UNSUCCESSFUL:", 31, true)} ${buildData.errors} errors${buildData.uniqueErrorFiles.length > 1 ? ` across ${buildData.uniqueErrorFiles.length} files` : ""}`);
        process.exit(1);
    }
}

