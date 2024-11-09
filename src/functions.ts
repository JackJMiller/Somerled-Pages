/*
**  Somerled Pages - A program for creating family encyclopedias
**  Copyright (C) 2023-2024 Jack J. Miller
**  Licensed under version 3 of the GNU General Public License
*/

import fs from "fs";
import { TREE_CONNECTORS } from "./constants";
import { loadBuildConfiguration, packageBuild, parseRawArticle, readArticle, savePage } from "./file_io";
import { BuildConfiguration, BuildData, BuildSheet, ErrorNotice, InfoBox, InfoTag, Metadata, PageData, ProjectPackage, Reference, TreeNode } from "./interfaces";
import { RefListing } from "./ref_listing_interfaces";
import { htmlString, renderArticle, renderHomepage, renderSearchPage } from "./rendering";
import { renderTreeHTML } from "./tree_rendering";

export function build(buildData: BuildData) {

    compileArticles(buildData);

    bugCheckBuild(buildData);

    savePage("res/build_sheet.json", JSON.stringify(createBuildSheet(buildData), null, 4) + "\n");

    // savePage("tree_nodes.json", JSON.stringify(buildData.tree, null, 4) + "\n");

    savePage("index.html", renderHomepage(buildData));
    savePage("search.html", renderSearchPage(buildData));

    renderAndSaveTreePage(buildData);
    packageBuild(buildData);

}

function bugCheckBuild(buildData: BuildData) {

    // check that articles listed for inclusion in build exist
    for (let member of buildData.configuration.members) {
        if (!fs.existsSync(`data/wiki_source/${member}`)) {
            throwError(`Article '${member}' referenced in 'members' does not exist.`, `data/builds/${buildData.name}.json`);
        }
    }

    // validate articles listed as features
    for (let feature of buildData.configuration.features) {

        // check that article listed exists
        if (!fs.existsSync(`data/wiki_source/${feature}`)) {
            throwError(`Article '${feature}' referenced in 'features' does not exist.`, `data/builds/${buildData.name}.json`);
        }

        // check that article listed is included in build
        if (!buildData.configuration.members.includes(feature)) {
            throwWarning(`Article '${feature}' is referenced in 'features' but is not included in build.`, `data/builds/${buildData.name}.json`);
        }

    }


}

function compileArticles(buildData: BuildData) {

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

function createBuildSheet(buildData: BuildData): BuildSheet {

    return {
        pageData: buildData.pageData
    };

}

function regexMatch(strings: string[], expression: string): string[] {
    let re = new RegExp(expression);
    let matches = strings.filter(s => re.test(s));
    return matches;
}

export function regexMatchArticles(expressions: string[]): string[] {

    let articles = fs.readdirSync("data/wiki_source/");
    let output: string[] = new Array();

    expressions.forEach((expression: string) => {
        output = output.concat(regexMatch(articles, expression));
    });

    return [... new Set(output)];

}

// TODO
function renderAndSaveTreePage(buildData: BuildData) {
    let treeRendered = renderTreeHTML(buildData.tree);
    let rendered = htmlString(`
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
    `);
    savePage("tree.html", rendered);
}

function renderAndSaveArticle(filetype: string, filename: string, buildData: BuildData) {
    const c = readArticle(buildData);
    const metadata = createInitialMetadata(filetype, filename);
    const source = parseRawArticle(c, metadata, buildData);
    const rendered = renderArticle(source, metadata, buildData);
    buildData.pageData[`${filetype}/${filename}`] = createPageData(filetype, filename, metadata);
    buildData.tree.nodes[filename] = createTreeNode(metadata.infobox.entries);
    savePage(`${filetype}/${filename}.html`, rendered);
}

function createPageData(filetype: string, filename: string, metadata: Metadata): PageData {
    return {
        name: metadata.name,
        born: metadata.born,
        died: metadata.died,
        imageSrc: metadata.infobox.image
    };
}

function createEmptyInfoBox(): InfoBox {
    return {
        "type": "infobox",
        "image": "silhouette.png",
        "image-caption": "",
        "entries": {}
    }
}

export function createInfoObject(): InfoTag {
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
        "infobox": createEmptyInfoBox(),
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

export function throwWarning(message: string, location: string, buildData: BuildData | null = null) {
    console.log(`${location}: ${colourString("WARNING:", 35, true)} ${message}`);
    if (buildData) {
        buildData.warnings++;
        if (!buildData.uniqueWarningFiles.includes(buildData.location)) {
            buildData.uniqueWarningFiles.push(buildData.location);
        }
    }
}

export function recordRefListing(element: any, buildData: BuildData) {
    buildData.inDocumentRefListings[element["id"]] = element;
}

export function initialiseBuildData(projectDirectory: string, buildName: string) {

    // load quick references
    let quickReferences = require(`${projectDirectory}/data/quick_references.json`);
    if (!fs.existsSync(`${projectDirectory}/data/quick_references.json`)) {
        throwError(`Project is missing file 'data/quick_references.json'.`, "BUILD");
    }

    // load the build configuration
    let buildConfiguration = loadBuildConfiguration(projectDirectory, buildName);

    // load project package
    let projectPackage = require(`${projectDirectory}/somerled-package.json`);

    // initialise the buildData object
    let buildData = createBuildData(projectDirectory, projectPackage, quickReferences, buildName, buildConfiguration);

    return buildData;

}

export function createBuildData(projectDirectory: string, projectPackage: ProjectPackage, quickReferences: { [index: string]: Reference }, name: string, configuration: BuildConfiguration): BuildData {
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

// update the buildData object for the handling of the next article source file
export function updateBuildData(buildData: BuildData, filetype: string, filename: string) {
    buildData.filetype = filetype;
    buildData.filename = filename;
    buildData.location = `data/${buildData.filetype}/${buildData.filename}`;
    buildData.citations = [];
    buildData.inDocumentRefListings = {};
}

// determine whether a given file is to be rendered in the build
export function shouldBeBuilt(filetype: string, filename: string, buildData: BuildData): boolean {
    if (buildData.configuration.members.includes(filename)) return true;
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

// mark an image referenced in an article source for later inclusion in the build
export function markImage(imageName: string, buildData: BuildData) {
    buildData.imagesRendered.push(imageName);
    if (!fs.existsSync(`media/${imageName}`)) {
        throwError(`Cannot find image '${imageName}'.`, buildData.location);
    }
}

export function recordErrorNotice(attribute: string, value: any, errors: ErrorNotice[]) {
    errors.push({ attribute, value });
}
