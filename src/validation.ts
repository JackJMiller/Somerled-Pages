/*
**  Somerled Pages - A program for creating family encyclopedias
**  Copyright (C) 2023-2024 Jack J. Miller
**  Licensed under version 3 of the GNU General Public License
*/

import { BuildData, InfoBox, Metadata } from "./interfaces";
import { extractDate } from "./sanitisation";

export function validateInfobox(infobox: InfoBox, metadata: Metadata, buildData: BuildData) {
    console.log(metadata["name"]);
    metadata["born"] = extractDate(metadata["born"]);
}
