/*
**  Somerled Pages - A program for creating family encyclopedias
**  Copyright (C) 2023 Jack J. Miller
**  Licensed under version 3 of the GNU General Public License
*/

import { RefListing, TestimonialRefListing, CensusRefListing, DeathCertificateRefListing, BirthCertificateRefListing, MarriageCertificateRefListing, ValuationRollRefListing, LazyRefListing, BookRefListing, JournalRefListing, NewspaperRefListing, WebsiteRefListing } from "./ref_listing_interfaces";

function renderTestimonialRefListing(element: TestimonialRefListing): string {
    return `<div class="reference">${element.id}. Told by ${element["name"]} to ${element["witness"]}. Testified ${element["date"]}.</div>`;
}

function renderCensusRefListing(element: CensusRefListing): string {
    let text = `${element["year"]} census`;
    if (element["link"]) {
        text = `<a target="_blank" href="../certificates/${element["link"]}">${text}</a>`;
    }
    text = "The " + text + " of Scotland";
    return `<div class="reference">${element.id}. ${text}.</div>`;
}

function renderDeathCertificateRefListing(element: DeathCertificateRefListing): string {
    let opening = element["is-copy"] ? "Copy of the death certificate" : "Death certificate";
    const ending = element["is-copy"] ? "Issued" : "Registered";
    const date = element["date"] || "on an unknown date";
    if (element["link"]) {
        opening = `<a target="_blank" href="../certificates/${element["link"]}">${opening}</a>`;
    }
    return `<div class="reference">${element.id}. ${opening} of ${element["name"]}. ${ending} ${date}, ${element["place"]}.</div>`;
}

function renderBirthCertificateRefListing(element: BirthCertificateRefListing): string {
    let opening = element["is-copy"] ? "Copy of the birth certificate" : "Birth certificate";
    const ending = element["is-copy"] ? "Issued" : "Registered";
    const date = element["date"] || "on an unknown date";
    if (element["link"]) {
        opening = `<a target="_blank" href="../certificates/${element["link"]}">${opening}</a>`;
    }
    return `<div class="reference">${element.id}. ${opening} of ${element["name"]}. ${ending} ${date}, ${element["place"]}.</div>`;
}

function renderMarriageCertificateRefListing(element: MarriageCertificateRefListing): string {
    let opening = element["is-copy"] ? "Copy of the marriage certificate" : "Marriage certificate";
    const ending = element["is-copy"] ? "Issued" : "Registered";
    const date = element["date"] || "on an unknown date";
    if (element["link"]) {
        opening = `<a target="_blank" href="../certificates/${element["link"]}">${opening}</a>`;
    }
    return `<div class="reference">${element.id}. ${opening} of ${element["party-one"]} and ${element["party-two"]}. ${ending} ${date}, ${element["place"]}.</div>`;
}

function renderValuationRollRefListing(element: ValuationRollRefListing): string {
    if (element["source-link"]) {
        return `<div class="reference">${element.id}. <a href="../certificates/${element["source-link"]}">Valuation roll</a> at ${element["source-location"]}. Dated ${element["source-date"]}.</div>`;
    }
    else {
        return `<div class="reference">${element.id}. Valuation roll at ${element["source-location"]}. Dated ${element["source-date"]}.</div>`;
    }
}

function renderLazyRefListing(element: LazyRefListing): string {
    if (element["source-link"]) {
        return `<div class="reference">${element.id}. <a href=\"${element["source-link"]}\">${element["source-value"]}</a></div>`;
    }
    else {
        return `<div class="reference">${element.id}. ${element["source-value"]}</div>`;
    }
}

function renderBookRefListing(element: BookRefListing): string {
    return `<div class="reference">${element.id}. ${element["last-name"]}, ${element["first-name"]} (${element["source-year"]}) <a href="${element["source-link"]}"><i>${element["source-title"]}</i></a>. pp. ${element["pages"]}</div>`;
}

function renderJournalRefListing(element: JournalRefListing): string {
    return `<div class="reference">${element.id}. <a href="${element["source-link"]}">${element["name-of-publication"]}</a>. ${element["source-date"]}. pp. ${element["pages"]}</div>`;
}

function renderNewspaperRefListing(element: NewspaperRefListing): string {
    return `<div class="reference">${element.id}. <a href="${element["source-link"]}">"${element["source-title"]}"</a>. <i>${element["name-of-publication"]}</i>. ${element["source-date"]}. pp. ${element["pages"]}</div>`;
}

function renderWebsiteRefListing(element: WebsiteRefListing): string {
    return `<div class="reference">${element.id}. Website <a href="${element["source-link"]}">${element["name-of-website"]}</a>. Retrieved ${element["date-retrieved"]}.</div>`;
}

function renderCitation(id: string) {
    return `<sup><a href="">[${id}]</a></sup>`;
}

function renderLink(placeholder: string, target: string) {
    return `<a href="${target}.html">${placeholder}</a>`;
}

export = {
    renderTestimonialRefListing,
    renderCensusRefListing,
    renderDeathCertificateRefListing,
    renderBirthCertificateRefListing,
    renderMarriageCertificateRefListing,
    renderValuationRollRefListing,
    renderLazyRefListing,
    renderBookRefListing,
    renderJournalRefListing,
    renderNewspaperRefListing,
    renderWebsiteRefListing,
    renderCitation,
    renderLink
};
