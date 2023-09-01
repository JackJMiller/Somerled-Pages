const QUICK_REFERENCES = require("./copied/quick_references.json");

function renderArticle(source, metadata) {
    const headerHTML = renderHeader(source, metadata);
    const renderedBody = renderBody(source, metadata);
    return `
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width"/>
        <title>${metadata["name"]} - A Somerled Pages family encyclopedia</title>
        <link rel="stylesheet" href="../res/main.css" type="text/css" charset="utf-8"/>
        <link rel="icon" href="../res/favicon.png" type="image/png"/>
    </head>
    <body>
        ${headerHTML}
        ${renderNavbar(metadata)}
        <div class="main-body">
            <div class="container">
            ${(isSplitFormat(metadata["article-type"])) ? "<div class=\"main-body-split\">" : ""}
                <div>
                    ${renderedBody}
                </div>
                <div class="images-column">
                    ${renderImages(metadata)}
                </div>
            </div>
            ${(isSplitFormat(metadata["article-type"])) ? "</div>" : ""}
        </div>
        <script src="../res/script.js" type="text/javascript"></script>
    </body>
</html>
    `;
}

function renderImages(metadata) {

    let images = "";
    if (metadata["infobox"]) {
        images = images + metadata["infobox"];
    }

    if (!metadata["images"]) return images;

    metadata["images"].forEach(image => {
        images = images + `
<div class="box">
    <img src="../media/${image.src}"/>
    ${image.caption ? `<p class="caption">${image.caption}</p>` : ""}
</div>`;
    });

    return images
}


function renderHeader(source, metadata) {
    let header;
    source.forEach(element => {
        if (element.type === "info") {
            infoObject = element;
            return
        }
    });

    if (infoObject === undefined) return "";

    metadata["name"] = infoObject["name"];
    metadata["article-type"] = infoObject["article-type"];
    metadata["born"] = infoObject["born"];
    metadata["died"] = infoObject["died"];
    metadata["images"] = infoObject["images"];

    let subtitle = "";
    if (metadata["type"] === "wiki" && infoObject["article-type"] === "person") {
        subtitle = `<h4 class="page-subtitle">${infoObject.born || "Unknown"} — ${infoObject.died || "Unknown"}</h4>`;
    }
    if (infoObject["subtitle"]) {
        subtitle = subtitle + `<h4 class="page-subtitle">${infoObject["subtitle"]}</h4>`;
    }

    return `
<div class="header">
    <div class="container">
        <h1 class="page-title">${infoObject.name}</h1>
        ${subtitle}
        <div class="somerled-pages-logo">A <span class="logo-somerled">Somerled</span> <span class="logo-pages">Pages</span> family encyclopedia</div>
    </div>
</div>`;
}

function renderNavbar(metadata) {
    let navbar = `
<div class="navbar">
    <div class="navbar-items" style="grid-template-columns:${" 1fr".repeat(metadata.headings.length - 1)}">\n`;

    metadata.headings.forEach(heading => {
        if (heading !== "References") {
            navbar = navbar + `<a href="" class="navbar-item"><h3>${heading}</h3></a>\n`;
        }
    });
    navbar = navbar + "    </div>\n</div>";
    return navbar;
}

function renderBody(source, metadata) {
    let rendered = "";
    source.forEach(element => {
        rendered = rendered + renderElement(element, metadata) + "\n";
    });
    rendered = substituteReferences(rendered);
    return rendered;
}

function substituteReferences(text) {
    let q = "text";
    let v = "";
    let output = "";
    for (let i = 0; i < text.length; i++) {
        let c = text[i];
        if (q === "text") {
            if (c === "[") {
                q = "ref";
                v = "";
            }
            else {
                output = output + c;
            }
        }
        else if (q === "ref") {
            if (c === "]") {
                q = "text";
                output = output + renderCitation(v);
            }
            else {
                v = v + c;
            }
        }

    }
    return output;
}

