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

// TODO
export function validateInfoBox(infoBox: InfoBox, metadata: Metadata, buildData: BuildData) {

}

// print any errors contained in a reference definition
export function errorCheckReference(reference: any, buildData: BuildData) {
    let errors = errorCheckRef(reference);
    for (let error of errors) {
        throwError(`Value for '${error.attribute}' cannot be set to '${error.value}' for reference with ID of '${reference.id}'.`, buildData.location);
    }
}

// check that a reference is properly defined // return any errors contained in the definition
export function errorCheckRef(ref: any): ErrorNotice[] {

    let errors = new Array();

    let sourceType = ref["source-type"];

    let model = RefListingModels[sourceType];

    let refKeys = Object.keys(ref);

    for (let attribute of model) {

        // record an error if a mandatory attribute inside the reference is missing
        if (!refKeys.includes(attribute.name)) {
            if (!attribute.types.includes("undefined")) {
                recordErrorNotice(attribute.name, undefined, errors);
            }
        }

        // record an error if an attribute inside the reference is of an invalid type
        else if (!attribute.types.includes(ref[attribute.name].constructor.name)) {
            recordErrorNotice(attribute.name, ref[attribute.name], errors);
        }
    }

    return errors;

}
