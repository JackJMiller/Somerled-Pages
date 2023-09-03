/*
**  Somerled Pages - A program for creating family encyclopedias
**  Copyright (C) 2023 Jack J. Miller
**  Licensed under version 3 of the GNU General Public License
*/

import fs from "fs";
import { parseRawArticle, readArticle, saveArticle } from "./src/file_io";
import { colourString, createBuildData, createEmptyInfobox, createInitialMetadata } from "./src/functions";
import { renderArticle } from "./src/rendering";

const start = Date.now();

for (let filetype of ["wiki", "sheet"]) {
    let files = fs.readdirSync(`./data/${filetype}_source/`);
    for (let filename of files) {
        const buildData = createBuildData(filetype, filename);
        const c = readArticle(buildData);
        const metadata = createInitialMetadata(filetype, filename);
        const source = parseRawArticle(c, metadata, buildData);
        const rendered = renderArticle(source, metadata, buildData);
        saveArticle(filetype, filename, rendered);
    }
}

const end = Date.now();
const elapsed = (end - start) / 1000;

console.log(`${colourString("BUILD SUCCESSFUL:", 32, true)} Completed in ${elapsed} seconds`);
