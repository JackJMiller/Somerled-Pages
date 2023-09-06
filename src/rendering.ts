/*
**  Somerled Pages - A program for creating family encyclopedias
**  Copyright (C) 2023 Jack J. Miller
**  Licensed under version 3 of the GNU General Public License
*/

import { BuildData, InfoBox, InlineElement, Metadata } from "./interfaces";
import { recordRefListing, throwError } from "./functions";
import { BirthCertificateRefListing, BookRefListing, CensusRefListing, DeathCertificateRefListing, JournalRefListing, LazyRefListing, MarriageCertificateRefListing, NewspaperRefListing, QuickRefListing, RefListing, TestimonialRefListing, ValuationRollRefListing, WebsiteRefListing } from "./ref_listing_interfaces";
import HTMLRendering from "./html_rendering";

export function renderArticle(source: InlineElement[], metadata: Metadata, buildData: BuildData): string {
    const headerHTML = renderHeader(source, metadata);
    const renderedBody = renderBody(source, metadata, buildData);
    const navbar = renderNavbar(metadata);
    const images = renderImages(metadata);
    const referenceListings = renderReferenceListings(buildData);
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
        ${navbar}
        <div class="main-body">
            <div class="container">
                ${(isSplitFormat(metadata["article-type"])) ? "<div class=\"main-body-split\">" : ""}
                    <div>
                        ${renderedBody}
                        ${referenceListings}
                    </div>
                    <div class="images-column">
                        ${images}
                    </div>
                ${(isSplitFormat(metadata["article-type"])) ? "</div>" : ""}
            </div>
        </div>
        <script src="../res/script.js" type="text/javascript"></script>
    </body>
</html>
    `;
}

export function renderReferenceListings(buildData: BuildData): string {
    if (buildData.citations.length === 0) {
        // TODO make HTML-specific function
        return "<p>There are no references yet.</p>";
    }
    let output = "";
    const inDocumentKeys = Object.keys(buildData.inDocumentRefListings);
    const quickRefKeys = Object.keys(buildData.quickReferences);
    let index = 1;
    for (let citation of buildData.citations) {
        if (inDocumentKeys.includes(citation) && quickRefKeys.includes(citation)) {
            throwError(`References with identifier '${citation}' found both in document and in data/quick_references.json. Remove one so that the compiler may pick.`, buildData.location, buildData, false);
        }
        if (inDocumentKeys.includes(citation)) {
            const refListing = buildData.inDocumentRefListings[citation];
            refListing.id = index.toString();
            const renderedRefListing = renderRefListing(refListing, buildData);
            output = output + "\n" + renderedRefListing;
        }
        else if (quickRefKeys.includes(citation)) {
            const renderedRefListing = renderQuickRefListing(citation, index, buildData);
            output = output + "\n" + renderedRefListing;
        }
        else {
            throwError(`Cannot find reference listing with '${citation}' identifier.`, buildData.location, buildData, false);
        }
        index++;
    }
    return output;
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

export function renderHeader(source: InlineElement[], metadata: Metadata): string {
    metadata["name"] = metadata["info"]["name"];
    metadata["article-type"] = metadata["info"]["article-type"];
    metadata["born"] = metadata["info"]["born"];
    metadata["died"] = metadata["info"]["died"];
    metadata["images"] = metadata["info"]["images"];

    let subtitle = "";
    if (metadata["info"]["article-type"] === "person") {
        subtitle = `<h4 class="page-subtitle">${metadata["info"].born || "Unknown"} — ${metadata["info"].died || "Unknown"}</h4>`;
    }
    if (metadata["info"]["subtitle"]) {
        subtitle = subtitle + `<h4 class="page-subtitle">${metadata["info"]["subtitle"]}</h4>`;
    }

    return `
<div class="header">
    <div class="container">
        <h1 class="page-title">${metadata["info"].name}</h1>
        ${subtitle}
        <div class="somerled-pages-logo">A <span class="logo-somerled">Somerled</span> <span class="logo-pages">Pages</span> family encyclopedia</div>
    </div>
</div>`;
}

export function renderNavbar(metadata: Metadata): string {
    let navbar = `
<div class="navbar">
    <div class="navbar-items" style="grid-template-columns:${" 1fr".repeat(metadata.headings.length - 1)}">\n`;

    metadata.headings.forEach((heading: string) => {
        if (heading !== "References") {
            navbar = navbar + `<a href="" class="navbar-item"><h3>${heading}</h3></a>\n`;
        }
    });
    navbar = navbar + "    </div>\n</div>";
    return navbar;
}

export function renderBody(source: InlineElement[], metadata: Metadata, buildData: BuildData) {
    let rendered = "";
    source.forEach((element: InlineElement) => {
        rendered = rendered + renderElement(element, metadata, buildData) + "\n";
    });
    // const references = rendered.
    rendered = substituteLinksAndCitations(rendered, buildData);
    return rendered;
}

export function substituteLinksAndCitations(text: string, buildData: BuildData): string {
    let q = "text";
    let v = "";
    const links: string[] = [];
    const citations: string[] = [];
    for (let i = 0; i < text.length; i++) {
        let c = text[i];
        if (q === "text") {
            if (c === "[") {
                q = "ref";
                v = "";
            }
        }
        else if (q === "ref") {
            if (c === "[") {
                q = "link";
            }
            else if (c === "]") {
                q = "text";
                // output = output + renderCitation(v);
                if (!citations.includes(v)) {
                    citations.push(v);
                }
            }
            else {
                v = v + c;
            }
        }
        else if (q === "link") {
            if (c === "]") {
                q = "end-of-link";
            }
            else {
                v = v + c;
            }
        }
        else if (q === "end-of-link") {
            if (c === "]") {
                links.push(v);
                q = "text";
                v = "";
            }
        }

    }

    buildData.citations = citations;

    for (let link of links) {
        text = text.replaceAll(`[[${link}]]`, renderLink(link, buildData));
    }

    let index = 1;
    for (let citation of citations) {
        text = text.replaceAll(`[${citation}]`, renderCitation(index.toString()));
        index++;
    }

    return text;
}

export function renderCitation(id: string) {
    return HTMLRendering.renderCitation(id);
}

export function renderLink(content: string, buildData: BuildData) {
    const contentValues = content.split("|");
    const placeholder = contentValues[0];
    const target = contentValues[1];
    if (buildData.configuration.members.includes(target)) {
        return HTMLRendering.renderLink(placeholder, target);
    }
    else {
        return placeholder;
    }
}

export function renderElement(element: any, metadata: Metadata, buildData: BuildData): string {
    if (element.type === "element") {
        return renderStandardElement(element);
    }
    else if (element.type == "img") {
        return renderImage(element);
    }
    else if (element.type == "infobox") {
        metadata["infobox"] = element;
        metadata["infobox-rendered"] = renderInfobox(element, metadata, buildData);
        return "";
    }
    else if (element.type == "ref-listing") {
        recordRefListing(element as RefListing, buildData);
        return "";
        // return renderRefListing(element as RefListing, buildData);
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

function renderQuickRefListing(key: string, index: number, buildData: BuildData): string {
    const refElement = JSON.parse(JSON.stringify(buildData.quickReferences[key]));
    refElement.id = index.toString();
    return renderRefListing(refElement as RefListing, buildData);
}

export function renderRefListing(element: RefListing, buildData: BuildData): string {
    if (element["source-type"] == "newspaper") {
        return HTMLRendering.renderNewspaperRefListing(element as NewspaperRefListing);
    }
    else if (element["source-type"] == "journal") {
        return HTMLRendering.renderJournalRefListing(element as JournalRefListing);
    }
    else if (element["source-type"] == "book") {
        return HTMLRendering.renderBookRefListing(element as BookRefListing);
    }
    else if (element["source-type"] == "lazy") {
        return HTMLRendering.renderLazyRefListing(element as LazyRefListing);
    }
    else if (element["source-type"] == "webpage") {
        return HTMLRendering.renderWebsiteRefListing(element as WebsiteRefListing);
    }
    else if (element["source-type"] == "marriage-certificate") {
        return HTMLRendering.renderMarriageCertificateRefListing(element as MarriageCertificateRefListing);
    }
    else if (element["source-type"] == "birth-certificate") {
        return HTMLRendering.renderBirthCertificateRefListing(element as BirthCertificateRefListing);
    }
    else if (element["source-type"] == "death-certificate") {
        return HTMLRendering.renderDeathCertificateRefListing(element as DeathCertificateRefListing);
    }
    else if (element["source-type"] == "census") {
        return HTMLRendering.renderCensusRefListing(element as CensusRefListing);
    }
    else if (element["source-type"] == "testimonial") {
        return HTMLRendering.renderTestimonialRefListing(element as TestimonialRefListing);
    }
    else if (element["source-type"] == "valuation-roll") {
        return HTMLRendering.renderValuationRollRefListing(element as ValuationRollRefListing);
    }
    else {
        throwError(`Found reference listing with invalid source-type attribute of '${element["source-type"]}'.`, buildData.location, buildData);
        return "";
    }
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

export function renderInfobox(infobox: InfoBox, metadata: Metadata, buildData: BuildData) {
    return `
<div class="box infobox">
    ${infobox.image ? `<img src="../media/${infobox.image}"/>` : ""}
    ${infobox["image-caption"] ? `<p class="caption">${infobox["image-caption"]}</p>` : ""}
    <div class="grid">
        ${renderInfoboxEntries(infobox.entries, metadata, buildData)}
    </div>
</div>`;
}

export function renderInfoboxEntries(entries: any, metadata: Metadata, buildData: BuildData) {
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
            output = output + `<h5>${key}</h5>${renderBoxValue(key, value, metadata, buildData)}\n`
        }
    });
    return output;
}

export function renderBoxValue(key: string, value: string, metadata: Metadata, buildData: BuildData): string {
    if (value.constructor.name === "Array") {
        let output = "<div>"
        for (let v of value) {
            v = substituteLinksAndCitations(v, buildData)
            output = output + `<p>${v}</p>`;
        }
        output = output + "</div>";
        return output;
    }
    else {
        let output = "<div>";
        value = substituteLinksAndCitations(value, buildData)
        output = output + `<p>${value}</p>`;
        output = output + "</div>";
        return output;
    }
}

export function isSplitFormat(articleType: string): boolean {
    return ["person", "place", "lineage"].includes(articleType);
}
