const fs = require("fs");

function readArticle(type, name) {
    const contents = fs.readFileSync(`./data/${type}_source/${name}`);
    return contents.toString();
}

function isArray(x) {
    return x.constructor.name === "Array";
}

function createInlineElement(q, v, metadata) {
    if (q === "text") {
        const obj = { "type": "element", "tag": "p", "inner": v };
        return obj;
    }
    else if (isArray(q) && q[0] === "h") {
        const obj = { "type": "element", "tag": `h${q[1]}`, "inner": v, "id": v, "class": "title" };
        if (q[1] === 1) {
            metadata.headings.push(v);
        }
        return obj;
    }
    else if (isArray(q) && q[0] === "obj") {
        obj = JSON.parse(v);
        return obj;
    }
}

function parseRawArticle(raw, metadata) {
    const parsed = new Array();
    // "sol" stands for "start of line"
    let q = "sol"
    let v = "";
    for (let i = 0; i < raw.length; i++) {
        let c = raw[i];
        if (c === "\n") {
            if (q === "text" || isArray(q) && q[0] === "h") {
                if (v !== "") {
                    parsed.push(createInlineElement(q, v, metadata));
                }
                q = "sol";
                v = "";
            }
        }
        else if (q === "sol") {
            if (c === "#") {
                q = ["h", 1];
            }
            else if (c === "{") {
                q = ["obj", 1]
                v = v + c;
            }
            else {
                q = "text";
                v = v + c;
            }
        }
        else if (isArray(q) && q[0] === "obj") {
            if (c === "{") {
                q[1] = q[1] + 1;
                v = v + c;
            }
            else if (c === "}") {
                q[1] = q[1] - 1;
                v = v + c;
                if (q[1] === 0) {
                    parsed.push(createInlineElement(q, v, metadata));
                    q = "text";
                    v = "";
                }
            }
            else {
                v = v + c;
            }
        }
        else if (q === "text") {
            if (c == "{") {
                parsed.push(createInlineElement(q, v, metadata));
                q = ["obj", 1];
                v = c;
            }
            else {
                v = v + c;
            }
        }
        else if (isArray(q) && q[0] === "h") {
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

function saveArticle(type, name, content) {
    fs.writeFileSync(`./${type}/${name}.html`, content);
}

module.exports = {
    parseRawArticle,
    readArticle,
    saveArticle
};
