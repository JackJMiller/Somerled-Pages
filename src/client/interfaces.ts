/*
**  Somerled Pages - A program for creating family encyclopedias
**  Copyright (C) 2023-2024 Jack J. Miller
**  Licensed under version 3 of the GNU General Public License
*/

interface PageData {
    name: string,
    born: string,
    died: string,
    imageSrc: string
}

interface SearchQuery {
    "article-name": string[],
    "birth-from": number,
    "birth-to": number,
    "death-from": number,
    "death-to": number
}
