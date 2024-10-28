/*
**  Somerled Pages - A program for creating family encyclopedias
**  Copyright (C) 2023-2024 Jack J. Miller
**  Licensed under version 3 of the GNU General Public License
*/

import HTMLRendering from "./html_rendering";
import { BuildData, ImageDefinition, InfoBox, InlineElement, Metadata } from "./interfaces";
import { markImage, recordRefListing, throwError, throwWarning } from "./functions";
import { BirthCertificateRefListing, BookRefListing, CensusRefListing, DeathCertificateRefListing, JournalRefListing, LazyRefListing, MarriageCertificateRefListing, NewspaperRefListing, QuickRefListing, RefListing, TestimonialRefListing, ValuationRollRefListing, WebsiteRefListing } from "./ref_listing_interfaces";

export function renderHomepage(buildData: BuildData): string {
    return HTMLRendering.renderHomepage(buildData);
}

export function renderArticle(source: InlineElement[], metadata: Metadata, buildData: BuildData): string {
    return HTMLRendering.renderArticle(source, metadata, buildData);
}

export function substituteLinksAndCitations(text: string, buildData: BuildData): string {
    let q = "text";
    let v = "";
    let links: string[] = [];
    let citations: string[] = [];
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

export function renderLink(content: string, buildData: BuildData): string {
    let contentValues = content.split("|");
    let placeholder = contentValues[0];
    let target = contentValues[1];
    if (buildData.configuration.members.includes(target)) {
        return HTMLRendering.renderLink(placeholder, target);
    }
    else if (buildData.configuration.allArticles.includes(target)) {
        return placeholder;
    }
    else {
        throwWarning(`Cannot link to non-existing article '${target}'.`, buildData.location)
        return "";
    }
}

export function renderElement(element: InlineElement | RefListing | InfoBox, metadata: Metadata, buildData: BuildData): string {
    if (element.type === "element") {
        return renderStandardElement(element as InlineElement);
    }
    else if (element.type == "img") {
        return renderImage(element as InlineElement, buildData);
    }
    else if (element.type == "infobox") {
        metadata["infobox"] = element as InfoBox;
        metadata["infobox-rendered"] = renderInfobox(element as InfoBox, metadata, buildData);
        return "";
    }
    else if (element.type == "ref-listing") {
        recordRefListing(element as RefListing, buildData);
        return "";
    }
    else if (element.type == "gallery") {
        return renderGallery(element as InlineElement, buildData);
    }
    else {
        return "";
    }
}

export function renderGallery(element: any, buildData: BuildData): string { 
    return HTMLRendering.renderGallery(element, buildData);
}

function renderGalleryImage(src: string, caption: string): string {
    return HTMLRendering.renderGalleryImage(src, caption);
}

export function renderQuickRefListing(key: string, index: number, buildData: BuildData): string {
    let refElement = JSON.parse(JSON.stringify(buildData.quickReferences[key]));
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
        return HTMLRendering.renderMarriageCertificateRefListing(element as MarriageCertificateRefListing, buildData);
    }
    else if (element["source-type"] == "birth-certificate") {
        return HTMLRendering.renderBirthCertificateRefListing(element as BirthCertificateRefListing, buildData);
    }
    else if (element["source-type"] == "death-certificate") {
        return HTMLRendering.renderDeathCertificateRefListing(element as DeathCertificateRefListing, buildData);
    }
    else if (element["source-type"] == "census") {
        return HTMLRendering.renderCensusRefListing(element as CensusRefListing, buildData);
    }
    else if (element["source-type"] == "testimonial") {
        return HTMLRendering.renderTestimonialRefListing(element as TestimonialRefListing);
    }
    else if (element["source-type"] == "valuation-roll") {
        return HTMLRendering.renderValuationRollRefListing(element as ValuationRollRefListing, buildData);
    }
    else {
        throwError(`Found reference listing with invalid source-type attribute of '${element["source-type"]}'.`, buildData.location, buildData);
        return "";
    }
}

export function renderImage(element: any, buildData: BuildData): string {
    return HTMLRendering.renderImage(element, buildData);
}

export function renderStandardElement(element: any) {
    let tag = element.tag;
    return `<${tag}${(element.id !== undefined) ? " id=\""+element.id+"\"" : ""}${(element.class !== undefined) ? " class=\""+element.class+"\"" : ""}>${element.inner}</${tag}>`;
}

export function renderInfobox(infobox: InfoBox, metadata: Metadata, buildData: BuildData) {
    if (infobox.image) {
        markImage(infobox.image, buildData);
    }
    return htmlString(`
        <div class="box infobox">
            ${infobox.image ? `<img src="../media/${infobox.image}"/>` : ""}
            ${infobox["image-caption"] ? `<p class="caption">${infobox["image-caption"]}</p>` : ""}
            <div class="grid">
                ${renderInfoboxEntries(infobox.entries, metadata, buildData)}
            </div>
        </div>`
    );
}

export function renderInfoboxEntries(entries: { [index: string]: string | string[] }, metadata: Metadata, buildData: BuildData) {
    let output = "";
    let keys = Object.keys(entries);
    if (metadata["born"]) {
        if (keys.includes("Born")) {
            entries["Born"] = [metadata["born"], entries["Born"] as string];
        }
        else {
            entries["Born"] = [metadata["born"]];
        }
    }
    if (metadata["died"] && metadata["died"] !== "present") {
        if (keys.includes("Died")) {
            entries["Died"] = [metadata["died"], entries["Died"] as string];
        }
        else {
            entries["Died"] = [metadata["died"]];
        }
    }
    keys.forEach((key: string) => {
        let value = entries[key];
        if (value.length > 0) {
            output = output + `<h5>${key}</h5>${renderBoxValue(key, value, metadata, buildData)}\n`
        }
    });
    return output;
}

export function renderBoxValue(key: string, value: string | string[], metadata: Metadata, buildData: BuildData): string {
    if (value.constructor.name === "Array") {
        return htmlString(`
            <div>
                ${(value as string[]).map((v: string) => "<p>" + substituteLinksAndCitations(v, buildData) + "</p>").join("")}
            </div>
        `);
    }
    else {
        return htmlString(`
            <div>
                <p>${substituteLinksAndCitations(value as string, buildData)}</p>
            </div>
        `);
    }
}

export function isSplitFormat(articleType: string): boolean {
    return ["person", "place", "lineage"].includes(articleType);
}

export function htmlString(html: string): string {
    return html.trim().replace(/\s+/g, " ");
}
