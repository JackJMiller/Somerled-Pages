/*
**  Somerled Pages - A program for creating family encyclopedias
**  Copyright (C) 2023-2025 Jack J. Miller
**  Licensed under version 3 of the GNU General Public License
*/

import { markImage, parseLink, throwError, throwWarning } from "./functions";
import { RefListing, TestimonialRefListing, CensusRefListing, DeathCertificateRefListing, BirthCertificateRefListing, MarriageCertificateRefListing, ValuationRollRefListing, LazyRefListing, BookRefListing, JournalRefListing, NewspaperRefListing, WebsiteRefListing, ElectoralRegisterRefListing } from "./ref_listing_interfaces";
import { htmlString, isSplitFormat, renderDate, renderElement, renderRefListing, renderQuickRefListing } from "./rendering";
import { BuildData, ImageDefinition, InfoBox, InlineElement, Metadata, PageData } from "./interfaces";

function renderScriptImports(scripts: string[]): string {
    return scripts.map((script: string) => htmlString(`
        <script src="../res/${script}" type="text/javascript"></script>
    `)).join("");
}

function renderArticle(source: InlineElement[], metadata: Metadata, buildData: BuildData): string {

    let articleHeaderHTML = renderArticleHeader(source, metadata);
    let renderedBody = renderBody(source, metadata, buildData);
    let navbar = renderNavbar(metadata);
    let images = renderImages(metadata, buildData);
    let referenceListings = renderReferenceListings(buildData);

    return htmlString(`
        <!DOCTYPE html>
        <html>
            ${renderHead(["main.css", "article.css"])}
            <body>
                ${renderHeader(false, buildData)}
                ${articleHeaderHTML}
                ${navbar}
                <div class="main-body">
                    <div class="container">
                        ${(isSplitFormat(metadata["article-type"])) ? "<div class=\"main-body-split\">" : ""}
                            <div>
                                ${renderedBody}
                                ${referenceListings}
                            </div>
                            <div class="images-column">
                                ${images}
                            </div>
                        ${(isSplitFormat(metadata["article-type"])) ? "</div>" : ""}
                    </div>
                    ${renderFooter()}
                </div>
                ${renderScriptImports(["functions.js", "article.js"])}
            </body>
        </html>
    `);
}

function renderReferenceListings(buildData: BuildData): string {
    if (buildData.citations.length === 0) {
        // TODO make HTML-specific function
        return "<p>There are no references yet.</p>";
    }
    let output = "";
    let inDocumentKeys = Object.keys(buildData.inDocumentRefListings);
    let quickRefKeys = Object.keys(buildData.quickReferences);
    let index = 1;
    for (let citation of buildData.citations) {
        if (inDocumentKeys.includes(citation) && quickRefKeys.includes(citation)) {
            throwError(`References with identifier '${citation}' found both in document and in data/quick_references.json. Remove one so that the compiler may pick.`, buildData.location, buildData, false);
        }
        if (inDocumentKeys.includes(citation)) {
            let refListing = buildData.inDocumentRefListings[citation];
            refListing.id = index.toString();
            let renderedRefListing = renderRefListing(refListing, buildData);
            output = output + "\n" + renderedRefListing;
        }
        else if (quickRefKeys.includes(citation)) {
            let renderedRefListing = renderQuickRefListing(citation, index, buildData);
            output = output + "\n" + renderedRefListing;
        }
        else {
            throwError(`Cannot find reference listing with '${citation}' identifier.`, buildData.location, buildData, false);
        }
        index++;
    }
    return output;
}

function renderImages(metadata: Metadata, buildData: BuildData) {

    let images = "";
    if (metadata["infobox-rendered"]) {
        images = images + metadata["infobox-rendered"];
    }

    if (!metadata["images"]) return images;

    images = images + metadata["images"].map((image: ImageDefinition) => {
        markImage(image.src, buildData);
        return htmlString(`
            <div class="box">
                <img src="../media/${image.src}"/>
                ${image.caption ? `<p class="caption">${image.caption}</p>` : ""}
            </div>`
        );
    }).join("");

    return images;
}

function renderInfoBox(infobox: InfoBox, metadata: Metadata, buildData: BuildData): string {

    return htmlString(`
        <div class="box infobox">
            ${infobox.image ? `<img src="../media/${infobox.image}"/>` : ""}
            ${infobox["image-caption"] ? `<p class="caption">${infobox["image-caption"]}</p>` : ""}
            <div class="grid">
                ${renderInfoBoxEntries(infobox.entries, metadata, buildData)}
            </div>
        </div>`
    );

}

