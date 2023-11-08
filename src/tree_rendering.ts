/*
**  Somerled Pages - A program for creating family encyclopedias
**  Copyright (C) 2023 Jack J. Miller
**  Licensed under version 3 of the GNU General Public License
*/

import { Tree, TreeNode } from "./interfaces";

interface NodePlacement {
    id: string,
    x: number,
    y: number,
    relativeX: number
}

interface NodePlacements {
    [index: string]: NodePlacement
}

export function renderTreeHTML(tree: Tree): string {
    // console.log(tree);
    let currentNode = tree.nodes[tree.ROOT_NODE];
    console.log(currentNode);
    const nodes = getNodeRelativePositions(tree, tree.ROOT_NODE, 0, 0);
    console.log("DONE");
    console.log(nodes);
    return "";
}

export function getNodeRelativePositions(tree: Tree, root: string, relativeX: number, y: number): NodePlacement[] {
    console.log("Soooo");
    console.log(root);
    let nodes = [];
    nodes.push({ id: root, x: 0, y: 0, relativeX: relativeX });
    if (!Object.keys(tree.nodes).includes(root)) {
        return nodes;
    }
    const currentNode = tree.nodes[root];
    console.log(currentNode);
    if (currentNode.connections["Mother"]) {
        nodes = nodes.concat(getNodeRelativePositions(tree, currentNode.connections["Mother"], -1, y + 1))
    }
    console.log("returning");
    console.log(nodes);
    return nodes;
};
