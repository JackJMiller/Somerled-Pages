/*
**  Somerled Pages - A program for creating family encyclopedias
**  Copyright (C) 2023 Jack J. Miller
**  Licensed under version 3 of the GNU General Public License
*/

import fs from "fs";
import { parseRawArticle, readArticle, saveArticle } from "./src/file_io";
import { colourString, createBuildData, createEmptyInfobox, createInitialMetadata, updateBuildData } from "./src/functions";
import { renderArticle } from "./src/rendering";

const start = Date.now();
const buildData = createBuildData();

for (let filetype of ["wiki", "sheet"]) {
    let files = fs.readdirSync(`./data/${filetype}_source/`);
    for (let filename of files) {
        updateBuildData(buildData, filetype, filename);
        const c = readArticle(buildData);
        const metadata = createInitialMetadata(filetype, filename);
        const source = parseRawArticle(c, metadata, buildData);
        const rendered = renderArticle(source, metadata, buildData);
        saveArticle(filetype, filename, rendered);
    }
}

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
