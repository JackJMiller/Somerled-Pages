/*
**  Somerled Pages - A program for creating family encyclopedias
**  Copyright (C) 2023 Jack J. Miller
**  Licensed under version 3 of the GNU General Public License
*/

import { InfoBox, InlineElement, Metadata } from "./interfaces";

const QUICK_REFERENCES = require("../copied/quick_references.json");

export function renderArticle(source: InlineElement[], metadata: Metadata): string {
    const headerHTML = renderHeader(source, metadata);
    const renderedBody = renderBody(source, metadata);
    return `
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width"/>
        <title>${metadata["name"]} - A Somerled Pages family encyclopedia</title>
        <link rel="stylesheet" href="../res/main.css" type="text/css" charset="utf-8"/>
        <link rel="icon" href="../res/favicon.png" type="image/png"/>
    </head>
    <body>
        ${headerHTML}
        ${renderNavbar(metadata)}
        <div class="main-body">
            <div class="container">
            ${(isSplitFormat(metadata["article-type"])) ? "<div class=\"main-body-split\">" : ""}
                <div>
                    ${renderedBody}
                </div>
                <div class="images-column">
                    ${renderImages(metadata)}
                </div>
            </div>
            ${(isSplitFormat(metadata["article-type"])) ? "</div>" : ""}
        </div>
        <script src="../res/script.js" type="text/javascript"></script>
    </body>
</html>
    `;
}

export function renderImages(metadata: Metadata) {

    let images = "";
    if (metadata["infobox-rendered"]) {
        images = images + metadata["infobox-rendered"];
    }

    if (!metadata["images"]) return images;

    metadata["images"].forEach((image: any) => {
        images = images + `
<div class="box">
    <img src="../media/${image.src}"/>
    ${image.caption ? `<p class="caption">${image.caption}</p>` : ""}
</div>`;
    });

    return images
}


export function renderHeader(source: any, metadata: Metadata): string {
    let header;
    const infoObject = source.find((element: any) => element.type === "info");

    console.log(infoObject);

    if (infoObject === undefined) return "";

    metadata["name"] = infoObject["name"];
    metadata["article-type"] = infoObject["article-type"];
    metadata["born"] = infoObject["born"];
    metadata["died"] = infoObject["died"];
    metadata["images"] = infoObject["images"];

    let subtitle = "";
    if (infoObject["article-type"] === "person") {
        subtitle = `<h4 class="page-subtitle">${infoObject.born || "Unknown"} — ${infoObject.died || "Unknown"}</h4>`;
    }
    if (infoObject["subtitle"]) {
        subtitle = subtitle + `<h4 class="page-subtitle">${infoObject["subtitle"]}</h4>`;
    }

    return `
<div class="header">
    <div class="container">
        <h1 class="page-title">${infoObject.name}</h1>
        ${subtitle}
        <div class="somerled-pages-logo">A <span class="logo-somerled">Somerled</span> <span class="logo-pages">Pages</span> family encyclopedia</div>
    </div>
</div>`;
}

export function renderNavbar(metadata: Metadata): string {
    let navbar = `
<div class="navbar">
    <div class="navbar-items" style="grid-template-columns:${" 1fr".repeat(metadata.headings.length - 1)}">\n`;

    metadata.headings.forEach((heading: any) => {
        if (heading !== "References") {
            navbar = navbar + `<a href="" class="navbar-item"><h3>${heading}</h3></a>\n`;
        }
    });
    navbar = navbar + "    </div>\n</div>";
    return navbar;
}

export function renderBody(source: any, metadata: Metadata) {
    let rendered = "";
    source.forEach((element: any) => {
        rendered = rendered + renderElement(element, metadata) + "\n";
    });
    rendered = substituteReferences(rendered);
    return rendered;
}

export function substituteReferences(text: string) {
    let q: any[] = ["text"];
    let v = "";
    let output = "";
    for (let i = 0; i < text.length; i++) {
        let c = text[i];
        if (q[0] === "text") {
            if (c === "[") {
                q = ["ref"];
                v = "";
            }
            else {
                output = output + c;
            }
        }
        else if (q[0] === "ref") {
            if (c === "]") {
                q = ["text"];
                output = output + renderCitation(v);
            }
            else {
                v = v + c;
            }
        }

    }
    return output;
}

