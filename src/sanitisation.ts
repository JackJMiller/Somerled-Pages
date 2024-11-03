/*
**  Somerled Pages - A program for creating family encyclopedias
**  Copyright (C) 2023-2024 Jack J. Miller
**  Licensed under version 3 of the GNU General Public License
*/

import { MONTHS } from "./constants";

// TODO
export function extractDate(rawDate: string): string {

    if (!rawDate) return "Unknown";

    let date = rawDate.split(" ");

    let containsCirca = (date[0] === "circa" || date[0] == "c.");

    if (containsCirca) date.shift();

    // TODO: preserve circa

    console.log({ rawDate, date });

    let year = (date.length >= 1) ? parseInt(date.at(-1) as string) : 0;
    let month = (date.length >= 2) ? getMonthIndex(date.at(-2) as string) : 0;
    let day = (date.length === 3) ? parseInt(date.at(-3) as string) : 0;

    return `${day || "?"}-${month || "?"}-${year || "?"}`;

}

// TODO
export function getMonthIndex(month: string): number {
    return MONTHS.indexOf(month);
}
