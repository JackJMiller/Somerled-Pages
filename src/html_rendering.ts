/*
**  Somerled Pages - A program for creating family encyclopedias
**  Copyright (C) 2023-2024 Jack J. Miller
**  Licensed under version 3 of the GNU General Public License
*/

import { RefListing, TestimonialRefListing, CensusRefListing, DeathCertificateRefListing, BirthCertificateRefListing, MarriageCertificateRefListing, ValuationRollRefListing, LazyRefListing, BookRefListing, JournalRefListing, NewspaperRefListing, WebsiteRefListing } from "./ref_listing_interfaces";
import { htmlString } from "./rendering";
import { BuildData, ImageDefinition, InlineElement, Metadata } from "./interfaces";

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
                        <span class="logo-somerled massive-text">Somerled</span> <span class="logo-pages massive-text">Pages</span>
                        <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.</p>
                        <p>At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
                    </div>
                    <div>
                        <h2>Search the encyclopedia...</h2>
                        <div class="vertical-margin five-grid small-text">
                            <span>Article Type</span>
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

function renderFooter(): string {
    return htmlString(`
        <footer>
            <div class="container">
                <div class="footer-inner grid">
                    <h1><span class="logo-somerled">Somerled</span> <span class="logo-pages">Pages</span></h1>
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

function renderHeader(): string {
    return htmlString(`
        <div class="header">
            <div class="container">
                <div class="header-inner">
                    <h1></h1>
                    <input class="search-box" type="text" placeholder="Search" id="search"/>
                </div>
            </div>
        </div>
    `);
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
                <div class="somerled-pages-logo">A family encyclopedia created with <span class="logo-somerled small-text">Somerled</span> <span class="logo-pages small-text">Pages</span></div>
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
    renderHomepage,
    renderFooter,
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