export function renderElement(element: any, metadata: Metadata) {
    if (element.type === "element") {
        return renderStandardElement(element);
    }
    else if (element.type == "img") {
        return renderImage(element);
    }
    else if (element.type == "infobox") {
        metadata["infobox-rendered"] = renderInfobox(element, metadata);
        return "";
    }
    else if (element.type == "ref-listing" || element.type == "quick-ref") {
        return renderRefListing(element);
    }
    else if (element.type == "gallery") {
        return renderGallery(element);
    }
    else {
        return "";
    }
}

export function renderGallery(element: any){ 
    let output = "";
    let id = 0;
    for (let image of element.images) {
        output = output + `<img class="gallery-image" src="../media/${image.src}"/>`;
        id++;
    }
    return `<div class="gallery">
    <button onclick="shiftGallery(-1);" class="gallery-arrow-container">
        <img style="width: 40px;" src="../res/arrow_left.svg"/>
    </button>
    <div>
        ${output}
    </div>
    <button onclick="shiftGallery(1);" class="gallery-arrow-container">
        <img style="width: 40px;" src="../res/arrow_right.svg"/>
    </button>
</div>`;
}

export function renderRefListing(element: any) {
    const pages = element["pages"];

    if (element["type"] == "quick-ref") {
        const refElement = JSON.parse(JSON.stringify(QUICK_REFERENCES[element["quick-id"]]))
        refElement.id = element.id;
        return renderRefListing(refElement);
    }
    else if (element["source-type"] == "newspaper") {
        return `<div class="reference">${element.id}. <a href="${element["source-link"]}">"${element["source-title"]}"</a>. <i>${element["name-of-publication"]}</i>. ${element["source-date"]}. pp. ${pages}</div>`;
    }
    else if (element["source-type"] == "journal") {
        return `<div class="reference">${element.id}. <a href="${element["source-link"]}">${element["name-of-publication"]}</a>. ${element["source-date"]}. pp. ${pages}</div>`;
    }
    else if (element["source-type"] == "book") {
        return `<div class="reference">${element.id}. ${element["last-name"]}, ${element["first-name"]} (${element["source-year"]}) <a href="${element["source-link"]}"><i>${element["source-title"]}</i></a>. pp. ${pages}</div>`;
    }
    else if (element["source-type"] == "lazy") {
        if (element["source-link"]) {
            return `<div class="reference">${element.id}. <a href=\"${element["source-link"]}\">${element["source-value"]}</a></div>`;
        }
        else {
            return `<div class="reference">${element.id}. ${element["source-value"]}</div>`;
        }
    }
    else if (element["source-type"] == "webpage") {
        return `<div class="reference">${element.id}. Website <a href="${element["source-link"]}">${element["name-of-website"]}</a>. Retrieved ${element["date-retrieved"]}.</div>`;
    }
    else if (element["source-type"] == "marriage-certificate") {
        let opening = element["is-copy"] ? "Copy of the marriage certificate" : "Marriage certificate";
        const ending = element["is-copy"] ? "Issued" : "Registered";
        const date = element["date"] || "on an unknown date";
        if (element["link"]) {
            opening = `<a target="_blank" href="../certificates/${element["link"]}">${opening}</a>`;
        }
        return `<div class="reference">${element.id}. ${opening} of ${element["party-one"]} and ${element["party-two"]}. ${ending} ${date}, ${element["place"]}.</div>`;
    }
    else if (element["source-type"] == "birth-certificate") {
        let opening = element["is-copy"] ? "Copy of the birth certificate" : "Birth certificate";
        const ending = element["is-copy"] ? "Issued" : "Registered";
        const date = element["date"] || "on an unknown date";
        if (element["link"]) {
            opening = `<a target="_blank" href="../certificates/${element["link"]}">${opening}</a>`;
        }
        return `<div class="reference">${element.id}. ${opening} of ${element["name"]}. ${ending} ${date}, ${element["place"]}.</div>`;
    }
    else if (element["source-type"] == "death-certificate") {
        let opening = element["is-copy"] ? "Copy of the death certificate" : "Death certificate";
        const ending = element["is-copy"] ? "Issued" : "Registered";
        const date = element["date"] || "on an unknown date";
        if (element["link"]) {
            opening = `<a target="_blank" href="../certificates/${element["link"]}">${opening}</a>`;
        }
        return `<div class="reference">${element.id}. ${opening} of ${element["name"]}. ${ending} ${date}, ${element["place"]}.</div>`;
    }
    else if (element["source-type"] == "census") {
        let text = `${element["year"]} census`;
        if (element["link"]) {
            text = `<a target="_blank" href="../certificates/${element["link"]}">${text}</a>`;
        }
        text = "The " + text + " of Scotland";
        return `<div class="reference">${element.id}. ${text}.</div>`;
    }
    else if (element["source-type"] == "testimonial") {
        return `<div class="reference">${element.id}. Told by ${element["name"]} to ${element["witness"]}. Testified ${element["date"]}.</div>`;
    }
    else if (element["source-type"] == "valuation-roll") {
        if (element["source-link"]) {
            return `<div class="reference">${element.id}. <a href="../certificates/${element["source-link"]}">Valuation roll</a> at ${element["source-location"]}. Dated ${element["source-date"]}.</div>`;
        }
        else {
            return `<div class="reference">${element.id}. Valuation roll at ${element["source-location"]}. Dated ${element["source-date"]}.</div>`;
        }
    }
}

