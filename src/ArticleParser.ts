import { createInlineElement } from "./file_io";
import { BuildData, InfoTag, InlineElement, Metadata } from "./interfaces";
import { validateInfoTag } from "./validation";

/*
** ArticleParser is a basic state machine that goes through a markup file and
** parses it by separating the objects and the plaintext. It uses a basic state
** machine.
*/

class ArticleParser {

    // q denotes the current state
    // - ["sol"] denotes the start of a line
    // - ["h", 1] denotes <h1>; ["h", 2] denotes <h2>; etc.
    // - ["text"] denotes plaintext; <p> in the case of HTML output
    // - ["{", 1] denotes an object; ["{", 2] denotes an object within an
    //   object; etc.
    private q: any[] = ["sol"];

    // v denotes the value of the elements; innerHTML in the case of HTML output

    private v: string = "";
    private buildData: BuildData;
    private metadata: Metadata;

    // array containing the elements extracted from the markup
    public parsed: InlineElement[] = new Array();

    constructor(raw: string, metadata: Metadata, buildData: BuildData) {
        this.metadata = metadata;
        this.buildData = buildData;
        this.parseRawArticle(raw, this.metadata, this.buildData);
    }

    private parseRawArticle(raw: string, metadata: Metadata, buildData: BuildData): void {

        // iterate through the markup file to parse it
        for (let i = 0; i < raw.length; i++) {
            let c = raw[i];
            if (c === "\n") {
                this.handleNewLine();
            }
            else if (this.q[0] === "sol") {
                // hash symbol at the start of a line denotes a heading
                if (c === "#") {
                    this.q = ["h", 1];
                }
                // curly brackets contain elements
                // TODO: respond to break characters e.g. backslash
                else if (c === "{") {
                    this.q = ["obj", 1]
                    this.v = this.v + c;
                }
                else {
                    this.q = ["text"];
                    this.v = this.v + c;
                }
            }
            else if (this.q[0] === "obj") {
                if (c === "{") {
                    this.q[1] = this.q[1] + 1;
                    this.v = this.v + c;
                }
                else if (c === "}") {
                    this.q[1] = this.q[1] - 1;
                    this.v = this.v + c;
                    if (this.q[1] === 0) {
                        const obj = JSON.parse(this.v);
                        if (obj["type"] === "info") {
                            this.metadata["info"] = obj as InfoTag;
                            validateInfoTag(this.metadata["info"], this.metadata, this.buildData);
                        }
                        else {
                            this.parsed.push(obj as InlineElement);
                        }
                        this.q = ["text"];
                        this.v = "";
                    }
                }
                else {
                    this.v = this.v + c;
                }
            }
            else if (this.q[0] === "text") {
                if (c == "{") {
                    this.parsed.push(createInlineElement(this.q, this.v, this.metadata, this.buildData));
                    this.q = ["obj", 1];
                    this.v = c;
                }
                else {
                    this.v = this.v + c;
                }
            }
            else if (this.q[0] === "h") {
                if (c === "#") {
                    this.q[1] = this.q[1] + 1;
                }
                else if (c !== " " || this.v !== "") {
                    this.v = this.v + c;
                }
            }
        }

        if (this.v !== "") {
            this.parsed.push(createInlineElement(this.q, this.v, this.metadata, this.buildData));
        }

    }

    private handleNewLine(): void {
        // if holding text then newline marks the end of a paragraph
        if (this.q[0] === "text" || this.q[0] === "h") {
            // add a text element if text is being held
            if (this.v !== "") {
                this.parsed.push(createInlineElement(this.q, this.v, this.metadata, this.buildData));
            }
            this.q = ["sol"];
            this.v = "";
        }
    }

}

export = ArticleParser;
