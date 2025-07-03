/*
**  Talorgan - A program for creating family encyclopedias
**  Copyright (C) 2023-2025 Jack J. Miller
**  Licensed under version 3 of the GNU General Public License
*/

import { MONTHS, MONTHS_SHORTENED } from "./constants";
import { throwError } from "./functions";
import { BuildData } from "./interfaces";

// TODO
export function extractDate(rawDate: string, buildData: BuildData): string {

    if (rawDate === "present") return rawDate;
    if (!rawDate) return "Unknown";

    let date = rawDate.split(" ");

    let circa = (date[0] === "circa" || date[0] == "c.") ? "c" : "";

    if (circa === "c") date.shift();

    let year = (date.length >= 1) ? parseInt(date.at(-1) as string) : 0;
    let month = (date.length >= 2) ? getMonthIndex(date.at(-2) as string, buildData) : 0;
    let day = (date.length === 3) ? parseInt(date.at(-3) as string) : 0;

    if (Number.isNaN(day) || Number.isNaN(year)) throwError(`Invalid date value.`, buildData.location, buildData, false);

    let parsed = `${circa}${day || "?"}-${month || "?"}-${year || "?"}`

    return parsed;

}

export function getMonthIndex(month: string, buildData: BuildData): number {

    let index = MONTHS.indexOf(month);

    if (index === -1) index = MONTHS_SHORTENED.indexOf(month);

    if (index === -1) throwError(`Invalid date value.`, buildData.location, buildData, false);

    return index;

}