function renderElement(element, metadata) {
    if (element.type === "element") {
        return renderStandardElement(element);
    }
    else if (element.type == "img") {
        return renderImage(element);
    }
    else if (element.type == "infobox") {
        metadata["infobox"] = renderInfobox(element, metadata);
        return "";
    }
    else if (element.type == "ref-listing" || element.type == "quick-ref") {
        return renderRefListing(element);
    }
    else if (element.type == "gallery") {
        return renderGallery(element);
    }
    else {
        return "";
    }
}

function renderGallery(element){ 
    let output = "";
    let id = 0;
    for (let image of element.images) {
        output = output + `<img class="gallery-image" src="../media/${image.src}"/>`;
        id++;
    }
    return `<div class="gallery">
    <button onclick="shiftGallery(-1);" class="gallery-arrow-container">
        <img style="width: 40px;" src="../res/arrow_left.svg"/>
    </button>
    <div>
        ${output}
    </div>
    <button onclick="shiftGallery(1);" class="gallery-arrow-container">
        <img style="width: 40px;" src="../res/arrow_right.svg"/>
    </button>
</div>`;
}

function renderRefListing(element) {
    const pages = element["pages"];

    if (element["type"] == "quick-ref") {
        refElement = JSON.parse(JSON.stringify(QUICK_REFERENCES[element["quick-id"]]))
        refElement.id = element.id;
        return renderRefListing(refElement);
    }
    else if (element["source-type"] == "newspaper") {
        return `<div class="reference">${element.id}. <a href="${element["source-link"]}">"${element["source-title"]}"</a>. <i>${element["name-of-publication"]}</i>. ${element["source-date"]}. pp. ${pages}</div>`;
    }
    else if (element["source-type"] == "journal") {
        return `<div class="reference">${element.id}. <a href="${element["source-link"]}">${element["name-of-publication"]}</a>. ${element["source-date"]}. pp. ${pages}</div>`;
    }
    else if (element["source-type"] == "book") {
        return `<div class="reference">${element.id}. ${element["last-name"]}, ${element["first-name"]} (${element["source-year"]}) <a href="${element["source-link"]}"><i>${element["source-title"]}</i></a>. pp. ${pages}</div>`;
    }
    else if (element["source-type"] == "lazy") {
        if (element["source-link"]) {
            return `<div class="reference">${element.id}. <a href=\"${element["source-link"]}\">${element["source-value"]}</a></div>`;
        }
        else {
            return `<div class="reference">${element.id}. ${element["source-value"]}</div>`;
        }
    }
    else if (element["source-type"] == "webpage") {
        return `<div class="reference">${element.id}. Website <a href="${element["source-link"]}">${element["name-of-website"]}</a>. Retrieved ${element["date-retrieved"]}.</div>`;
    }
    else if (element["source-type"] == "marriage-certificate") {
        let opening = element["is-copy"] ? "Copy of the marriage certificate" : "Marriage certificate";
        const ending = element["is-copy"] ? "Issued" : "Registered";
        const date = element["date"] || "on an unknown date";
        if (element["link"]) {
            opening = `<a target="_blank" href="../certificates/${element["link"]}">${opening}</a>`;
        }
        return `<div class="reference">${element.id}. ${opening} of ${element["party-one"]} and ${element["party-two"]}. ${ending} ${date}, ${element["place"]}.</div>`;
    }
    else if (element["source-type"] == "birth-certificate") {
        let opening = element["is-copy"] ? "Copy of the birth certificate" : "Birth certificate";
        const ending = element["is-copy"] ? "Issued" : "Registered";
        const date = element["date"] || "on an unknown date";
        if (element["link"]) {
            opening = `<a target="_blank" href="../certificates/${element["link"]}">${opening}</a>`;
        }
        return `<div class="reference">${element.id}. ${opening} of ${element["name"]}. ${ending} ${date}, ${element["place"]}.</div>`;
    }
    else if (element["source-type"] == "death-certificate") {
        let opening = element["is-copy"] ? "Copy of the death certificate" : "Death certificate";
        const ending = element["is-copy"] ? "Issued" : "Registered";
        const date = element["date"] || "on an unknown date";
        if (element["link"]) {
            opening = `<a target="_blank" href="../certificates/${element["link"]}">${opening}</a>`;
        }
        return `<div class="reference">${element.id}. ${opening} of ${element["name"]}. ${ending} ${date}, ${element["place"]}.</div>`;
    }
    else if (element["source-type"] == "census") {
        let text = `${element["year"]} census`;
        if (element["link"]) {
            text = `<a target="_blank" href="../certificates/${element["link"]}">${text}</a>`;
        }
        text = "The " + text + " of Scotland";
        return `<div class="reference">${element.id}. ${text}.</div>`;
    }
    else if (element["source-type"] == "testimonial") {
        return `<div class="reference">${element.id}. Told by ${element["name"]} to ${element["witness"]}. Testified ${element["date"]}.</div>`;
    }
    else if (element["source-type"] == "valuation-roll") {
        if (element["source-link"]) {
            return `<div class="reference">${element.id}. <a href="../certificates/${element["source-link"]}">Valuation roll</a> at ${element["source-location"]}. Dated ${element["source-date"]}.</div>`;
        }
        else {
            return `<div class="reference">${element.id}. Valuation roll at ${element["source-location"]}. Dated ${element["source-date"]}.</div>`;
        }
    }
}

