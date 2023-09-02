"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const file_io_1 = require("./src/file_io");
const rendering_1 = require("./src/rendering");
for (let type of ["wiki", "sheet"]) {
    let files = fs_1.default.readdirSync(`./data/${type}_source/`);
    for (let name of files) {
        const c = (0, file_io_1.readArticle)(type, name);
        const metadata = {
            "type": type,
            "article-type": "",
            "headings": [],
            "born": "",
            "died": "",
            "images": []
        };
        const source = (0, file_io_1.parseRawArticle)(c, metadata);
        const rendered = (0, rendering_1.renderArticle)(source, metadata);
        (0, file_io_1.saveArticle)(type, name, rendered);
    }
}
