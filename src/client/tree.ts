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
    element("canvas-container")!.appendChild(canvas);
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
    renderNode();
}

function renderNode() {

}

function getNodePosition(root: string, parentalDirection: string): Vector2 {
    return { x: 0, y: 0 };
}

const HEADER = element("header");

const CANVAS = createCanvas("tree-canvas");
const ctx = CANVAS.getContext("2d");

setInterval(() => {
    render();
}, 1000);

