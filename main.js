const fs = require("fs");

const { parseRawArticle, readArticle, saveArticle } = require("./file_io");
const { renderArticle } = require("./rendering");

// add "sheet" back into the types when you wish to use them again
// remember to return the rm sheet/* command in the bash script
for (let type of ["wiki", "sheet"]) {
    let files = fs.readdirSync(`./data/${type}_source/`);
    for (let name of files) {
        const c = readArticle(type, name);
        const metadata = {
            "type": type,
            "article-type": "",
            "headings": [],
            "born": "",
            "died": "",
            "images": []
        };
        const source = parseRawArticle(c, metadata);
        const rendered = renderArticle(source, metadata);
        saveArticle(type, name, rendered);
    }
}