export function renderCitation(id: string) {
    return `<sup><a href="">[${id}]</a></sup>`;
}

export function renderImage(element: any) {
    let floatValue = "";
    if (element["float"] === "left") {
        floatValue = "left";
    }
    else if (element["float"] === "right") {
        floatValue = "right";
    }
    return `
<div class="small-box box ${floatValue}-box">
    <img src="../media/${element.src}"/>
    ${element.caption ? `<p class="caption">${element.caption}</p>` : ""}
</div>`;
}

export function renderStandardElement(element: any) {
    const tag = element.tag;
    return `<${tag}${(element.id !== undefined) ? " id=\""+element.id+"\"" : ""}${(element.class !== undefined) ? " class=\""+element.class+"\"" : ""}>${element.inner}</${tag}>`;
}

export function renderInfobox(infobox: InfoBox, metadata: Metadata) {
    return `
<div class="box infobox">
    ${infobox.image ? `<img src="../media/${infobox.image}"/>` : ""}
    ${infobox["image-caption"] ? `<p class="caption">${infobox["image-caption"]}</p>` : ""}
    <div class="grid">
        ${renderInfoboxEntries(infobox.entries, metadata)}
    </div>
</div>`;
}

export function renderInfoboxEntries(entries: any, metadata: Metadata) {
    let output = "";
    let keys = Object.keys(entries);
    if (metadata["born"]) {
        if (keys.includes("Born")) {
            entries["Born"] = [metadata["born"], entries["Born"]];
        }
        else {
            entries["Born"] = [metadata["born"]];
        }
    }
    if (metadata["died"] && metadata["died"] !== "present") {
        if (keys.includes("Died")) {
            entries["Died"] = [metadata["died"], entries["Died"]];
        }
        else {
            entries["Died"] = [metadata["died"]];
        }
    }
    keys.forEach((key: string) => {
        const value = entries[key];
        if (value.length > 0) {
            output = output + `<h5>${key}</h5>${renderBoxValue(key, value, metadata)}\n`
        }
    });
    return output;
}

export function renderBoxValue(key: string, value: string, metadata: Metadata): string {
    if (value.constructor.name === "Array") {
        let output = "<div>"
        for (let v of value) {
            output = output + `<p>${v}</p>`;
        }
        output = output + "</div>";
        return output;
    }
    else {
        let output = "<div>";
        output = output + `<p>${value}</p>`;
        output = output + "</div>";
        return output;
    }
}

export function isSplitFormat(articleType: string): boolean {
    return ["person", "place", "lineage"].includes(articleType);
}
