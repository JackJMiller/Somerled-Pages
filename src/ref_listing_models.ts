/*
**  Somerled Pages - A program for creating family encyclopedias
**  Copyright (C) 2023-2024 Jack J. Miller
**  Licensed under version 3 of the GNU General Public License
*/

import { RefModelAttribute } from "./interfaces";
import { RefSourceType } from "./ref_listing_interfaces";

const BookRefModel: RefModelAttribute[] = [
    { "name": "id", "types": ["String"] },
    { "name": "source-type", "types": ["String"] },
    { "name": "source-title", "types": ["String"] },
    { "name": "last-name", "types": ["String"] },
    { "name": "first-name", "types": ["String"] },
    { "name": "source-link", "types": ["String"] },
    { "name": "source-year", "types": ["String"] },
    { "name": "pages", "types": ["String"] }
];

const CensusRefModel: RefModelAttribute[] = [
    { "name": "id", "types": ["String"] },
    { "name": "source-type", "types": ["String"] },
    { "name": "year", "types": ["String"] },
    { "name": "link", "types": ["String", "undefined"] },
    { "name": "is-copy", "types": ["Boolean", "undefined"] }
];

const BirthCertificateRefModel: RefModelAttribute[] = [
    { "name": "id", "types": ["String"] },
    { "name": "source-type", "types": ["String"] },
    { "name": "name", "types": ["String"] },
    { "name": "date", "types": ["String"] },
    { "name": "place", "types": ["String"] },
    { "name": "link", "types": ["String", "undefined"] },
    { "name": "is-copy", "types": ["Boolean", "undefined"] }
];

const DeathCertificateRefModel: RefModelAttribute[] = [
    { "name": "id", "types": ["String"] },
    { "name": "source-type", "types": ["String"] },
    { "name": "name", "types": ["String"] },
    { "name": "date", "types": ["String"] },
    { "name": "place", "types": ["String"] },
    { "name": "link", "types": ["String", "undefined"] },
    { "name": "is-copy", "types": ["Boolean", "undefined"] }
];

const LazyRefModel: RefModelAttribute[] = [
    { "name": "id", "types": ["String"] },
    { "name": "source-type", "types": ["String"] },
    { "name": "source-value", "types": ["String"] },
    { "name": "source-link", "types": ["String"] }
];

const MarriageCertificateRefModel: RefModelAttribute[] = [
    { "name": "id", "types": ["String"] },
    { "name": "source-type", "types": ["String"] },
    { "name": "party-one", "types": ["String"] },
    { "name": "party-two", "types": ["String"] },
    { "name": "date", "types": ["String"] },
    { "name": "place", "types": ["String"] },
    { "name": "link", "types": ["String", "undefined"] },
    { "name": "is-copy", "types": ["Boolean", "undefined"] }
];

const NewspaperRefModel: RefModelAttribute[] = [
    { "name": "id", "types": ["String"] },
    { "name": "source-type", "types": ["String"] },
    { "name": "name-of-publication", "types": ["String"] },
    { "name": "source-link", "types": ["String"] },
    { "name": "source-title", "types": ["String"] },
    { "name": "source-date", "types": ["String"] },
    { "name": "pages", "types": ["String"] },
    { "name": "is-copy", "types": ["Boolean", "undefined"] }
];

const TestimonialRefModel: RefModelAttribute[] = [
    { "name": "id", "types": ["String"] },
    { "name": "source-type", "types": ["String"] },
    { "name": "name", "types": ["String"] },
    { "name": "witness", "types": ["String"] },
    { "name": "date", "types": ["String"] }
];

const ValuationRollRefModel: RefModelAttribute[] = [
    { "name": "id", "types": ["String"] },
    { "name": "source-type", "types": ["String"] },
    { "name": "source-location", "types": ["String"] },
    { "name": "source-date", "types": ["String"] },
    { "name": "source-link", "types": ["String"] },
    { "name": "is-copy", "types": ["Boolean", "undefined"] }
];

const WebsiteRefModel: RefModelAttribute[] = [
    { "name": "id", "types": ["String"] },
    { "name": "source-type", "types": ["String"] },
    { "name": "name-of-website", "types": ["String"] },
    { "name": "source-link", "types": ["String"] },
    { "name": "date-retrieved", "types": ["String"] }
];

const JournalRefModel: RefModelAttribute[] = [
    { "name": "id", "types": ["String"] },
    { "name": "source-type", "types": ["String"] },
    { "name": "name-of-publication", "types": ["String"] },
    { "name": "source-date", "types": ["String"] },
    { "name": "pages", "types": ["String"] },
    { "name": "source-link", "types": ["String"] }
];

export const RefListingModels: any = {
    "book": BookRefModel,
    "census": CensusRefModel,
    "birth-certificate": BirthCertificateRefModel,
    "death-certificate": DeathCertificateRefModel,
    "lazy": LazyRefModel,
    "marriage-certificate": MarriageCertificateRefModel,
    "newspaper": NewspaperRefModel,
    "testimonial": TestimonialRefModel,
    "valuation-roll": ValuationRollRefModel,
    "webpage": WebsiteRefModel,
    "journal": JournalRefModel
};