function renderInfoBoxEntries(entries: { [index: string]: string | string[] }, metadata: Metadata, buildData: BuildData): string {
    let output = "";
    let keys = Object.keys(entries);
    if (metadata["born"]) {
        if (keys.includes("Born")) {
            entries["Born"] = [renderDate(metadata["born"]), entries["Born"] as string];
        }
        else {
            entries["Born"] = [renderDate(metadata["born"])];
        }
    }
    if (metadata["died"] && metadata["died"] !== "present") {
        if (keys.includes("Died")) {
            entries["Died"] = [renderDate(metadata["died"]), entries["Died"] as string];
        }
        else {
            entries["Died"] = [renderDate(metadata["died"])];
        }
    }
    keys.forEach((key: string) => {
        let value = entries[key];
        if (value.length > 0) {
            output = output + `<h5>${key}</h5>${renderBoxValue(key, value, metadata, buildData)}\n`
        }
    });
    return output;
}

function renderBoxValue(key: string, value: string | string[], metadata: Metadata, buildData: BuildData): string {
    if (value.constructor.name === "Array") {
        return htmlString(`
            <div>
                ${(value as string[]).map((v: string) => "<p>" + substituteLinksAndCitations(v, buildData) + "</p>").join("")}
            </div>
        `);
    }
    else {
        return htmlString(`
            <div>
                <p>${substituteLinksAndCitations(value as string, buildData)}</p>
            </div>
        `);
    }
}

function substituteLinksAndCitations(text: string, buildData: BuildData): string {
    let q = "text";
    let v = "";
    let links: string[] = [];
    let citations: string[] = [];
    for (let i = 0; i < text.length; i++) {
        let c = text[i];
        if (q === "text") {
            if (c === "[") {
                q = "ref";
                v = "";
            }
        }
        else if (q === "ref") {
            if (c === "[") {
                q = "link";
            }
            else if (c === "]") {
                q = "text";
                // output = output + renderCitation(v);
                if (!citations.includes(v)) {
                    citations.push(v);
                }
            }
            else {
                v = v + c;
            }
        }
        else if (q === "link") {
            if (c === "]") {
                q = "end-of-link";
            }
            else {
                v = v + c;
            }
        }
        else if (q === "end-of-link") {
            if (c === "]") {
                links.push("[[" + v + "]]");
                q = "text";
                v = "";
            }
        }

    }

    buildData.citations = buildData.citations.concat(citations);

    for (let link of links) {
        text = text.replaceAll(link, renderUnparsedLink(link, buildData));
    }

    let index = 1;
    for (let citation of citations) {
        text = text.replaceAll(`[${citation}]`, renderCitation(index.toString()));
        index++;
    }

    return text;
}

function renderUnparsedLink(unparsed: string, buildData: BuildData): string {
    let { placeholder, target } = parseLink(unparsed);
    if (buildData.configuration.members.includes(target)) {
        return renderLink(placeholder, target);
    }
    else if (buildData.configuration.allArticles.includes(target)) {
        return placeholder;
    }
    else {
        throwWarning(`Cannot link to non-existing article '${target}'.`, buildData.location)
        return "";
    }
}

function renderNavbar(metadata: Metadata): string {
    let navbar: string = metadata.headings.map((heading: string) => {
        if (heading === "References") return "";
        return `<a href="" class="navbar-item"><h3>${heading}</h3></a>\n`;
    }).join("");

    return htmlString(`
        <div class="navbar">
            <div class="navbar-items" style="grid-template-columns:${" 1fr".repeat(metadata.headings.length - 1)}">
                ${navbar}
            </div>
        </div>`);
}

function renderBody(source: InlineElement[], metadata: Metadata, buildData: BuildData) {
    let rendered = "";
    source.forEach((element: InlineElement) => {
        rendered = rendered + renderElement(element, metadata, buildData) + "\n";
    });
    rendered = substituteLinksAndCitations(rendered, buildData);
    return rendered;
}

function renderHomepage(buildData: BuildData): string {
    return htmlString(`
        <!DOCTYPE html>
        <html>
            ${renderHead(["main.css", "homepage.css"])}
            <body>

                ${renderHeader(false, buildData)}

                ${renderHomepageLead(buildData)}

                ${renderArticleFeatures("Featured Articles", buildData.configuration.features, buildData)}

                ${renderArticleFeatures("All Articles", buildData.configuration.members, buildData)}

                ${renderFooter()}

                ${renderScriptImports(["functions.js", "homepage.js"])}
            </body>
        </html>
    `);
}

