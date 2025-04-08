/*
**  Somerled Pages - A program for creating family encyclopedias
**  Copyright (C) 2023-2025 Jack J. Miller
**  Licensed under version 3 of the GNU General Public License
*/

function renderArticleFeature(articleName: string, pageData: PageData): string {

    return htmlString(`
        <a href="/wiki/${articleName}.html" class="article-feature" style="background-image: url('http://localhost:3000/media/${pageData.imageSrc}');">
            <div class="article-feature-mask">
                <div class="article-feature-inner">
                    <h1>${pageData.name}</h1>
                    <h2>${renderDate(pageData.born)} — ${renderDate(pageData.died)}</h2>
                </div>
            </div>
        </a>
    `);

}

function htmlString(html: string): string {
    return html.trim().replace(/\s+/g, " ");
}

function submitSearch() {
    let value = (document.getElementById("search") as HTMLInputElement).value;
    let query = value.replace(/\s+/g, "%20");
    window.location.href = `/search.html?article-name=${query}`;
}

function submitAdvancedSearch() {

    let params = new Array();

    considerParamInQuery("article-name", params);
    considerParamInQuery("birth-from", params);
    considerParamInQuery("birth-to", params);
    considerParamInQuery("death-from", params);
    considerParamInQuery("death-to", params);

    let query = params.join("&");

    window.location.href = `/search.html?${query}`;

}

function considerParamInQuery(paramID: string, params: string[]) {
    let paramValue = (document.getElementById(`adv-srch-${paramID}`) as HTMLInputElement).value;
    paramValue = paramValue.trim().toLowerCase().replace(/\s+/g, "%20");
    if (paramValue) params.push(`${paramID}=${paramValue}`);
}

function element(id: string): any {
    return document.getElementById(id);
}

function renderDate(rawDate: string): string {

    if (rawDate == "Unknown") return rawDate;

    let circa = (rawDate[0] === "c") ? "circa" : "";
    if (circa) rawDate = rawDate.slice(1);

    let date = rawDate.split("-");
    let day = (date[0] === "?") ? "" : date[0];
    let month = (date[1] === "?") ? "" : MONTHS[parseInt(date[1])];
    let year = (date[2] === "?") ? "" : date[2];

    return [circa, day, month, year].join(" ").trim().replace(/\s+/g, " ");
}

document.getElementById("search-form")!.addEventListener("submit", event => {
    event.preventDefault();
    submitSearch();
});
