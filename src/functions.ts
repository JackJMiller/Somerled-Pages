/*
**  Somerled Pages - A program for creating family encyclopedias
**  Copyright (C) 2023-2024 Jack J. Miller
**  Licensed under version 3 of the GNU General Public License
*/

import fs from "fs";
import { FULL_BUILD, TREE_CONNECTORS } from "./constants";
import { packageBuild, parseRawArticle, readArticle, saveArticle } from "./file_io";
import { BuildData, InfoBox, InfoElement, Metadata, PageData, ProjectPackage, Reference, TreeNode } from "./interfaces";
import { RefListing } from "./ref_listing_interfaces";
import { renderArticle } from "./rendering";
import { renderTreeHTML } from "./tree_rendering";

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
    fs.writeFileSync("tree_nodes.json", JSON.stringify(buildData.tree, null, 4) + "\n");
    renderAndSaveHomepage(buildData);
    packageBuild(buildData);
}

function renderAndSaveHomepage(buildData: BuildData) {
    const treeRendered = renderTreeHTML(buildData.tree);
    let rendered = `
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width" />
        <title>Somerled Pages</title>
    </head>
    <body>
        ${treeRendered}
    </body>
</html>
`
    fs.writeFileSync("tree.html", rendered);
}

function renderAndSaveArticle(filetype: string, filename: string, buildData: BuildData) {
    const c = readArticle(buildData);
    const metadata = createInitialMetadata(filetype, filename);
    const source = parseRawArticle(c, metadata, buildData);
    const rendered = renderArticle(source, metadata, buildData);
    buildData.pageData[`${filetype}/${filename}`] = createPageData(filetype, filename, metadata);
    buildData.tree.nodes[filename] = createTreeNode(metadata.infobox.entries);
    saveArticle(filetype, filename, rendered);
}

function createPageData(filetype: string, filename: string, metadata: Metadata): PageData {
    return {
        name: metadata.name,
        born: metadata.born,
        died: metadata.died
    };
}

function createEmptyInfobox(): InfoBox {
    return {
        "type": "infobox",
        "image": "silhouette.png",
        "image-caption": "",
        "entries": {
        }
    }
}

export function createInfoObject(): InfoElement {
    return {
        "name": "",
        "born": "",
        "died": "",
        "subtitle": "",
        "article-type": "",
        "images": []
    };
}

export function createInitialMetadata(name: string, type: string): Metadata {
    return {
        "infobox": createEmptyInfobox(),
        "infobox-rendered": "",
        "info": createInfoObject(),
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
    if (buildName !== "full" && !fs.existsSync(`data/builds/${buildName}.json`)) {
        throwError(`There is no build called '${buildName}'.`, "build_configurations.json");
    }
    const buildConfiguration = (buildName === "full" ? FULL_BUILD : require(`${projectDirectory}/data/builds/${buildName}.json`));
    if (buildName === "full") {
        buildConfiguration.members = fs.readdirSync("data/wiki_source/");
    }
    const projectPackage = require(`${projectDirectory}/somerled-package.json`);
    const buildData = createBuildData(projectDirectory, projectPackage, quickReferences, buildName, buildConfiguration);
    return buildData;
}

export function createBuildData(projectDirectory: string, projectPackage: ProjectPackage, quickReferences: { [index: string]: Reference }, name: string, configuration: any): BuildData {
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
        tree: { ROOT_NODE: configuration.root, nodes: {} }, // TEMP: remove
        errors: 0,
        uniqueErrorFiles: [],
        warnings: 0,
        uniqueWarningFiles: [],
        pageData: {},
        imagesRendered: [],
        sourcesCited: []
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

export function createTreeNode(nodeConnections: any): TreeNode {
    // TODO: make this nicer
    const connections: any = {};
    const keys = Object.keys(nodeConnections);
    for (let key of keys) {
        if (TREE_CONNECTORS.includes(key) && isLink(nodeConnections[key])) {
            connections[key] = getLinkTarget(nodeConnections[key]);
        }
    }
    return { connections };
}

export function isLink(string: string): boolean {
    return (string.length >= 4 && string.slice(0,2) === "[[" && string.slice(-2) === "]]");
}

export function getLinkTarget(string: string) {
    // TODO: generalise all this link rubbish
    if (isLink(string)) string = string.slice(2, -2);
    const contentValues = string.split("|");
    return contentValues[1];
}

export function markImage(imageName: string, buildData: BuildData) {
    buildData.imagesRendered.push(imageName);
    if (!fs.existsSync(`media/${imageName}`)) {
        throwError(`Cannot find image '${imageName}'.`, buildData.location);
    }
}
