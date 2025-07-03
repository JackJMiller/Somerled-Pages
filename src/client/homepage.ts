/*
**  Talorgan - A program for creating family encyclopedias
**  Copyright (C) 2023-2025 Jack J. Miller
**  Licensed under version 3 of the GNU General Public License
*/

document.getElementById("advanced-search")!.addEventListener("submit", event => {
    event.preventDefault();
    submitAdvancedSearch();
});
