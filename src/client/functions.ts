function renderArticleFeature(articleName: string, pageData: PageData): string {

    return htmlString(`
        <a href="/${articleName}.html" class="article-feature" style="background-image: url('http://localhost:3000/media/${pageData.imageSrc}');">
            <div class="article-feature-mask">
                <div class="article-feature-inner">
                    <h1>${pageData.name}</h1>
                    <h2>${pageData.born} — ${pageData.died}</h2>
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
    let query = value.replace(/\s+/, "%20");
    window.location.href = `/search.html?q=${query}`;
}

document.getElementById("search-form")!.addEventListener("submit", event => {
    event.preventDefault();
    submitSearch();
})