function renderHomepageLead(buildData: BuildData): string {

    let logoSize = Math.max(1000 / buildData.projectPackage.name.length, 36) + "px";

    return htmlString(`
        <div class="body">
            
            <div class="inner-container">
                <div class="homepage-top">
                    <div>
                        <h1>${renderLogo(logoSize, buildData)}</h1>
                        ${renderSomerledPagesCredit()}
                        ${buildData.projectPackage.description.split("\n").map(e => `<p>${e}</p>`).join("")}
                    </div>
                    ${renderAdvancedSearchForm()}
                </div>
            </div>
        </div>
    `);

}

function renderAdvancedSearchForm() {
    return htmlString(`
        <form id="advanced-search">
            <h2 style="margin-bottom: 2rem;">Search the encyclopedia...</h2>
            <input type="text" class="vertical-margin text-box" id="adv-srch-article-name" placeholder="Article name"/>
            <h3>Birth</h3>
            <div class="two-columns">
                <input type="text" class="vertical-margin text-box" id="adv-srch-birth-from" placeholder="From"/>
                <input type="text" class="vertical-margin text-box" id="adv-srch-birth-to" placeholder="To"/>
            </div>
            <h3>Death</h3>
            <div class="two-columns">
                <input type="text" class="vertical-margin text-box" id="adv-srch-death-from" placeholder="From"/>
                <input type="text" class="vertical-margin text-box" id="adv-srch-death-to" placeholder="To"/>
            </div>
            <button onclick="submitAdvancedSearch();" class="clean-button vertical-margin">Search</button>
        </form>
    `);
}

function renderArticleFeatures(heading: string, articleNames: string[], buildData: BuildData): string {
    return htmlString(`
        <div class="inner-container">
            <h1 class="heading">${heading}</h1>
            <div class="four-grid">
                ${articleNames.map((articleName: string) => renderArticleFeature(articleName, buildData.pageData[articleName])).join("")}
            </div>
        </div>
    `);
}

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

function renderExtraStylesheets(stylesheets: string[] | null): string {
    if (!stylesheets) return "";
    return stylesheets.map((stylesheet: string) => htmlString(`
        <link rel="stylesheet" href="../res/${stylesheet}" type="text/css" charset="utf-8"/>
    `)).join("");
}

function renderFooter(): string {
    return htmlString(`
        <footer>
            <div class="container">
                <div class="footer-inner grid">
                    <h1>${renderSomerledPagesLogo()}</h1>
                    <div class="four-grid align-centre">
                        <span><a href="/">Home</a></span>
                        <span><a href="/explore.html">Explore</a></span>
                        <span><a href="/tree.html">Family Tree</a></span>
                        <span><a href="/about.html">About</a></span>
                    </div>
                </div>
            </div>
            <div class="sub-footer">
                <div class="container">
                    <span>© Copyright notice goes here</span>
                </div>
            </div>
        </footer>
    `);
}


function renderCarouselGallery(element: any, buildData: BuildData): string { 

    let galleryItems: string[] = element.images.map((image: ImageDefinition) => {
        markImage(image.src, buildData);
        return renderCarouselGalleryImage(image.src, image.caption || "<i>No caption provided</i>");
    });

    return htmlString(`
        <div class="gallery">
            <button onclick="shiftGallery(-1);" class="gallery-arrow-container">
                <img style="width: 40px;" src="../res/arrow_left.svg"/>
            </button>
        <div>
        ${galleryItems.join("")}
        </div>
            <button onclick="shiftGallery(1);" class="gallery-arrow-container">
                <img style="width: 40px;" src="../res/arrow_right.svg"/>
            </button>
        </div>`
    );

}

function renderCarouselGalleryImage(src: string, caption: string): string {

    return htmlString(
        `<div class="gallery-image-container">
            <img class="gallery-image" src="../media/${src}"/>
            <div class="gallery-image-text-container">
                <span class="gallery-image-text">${caption}</span>
            </div>
        </div>`
    );

}

function renderLogo(size: string, buildData: BuildData): string {
    let name = buildData.projectPackage.name;
    return htmlString(`
        <a href="/">
            <span style="color: black; font-size: ${size}; font-family: 'Libre Baskerville', serif;">${name}</span>
        </a>
    `);
}

function renderSomerledPagesLogo(): string {
    return htmlString(`
        <a href="/">
            <span class="logo-somerled">Somerled</span> <span class="logo-pages">Pages</span>
        </a>
    `);
}

function renderHead(extraStylesheets: string[] | null = null): string {
    return htmlString(`
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width" />
            <title>Somerled Pages</title>
            ${renderExtraStylesheets(extraStylesheets)}
            <link rel="icon" href="../res/favicon.png" type="image/png"/>
        </head>
    `);
}

