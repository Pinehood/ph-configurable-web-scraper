import * as fs from "fs";
import { CronJobMeta, DataStorage, ScraperConfig } from "@/common";
import { default as storageDir } from "@/storage/index";

let DATA_STORAGE: DataStorage = {
  jobs: [],
  scrapers: [],
};

export class StorageService {
  private static filename = `${storageDir()}/data.json`;

  static data(): DataStorage {
    return { ...DATA_STORAGE };
  }

  static scraper(
    action: "add" | "update" | "remove",
    scraper: ScraperConfig | string,
  ): boolean {
    try {
      if (action == "add" && typeof scraper == "object") {
        DATA_STORAGE.scrapers.push(scraper);
      } else if (action == "remove" && typeof scraper == "string") {
        DATA_STORAGE.scrapers = DATA_STORAGE.scrapers.filter(
          (s) => s.name != scraper,
        );
      } else if (action == "update" && typeof scraper == "object") {
        const idx = DATA_STORAGE.scrapers.findIndex(
          (s) => s.name == scraper.name,
        );
        DATA_STORAGE.scrapers[idx] = { ...scraper };
      }
      return true;
    } catch {
      return false;
    }
  }

  static job(
    action: "add" | "update" | "remove",
    job: CronJobMeta | string,
  ): boolean {
    try {
      if (action == "add" && typeof job == "object") {
        DATA_STORAGE.jobs.push(job);
      } else if (action == "remove" && typeof job == "string") {
        DATA_STORAGE.jobs = DATA_STORAGE.jobs.filter((s) => s.name != job);
      } else if (action == "update" && typeof job == "object") {
        const idx = DATA_STORAGE.jobs.findIndex((s) => s.name == job.name);
        DATA_STORAGE.jobs[idx] = { ...job };
      }
      return true;
    } catch {
      return false;
    }
  }

  static load(): boolean {
    try {
      StorageService.check();
      DATA_STORAGE = JSON.parse(
        fs.readFileSync(StorageService.filename).toString(),
      ) as DataStorage;
      return true;
    } catch {
      DATA_STORAGE = {
        jobs: [],
        scrapers: [],
      };
      return false;
    }
  }

  static save(): boolean {
    try {
      fs.writeFileSync(
        StorageService.filename,
        JSON.stringify({ ...DATA_STORAGE }),
      );
      return true;
    } catch {
      return false;
    }
  }

  private static check(): boolean {
    try {
      if (!fs.existsSync(StorageService.filename)) {
        fs.writeFileSync(
          StorageService.filename,
          JSON.stringify({
            jobs: [],
            scrapers: [],
          }),
        );
      }
      return true;
    } catch {
      return false;
    }
  }
}
