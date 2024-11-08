/*
**  Somerled Pages - A program for creating family encyclopedias
**  Copyright (C) 2023-2024 Jack J. Miller
**  Licensed under version 3 of the GNU General Public License
*/

import { BuildData, ErrorNotice, InfoBox, InfoTag, Metadata } from "./interfaces";
import { recordErrorNotice, throwError } from "./functions";
import { BookRefListing, CensusRefListing, BirthCertificateRefListing, DeathCertificateRefListing, LazyRefListing, MarriageCertificateRefListing, NewspaperRefListing, RefListing, TestimonialRefListing, ValuationRollRefListing, WebsiteRefListing, JournalRefListing } from "./ref_listing_interfaces";
import { extractDate } from "./sanitisation";

export function validateInfoTag(infoTag: InfoTag, metadata: Metadata, buildData: BuildData) {

    infoTag["born"] = extractDate(infoTag["born"], buildData);
    metadata["born"] = infoTag["born"];

    infoTag["died"] = extractDate(infoTag["died"], buildData);
    metadata["died"] = infoTag["died"];

}

export function validateInfoBox(infoBox: InfoBox, metadata: Metadata, buildData: BuildData) {

}

export function errorCheckReference(reference: RefListing, buildData: BuildData) {
    let errors = errorCheckRef(reference);
    for (let error of errors) {
        throwError(`Value for '${error.attribute}' cannot be set to '${error.value}' for reference with ID of '${reference.id}'.`, buildData.location);
    }
}

export function errorCheckRef(reference: RefListing): ErrorNotice[] {

    switch (reference["source-type"]) {
        case "book":
            return validateBookRefListing(reference as BookRefListing);
        case "census":
            return validateCensusRefListing(reference as CensusRefListing)
        case "birth-certificate":
            return validateBirthCertificateRefListing(reference as BirthCertificateRefListing)
        case "death-certificate":
            return validateDeathCertificateRefListing(reference as DeathCertificateRefListing)
        case "lazy":
            return validateLazyRefListing(reference as LazyRefListing)
        case "marriage-certificate":
            return validateMarriageCertificateRefListing(reference as MarriageCertificateRefListing)
        case "newspaper":
            return validateNewspaperRefListing(reference as NewspaperRefListing)
        case "testimonial":
            return validateTestimonialRefListing(reference as TestimonialRefListing)
        case "valuation-roll":
            return validateValuationRollRefListing(reference as ValuationRollRefListing)
        case "website":
            return validateWebsiteRefListing(reference as WebsiteRefListing)
        case "journal":
            return validateJournalRefListing(reference as JournalRefListing)
        default:
            return new Array();
    }


}

export function validateBookRefListing(ref: BookRefListing): ErrorNotice[] {

    let errors = new Array();
    let keys = Object.keys(ref);

    if (ref["type"].constructor.name !== "String") recordErrorNotice("type", ref["type"], errors);

    else if (!keys.includes("type")) recordErrorNotice("type", undefined, errors);
    if (ref["id"].constructor.name !== "String") recordErrorNotice("id", ref["id"], errors);

    else if (!keys.includes("id")) recordErrorNotice("id", undefined, errors);
    if (ref["source-type"].constructor.name !== "String") recordErrorNotice("source-type", ref["source-type"], errors);

    else if (!keys.includes("source-type")) recordErrorNotice("source-type", undefined, errors);
    if (ref["source-title"].constructor.name !== "String") recordErrorNotice("source-title", ref["source-title"], errors);

    else if (!keys.includes("source-title")) recordErrorNotice("source-title", undefined, errors);
    if (ref["last-name"].constructor.name !== "String") recordErrorNotice("last-name", ref["last-name"], errors);

    else if (!keys.includes("last-name")) recordErrorNotice("last-name", undefined, errors);
    if (ref["first-name"].constructor.name !== "String") recordErrorNotice("first-name", ref["first-name"], errors);

    else if (!keys.includes("first-name")) recordErrorNotice("first-name", undefined, errors);
    if (ref["source-link"].constructor.name !== "String") recordErrorNotice("source-link", ref["source-link"], errors);

    else if (!keys.includes("source-link")) recordErrorNotice("source-link", undefined, errors);
    if (ref["source-year"].constructor.name !== "String") recordErrorNotice("source-year", ref["source-year"], errors);

    else if (!keys.includes("source-year")) recordErrorNotice("source-year", undefined, errors);
    if (ref["pages"].constructor.name !== "String") recordErrorNotice("pages", ref["pages"], errors);

    else if (!keys.includes("pages")) recordErrorNotice("pages", undefined, errors);

    return errors;

}

