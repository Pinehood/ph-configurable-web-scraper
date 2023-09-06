import * as cheerio from "cheerio";
import jsonpath from "jsonpath";
import { ContentExtractor, ScraperConfig } from "@/common/types";
import { TransformService } from "@/services/transform.service";

export class ExtractService {
  static links(data: string, config: ScraperConfig): string[] {
    try {
      const links: string[] = [];
      if (config.links.type == "text") {
        links.push(
          ...data
            .match(config.links.selector)
            .map((link) => TransformService.link(link, config)),
        );
      } else if (config.links.type == "html") {
        const $ = cheerio.load(data);
        $(config.links.selector).each((_, el) => {
          const link = TransformService.link($(el).attr("href"), config);
          if (links.findIndex((el) => el == link) == -1) {
            links.push(link);
          }
        });
      } else if (config.links.type == "json") {
        const selector = config.links.selector;
        const json = JSON.parse(data) as any;
        links.push(...jsonpath.query(json, selector));
      }
      return links;
    } catch {
      return null;
    }
  }

  static content($: cheerio.CheerioAPI, extractor: ContentExtractor): string {
    try {
      let node: cheerio.Cheerio<cheerio.AnyNode> = null;
      if (extractor.take == "first") {
        node = $(extractor.selector).first();
      } else if (extractor.take == "last") {
        node = $(extractor.selector).last();
      } else if (!extractor.take || extractor.take == "normal") {
        node = $(extractor.selector);
      }
      if (!node) return "";

      let value = "";
      if (extractor.type == "html") {
        value = node.html();
      } else if (!extractor.type || extractor.type == "text") {
        value = node.text();
      }
      return value;
    } catch {
      return null;
    }
  }
}
