/*
**  Somerled Pages - A program for creating family encyclopedias
**  Copyright (C) 2023 Jack J. Miller
**  Licensed under version 3 of the GNU General Public License
*/

import { BuildData, InfoBox, Metadata } from "./interfaces";
import { RefListing } from "./ref_listing_interfaces";

export function createEmptyInfobox(): InfoBox {
    return {
        "type": "infobox",
        "image": "silhouette.png",
        "image-caption": "",
        "entries": {
        }
    }
}

export function createInitialMetadata(name: string, type: string): Metadata {
    return {
        "infobox": createEmptyInfobox(),
        "infobox-rendered": "",
        "info": {},
        "type": type,
        "name": name,
        "article-type": "",
        "headings": [],
        "born": "",
        "died": "",
        "images": []
    };
}

export function colourString(string: string, colourCode: number, bold: boolean = false) {
    const isBold = bold ? 1 : 0;
    return `\x1b[${isBold};${colourCode}m${string}\x1b[0m`;
}

export function throwError(message: string, location: string, buildData: BuildData | null = null, exitProgram: boolean = true) {
    console.log(`${location}: ${colourString("ERROR:", 31, true)} ${message}`);
    if (buildData) {
        buildData.errors++;
        if (!buildData.uniqueErrorFiles.includes(buildData.location)) {
            buildData.uniqueErrorFiles.push(buildData.location);
        }
    }
    if (exitProgram) process.exit(1);
}

export function recordRefListing(element: RefListing, buildData: BuildData) {
    buildData.inDocumentRefListings[element["id"]] = element;
}

export function createBuildData(name: string, configuration: any): BuildData {
    return {
        name: name,
        configuration: configuration,
        filetype: "",
        filename: "",
        location: "",
        citations: [],
        inDocumentRefListings: {},
        errors: 0,
        uniqueErrorFiles: [],
        warnings: 0,
        uniqueWarningFiles: []
    };
}

export function updateBuildData(buildData: BuildData, filetype: string, filename: string) {
    buildData.filetype = filetype;
    buildData.filename = filename;
    buildData.location = `data/${buildData.filetype}/${buildData.filename}`;
    buildData.citations = [];
    buildData.inDocumentRefListings = {};
}

export function shouldBeBuilt(filetype: string, filename: string, buildData: BuildData): boolean {
    if (buildData.name === "full") return true;
    else if (buildData.configuration.members.includes(filename)) return true;
    else return false;
}