export function validateCensusRefListing(ref: CensusRefListing): ErrorNotice[] {

    let errors = new Array();

    let keys = Object.keys(ref);

    if (keys.includes("type") && ref["type"].constructor.name !== "String") recordErrorNotice("type", ref["type"], errors);

    else if (!keys.includes("type")) recordErrorNotice("type", undefined, errors);
    if (keys.includes("id") && ref["id"].constructor.name !== "String") recordErrorNotice("id", ref["id"], errors);

    else if (!keys.includes("id")) recordErrorNotice("id", undefined, errors);
    if (keys.includes("source-type") && ref["source-type"].constructor.name !== "String") recordErrorNotice("source-type", ref["source-type"], errors);

    else if (!keys.includes("source-type")) recordErrorNotice("source-type", undefined, errors);
    if (keys.includes("year") && ref["year"].constructor.name !== "String") recordErrorNotice("year", ref["year"], errors);

    else if (!keys.includes("year")) recordErrorNotice("year", undefined, errors);
    if (keys.includes("link") && ref["link"].constructor.name !== "String") recordErrorNotice("link", ref["link"], errors);

    else if (!keys.includes("link")) recordErrorNotice("link", undefined, errors);
    if (keys.includes("is-copy") && ref["is-copy"].constructor.name !== "Boolean") recordErrorNotice("is-copy", ref["is-copy"], errors);

    else if (!keys.includes("is-copy")) recordErrorNotice("is-copy", undefined, errors);

    return errors;

}

export function validateBirthCertificateRefListing(ref: BirthCertificateRefListing): ErrorNotice[] {

    let errors = new Array();

    let keys = Object.keys(ref);

    if (keys.includes("type") && ref["type"].constructor.name !== "String") recordErrorNotice("type", ref["type"], errors);

    else if (!keys.includes("type")) recordErrorNotice("type", undefined, errors);
    if (keys.includes("id") && ref["id"].constructor.name !== "String") recordErrorNotice("id", ref["id"], errors);

    else if (!keys.includes("id")) recordErrorNotice("id", undefined, errors);
    if (keys.includes("source-type") && ref["source-type"].constructor.name !== "String") recordErrorNotice("source-type", ref["source-type"], errors);

    else if (!keys.includes("source-type")) recordErrorNotice("source-type", undefined, errors);
    if (keys.includes("name") && ref["name"].constructor.name !== "String") recordErrorNotice("name", ref["name"], errors);

    else if (!keys.includes("name")) recordErrorNotice("name", undefined, errors);
    if (keys.includes("date") && ref["date"].constructor.name !== "String") recordErrorNotice("date", ref["date"], errors);

    else if (!keys.includes("date")) recordErrorNotice("date", undefined, errors);
    if (keys.includes("place") && ref["place"].constructor.name !== "String") recordErrorNotice("place", ref["place"], errors);

    else if (!keys.includes("place")) recordErrorNotice("place", undefined, errors);
    if (keys.includes("link") && ref["link"].constructor.name !== "String") recordErrorNotice("link", ref["link"], errors);

    else if (!keys.includes("link")) recordErrorNotice("link", undefined, errors);
    if (keys.includes("is-copy") && ref["is-copy"].constructor.name !== "Boolean") recordErrorNotice("is-copy", ref["is-copy"], errors);

    else if (!keys.includes("is-copy")) recordErrorNotice("is-copy", undefined, errors);

    return errors;

}

