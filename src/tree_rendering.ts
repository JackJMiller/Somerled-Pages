/*
**  Somerled Pages - A program for creating family encyclopedias
**  Copyright (C) 2023-2024 Jack J. Miller
**  Licensed under version 3 of the GNU General Public License
*/

import { Tree, TreeNode } from "./interfaces";

interface NodePlacement {
    id: string,
    x: number,
    y: number
}

interface NodePlacements {
    [index: string]: NodePlacement
}

// TODO: modularise and move html-rendering to html_rendering
export function renderTreeHTML(tree: Tree): string {
    let currentNode = tree.nodes[tree.ROOT_NODE];
    const nodes = getNodeRelativePositions(tree, tree.ROOT_NODE, "");
    // TODO: modularise this
    let layers = 0;
    for (let node of nodes) {
        if (node.y > layers) layers = node.y;
    }
    const treeWidth = 1200;
    const treeHeight = 800;
    let output = `<div style="display: block; width: ${treeWidth}px; height: ${treeHeight}px;">`;
    for (let node of nodes) {
        output = output + renderFamilyTreeNode(node, layers, treeWidth, treeHeight);
    }
    output = output + "</div>"
    return output;
}

export function getNodeRelativePositions(tree: Tree, root: string, parentalDirection: string): NodePlacement[] {
    let nodes = [];
    let x = 0;
    let d = 1
    for (let char of parentalDirection) {
        d *= 0.5;
        x = (char === "M" ? x - d : x + d);
    }
    nodes.push({ id: root, x, y: parentalDirection.length });
    if (!Object.keys(tree.nodes).includes(root)) {
        return nodes;
    }
    const currentNode = tree.nodes[root];
    if (currentNode.connections["Mother"]) {
        nodes = nodes.concat(getNodeRelativePositions(tree, currentNode.connections["Mother"], parentalDirection + "M"))
    }
    if (currentNode.connections["Father"]) {
        nodes = nodes.concat(getNodeRelativePositions(tree, currentNode.connections["Father"], parentalDirection + "F"))
    }
    return nodes;
}

function renderFamilyTreeNode(node: NodePlacement, layers: number, treeWidth: number, treeHeight: number): string {
    const layer = layers - node.y;
    return `
        <div style="font-size: ${2 * Math.pow(0.5, node.y)}rem; position: absolute; top: ${(Math.pow(0.5, node.y)) * treeHeight}px; left: ${treeWidth * (node.x / 2 + 1)}px; display: block; background: yellow; transform: translateX(-50%);">
            <h1>${node.id}</h1>
            <h2>D.O.B - D.O.D</h2>
        </div>
`;
}
