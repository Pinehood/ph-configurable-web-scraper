import * as fs from "fs";
import {
  CollectionChangeAction,
  CollectionClearWhat,
  CommonConstants,
  CronJobMeta,
  DataStorage,
  ScraperConfig,
  ScraperHistory,
} from "@/common";
import { default as storageDir } from "@/storage/index";

let DATA_STORAGE: DataStorage = {
  jobs: [],
  scrapers: [],
};

let HISTORY_STORAGE: ScraperHistory[] = [];

export class StorageService {
  private static dataFilename = `${storageDir()}/data.json`;
  private static historyFilename = `${storageDir()}/history.json`;

  static data(): DataStorage {
    return { ...DATA_STORAGE };
  }

  static histories(): ScraperHistory[] {
    return [...HISTORY_STORAGE];
  }

  static scraper(
    action: CollectionChangeAction,
    scraper: ScraperConfig | string,
  ): boolean {
    try {
      if (action == "add" && typeof scraper == "object") {
        if (
          DATA_STORAGE.scrapers.findIndex((s) => s.name == scraper.name) > -1
        ) {
          return false;
        }
        if (!scraper.favicon || scraper.favicon.trim().length <= 0) {
          scraper.favicon = CommonConstants.FAVICON;
        }
        DATA_STORAGE.scrapers.push(scraper);
      } else if (action == "remove" && typeof scraper == "string") {
        DATA_STORAGE.scrapers = DATA_STORAGE.scrapers.filter(
          (s) => s.name != scraper,
        );
        DATA_STORAGE.jobs = DATA_STORAGE.jobs.filter(
          (j) => j.scraper != scraper,
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
    action: CollectionChangeAction,
    job: CronJobMeta | string,
  ): boolean {
    try {
      if (action == "add" && typeof job == "object") {
        if (DATA_STORAGE.jobs.findIndex((j) => j.name == job.name) > -1) {
          return false;
        }
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

  static history(
    scraper: string,
    date: Date,
    amount: number,
    duration: number,
    success: boolean,
    submitted: boolean,
  ): boolean {
    try {
      HISTORY_STORAGE.push({
        scraper,
        date,
        amount,
        duration,
        success,
        submitted,
      });
      return true;
    } catch {
      return false;
    }
  }

  static clear(what: CollectionClearWhat): void {
    if (what == "scrapers+jobs") {
      DATA_STORAGE.scrapers = [];
      DATA_STORAGE.jobs = [];
    } else if (what == "history") {
      HISTORY_STORAGE = [];
    }
  }

  static load(): boolean {
    try {
      StorageService.check();
      DATA_STORAGE = JSON.parse(
        fs.readFileSync(StorageService.dataFilename).toString(),
      ) as DataStorage;
      HISTORY_STORAGE = JSON.parse(
        fs.readFileSync(StorageService.historyFilename).toString(),
      ) as ScraperHistory[];
      return true;
    } catch {
      DATA_STORAGE = {
        jobs: [],
        scrapers: [],
      };
      HISTORY_STORAGE = [];
      return false;
    }
  }

  static save(): boolean {
    try {
      fs.writeFileSync(
        StorageService.dataFilename,
        JSON.stringify({ ...DATA_STORAGE }),
      );
      fs.writeFileSync(
        StorageService.historyFilename,
        JSON.stringify([...HISTORY_STORAGE]),
      );
      return true;
    } catch {
      return false;
    }
  }

  private static check(): boolean {
    try {
      if (!fs.existsSync(StorageService.dataFilename)) {
        fs.writeFileSync(
          StorageService.dataFilename,
          JSON.stringify({
            jobs: [],
            scrapers: [],
          }),
        );
      }
      if (!fs.existsSync(StorageService.historyFilename)) {
        fs.writeFileSync(StorageService.historyFilename, JSON.stringify([]));
      }
      return true;
    } catch {
      return false;
    }
  }
}
