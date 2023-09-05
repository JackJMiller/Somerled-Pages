/*
**  Somerled Pages - A program for creating family encyclopedias
**  Copyright (C) 2023 Jack J. Miller
**  Licensed under version 3 of the GNU General Public License
*/

import { BuildData, InlineElement, Metadata } from "./interfaces";
import { throwError } from "./functions";

const fs = require("fs");

export function readArticle(buildData: BuildData): string {
    const contents = fs.readFileSync(`./data/${buildData.filetype}_source/${buildData.filename}`);
    return contents.toString();
}

export function createInlineElement(q: any[], v: string, metadata: Metadata, buildData: BuildData): InlineElement {
    if (q[0] === "text") {
        const obj = { "type": "element", "tag": "p", "inner": v };
        return obj;
    }
    else if (q[0] === "h") {
        const obj = { "type": "element", "tag": `h${q[1]}`, "inner": v, "id": v, "class": "title" };
        if (q[1] === 1) {
            metadata.headings.push(v);
        }
        return obj;
    }
    else {
        throwError("Somerled Pages contains a bug.", buildData);
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
                    const obj = JSON.parse(v) as InlineElement;
                    if (obj["type"] === "info") {
                        metadata["info"] = obj;
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

export function saveArticle(type: string, name: string, content: string) {
    fs.writeFileSync(`./build/${type}/${name}.html`, content);
}
