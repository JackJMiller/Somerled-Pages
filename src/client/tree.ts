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
    ctx!.fillStyle = "#ff00ff";
    ctx!.fillRect(0, 0, CANVAS.width, CANVAS.height);
    renderTree();
}

function renderTree() {
    let currentNode = CLIENT_TREE.nodes[CLIENT_TREE.ROOT_NODE];
    treeContainer!.innerHTML = renderUnit("Jack_Miller", 4);
}

function renderUnit(id: string, depth: number): string {

    let pageData = BUILD_SHEET.pageData[`wiki/${id}`];

    let motherID = (pageData) ? pageData.mother : "";
    let fatherID = (pageData) ? pageData.father : "";

    let output = htmlString(`
        <div id="tree-${id}-siblings" class="unit-bottom">
            ${renderSiblingsRow(id)}
        </div>
    `);

    if (depth > 0) {
        output = htmlString(`
            <div id="tree-${id}-parents" class="unit-top">
                ${renderUnit(motherID, depth - 1)}
                ${renderUnit(fatherID, depth - 1)}
            </div>
        `) + output;
    }

    return htmlString(`<div>${output}</div>`);

}

function renderSiblingsRow(id: string): string {
    return renderTreeNode(id);
}

function renderTreeNode(id: string): string {

    let pageData = BUILD_SHEET.pageData[`wiki/${id}`];

    if (!pageData) return htmlString(`
        <div class="tree-node">
            <h1>ANONYMOUS</h1>
            <h2>Unknown</h2>
        </div>
    `);

    return htmlString(`
        <div class="tree-node">
            <h1>${pageData.name}</h1>
            <h2>${pageData.born} — ${pageData.died}</h2>
        </div>
    `);

}

function getNodePosition(root: string, parentalDirection: string): Vector2 {
    return { x: 0, y: 0 };
}

const HEADER = element("header");

const CANVAS = createCanvas("tree-canvas");
const ctx = CANVAS.getContext("2d");
const treeContainer = element("tree-container");

render();

// setInterval(() => {
//     render();
// }, 1000);
//
