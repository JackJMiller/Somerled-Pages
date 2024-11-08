/*
**  Somerled Pages - A program for creating family encyclopedias
**  Copyright (C) 2023-2024 Jack J. Miller
**  Licensed under version 3 of the GNU General Public License
*/

import { BuildData, ErrorNotice, InfoBox, InfoTag, Metadata } from "./interfaces";
import { recordErrorNotice, throwError } from "./functions";
import { BookRefListing, RefListing } from "./ref_listing_interfaces";
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
            return validateRefBook(reference as BookRefListing);
        default:
            return new Array();
    }


}

export function validateRefBook(ref: BookRefListing): ErrorNotice[] {

    let errors = new Array();

    if (ref["type"].constructor.name !== "String") recordErrorNotice("type", ref["type"], errors);
    if (ref["id"].constructor.name !== "String") recordErrorNotice("id", ref["id"], errors);
    if (ref["source-type"].constructor.name !== "String") recordErrorNotice("source-type", ref["source-type"], errors);
    if (ref["source-title"].constructor.name !== "String") recordErrorNotice("source-title", ref["source-title"], errors);
    if (ref["last-name"].constructor.name !== "String") recordErrorNotice("last-name", ref["last-name"], errors);
    if (ref["first-name"].constructor.name !== "String") recordErrorNotice("first-name", ref["first-name"], errors);
    if (ref["source-link"].constructor.name !== "String") recordErrorNotice("source-link", ref["source-link"], errors);
    if (ref["source-year"].constructor.name !== "String") recordErrorNotice("source-year", ref["source-year"], errors);
    if (ref["pages"].constructor.name !== "String") recordErrorNotice("pages", ref["pages"], errors);

    return errors;

}
