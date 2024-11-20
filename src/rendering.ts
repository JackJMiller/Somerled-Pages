/*
**  Somerled Pages - A program for creating family encyclopedias
**  Copyright (C) 2023-2024 Jack J. Miller
**  Licensed under version 3 of the GNU General Public License
*/

import HTMLRendering from "./html_rendering";
import { MONTHS } from "./constants";
import { BuildData, ImageDefinition, InfoBox, InlineElement, Metadata, Tree } from "./interfaces";
import { markImage, recordRefListing, throwError, throwWarning } from "./functions";
import { BirthCertificateRefListing, BookRefListing, CensusRefListing, DeathCertificateRefListing, JournalRefListing, LazyRefListing, MarriageCertificateRefListing, NewspaperRefListing, RefListing, TestimonialRefListing, ValuationRollRefListing, WebsiteRefListing } from "./ref_listing_interfaces";
import { errorCheckReference, validateInfoBox, validateInfoTag } from "./validation";

export function renderHomepage(buildData: BuildData): string {
    return HTMLRendering.renderHomepage(buildData);
}

export function renderArticle(source: InlineElement[], metadata: Metadata, buildData: BuildData): string {
    return HTMLRendering.renderArticle(source, metadata, buildData);
}

export function renderTreePage(buildData: BuildData): string {
    return HTMLRendering.renderTreePage(buildData);
}

export function renderSearchPage(buildData: BuildData): string {
    return HTMLRendering.renderSearchPage(buildData);
}

export function renderCitation(id: string) {
    return HTMLRendering.renderCitation(id);
}

export function renderDate(rawDate: string): string {

    if (rawDate == "Unknown") return rawDate;

    let circa = (rawDate[0] === "c") ? "circa" : "";
    if (circa) rawDate = rawDate.slice(1);

    let date = rawDate.split("-");
    let day = (date[0] === "?") ? "" : date[0];
    let month = (date[1] === "?") ? "" : MONTHS[parseInt(date[1])];
    let year = (date[2] === "?") ? "" : date[2];

    return [circa, day, month, year].join(" ").trim().replace(/\s+/g, " "); }

export function renderElement(element: InlineElement | RefListing | InfoBox, metadata: Metadata, buildData: BuildData): string {
    if (element.type === "element") {
        return renderStandardElement(element as InlineElement);
    }
    else if (element.type == "img") {
        return renderImage(element as InlineElement, buildData);
    }
    else if (element.type == "infobox") {
        metadata["infobox"] = element as InfoBox;
        metadata["infobox-rendered"] = renderInfoBox(element as InfoBox, metadata, buildData);
        return "";
    }
    else if (element.type == "ref-listing") {
        errorCheckReference(element, buildData);
        recordRefListing(element, buildData);
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

export function renderInfoBox(infobox: InfoBox, metadata: Metadata, buildData: BuildData) {
    if (infobox.image) {
        markImage(infobox.image, buildData);
    }
    let pageData = buildData.pageData[metadata.id];
    validateInfoBox(infobox, metadata, pageData);
    return HTMLRendering.renderInfoBox(infobox, metadata, buildData);
}

export function isSplitFormat(articleType: string): boolean {
    return ["person", "place", "lineage"].includes(articleType);
}

export function htmlString(html: string): string {
    return html.trim().replace(/\s+/g, " ");
}
