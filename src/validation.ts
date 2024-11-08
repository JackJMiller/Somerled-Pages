/*
**  Somerled Pages - A program for creating family encyclopedias
**  Copyright (C) 2023-2024 Jack J. Miller
**  Licensed under version 3 of the GNU General Public License
*/

import { BuildData, ErrorNotice, InfoBox, InfoTag, Metadata } from "./interfaces";
import { recordErrorNotice, throwError } from "./functions";
import { RefListing, RefSourceType } from "./ref_listing_interfaces";
import { RefListingModels } from "./ref_listing_models";
import { extractDate } from "./sanitisation";

export function validateInfoTag(infoTag: InfoTag, metadata: Metadata, buildData: BuildData) {

    infoTag["born"] = extractDate(infoTag["born"], buildData);
    metadata["born"] = infoTag["born"];

    infoTag["died"] = extractDate(infoTag["died"], buildData);
    metadata["died"] = infoTag["died"];

}

export function validateInfoBox(infoBox: InfoBox, metadata: Metadata, buildData: BuildData) {

}

export function errorCheckReference(reference: any, buildData: BuildData) {
    let errors = errorCheckRef(reference);
    for (let error of errors) {
        throwError(`Value for '${error.attribute}' cannot be set to '${error.value}' for reference with ID of '${reference.id}'.`, buildData.location);
    }
}

export function errorCheckRef(ref: any): ErrorNotice[] {

    let errors = new Array();

    let sourceType = ref["source-type"];

    let model = RefListingModels[sourceType];

    let refKeys = Object.keys(ref);

    for (let attribute of model) {
        if (!refKeys.includes(attribute.name)) {
            if (!attribute.types.includes("undefined")) {
                recordErrorNotice(attribute.name, undefined, errors);
            }
        }
        else if (!attribute.types.includes(ref[attribute.name].constructor.name)) {
            recordErrorNotice(attribute.name, ref[attribute.name], errors);
        }
    }

    return errors;

}