export function validateDeathCertificateRefListing(ref: DeathCertificateRefListing): ErrorNotice[] {

    let errors = new Array();

    let keys = Object.keys(ref);

    if (keys.includes("type") && ref["type"].constructor.name !== "String") recordErrorNotice("type", ref["type"], errors);

    else if (!keys.includes("type")) recordErrorNotice("type", undefined, errors);
    if (keys.includes("id") && ref["id"].constructor.name !== "String") recordErrorNotice("id", ref["id"], errors);

    else if (!keys.includes("id")) recordErrorNotice("id", undefined, errors);
    if (keys.includes("source-type") && ref["source-type"].constructor.name !== "String") recordErrorNotice("source-type", ref["source-type"], errors);

    else if (!keys.includes("source-type")) recordErrorNotice("source-type", undefined, errors);
    if (keys.includes("name") && ref["name"].constructor.name !== "String") recordErrorNotice("name", ref["name"], errors);

    else if (!keys.includes("name")) recordErrorNotice("name", undefined, errors);
    if (keys.includes("date") && ref["date"].constructor.name !== "String") recordErrorNotice("date", ref["date"], errors);

    else if (!keys.includes("date")) recordErrorNotice("date", undefined, errors);
    if (keys.includes("place") && ref["place"].constructor.name !== "String") recordErrorNotice("place", ref["place"], errors);

    else if (!keys.includes("place")) recordErrorNotice("place", undefined, errors);
    if (keys.includes("link") && ref["link"].constructor.name !== "String") recordErrorNotice("link", ref["link"], errors);

    else if (!keys.includes("link")) recordErrorNotice("link", undefined, errors);
    if (keys.includes("is-copy") && ref["is-copy"].constructor.name !== "Boolean") recordErrorNotice("is-copy", ref["is-copy"], errors);

    else if (!keys.includes("is-copy")) recordErrorNotice("is-copy", undefined, errors);

    return errors;

}

export function validateLazyRefListing(ref: LazyRefListing): ErrorNotice[] {

    let errors = new Array();

    let keys = Object.keys(ref);

    if (keys.includes("type") && ref["type"].constructor.name !== "String") recordErrorNotice("type", ref["type"], errors);

    else if (!keys.includes("type")) recordErrorNotice("type", undefined, errors);
    if (keys.includes("id") && ref["id"].constructor.name !== "String") recordErrorNotice("id", ref["id"], errors);

    else if (!keys.includes("id")) recordErrorNotice("id", undefined, errors);
    if (keys.includes("source-type") && ref["source-type"].constructor.name !== "String") recordErrorNotice("source-type", ref["source-type"], errors);

    else if (!keys.includes("source-type")) recordErrorNotice("source-type", undefined, errors);
    if (keys.includes("source-value") && ref["source-value"].constructor.name !== "String") recordErrorNotice("source-value", ref["source-value"], errors);

    else if (!keys.includes("source-value")) recordErrorNotice("source-value", undefined, errors);
    if (keys.includes("source-link") && ref["source-link"].constructor.name !== "String") recordErrorNotice("source-link", ref["source-link"], errors);

    else if (!keys.includes("source-link")) recordErrorNotice("source-link", undefined, errors);

    return errors;

}

export function validateMarriageCertificateRefListing(ref: MarriageCertificateRefListing): ErrorNotice[] {

    let errors = new Array();

    let keys = Object.keys(ref);

    if (keys.includes("type") && ref["type"].constructor.name !== "String") recordErrorNotice("type", ref["type"], errors);

    else if (!keys.includes("type")) recordErrorNotice("type", undefined, errors);
    if (keys.includes("id") && ref["id"].constructor.name !== "String") recordErrorNotice("id", ref["id"], errors);

    else if (!keys.includes("id")) recordErrorNotice("id", undefined, errors);
    if (keys.includes("source-type") && ref["source-type"].constructor.name !== "String") recordErrorNotice("source-type", ref["source-type"], errors);

    else if (!keys.includes("source-type")) recordErrorNotice("source-type", undefined, errors);
    if (keys.includes("party-one") && ref["party-one"].constructor.name !== "String") recordErrorNotice("party-one", ref["party-one"], errors);

    else if (!keys.includes("party-one")) recordErrorNotice("party-one", undefined, errors);
    if (keys.includes("party-two") && ref["party-two"].constructor.name !== "String") recordErrorNotice("party-two", ref["party-two"], errors);

    else if (!keys.includes("party-two")) recordErrorNotice("party-two", undefined, errors);
    if (keys.includes("date") && ref["date"].constructor.name !== "String") recordErrorNotice("date", ref["date"], errors);

    else if (!keys.includes("date")) recordErrorNotice("date", undefined, errors);
    if (keys.includes("place") && ref["place"].constructor.name !== "String") recordErrorNotice("place", ref["place"], errors);

    else if (!keys.includes("place")) recordErrorNotice("place", undefined, errors);
    if (keys.includes("link") && ref["link"].constructor.name !== "String") recordErrorNotice("link", ref["link"], errors);

    else if (!keys.includes("link")) recordErrorNotice("link", undefined, errors);
    if (keys.includes("is-copy") && ref["is-copy"].constructor.name !== "Boolean") recordErrorNotice("is-copy", ref["is-copy"], errors);

    else if (!keys.includes("is-copy")) recordErrorNotice("is-copy", undefined, errors);

    return errors;

}

