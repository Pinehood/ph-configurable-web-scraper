import { AxiosHeaders } from "axios";

export type ScraperConfig = {
  name: string;
  base: string;
  favicon: string;
  roots: string[];
  links: LinkExtractor;
  remove: string[];
  scrape: ContentExtractor[];
};

export type LinkExtractor = {
  fetching: FetchDetails;
  type: "text" | "html" | "json";
  selector: string | RegExp;
};

export type ContentExtractor = {
  property: string;
  selector: string;
  transfomers?: ContentTransfomer[];
  remove?: string[];
  type?: "text" | "html";
  take?: "first" | "last" | "normal";
};

export type ContentTransfomer = {
  type:
    | "replace"
    | "substring"
    | "split"
    | "trim"
    | "uppercase"
    | "lowercase"
    | "slice"
    | "padEnd"
    | "padStart";
  valueOne?: string | number;
  valueTwo?: string | number;
};

export type FetchDetails = {
  method: "GET" | "POST" | "PUT";
  body?: any;
  headers?: AxiosHeaders;
};

export type ScrapedContent = {
  scraper: {
    name: string;
    base: string;
    favicon: string;
  };
  content: ScrapedContentEntry[];
};

export type ScrapedContentEntry = {
  from: string;
  values: ScrapedContentEntryValue[];
};

export type ScrapedContentEntryValue = {
  property: string;
  value: string;
};
