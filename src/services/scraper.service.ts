import * as cheerio from "cheerio";
import * as fs from "fs";
import { AxiosResponse } from "axios";
import axios from "@/common/axios";
import {
  FetchDetails,
  ContentSubmitter,
  ScrapedContent,
  ScrapedContentEntry,
  ScraperConfig,
} from "@/common";
import { ExtractService } from "@/services/extract.service";
import { TransformService } from "@/services/transform.service";

export class ScraperService {
  static async scrape(config: ScraperConfig): Promise<ScrapedContent> {
    try {
      const start = new Date().getTime();
      const content: ScrapedContentEntry[] = [];
      for (let i = 0; i < config.roots.length; i++) {
        const root = config.roots[i];
        const rootResponse = await ScraperService.request(
          root,
          config.links.fetching,
        );
        if (!rootResponse || rootResponse.data) continue;

        const data = rootResponse.data as string;
        const links = ExtractService.links(data, config);
        if (!links || links.length <= 0) continue;

        for (let i = 0; i < links.length; i++) {
          const link = links[i];
          const entry: ScrapedContentEntry = {
            from: link,
            values: [],
          };
          const linkResponse = await axios.get(link);
          if (!linkResponse || !linkResponse.data) continue;

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
                extractor.transfomers,
              ),
            });
          });
          content.push(entry);
        }
      }
      const end = new Date().getTime();
      const scrapedContent: ScrapedContent = {
        scraper: {
          name: config.name,
          base: config.base,
          favicon: config.favicon,
        },
        stats: {
          amount: content.length,
          start,
          end,
        },
        content,
        submitted: false,
      };
      scrapedContent.submitted = await ScraperService.submit(
        config.submit,
        scrapedContent,
      );
      return scrapedContent;
    } catch {
      return {
        scraper: {
          name: config.name,
          base: config.base,
          favicon: config.favicon,
        },
        stats: {
          amount: 0,
          start: 0,
          end: 0,
        },
        content: [],
        submitted: false,
      };
    }
  }

  private static request(
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

  private static async submit(
    submitter: ContentSubmitter,
    content: ScrapedContent,
  ): Promise<boolean> {
    try {
      if (submitter.type == "request") {
        const response = await axios.request({
          method: submitter.method,
          url: submitter.url,
          headers: submitter.headers,
          data: content,
        });
        return response.status.toString().startsWith("2");
      } else if (submitter.type == "file") {
        fs.writeFileSync(submitter.destination, JSON.stringify(content));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
}
