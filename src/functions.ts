/*
**  Somerled Pages - A program for creating family encyclopedias
**  Copyright (C) 2023 Jack J. Miller
**  Licensed under version 3 of the GNU General Public License
*/

import fs from "fs";
import { BuildData, InfoBox, Metadata } from "./interfaces";
import { parseRawArticle, readArticle, saveArticle } from "./file_io";
import { renderArticle } from "./rendering";
import { RefListing } from "./ref_listing_interfaces";
import { FULL_BUILD } from "./constants";

export function build(buildData: BuildData) {
    for (let filetype of ["wiki", "sheet"]) {
        let files = fs.readdirSync(`./data/${filetype}_source/`);
        for (let filename of files) {
            if (shouldBeBuilt(filetype, filename, buildData)) {
                updateBuildData(buildData, filetype, filename);
                renderAndSaveArticle(filetype, filename, buildData)
            }
        }
    }
}

function renderAndSaveArticle(filetype: string, filename: string, buildData: BuildData) {
    const c = readArticle(buildData);
    const metadata = createInitialMetadata(filetype, filename);
    const source = parseRawArticle(c, metadata, buildData);
    const rendered = renderArticle(source, metadata, buildData);
    saveArticle(filetype, filename, rendered);
}

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

export function initialiseBuildData(projectDirectory: string, buildName: string) {
    const quickReferences = require(`${projectDirectory}/data/quick_references.json`);
    if (!fs.existsSync(`data/builds/${buildName}.json`)) {
        throwError(`There is no build called '${buildName}'.`, "build_configurations.json");
    }
    const buildConfiguration = (buildName === "full" ? FULL_BUILD : require(`${projectDirectory}/data/builds/${buildName}.json`));
    const projectPackage = require(`${projectDirectory}/somerled-package.json`);
    const buildData = createBuildData(projectDirectory, projectPackage, quickReferences, buildName, buildConfiguration);
    return buildData;
}

export function createBuildData(projectDirectory: string, projectPackage: string, quickReferences: any, name: string, configuration: any): BuildData {
    return {
        name,
        configuration,
        filetype: "",
        filename: "",
        location: "",
        citations: [],
        projectDirectory,
        projectPackage,
        quickReferences,
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
