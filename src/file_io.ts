/*
**  Somerled Pages - A program for creating family encyclopedias
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

    // copy all articles rendered in the build into the `wiki` directory
    for (let filename of fs.readdirSync("wiki")) {
        fs.copyFileSync(`wiki/${filename}`, `build/wiki/${filename}`);
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
        throwError("Somerled Pages contains a bug.", buildData.location, buildData);
        return { "type": "element", "tag": "p", "inner": "" };
    }
}

/*
** This function goes through a markup file and parses it by separating the
** objects and the plaintext. It uses a basic state machine.
*/
export function parseRawArticle(raw: string, metadata: Metadata, buildData: BuildData): InlineElement[] {

    // array containing the elements extracted from the markup
    const parsed: InlineElement[] = new Array();

    // q denotes the current state
    // - ["sol"] denotes the start of a line
    // - ["h", 1] denotes <h1>; ["h", 2] denotes <h2>; etc.
    // - ["text"] denotes plaintext; <p> in the case of HTML output
    // - ["{", 1] denotes an object; ["{", 2] denotes an object within an
    //   object; etc.
    let q: any[] = ["sol"];

    // the value of the elements; innerHTML in the case of HTML output
    let v = "";

    // iterate through the markup file to parse it
    for (let i = 0; i < raw.length; i++) {
        let c = raw[i];
        if (c === "\n") {
            // if holding text then newline marks the end of a paragraph
            if (q[0] === "text" || q[0] === "h") {
                // add a text element if text is being held
                if (v !== "") {
                    parsed.push(createInlineElement(q, v, metadata, buildData));
                }
                q = ["sol"];
                v = "";
            }
        }
        else if (q[0] === "sol") {
            // hash symbol at the start of a line denotes a heading
            if (c === "#") {
                q = ["h", 1];
            }
            // curly brackets contain elements
            // TODO: respond to break characters e.g. backslash
            else if (c === "{") {
                q = ["obj", 1]
                v = v + c;
            }
            else {
                q = ["text"];
                v = v + c;
            }
        }
        else if (q[0] === "obj") {
            if (c === "{") {
                q[1] = q[1] + 1;
                v = v + c;
            }
            else if (c === "}") {
                q[1] = q[1] - 1;
                v = v + c;
                if (q[1] === 0) {
                    const obj = JSON.parse(v);
                    if (obj["type"] === "info") {
                        metadata["info"] = obj as InfoTag;
                        validateInfoTag(metadata["info"], metadata, buildData);
                    }
                    else {
                        parsed.push(obj as InlineElement);
                    }
                    q = ["text"];
                    v = "";
                }
            }
            else {
                v = v + c;
            }
        }
        else if (q[0] === "text") {
            if (c == "{") {
                parsed.push(createInlineElement(q, v, metadata, buildData));
                q = ["obj", 1];
                v = c;
            }
            else {
                v = v + c;
            }
        }
        else if (q[0] === "h") {
            if (c === "#") {
                q[1] = q[1] + 1;
            }
            else if (c !== " " || v !== "") {
                v = v + c;
            }
        }
    }

    if (v !== "") {
        parsed.push(createInlineElement(q, v, metadata, buildData));
    }

    return parsed;
}

export function savePage(path: string, content: string) {
    fs.writeFileSync(`./build/${path}`, content);
}