export function validateNewspaperRefListing(ref: NewspaperRefListing): ErrorNotice[] {

    let errors = new Array();

    let keys = Object.keys(ref);

    if (keys.includes("type") && ref["type"].constructor.name !== "String") recordErrorNotice("type", ref["type"], errors);

    else if (!keys.includes("type")) recordErrorNotice("type", undefined, errors);
    if (keys.includes("id") && ref["id"].constructor.name !== "String") recordErrorNotice("id", ref["id"], errors);

    else if (!keys.includes("id")) recordErrorNotice("id", undefined, errors);
    if (keys.includes("source-type") && ref["source-type"].constructor.name !== "String") recordErrorNotice("source-type", ref["source-type"], errors);

    else if (!keys.includes("source-type")) recordErrorNotice("source-type", undefined, errors);
    if (keys.includes("name-of-publication") && ref["name-of-publication"].constructor.name !== "String") recordErrorNotice("name-of-publication", ref["name-of-publication"], errors);

    else if (!keys.includes("name-of-publication")) recordErrorNotice("name-of-publication", undefined, errors);
    if (keys.includes("source-link") && ref["source-link"].constructor.name !== "String") recordErrorNotice("source-link", ref["source-link"], errors);

    else if (!keys.includes("source-link")) recordErrorNotice("source-link", undefined, errors);
    if (keys.includes("source-title") && ref["source-title"].constructor.name !== "String") recordErrorNotice("source-title", ref["source-title"], errors);

    else if (!keys.includes("source-title")) recordErrorNotice("source-title", undefined, errors);
    if (keys.includes("source-date") && ref["source-date"].constructor.name !== "String") recordErrorNotice("source-date", ref["source-date"], errors);

    else if (!keys.includes("source-date")) recordErrorNotice("source-date", undefined, errors);
    if (keys.includes("pages") && ref["pages"].constructor.name !== "String") recordErrorNotice("pages", ref["pages"], errors);

    else if (!keys.includes("pages")) recordErrorNotice("pages", undefined, errors);
    if (keys.includes("is-copy") && ref["is-copy"].constructor.name !== "Boolean") recordErrorNotice("is-copy", ref["is-copy"], errors);

    else if (!keys.includes("is-copy")) recordErrorNotice("is-copy", undefined, errors);

    return errors;

}

export function validateTestimonialRefListing(ref: TestimonialRefListing): ErrorNotice[] {

    let errors = new Array();

    let keys = Object.keys(ref);

    if (keys.includes("type") && ref["type"].constructor.name !== "String") recordErrorNotice("type", ref["type"], errors);

    else if (!keys.includes("type")) recordErrorNotice("type", undefined, errors);
    if (keys.includes("id") && ref["id"].constructor.name !== "String") recordErrorNotice("id", ref["id"], errors);

    else if (!keys.includes("id")) recordErrorNotice("id", undefined, errors);
    if (keys.includes("source-type") && ref["source-type"].constructor.name !== "String") recordErrorNotice("source-type", ref["source-type"], errors);

    else if (!keys.includes("source-type")) recordErrorNotice("source-type", undefined, errors);
    if (keys.includes("name") && ref["name"].constructor.name !== "String") recordErrorNotice("name", ref["name"], errors);

    else if (!keys.includes("name")) recordErrorNotice("name", undefined, errors);
    if (keys.includes("witness") && ref["witness"].constructor.name !== "String") recordErrorNotice("witness", ref["witness"], errors);

    else if (!keys.includes("witness")) recordErrorNotice("witness", undefined, errors);
    if (keys.includes("date") && ref["date"].constructor.name !== "String") recordErrorNotice("date", ref["date"], errors);

    else if (!keys.includes("date")) recordErrorNotice("date", undefined, errors);

    return errors;

}

