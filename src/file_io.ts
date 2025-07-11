/*
**  Talorgan - A program for creating family encyclopedias
**  Copyright (C) 2023-2025 Jack J. Miller
**  Licensed under version 3 of the GNU General Public License
*/

import fs from "fs";
import { regexMatchArticles, throwError } from "./functions";
import { BuildConfiguration, BuildData, InfoTag, InlineElement, Metadata } from "./interfaces";
import { validateInfoTag } from "./validation";

export function loadBuildConfiguration(projectDirectory: string, buildName: string): BuildConfiguration {

    // check that build actually exists
    if (!fs.existsSync(`data/builds/${buildName}.json`)) {
        throwError(`There is no build called '${buildName}'.`, "BUILD");
    }

    // load build config
    let config = require(`${projectDirectory}/data/builds/${buildName}.json`);

    // determine which articles are to be compiled
    config.members = regexMatchArticles(config.members);

    // save list of all articles included in project, compiled or omitted
    config.allArticles = fs.readdirSync("data/wiki_source/");

    return config;

}

export function packageBuild(buildData: BuildData) {

    // copy all images included in build into the `media` directory
    for (let imageName of buildData.imagesRendered) {
        fs.copyFileSync(`media/${imageName}`, `build/media/${imageName}`);
    }

    // copy all sources included in build into the `sources` directory
    for (let source of buildData.sourcesCited) {
        if (fs.existsSync(`sources/${source}`)) {
            fs.copyFileSync(`sources/${source}`, `build/sources/${source}`);
        }
    }

}

export function readArticle(buildData: BuildData): string {
    const contents = fs.readFileSync(`./data/${buildData.filetype}_source/${buildData.filename}`);
    return contents.toString();
}

export function createInlineElement(q: any[], v: string, metadata: Metadata, buildData: BuildData): InlineElement {

    // return standard text
    if (q[0] === "text") {
        const obj = { "type": "element", "tag": "p", "inner": v };
        return obj;
    }

    // record and return heading
    else if (q[0] === "h") {
        const obj = { "type": "element", "tag": `h${q[1]}`, "inner": v, "id": v, "class": "title" };
        if (q[1] === 1) {
            metadata.headings.push(v);
        }
        return obj;
    }

    else {
        throwError("Talorgan contains a bug.", buildData.location, buildData);
        return { "type": "element", "tag": "p", "inner": "" };
    }
}

export function savePage(path: string, content: string) {
    fs.writeFileSync(`./build/${path}`, content);
}
