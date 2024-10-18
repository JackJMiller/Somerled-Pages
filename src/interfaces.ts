/*
**  Somerled Pages - A program for creating family encyclopedias
**  Copyright (C) 2023-2024 Jack J. Miller
**  Licensed under version 3 of the GNU General Public License
*/

import { RefListing } from "./ref_listing_interfaces";

export interface InfoBox {
    "type": string,
    "image": string,
    "image-caption": string,
    "entries": { [index: string]: any }
}

export interface ImageDefinition {
    "src": string,
    "caption": string
}

export interface InfoElement {
    "name": string,
    "born": string,
    "died": string,
    "subtitle": string,
    "article-type": string,
    "images": ImageDefinition[]
}

export interface Metadata {
    "infobox": InfoBox,
    "infobox-rendered": string,
    "info": InfoElement,
    "type": string,
    "name": string,
    "article-type": string,
    "headings": string[],
    "born": string,
    "died": string,
    "images": any[]
}

export interface InlineElement {
    "type": string,
    "tag": string,
    "inner": string
}

export interface HeaderElement {
    "type": string,
    "tag": string,
    "inner": string,
    "id": string,
    "class": string
}

export interface BuildConfiguration {
    root: string,
    members: string[]
}

export interface PageData {
    name: string,
    born: string,
    died: string
}

export interface BuildData {
    name: string,
    configuration: BuildConfiguration,
    filename: string,
    filetype: string,
    location: string,
    citations: string[],
    projectDirectory: string,
    projectPackage: ProjectPackage,
    quickReferences: any,
    inDocumentRefListings: { [index: string]: RefListing },
    tree: Tree,
    errors: number,
    uniqueErrorFiles: string[],
    warnings: number,
    uniqueWarningFiles: string[],
    pageData: { [index: string]: PageData },
    imagesRendered: string[],
    sourcesCited: string[]
}

export interface ProjectPackage {
    name: string,
    authors: string[],
    contributors: string[]
}

export interface Tree {
    ROOT_NODE: string,
    nodes: TreeNodes
}

export interface TreeNode {
    connections: any
}

export interface TreeNodes {
    [index: string]: TreeNode
}
