function search(query: string, buildSheet: any) {

    document.getElementById("search-results-heading")!.innerHTML = `Search results for "${query}"`;

    let keys = Object.keys(buildSheet.pageData);

    for (let key of keys) {
        let pageData = buildSheet.pageData[key];
        if (includedInSearch(query, pageData))
        document.getElementById("search-results")!.innerHTML += renderArticleFeature(key, pageData);
    }
}

function includedInSearch(query: string, pageData: PageData): boolean {
    return true;
}

fetch("/res/build_sheet.json")
.then(res => res.json())
.then(buildSheet => {
    search("jack miller", buildSheet);
});
