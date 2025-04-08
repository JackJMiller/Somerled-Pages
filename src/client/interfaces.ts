/*
**  Somerled Pages - A program for creating family encyclopedias
**  Copyright (C) 2023-2025 Jack J. Miller
**  Licensed under version 3 of the GNU General Public License
*/

interface BuildSheet {
    pageData: { [index: string]: PageData }
}

interface ClientTree {
    ROOT_NODE: string,
    nodes: { [index: string]: ClientTreeNode }
}

interface ClientTreeNode {
    id: string,
    x: number,
    y: number,
    connections: any
}

interface PageData {
    name: string,
    born: string,
    died: string,
    mother: string,
    father: string
    siblings: string[],
    children: string[],
    imageSrc: string
}

interface SearchQuery {
    "article-name": string[],
    "birth-from": number,
    "birth-to": number,
    "death-from": number,
    "death-to": number
}

interface Vector2 {
    x: number,
    y: number
}
