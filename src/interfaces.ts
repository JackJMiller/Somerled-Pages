/*
**  Somerled Pages - A program for creating family encyclopedias
**  Copyright (C) 2023 Jack J. Miller
**  Licensed under version 3 of the GNU General Public License
*/

export interface InfoBox {
    "type": string,
    "image": string,
    "image-caption": string,
    "entries": any
}

export interface Metadata {
    "infobox": InfoBox,
    "infobox-rendered": string,
    "info": any,
    "type": string,
    "name": string,
    "article-type": string,
    "headings": any[],
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

export interface BuildData {
    name: string,
    configuration: any,
    filename: string,
    filetype: string,
    location: string,
    citations: string[],
    projectDirectory: string,
    projectPackage: any,
    quickReferences: any,
    inDocumentRefListings: any,
    errors: number,
    uniqueErrorFiles: string[],
    warnings: number,
    uniqueWarningFiles: string[]
}