function renderHeader(includeLogo: boolean, buildData: BuildData): string {
    return htmlString(`
        <div id="header">
            <div class="container">
                <div class="header-inner">
                    <h1>${(includeLogo) ? renderLogo("auto", buildData): ""}</h1>
                    <form id="search-form">
                        <input id="search" class="text-box" type="text" placeholder="Search"/>
                    </form>
                </div>
            </div>
        </div>
    `);
}

function renderImage(element: any, buildData: BuildData): string {

    markImage(element.src, buildData);

    return htmlString(`
        <div class="small-box box">
            <img src="../media/${element.src}"/>
            ${element.caption ? `<p class="caption">${element.caption}</p>` : ""}
        </div>`
    );

}

function renderSearchPage(buildData: BuildData): string {
    return htmlString(`
        <!DOCTYPE html>
        <html>
            ${renderHead(["main.css", "homepage.css"])}
            <body>

                ${renderHeader(false, buildData)}

                <div class="inner-inner-container">
                    ${renderAdvancedSearchForm()}
                </div>

                <div class="inner-container">
                    <h1 id="search-results-heading" class="heading"></h1>
                    <div id="search-results" class="four-grid">
                    </div>
                </div>

                ${renderFooter()}

                ${renderScriptImports(["values.js", "build_sheet.js", "functions.js", "search.js"])}
            </body>
        </html>
    `);
}

function renderTreePage(buildData: BuildData): string {
    return htmlString(`
        <!DOCTYPE html>
        <html>
            ${renderHead(["main.css", "tree.css"])}
            <body onresize="fixCanvas()">
                ${renderHeader(false, buildData)}
                <div id="tree-container">
                    <div id="tree">
                    </div>
                </div>
                ${renderFooter()}
                ${renderScriptImports(["build_sheet.js", "tree_nodes.js", "functions.js", "tree.js"])}
            </body>
        </html>
    `);
}

function renderStandardElement(element: any): string {
    let tag = element.tag;
    let elementID = (element.id !== undefined) ? "id=\""+element.id+"\"" : "";
    let elementClass = (element.class !== undefined) ? "class=\""+element.class+"\"" : "";
    return `<${tag} ${elementID} ${elementClass}>${element.inner}</${tag}>`;
}

function renderArticleHeader(source: InlineElement[], metadata: Metadata): string {

    metadata["name"] = metadata["info"]["name"];
    metadata["article-type"] = metadata["info"]["article-type"];
    metadata["born"] = metadata["info"]["born"];
    metadata["died"] = metadata["info"]["died"];
    metadata["images"] = metadata["info"]["images"] as ImageDefinition[];

    let subtitle = "";
    if (metadata["info"]["article-type"] === "person") {
        subtitle = `<h4 class="page-subtitle">${renderDate(metadata["born"])} — ${renderDate(renderDate(metadata["died"]))}</h4>`;
    }
    if (metadata["info"]["subtitle"]) {
        subtitle = subtitle + `<h4 class="page-subtitle">${metadata["info"]["subtitle"]}</h4>`;
    }

    return htmlString(`
        <div class="article-header">
            <div class="container">
                <h1 class="page-title">${metadata.info.name}</h1>
                ${subtitle}
                ${renderSomerledPagesCredit()}
            </div>
        </div>
    `);

}


function renderSomerledPagesCredit(): string {
    return `<p class="framework-credit">Created with ${renderSomerledPagesLogo()}</p>`;
}

function renderTestimonialRefListing(element: TestimonialRefListing): string {
    return `<div class="reference">${element.id}. Told by ${element["name"]} to ${element["witness"]}. Testified ${element["date"]}.</div>`;
}

function renderCensusRefListing(element: CensusRefListing, buildData: BuildData): string {
    let text = `${element["year"]} census`;
    if (element["link"]) {
        buildData.sourcesCited.push(element.link);
        text = `<a target="_blank" href="../sources/${element["link"]}">${text}</a>`;
    }
    text = "The " + text;
    return `<div class="reference">${element.id}. ${text}.</div>`;
}

function renderDeathCertificateRefListing(element: DeathCertificateRefListing, buildData: BuildData): string {
    let opening = element["is-copy"] ? "Copy of the death certificate" : "Death certificate";
    const ending = element["is-copy"] ? "Issued" : "Registered";
    const date = element["date"] || "on an unknown date";
    if (element["link"]) {
        buildData.sourcesCited.push(element.link);
        opening = `<a target="_blank" href="../sources/${element["link"]}">${opening}</a>`;
    }
    return `<div class="reference">${element.id}. ${opening} of ${element["name"]}. ${ending} ${date}, ${element["place"]}.</div>`;
}

