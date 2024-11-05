/*
**  Somerled Pages - A program for creating family encyclopedias
**  Copyright (C) 2023-2024 Jack J. Miller
**  Licensed under version 3 of the GNU General Public License
*/

function search(query: SearchQuery, buildSheet: any) {

    document.getElementById("search-results-heading")!.innerHTML = `Search results for "${query["article-name"].join(" ")}"`;

    let keys = Object.keys(buildSheet.pageData);

    let articleName = query["article-name"];

    let returns: any = {};

    for (let key of keys) {
        let pageData = buildSheet.pageData[key];
        let matchFactor = getSearchMatchFactor(query, pageData);
        if (matchFactor > 0) {
            if (!returns[matchFactor]) returns[matchFactor] = [key];
            else returns[matchFactor].push(key);
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
function getSearchMatchFactor(query: SearchQuery, pageData: PageData): number {

    let nameSplit = pageData.name.toLowerCase().split(" ");
    let matches = 0;

    if (!querySatisfiesDateConditions(query, pageData)) return 0;

    for (let queryWord of query["article-name"]) {
        if (nameSplit.includes(queryWord)) {
            matches++;
        }
    }

    return matches / query["article-name"].length;

}

function querySatisfiesDateConditions(query: SearchQuery, pageData: PageData): boolean {
    let birthNumerised = numeriseDate(pageData.born);
    let deathNumerised = numeriseDate(pageData.died);
    if (!Number.isNaN(query["birth-from"]) && query["birth-from"] > birthNumerised) return false;
    if (!Number.isNaN(query["birth-to"]) && query["birth-to"] < birthNumerised) return false;
    if (!Number.isNaN(query["death-from"]) && query["death-from"] > deathNumerised) return false;
    if (!Number.isNaN(query["death-to"]) && query["death-to"] < deathNumerised) return false;
    return true;
}

// TODO
function numeriseDate(date: string): number {
    if (!date) return NaN;
    let year = date.split("-").at(-1);
    return (year === "?") ? NaN : parseInt(year as string);
}

function parseQuery(query: string): SearchQuery {

    let searchParams = new URLSearchParams(query);

    let articleName = searchParams.get("article-name") || "";
    let birthFrom = searchParams.get("birth-from") || "";
    let birthTo = searchParams.get("birth-to") || "";
    let deathFrom = searchParams.get("death-from") || "";
    let deathTo = searchParams.get("death-to") || "";

    return {
        "article-name": articleName.toLowerCase().replace(/\%20/, " ").split(" "),
        "birth-from": parseInt(birthFrom),
        "birth-to": parseInt(birthTo),
        "death-from": parseInt(deathFrom),
        "death-to": parseInt(deathTo)
    };

}

fetch("/res/build_sheet.json")
.then(res => res.json())
.then(buildSheet => {
    let query = window.location.search;
    if (query !== "") {
        let parsedQuery = parseQuery(query);
        console.log("Parsed Query");
        console.log(parsedQuery);
        search(parsedQuery, buildSheet);
    }
});