export function validateValuationRollRefListing(ref: ValuationRollRefListing): ErrorNotice[] {

    let errors = new Array();

    let keys = Object.keys(ref);

    if (keys.includes("type") && ref["type"].constructor.name !== "String") recordErrorNotice("type", ref["type"], errors);

    else if (!keys.includes("type")) recordErrorNotice("type", undefined, errors);
    if (keys.includes("id") && ref["id"].constructor.name !== "String") recordErrorNotice("id", ref["id"], errors);

    else if (!keys.includes("id")) recordErrorNotice("id", undefined, errors);
    if (keys.includes("source-type") && ref["source-type"].constructor.name !== "String") recordErrorNotice("source-type", ref["source-type"], errors);

    else if (!keys.includes("source-type")) recordErrorNotice("source-type", undefined, errors);
    if (keys.includes("source-location") && ref["source-location"].constructor.name !== "String") recordErrorNotice("source-location", ref["source-location"], errors);

    else if (!keys.includes("source-location")) recordErrorNotice("source-location", undefined, errors);
    if (keys.includes("source-date") && ref["source-date"].constructor.name !== "String") recordErrorNotice("source-date", ref["source-date"], errors);

    else if (!keys.includes("source-date")) recordErrorNotice("source-date", undefined, errors);
    if (keys.includes("source-link") && ref["source-link"].constructor.name !== "String") recordErrorNotice("source-link", ref["source-link"], errors);

    else if (!keys.includes("source-link")) recordErrorNotice("source-link", undefined, errors);
    if (keys.includes("is-copy") && ref["is-copy"].constructor.name !== "Boolean") recordErrorNotice("is-copy", ref["is-copy"], errors);

    else if (!keys.includes("is-copy")) recordErrorNotice("is-copy", undefined, errors);

    return errors;

}

export function validateWebsiteRefListing(ref: WebsiteRefListing): ErrorNotice[] {

    let errors = new Array();

    let keys = Object.keys(ref);

    if (keys.includes("type") && ref["type"].constructor.name !== "String") recordErrorNotice("type", ref["type"], errors);

    else if (!keys.includes("type")) recordErrorNotice("type", undefined, errors);
    if (keys.includes("id") && ref["id"].constructor.name !== "String") recordErrorNotice("id", ref["id"], errors);

    else if (!keys.includes("id")) recordErrorNotice("id", undefined, errors);
    if (keys.includes("source-type") && ref["source-type"].constructor.name !== "String") recordErrorNotice("source-type", ref["source-type"], errors);

    else if (!keys.includes("source-type")) recordErrorNotice("source-type", undefined, errors);
    if (keys.includes("name-of-website") && ref["name-of-website"].constructor.name !== "String") recordErrorNotice("name-of-website", ref["name-of-website"], errors);

    else if (!keys.includes("name-of-website")) recordErrorNotice("name-of-website", undefined, errors);
    if (keys.includes("source-link") && ref["source-link"].constructor.name !== "String") recordErrorNotice("source-link", ref["source-link"], errors);

    else if (!keys.includes("source-link")) recordErrorNotice("source-link", undefined, errors);
    if (keys.includes("date-retrieved") && ref["date-retrieved"].constructor.name !== "String") recordErrorNotice("date-retrieved", ref["date-retrieved"], errors);

    else if (!keys.includes("date-retrieved")) recordErrorNotice("date-retrieved", undefined, errors);

    return errors;

}

export function validateJournalRefListing(ref: JournalRefListing): ErrorNotice[] {

    let errors = new Array();

    let keys = Object.keys(ref);

    if (keys.includes("type") && ref["type"].constructor.name !== "String") recordErrorNotice("type", ref["type"], errors);

    else if (!keys.includes("type")) recordErrorNotice("type", undefined, errors);
    if (keys.includes("id") && ref["id"].constructor.name !== "String") recordErrorNotice("id", ref["id"], errors);

    else if (!keys.includes("id")) recordErrorNotice("id", undefined, errors);
    if (keys.includes("source-type") && ref["source-type"].constructor.name !== "String") recordErrorNotice("source-type", ref["source-type"], errors);

    else if (!keys.includes("source-type")) recordErrorNotice("source-type", undefined, errors);
    if (keys.includes("name-of-publication") && ref["name-of-publication"].constructor.name !== "String") recordErrorNotice("name-of-publication", ref["name-of-publication"], errors);

    else if (!keys.includes("name-of-publication")) recordErrorNotice("name-of-publication", undefined, errors);
    if (keys.includes("source-date") && ref["source-date"].constructor.name !== "String") recordErrorNotice("source-date", ref["source-date"], errors);

    else if (!keys.includes("source-date")) recordErrorNotice("source-date", undefined, errors);
    if (keys.includes("pages") && ref["pages"].constructor.name !== "String") recordErrorNotice("pages", ref["pages"], errors);

    else if (!keys.includes("pages")) recordErrorNotice("pages", undefined, errors);
    if (keys.includes("source-link") && ref["source-link"].constructor.name !== "String") recordErrorNotice("source-link", ref["source-link"], errors);

    else if (!keys.includes("source-link")) recordErrorNotice("source-link", undefined, errors);

    return errors;

}
