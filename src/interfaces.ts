/*
**  Somerled Pages - A program for creating family encyclopedias
**  Copyright (C) 2023-2024 Jack J. Miller
**  Licensed under version 3 of the GNU General Public License
*/

import { RefListing } from "./ref_listing_interfaces";

export interface InfoBox {
    "type": string,
    "image": string,
    "image-caption": string,
    "entries": { [index: string]: any }
}

export interface ImageDefinition {
    "src": string,
    "caption": string
}

export interface InfoTag {
    "name": string,
    "born": string,
    "died": string,
    "subtitle": string,
    "article-type": string,
    "images": ImageDefinition[]
}

export interface Metadata {
    "infobox": InfoBox,
    "infobox-rendered": string,
    "info": InfoTag,
    "type": string,
    "name": string,
    "article-type": string,
    "headings": string[],
    "born": string,
    "died": string,
    "images": ImageDefinition[]
}

export interface InlineElement {
    "type": string,
    "tag": string,
    "inner": string
}

export interface HeaderElement {
    "type": string,
    "tag": string,
    "inner": string,
    "id": string,
    "class": string
}

export interface BuildConfiguration {
    root: string,
    members: string[],
    allArticles: string[],
    features: string[]
}

export interface BuildSheet {
    pageData: { [index: string]: PageData }
}

export interface PageData {
    name: string,
    born: string,
    died: string,
    imageSrc: string
}

export interface BuildData {
    name: string,
    configuration: BuildConfiguration,
    filename: string,
    filetype: string,
    location: string,
    citations: string[],
    projectDirectory: string,
    projectPackage: ProjectPackage,
    quickReferences: { [index: string]: Reference },
    inDocumentRefListings: { [index: string]: RefListing },
    tree: Tree,
    errors: number,
    uniqueErrorFiles: string[],
    warnings: number,
    uniqueWarningFiles: string[],
    pageData: { [index: string]: PageData },
    imagesRendered: string[],
    sourcesCited: string[]
}

export interface ProjectPackage {
    name: string,
    description: string,
    authors: string[],
    contributors: string[]
}

export type Reference = BirthCertificateReference | MarriageCertificateReference | DeathCertificateReference | CensusReference | NewspaperReference | ValuationRollReference | WebsiteReference | LazyReference;

export interface BirthCertificateReference {
    "source-type": string,
    "name": string,
    "date": string,
    "place": string,
    "link": string
}

export interface MarriageCertificateReference {
    "source-type": string,
    "party-one": string,
    "party-two": string,
    "date": string,
    "place": string,
    "link": string
}

export interface DeathCertificateReference {
    "source-type": string,
    "name": string,
    "date": string,
    "place": string,
    "link": string
}

export interface CensusReference {
    "source-type": string,
    "year": string,
    "link": string
}

export interface NewspaperReference {
    "source-type": string,
    "name-of-publication": string,
    "source-link": string,
    "source-title": string,
    "source-date": string,
    "pages": string
}

export interface ValuationRollReference {
    "source-type": string,
    "source-location": string,
    "source-date": string,
    "source-link": string
}

export interface WebsiteReference {
    "source-type": string,
    "name-of-website": string,
    "source-link": string,
    "date-retrieved": string
}

export interface LazyReference {
    "source-type": string,
    "source-value": string,
    "source-link": string
}

export interface Tree {
    ROOT_NODE: string,
    nodes: TreeNodes
}

export interface TreeNode {
    connections: any
}

export interface TreeNodes {
    [index: string]: TreeNode
}