function renderCitation(id) {
    return `<sup><a href="">[${id}]</a></sup>`;
}

function renderImage(element) {
    let floatValue = "";
    if (element["float"] === "left") {
        floatValue = "left";
    }
    else if (element["float"] === "right") {
        floatValue = "right";
    }
    return `
<div class="small-box box ${floatValue}-box">
    <img src="../media/${element.src}"/>
    ${element.caption ? `<p class="caption">${element.caption}</p>` : ""}
</div>`;
}

function renderStandardElement(element) {
    const tag = element.tag;
    return `<${tag}${(element.id !== undefined) ? " id=\""+element.id+"\"" : ""}${(element.class !== undefined) ? " class=\""+element.class+"\"" : ""}>${element.inner}</${tag}>`;
}

function renderInfobox(infobox, metadata) {
    return `
<div class="box infobox">
    ${infobox.image ? `<img src="../media/${infobox.image}"/>` : ""}
    ${infobox["image-caption"] ? `<p class="caption">${infobox["image-caption"]}</p>` : ""}
    <div class="grid">
        ${renderInfoboxEntries(infobox.entries, metadata)}
    </div>
</div>`;
}

function renderInfoboxEntries(entries, metadata) {
    let output = "";
    let keys = Object.keys(entries);
    if (metadata["born"]) {
        if (keys.includes("Born")) {
            entries["Born"] = [metadata["born"], entries["Born"]];
        }
        else {
            entries["Born"] = [metadata["born"]];
        }
    }
    if (metadata["died"] && metadata["died"] !== "present") {
        if (keys.includes("Died")) {
            entries["Died"] = [metadata["died"], entries["Died"]];
        }
        else {
            entries["Died"] = [metadata["died"]];
        }
    }
    keys.forEach(key => {
        const value = entries[key];
        if (value.length > 0) {
            output = output + `<h5>${key}</h5>${renderBoxValue(key, value, metadata)}\n`
        }
    });
    return output;
}

function renderBoxValue(key, value, metadata) {
    if (value.constructor.name === "Array") {
        let output = "<div>"
        for (let v of value) {
            output = output + `<p>${v}</p>`;
        }
        output = output + "</div>";
        return output;
    }
    else {
        let output = "<div>";
        output = output + `<p>${value}</p>`;
        output = output + "</div>";
        return output;
    }
}

function isSplitFormat(articleType) {
    return ["person", "place", "lineage"].includes(articleType);
}

module.exports = {
    renderArticle,
    renderBody
};
