/*
**  Somerled Pages - A program for creating family encyclopedias
**  Copyright (C) 2023-2024 Jack J. Miller
**  Licensed under version 3 of the GNU General Public License
*/

import { markImage, throwError, throwWarning } from "./functions";
import { RefListing, TestimonialRefListing, CensusRefListing, DeathCertificateRefListing, BirthCertificateRefListing, MarriageCertificateRefListing, ValuationRollRefListing, LazyRefListing, BookRefListing, JournalRefListing, NewspaperRefListing, WebsiteRefListing } from "./ref_listing_interfaces";
import { htmlString, isSplitFormat, renderElement, renderRefListing, renderQuickRefListing, substituteLinksAndCitations } from "./rendering";
import { BuildData, ImageDefinition, InlineElement, Metadata } from "./interfaces";

function renderArticle(source: InlineElement[], metadata: Metadata, buildData: BuildData): string {

    let headerHTML = renderHeader();
    let articleHeaderHTML = renderArticleHeader(source, metadata);
    let renderedBody = renderBody(source, metadata, buildData);
    let navbar = renderNavbar(metadata);
    let images = renderImages(metadata, buildData);
    let referenceListings = renderReferenceListings(buildData);

    return htmlString(`
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8"/>
                <meta name="viewport" content="width=device-width"/>
                <title>${metadata["name"]} - A Somerled Pages family encyclopedia</title>
                <link rel="stylesheet" href="../res/main.css" type="text/css" charset="utf-8"/>
                <link rel="stylesheet" href="../res/article.css" type="text/css" charset="utf-8"/>
                <link rel="icon" href="../res/favicon.png" type="image/png"/>
            </head>
            <body>
                ${headerHTML}
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

                <script src="../res/article.js" type="text/javascript"></script>
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
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width" />
                <title>Somerled Pages</title>
                <link rel="stylesheet" href="../res/main.css" type="text/css" charset="utf-8"/>
                <link rel="stylesheet" href="../res/homepage.css" type="text/css" charset="utf-8"/>
                <link rel="icon" href="../res/favicon.png" type="image/png"/>
            </head>
            <body>

                ${renderHeader()}

                ${renderHomepageLead()}

                ${renderArticleFeatures("Featured Articles", buildData.configuration.features, buildData)}

                ${renderArticleFeatures("All Articles", buildData.configuration.members, buildData)}

                ${renderFooter()}

            </body>
        </html>
    `);
}

function renderHomepageLead(): string {
    return htmlString(`
        <div class="body">
            
            <div class="inner-container">
                <div class="homepage-top">
                    <div>
                        <h1 class="massive-text">${renderLogo()}</h1>
                        <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.</p>
                        <p>At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
                    </div>
                    <div>
                        <h2 style="margin-bottom: 2rem;">Search the encyclopedia...</h2>
                        <h3>Article Type</h3>
                        <div class="vertical-margin four-grid small-text">
                            <div>
                                <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike"/>
                                <label for="vehicle1">Any</label>
                            </div>
                            <div>
                                <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike"/>
                                <label for="vehicle1">Person</label>
                            </div>
                            <div>
                                <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike"/>
                                <label for="vehicle1">Place</label>
                            </div>
                            <div>
                                <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike"/>
                                <label for="vehicle1">Lineage</label>
                            </div>
                        </div>
                        <input type="text" class="vertical-margin text-box" placeholder="Article name"/>
                        <input type="text" class="vertical-margin text-box" placeholder="Text in article"/>
                        <h3>Birth</h3>
                        <div class="two-columns">
                            <input type="text" class="vertical-margin text-box" placeholder="From"/>
                            <input type="text" class="vertical-margin text-box" placeholder="To"/>
                        </div>
                        <h3>Death</h3>
                        <div class="two-columns">
                            <input type="text" class="vertical-margin text-box" placeholder="From"/>
                            <input type="text" class="vertical-margin text-box" placeholder="To"/>
                        </div>
                        <button onclick="console.log('Submit');" class="clean-button vertical-margin">Search</button>
                    </div>
                </div>
            </div>
        </div>
    `);
}

