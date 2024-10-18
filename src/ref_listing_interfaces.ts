/*
**  Somerled Pages - A program for creating family encyclopedias
**  Copyright (C) 2023-2024 Jack J. Miller
**  Licensed under version 3 of the GNU General Public License
*/

export type RefListing = TestimonialRefListing | CensusRefListing | DeathCertificateRefListing | BirthCertificateRefListing | MarriageCertificateRefListing | ValuationRollRefListing | LazyRefListing | BookRefListing | JournalRefListing | NewspaperRefListing | WebsiteRefListing;

export interface BookRefListing {
    "type": string,
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
    "type": string,
    "id": string,
    "source-type": string,
    "year": string,
    "link": string,
    "is-copy": boolean
};

export interface BirthCertificateRefListing {
    "type": string,
    "id": string,
    "source-type": string,
    "name": string,
    "date": string,
    "place": string,
    "link": string,
    "is-copy": boolean
};

export interface DeathCertificateRefListing {
    "type": string,
    "id": string,
    "source-type": string,
    "name": string,
    "date": string,
    "place": string,
    "link": string,
    "is-copy": boolean
};

export interface LazyRefListing {
    "type": string,
    "id": string,
    "source-type": string,
    "source-value": string,
    "source-link": string
};

export interface MarriageCertificateRefListing {
    "type": string,
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
    "type": string,
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
    "type": string,
    "id": string,
    "source-type": string,
    "name": string,
    "witness": string,
    "date": string
};

export interface ValuationRollRefListing {
    "type": string,
    "id": string,
    "source-type": string,
    "source-location": string,
    "source-date": string,
    "source-link": string,
    "is-copy": boolean
};

export interface WebsiteRefListing {
    "type": string,
    "id": string,
    "source-type": string,
    "name-of-website": string,
    "source-link": string,
    "date-retrieved": string
};

export interface QuickRefListing {
    "type": string,
    "id": string,
    "quick-id": string
};

export interface JournalRefListing {
    "type": string,
    "id": string,
    "source-type": string,
    "name-of-publication": string,
    "source-date": string,
    "pages": string,
    "source-link": string
};
