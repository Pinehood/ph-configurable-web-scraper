import * as cheerio from "cheerio";
import jsonpath from "jsonpath";
import axios from "@/common/axios";
import {
  FetchDetails,
  ScrapedContent,
  ScrapedContentEntry,
  ScraperConfig,
} from "@/common";
import { ExtractionService } from "@/services/extraction.service";
import { AxiosResponse } from "axios";

export class ScraperService {
  static async scrape(config: ScraperConfig): Promise<ScrapedContent> {
    const content: ScrapedContentEntry[] = [];
    for (let i = 0; i < config.roots.length; i++) {
      const links: string[] = [];
      const root = config.roots[i];
      const response = await ScraperService.response(
        root,
        config.links.fetching,
      );
      if (response && response.data) {
        const data = response.data as string;
        if (config.links.type == "text") {
          links.push(
            ...data
              .match(config.links.selector as RegExp)
              .map((link) => ScraperService.sanitizeLink(link, config)),
          );
        } else if (config.links.type == "html") {
          const $ = cheerio.load(data);
          $(config.links.selector as string).each((_, el) => {
            const link = ScraperService.sanitizeLink(
              $(el).attr("href"),
              config,
            );
            if (links.findIndex((el) => el == link) == -1) {
              links.push(link);
            }
          });
        } else if (config.links.type == "json") {
          const selector = config.links.selector as string;
          const json = JSON.parse(data) as any;
          links.push(...jsonpath.query(json, selector));
        }
      }
      if (links && links.length > 0) {
        for (let i = 0; i < links.length; i++) {
          const link = links[i];
          const entry: ScrapedContentEntry = {
            from: link,
            values: [],
          };
          const response = await axios.get(link);
          if (response && response.data) {
            const page = response.data as string;
            const $ = cheerio.load(page);
            config.remove.forEach((removal) => $(removal).remove());
            config.scrape.forEach((extractor) => {
              if (extractor.remove && extractor.remove.length > 0) {
                extractor.remove.forEach((removal) => $(removal).remove());
              }
              entry.values.push({
                property: extractor.property,
                value: ExtractionService.cheerio($, extractor),
              });
            });
            content.push(entry);
          }
        }
      }
    }
    return {
      scraper: {
        name: config.name,
        base: config.base,
        favicon: config.favicon,
      },
      content,
    };
  }

  static sanitizeLink(link: string, config: ScraperConfig): string {
    let finalLink = link;
    if (!finalLink.startsWith("http")) {
      if (!finalLink.startsWith("/")) {
        finalLink = `${config.base}/${link}`;
      } else {
        finalLink = `${config.base}${link}`;
      }
    }
    return finalLink;
  }

  static async response(
    url: string,
    fetching: FetchDetails,
  ): Promise<AxiosResponse<any, any>> {
    if (fetching.method == "GET") {
      return await axios.get(url, {
        headers: fetching.headers,
      });
    } else if (fetching.method == "POST") {
      return await axios.post(url, fetching.body, {
        headers: fetching.headers,
      });
    } else if (fetching.method == "PUT") {
      return await axios.put(url, fetching.body, {
        headers: fetching.headers,
      });
    }
  }
}
