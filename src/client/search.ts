/*
**  Somerled Pages - A program for creating family encyclopedias
**  Copyright (C) 2023-2024 Jack J. Miller
**  Licensed under version 3 of the GNU General Public License
*/

function search(query: string, buildSheet: any) {

    document.getElementById("search-results-heading")!.innerHTML = `Search results for "${query}"`;

    let keys = Object.keys(buildSheet.pageData);

    let querySplit = query.toLowerCase().split(/\s+/);

    let returns: any = {};

    for (let key of keys) {
        let pageData = buildSheet.pageData[key];
        let matchFactor = getSearchMatchFactor(querySplit, pageData);
        if (matchFactor > 0) {
            if (!returns[matchFactor]) {
                returns[matchFactor] = [key];
            }
            else {
                returns[matchFactor].push(key);
            }
        }
    }

    let matchFactors = Object.keys(returns).sort().reverse();

    for (let matchFactor of matchFactors) {
        for (let key of returns[matchFactor.toString()]) {
            let pageData = buildSheet.pageData[key];
            document.getElementById("search-results")!.innerHTML += renderArticleFeature(key, pageData);
        }
    }

}

// TODO
function getSearchMatchFactor(query: string[], pageData: PageData): number {
    let nameSplit = pageData.name.toLowerCase().split(" ");
    let matches = 0;
    for (let queryWord of query) {
        if (nameSplit.includes(queryWord)) {
            matches++;
        }
    }
    return matches / query.length;
}

function parseQuery(query: string): string {
    let searchParams = new URLSearchParams(query);
    return searchParams.get("q")!.toLowerCase();
}

fetch("/res/build_sheet.json")
.then(res => res.json())
.then(buildSheet => {
    let query = window.location.search;
    if (query !== "") {
        let parsedQuery = parseQuery(query);
        search(parsedQuery, buildSheet);
    }
});