function renderBirthCertificateRefListing(element: BirthCertificateRefListing, buildData: BuildData): string {
    let opening = element["is-copy"] ? "Copy of the birth certificate" : "Birth certificate";
    const ending = element["is-copy"] ? "Issued" : "Registered";
    const date = element["date"] || "on an unknown date";
    if (element["link"]) {
        buildData.sourcesCited.push(element.link);
        opening = `<a target="_blank" href="../sources/${element["link"]}">${opening}</a>`;
    }
    return `<div class="reference">${element.id}. ${opening} of ${element["name"]}. ${ending} ${date}, ${element["place"]}.</div>`;
}

function renderMarriageCertificateRefListing(element: MarriageCertificateRefListing, buildData: BuildData): string {
    let opening = element["is-copy"] ? "Copy of the marriage certificate" : "Marriage certificate";
    const ending = element["is-copy"] ? "Issued" : "Registered";
    const date = element["date"] || "on an unknown date";
    if (element["link"]) {
        buildData.sourcesCited.push(element.link);
        opening = `<a target="_blank" href="../sources/${element["link"]}">${opening}</a>`;
    }
    return `<div class="reference">${element.id}. ${opening} of ${element["party-one"]} and ${element["party-two"]}. ${ending} ${date}, ${element["place"]}.</div>`;
}

function renderValuationRollRefListing(element: ValuationRollRefListing, buildData: BuildData): string {
    // TODO: change `source-link` to `link`
    if (element["source-link"]) {
        buildData.sourcesCited.push(element["source-link"]);
        return `<div class="reference">${element.id}. <a href="../sources/${element["source-link"]}">Valuation roll</a> at ${element["source-location"]}. Dated ${element["source-date"]}.</div>`;
    }
    else {
        return `<div class="reference">${element.id}. Valuation roll at ${element["source-location"]}. Dated ${element["source-date"]}.</div>`;
    }
}

function renderLazyRefListing(element: LazyRefListing): string {
    if (element["source-link"]) {
        return `<div class="reference">${element.id}. <a href=\"${element["source-link"]}\">${element["source-value"]}</a></div>`;
    }
    else {
        return `<div class="reference">${element.id}. ${element["source-value"]}</div>`;
    }
}

function renderBookRefListing(element: BookRefListing): string {
    return `<div class="reference">${element.id}. ${element["last-name"]}, ${element["first-name"]} (${element["source-year"]}) <a href="${element["source-link"]}"><i>${element["source-title"]}</i></a>. pp. ${element["pages"]}</div>`;
}

function renderJournalRefListing(element: JournalRefListing): string {
    return `<div class="reference">${element.id}. <a href="${element["source-link"]}">${element["name-of-publication"]}</a>. ${element["source-date"]}. pp. ${element["pages"]}</div>`;
}

function renderNewspaperRefListing(element: NewspaperRefListing): string {
    return `<div class="reference">${element.id}. <a href="${element["source-link"]}">"${element["source-title"]}"</a>. <i>${element["name-of-publication"]}</i>. ${element["source-date"]}. pp. ${element["pages"]}</div>`;
}

function renderWebsiteRefListing(element: WebsiteRefListing): string {
    return `<div class="reference">${element.id}. Website <a href="${element["source-link"]}">${element["name-of-website"]}</a>. Retrieved ${element["date-retrieved"]}.</div>`;
}

function renderElectoralRegisterRefListing(element: ElectoralRegisterRefListing, buildData: BuildData): string {
    buildData.sourcesCited.push(element.link);
    return `<div class="reference">${element.id}. The <a href="/sources/${element["link"]}">${element["year"]} electoral register</a>.</div>`;
}

function renderCitation(id: string) {
    return `<sup><a href="">[${id}]</a></sup>`;
}

function renderLink(placeholder: string, target: string) {
    return `<a href="${target}.html">${placeholder}</a>`;
}

export = {
    renderArticle,
    renderArticleFeatures,
    renderHomepage,
    renderFooter,
    renderCarouselGallery,
    renderCarouselGalleryImage,
    renderImage,
    renderInfoBox,
    renderSearchPage,
    renderStandardElement,
    renderTreePage,
    renderArticleHeader,
    renderHeader,
    renderTestimonialRefListing,
    renderCensusRefListing,
    renderDeathCertificateRefListing,
    renderBirthCertificateRefListing,
    renderMarriageCertificateRefListing,
    renderValuationRollRefListing,
    renderLazyRefListing,
    renderBookRefListing,
    renderJournalRefListing,
    renderElectoralRegisterRefListing,
    renderNewspaperRefListing,
    renderWebsiteRefListing,
    renderCitation
};