function renderArticleFeatures(heading: string, articleNames: string[], buildData: BuildData): string {
    return htmlString(`
        <div class="inner-container">
            <h1 class="heading">${heading}</h1>
            <div class="four-grid">
                ${articleNames.map((articleName: string) => renderArticleFeature(articleName, buildData)).join("")}
            </div>
        </div>
    `);
}

function renderArticleFeature(articleName: string, buildData: BuildData): string {

    if (!buildData.configuration.members.includes(articleName)) {
        throwWarning(`Article '${articleName}' is referenced as a homepage feature but is not included in build.`, "index.html");
        return "";
    }

    let pageData = buildData.pageData[`wiki/${articleName}`];

    return htmlString(`
        <a href="/wiki/${articleName}.html" class="article-feature" style="background-image: url('http://localhost:3000/media/${pageData.imageSrc}');">
            <div class="article-feature-mask">
                <div class="article-feature-inner">
                    <h1>${pageData.name}</h1>
                    <h2>${pageData.born} — ${pageData.died}</h2>
                </div>
            </div>
        </a>
    `);

}

function renderFooter(): string {
    return htmlString(`
        <footer>
            <div class="container">
                <div class="footer-inner grid">
                    <h1>${renderLogo()}</h1>
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


function renderGallery(element: any, buildData: BuildData): string { 

    let galleryItems: string[] = element.images.map((image: ImageDefinition) => {
        markImage(image.src, buildData);
        return renderGalleryImage(image.src, image.caption || "<i>No caption provided</i>");
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

function renderGalleryImage(src: string, caption: string): string {

    return htmlString(
        `<div class="gallery-image-container">
            <img class="gallery-image" src="../media/${src}"/>
            <div class="gallery-image-text-container">
                <span class="gallery-image-text">${caption}</span>
            </div>
        </div>`
    );

}

function renderLogo(): string {
    return htmlString(`
        <a href="/">
            <span class="logo-somerled">Somerled</span> <span class="logo-pages">Pages</span>
        </a>
    `);
}

function renderHeader(): string {
    return htmlString(`
        <div class="header">
            <div class="container">
                <div class="header-inner">
                    <h1></h1>
                    <input class="text-box" type="text" placeholder="Search" id="search"/>
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

function renderSearchPage(): string {
    return htmlString(`
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width" />
                <title>Somerled Pages</title>
                <link rel="stylesheet" href="../res/main.css" type="text/css" charset="utf-8"/>
                <link rel="stylesheet" href="../res/homepage.css" type="text/css" charset="utf-8"/>
                <link rel="icon" href="../res/favicon.png" type="image/png"/>
            </head>
            <body>

                ${renderHeader()}

                <div id="search-results">
                </div>

                ${renderFooter()}

                <script src="../res/search.js" type="text/javascript"></script>
            </body>
        </html>
    `);
}

function renderSearchResults(results: string[], buildData: BuildData): string {
    return renderArticleFeatures("Search results for \"jack miller\"", results, buildData);
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
        subtitle = `<h4 class="page-subtitle">${metadata["info"].born || "Unknown"} — ${metadata["info"].died || "Unknown"}</h4>`;
    }
    if (metadata["info"]["subtitle"]) {
        subtitle = subtitle + `<h4 class="page-subtitle">${metadata["info"]["subtitle"]}</h4>`;
    }

    return htmlString(`
        <div class="article-header">
            <div class="container">
                <h1 class="page-title">${metadata["info"].name}</h1>
                ${subtitle}
                <span class="sub-subtitle">A family encyclopedia created with ${renderLogo()}</span>
            </div>
        </div>
    `);
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
    renderGallery,
    renderGalleryImage,
    renderImage,
    renderSearchPage,
    renderStandardElement,
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
    renderNewspaperRefListing,
    renderWebsiteRefListing,
    renderCitation,
    renderLink
};
