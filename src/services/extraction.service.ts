import * as cheerio from "cheerio";
import { ContentExtractor } from "@/common";

export class ExtractionService {
  static cheerio($: cheerio.CheerioAPI, extractor: ContentExtractor): string {
    try {
      let node: cheerio.Cheerio<cheerio.AnyNode> = null;
      if (extractor.take == "first") {
        node = $(extractor.selector).first();
      } else if (extractor.take == "last") {
        node = $(extractor.selector).last();
      } else if (!extractor.take || extractor.take == "normal") {
        node = $(extractor.selector);
      }
      if (node) {
        let value = "";
        if (extractor.type == "html") {
          value = node.html();
        } else if (!extractor.type || extractor.type == "text") {
          value = node.text();
        }
        return value;
      }
    } catch {
      return "";
    }
  }
}
