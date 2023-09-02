import { Metadata } from "./interfaces";

const fs = require("fs");

export function readArticle(type: string, name: string): string {
    const contents = fs.readFileSync(`./data/${type}_source/${name}`);
    return contents.toString();
}

export function createInlineElement(q: any, v: string, metadata: Metadata): any {
    if (q[0] === "text") {
        const obj = { "type": "element", "tag": "p", "inner": v };
        return obj;
    }
    else if (q.constructor.name === "Array" && q[0] === "h") {
        const obj = { "type": "element", "tag": `h${q[1]}`, "inner": v, "id": v, "class": "title" };
        if (q[1] === 1) {
            metadata.headings.push(v);
        }
        return obj;
    }
    else if (q.constructor.name === "Array" && q[0] === "obj") {
        const obj = JSON.parse(v);
        return obj;
    }
}

export function parseRawArticle(raw: string, metadata: Metadata): any[] {
    const parsed = new Array();
    // "sol" stands for "start of line"
    let q: any[] = ["sol"];
    let v = "";
    for (let i = 0; i < raw.length; i++) {
        let c = raw[i];
        if (c === "\n") {
            if (q[0] === "text" || q[0] === "h") {
                if (v !== "") {
                    parsed.push(createInlineElement(q, v, metadata));
                }
                q = ["sol"];
                v = "";
            }
        }
        else if (q[0] === "sol") {
            if (c === "#") {
                q = ["h", 1];
            }
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
                    parsed.push(createInlineElement(q, v, metadata));
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
                parsed.push(createInlineElement(q, v, metadata));
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
        parsed.push(createInlineElement(q, v, metadata));
    }

    return parsed;
}

export function saveArticle(type: string, name: string, content: string) {
    fs.writeFileSync(`./${type}/${name}.html`, content);
}
