/*
**  Somerled Pages - A program for creating family encyclopedias
**  Copyright (C) 2023-2024 Jack J. Miller
**  Licensed under version 3 of the GNU General Public License
*/

function createCanvas(id: string): HTMLCanvasElement {
    let canvas: HTMLCanvasElement = document.createElement("canvas");
    canvas.id = id;
    canvas.width = document.body.clientWidth;
    canvas.height = window.innerHeight - HEADER!.clientHeight;
    // element("canvas-container")!.appendChild(canvas);
    return canvas;
}

function fixCanvas() {
    CANVAS.width = document.body.clientWidth;
    CANVAS.height = window.innerHeight - HEADER!.clientHeight;
}

function render() {
    fixCanvas();
    renderTree("Jack_Miller");
}

function renderTree(id: string) {
    let currentNode = CLIENT_TREE.nodes[CLIENT_TREE.ROOT_NODE];
    treeElement!.innerHTML = renderUnit(id, 2, true);
}

function renderUnit(id: string, depth: number, renderSiblings: boolean): string {

    let pageData = BUILD_SHEET.pageData[id];

    let motherID = (pageData) ? pageData.mother : "";
    let fatherID = (pageData) ? pageData.father : "";

    let output = htmlString(`
        <div id="tree-${id}-siblings" class="unit-bottom">
            ${renderSiblingsRow(id, renderSiblings)}
        </div>
    `);

    if (depth > 0) {
        output = htmlString(`
            <div id="tree-${id}-parents" class="unit-top">
                ${renderUnit(motherID, depth - 1, false)}
                ${renderUnit(fatherID, depth - 1, false)}
            </div>
        `) + output;
    }

    return htmlString(`<div class="tree-unit">${output}</div>`);

}

function renderSiblingsRow(id: string, renderSiblings: boolean): string {

    // TEMP
    let younger: string[] = (renderSiblings) ? BUILD_SHEET.pageData[id].siblings : [];
    let older: string[] = (renderSiblings) ? [] : [];

    return htmlString(`
        <div style="margin: auto; width: fit-content; display: grid; grid-gap: 1rem; grid-template-columns: ${"1fr ".repeat(1 + younger.length + older.length)};">
            ${renderTreeNodes(younger)}
            ${renderTreeNode(id)}
            ${renderTreeNodes(older)}
        </div>
    `);

}

function renderTreeNode(id: string): string {

    let pageData = BUILD_SHEET.pageData[id];

    if (!pageData) {
        if (id) {
            return htmlString(`
                <button class="tree-node">
                    <h1>${id}</h1>
                    <h2>Unknown — Unknown</h2>
                </button>
            `);
        }
        else {
            return htmlString(`
                <button class="tree-node empty-tree-node">
                    <h1>${id}</h1>
                    <h2>Unknown — Unknown</h2>
                </button>
            `);

        }
    }

    return htmlString(`
        <button onclick="renderTree('${id}')" class="tree-node">
            <h1>${pageData.name}</h1>
            <h2>${pageData.born} — ${pageData.died}</h2>
        </button>
    `);

}

function renderTreeNodes(ids: string[]): string {
    return ids.map((id: string) => renderTreeNode(id)).join("");
}

function getNodePosition(root: string, parentalDirection: string): Vector2 {
    return { x: 0, y: 0 };
}

const HEADER = element("header");

const CANVAS = createCanvas("tree-canvas");
const ctx = CANVAS.getContext("2d");
const treeElement = element("tree");

render();
