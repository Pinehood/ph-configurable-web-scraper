import { AxiosHeaders } from "axios";

type BaseLinkExtractor = {
  fetching: FetchDetails;
};

type RegexLinkExtractor = {
  type: "text";
  selector: RegExp;
};

type NormalLinkExtractor = {
  type: "html" | "json";
  selector: string;
};

type ContentExtractor = {
  property: string;
  selector: string;
  transfomers?: ContentTransfomer[];
  remove?: string[];
  type?: "text" | "html";
  take?: "first" | "last" | "normal";
};

type SimpleContentTransfomer = {
  type: "trim" | "uppercase" | "lowercase";
};

type NumericContentTransformer = {
  type: "substring" | "slice";
  from: number;
  to: number;
};

type StringContentTransfomer = {
  type: "replace";
  occurence: "first" | "all";
  what: string;
  with: string;
};

type CombinedContentTransfomer = {
  type: "split" | "padEnd" | "padStart";
  index: number;
  value: string;
};

type FileContentSubmitter = {
  type: "file";
  destination: string;
};

type RequestContentSubmitter = {
  type: "request";
  url: string;
  method: "POST" | "PUT";
  headers?: AxiosHeaders;
};

type FetchDetails = {
  method: "GET" | "POST" | "PUT";
  headers?: AxiosHeaders;
  body?: any;
};

type LinkExtractor = BaseLinkExtractor &
  (RegexLinkExtractor | NormalLinkExtractor);

type ContentTransfomer =
  | SimpleContentTransfomer
  | NumericContentTransformer
  | StringContentTransfomer
  | CombinedContentTransfomer;

type ContentSubmitter = FileContentSubmitter | RequestContentSubmitter;

type ScraperConfig = {
  name: string;
  base: string;
  favicon: string;
  roots: string[];
  links: LinkExtractor;
  remove: string[];
  scrape: ContentExtractor[];
  submit: ContentSubmitter;
};

type ScrapedContent = {
  scraper: {
    name: string;
    base: string;
    favicon: string;
  };
  stats: {
    amount: number;
    start: number;
    end: number;
  };
  content: ScrapedContentEntry[];
  submitted: boolean;
};

type ScrapedContentEntry = {
  from: string;
  values: ScrapedContentEntryValue[];
};

type ScrapedContentEntryValue = {
  property: string;
  value: string;
};

type CronJobMeta = {
  scraper: string;
  name: string;
  expression: string;
};

type ScraperHistory = {
  scraper: string;
  date: Date;
  amount: number;
  duration: number;
  success: boolean;
  submitted: boolean;
};

type DataStorage = {
  scrapers: ScraperConfig[];
  jobs: CronJobMeta[];
  history: ScraperHistory[];
};

type CollectionChangeAction = "add" | "update" | "remove";
type CollectionClearWhat = "scrapers+jobs" | "history";

export {
  CollectionChangeAction,
  CollectionClearWhat,
  ContentExtractor,
  ContentSubmitter,
  ContentTransfomer,
  CronJobMeta,
  DataStorage,
  FetchDetails,
  ScrapedContent,
  ScrapedContentEntry,
  ScraperConfig,
  ScraperHistory,
};
