import { BuildData, InfoBox, Metadata } from "./interfaces";
import { extractDate } from "./sanitisation";

export function validateInfobox(infobox: InfoBox, metadata: Metadata, buildData: BuildData) {
    console.log(metadata["name"]);
    metadata["born"] = extractDate(metadata["born"]);
}
