import fs from "fs";
import { parseRawArticle, readArticle, saveArticle } from "./src/file_io";
import { createEmptyInfobox, createInitialMetadata } from "./src/functions";
import { renderArticle } from "./src/rendering";

for (let type of ["wiki", "sheet"]) {
    let files = fs.readdirSync(`./data/${type}_source/`);
    for (let name of files) {
        const c = readArticle(type, name);
        const metadata = createInitialMetadata(type, name);
        const source = parseRawArticle(c, metadata);
        const rendered = renderArticle(source, metadata);
        saveArticle(type, name, rendered);
    }
}
