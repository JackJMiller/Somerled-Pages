/*
**  Somerled Pages - A program for creating family encyclopedias
**  Copyright (C) 2023-2025 Jack J. Miller
**  Licensed under version 3 of the GNU General Public License
*/

export type RefListing = TestimonialRefListing | CensusRefListing | DeathCertificateRefListing | BirthCertificateRefListing | MarriageCertificateRefListing | ValuationRollRefListing | LazyRefListing | BookRefListing | JournalRefListing | NewspaperRefListing | WebsiteRefListing | ElectoralRegisterRefListing;
export type RefSourceType = "book" | "census" | "birth-certificate" | "death-certificate" | "lazy" | "marriage-certificate" | "newspaper" | "testimonial" | "valuation-roll" | "webpage" | "journal" | "electoral-register";

export interface BookRefListing {
    "type": "book",
    "id": string,
    "source-type": string,
    "source-title": string,
    "last-name": string,
    "first-name": string,
    "source-link": string,
    "source-year": string,
    "pages": string
}

export interface CensusRefListing {
    "type": "census",
    "id": string,
    "source-type": string,
    "year": string,
    "link": string,
    "is-copy": boolean
};

export interface BirthCertificateRefListing {
    "type": "birth-certificate",
    "id": string,
    "source-type": string,
    "name": string,
    "date": string,
    "place": string,
    "link": string,
    "is-copy": boolean
};

export interface DeathCertificateRefListing {
    "type": "death-certificate",
    "id": string,
    "source-type": string,
    "name": string,
    "date": string,
    "place": string,
    "link": string,
    "is-copy": boolean
};

export interface LazyRefListing {
    "type": "lazy",
    "id": string,
    "source-type": string,
    "source-value": string,
    "source-link": string
};

export interface MarriageCertificateRefListing {
    "type": "marriage-certificate",
    "id": string,
    "source-type": string,
    "party-one": string,
    "party-two": string,
    "date": string,
    "place": string,
    "link": string,
    "is-copy": boolean
};

export interface NewspaperRefListing {
    "type": "newspaper",
    "id": string,
    "source-type": string,
    "name-of-publication": string,
    "source-link": string,
    "source-title": string,
    "source-date": string,
    "pages": string,
    "is-copy": boolean
};

export interface TestimonialRefListing {
    "type": "testimonial",
    "id": string,
    "source-type": string,
    "name": string,
    "witness": string,
    "date": string
};

export interface ValuationRollRefListing {
    "type": "valuation-roll",
    "id": string,
    "source-type": string,
    "source-location": string,
    "source-date": string,
    "source-link": string,
    "is-copy": boolean
};

export interface WebsiteRefListing {
    "type": "webpage",
    "id": string,
    "source-type": string,
    "name-of-website": string,
    "source-link": string,
    "date-retrieved": string
};

export interface JournalRefListing {
    "type": "journal",
    "id": string,
    "source-type": string,
    "name-of-publication": string,
    "source-date": string,
    "pages": string,
    "source-link": string
};

export interface ElectoralRegisterRefListing {
    "type": "electoral-register",
    "id": string,
    "source-type": string,
    "year": string
    "link": string
};
