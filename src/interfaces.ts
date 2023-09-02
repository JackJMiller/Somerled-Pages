export interface Metadata {
    "infobox": any,
    "type": string,
    "name": string,
    "article-type": string,
    "headings": any[],
    "born": string,
    "died": string,
    "images": any[]
};

export interface InfoBox {
    "type": string,
    "image": string,
    "image-caption": string,
    "entries": any
};

export interface InlineElement {
    "type": string,
    "tag": string,
    "inner": string
};

export interface HeaderElement {
    "type": string,
    "tag": string,
    "inner": string,
    "id": string,
    "class": string
};
