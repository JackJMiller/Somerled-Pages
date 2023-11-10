/*
**  Somerled Pages - A program for creating family encyclopedias
**  Copyright (C) 2023 Jack J. Miller
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

export function renderTreeHTML(tree: Tree): string {
    // console.log(tree);
    let currentNode = tree.nodes[tree.ROOT_NODE];
    console.log(currentNode);
    const nodes = getNodeRelativePositions(tree, tree.ROOT_NODE, "");
    console.log("DONE");
    console.log(nodes);
    return "";
}

export function getNodeRelativePositions(tree: Tree, root: string, parentalDirection: string): NodePlacement[] {
    console.log("Soooo");
    console.log(root);
    let nodes = [];
    let x = 0;
    let d = 1
    for (let char of parentalDirection) {
        console.log(char);
        d *= 0.5;
        x = (char === "M" ? x - d : x + d);
    }
    nodes.push({ id: root, x, y: parentalDirection.length });
    if (!Object.keys(tree.nodes).includes(root)) {
        return nodes;
    }
    const currentNode = tree.nodes[root];
    console.log(currentNode);
    if (currentNode.connections["Mother"]) {
        nodes = nodes.concat(getNodeRelativePositions(tree, currentNode.connections["Mother"], parentalDirection + "M"))
    }
    if (currentNode.connections["Father"]) {
        nodes = nodes.concat(getNodeRelativePositions(tree, currentNode.connections["Father"], parentalDirection + "F"))
    }
    console.log("returning");
    console.log(nodes);
    return nodes;
};
