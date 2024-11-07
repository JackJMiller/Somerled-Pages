/*
**  Somerled Pages - A program for creating family encyclopedias
**  Copyright (C) 2023-2024 Jack J. Miller
**  Licensed under version 3 of the GNU General Public License
*/

import { BuildData, InfoBox, InfoTag, Metadata } from "./interfaces";
import { throwError } from "./functions";
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

export function errorCheckRef(reference: RefListing): any[] {

    switch (reference["source-type"]) {
        case "book":
            return validateRefBook(reference as BookRefListing);
        default:
            return new Array();
    }


}

export function validateRefBook(ref: BookRefListing): any[] {

    let errors = new Array();

    if (ref["type"].constructor.name !== "String") errors.push({ attribute: "type", value: ref["type"] });
    if (ref["id"].constructor.name !== "String") errors.push({ attribute: "id", value: ref["id"] });
    if (ref["source-type"].constructor.name !== "String") errors.push({ attribute: "source-type", value: ref["source-type"] });
    if (ref["source-title"].constructor.name !== "String") errors.push({ attribute: "source-title", value: ref["source-title"] });
    if (ref["last-name"].constructor.name !== "String") errors.push({ attribute: "last-name", value: ref["last-name"] });
    if (ref["first-name"].constructor.name !== "String") errors.push({ attribute: "first-name", value: ref["first-name"] });
    if (ref["source-link"].constructor.name !== "String") errors.push({ attribute: "source-link", value: ref["source-link"] });
    if (ref["source-year"].constructor.name !== "String") errors.push({ attribute: "source-year", value: ref["source-year"] });
    if (ref["pages"].constructor.name !== "String") errors.push({ attribute: "pages", value: ref["pages"] });

    return errors;

}
