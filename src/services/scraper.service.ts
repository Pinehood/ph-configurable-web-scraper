import * as cheerio from "cheerio";
import { AxiosResponse } from "axios";
import axios from "@/common/axios";
import {
  FetchDetails,
  ScrapedContent,
  ScrapedContentEntry,
  ScraperConfig,
} from "@/common";
import { ExtractService } from "@/services/extract.service";
import { TransformService } from "@/services/transform.service";

export class ScraperService {
  static async scrape(config: ScraperConfig): Promise<ScrapedContent> {
    try {
      const content: ScrapedContentEntry[] = [];
      for (let i = 0; i < config.roots.length; i++) {
        const root = config.roots[i];
        const rootResponse = await ScraperService.response(
          root,
          config.links.fetching,
        );
        if (!rootResponse || rootResponse.data) return null;

        const data = rootResponse.data as string;
        const links = ExtractService.links(data, config);
        if (!links || links.length <= 0) return null;

        for (let i = 0; i < links.length; i++) {
          const link = links[i];
          const entry: ScrapedContentEntry = {
            from: link,
            values: [],
          };
          const linkResponse = await axios.get(link);
          if (!linkResponse || !linkResponse.data) return null;

          const page = linkResponse.data as string;
          const $ = cheerio.load(page);
          config.remove.forEach((removal) => $(removal).remove());
          config.scrape.forEach((extractor) => {
            if (extractor.remove && extractor.remove.length > 0) {
              extractor.remove.forEach((removal) => $(removal).remove());
            }
            entry.values.push({
              property: extractor.property,
              value: TransformService.content(
                ExtractService.content($, extractor),
                extractor,
              ),
            });
          });
          content.push(entry);
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
    } catch {
      return null;
    }
  }

  private static response(
    url: string,
    fetching: FetchDetails,
  ): Promise<AxiosResponse<any, any>> {
    if (fetching.method == "GET") {
      return axios.get(url, {
        headers: fetching.headers,
      });
    } else if (fetching.method == "POST") {
      return axios.post(url, fetching.body, {
        headers: fetching.headers,
      });
    } else if (fetching.method == "PUT") {
      return axios.put(url, fetching.body, {
        headers: fetching.headers,
      });
    }
  }
}
