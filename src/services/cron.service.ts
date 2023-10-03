import { Injectable } from "@nestjs/common";
import {
  Timeout,
  SchedulerRegistry,
  CronExpression,
  Cron,
} from "@nestjs/schedule";
import { CronJob } from "cron";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import {
  CommonConstants,
  CronJobMeta,
  DataStorage,
  ScraperConfig,
} from "@/common";
import { ScraperService } from "@/services/scraper.service";
import { StorageService } from "@/services/storage.service";

@Injectable()
export class CronService {
  constructor(
    @InjectPinoLogger(CronService.name) private readonly logger: PinoLogger,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  @Timeout(2500)
  afterStartup(): void {
    try {
      const loaded = StorageService.load();
      if (loaded == true) {
        const data = StorageService.data();
        this.logger.info("Loaded data");
        data.jobs.forEach((job) => this.job(job, data));
      }
    } catch (error: any) {
      this.logger.error(error);
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  everyMinute(): void {
    try {
      const data = StorageService.data();
      const jobs = this.schedulerRegistry.getCronJobs();
      data.jobs.forEach((job) => {
        if (!jobs.has(job.name)) {
          this.job(job, data);
        }
      });
      const names = data.jobs.map((j) => j.name);
      jobs.forEach((job, name) => {
        if (
          !names.includes(name) &&
          name.endsWith(CommonConstants.CRONJOB_SUFFIX)
        ) {
          job.stop();
          this.schedulerRegistry.deleteCronJob(name);
          this.logger.info("Stopped cron job %s", name);
        }
      });
      StorageService.save();
    } catch (error: any) {
      this.logger.error(error);
    }
  }

  private job(job: CronJobMeta, data: DataStorage): void {
    try {
      const cronJob = new CronJob(job.expression, async () => {
        await this.scraper(data.scrapers.find((s) => s.name == job.scraper));
      });
      this.schedulerRegistry.addCronJob(job.name, cronJob);
      cronJob.start();
      this.logger.info(
        "Started cron job '%s' for scraper '%s'",
        job.name,
        job.scraper,
      );
    } catch (error: any) {
      this.logger.error(error);
    }
  }

  private async scraper(config: ScraperConfig): Promise<void> {
    try {
      const scraped = await ScraperService.scrape(config);
      if (scraped) {
        this.logger.info(
          "'%s' scraped content amount '%d' in '%d' seconds",
          scraped.scraper.name,
          scraped.stats.amount,
          (scraped.stats.end - scraped.stats.start) / 1000,
        );
      }
      StorageService.history(
        scraped.scraper.name,
        new Date(scraped.stats.start),
        scraped.stats.amount,
        (scraped.stats.end - scraped.stats.start) / 1000,
        scraped.content.length > 0,
        scraped.submitted,
      );
    } catch (error: any) {
      this.logger.error(error);
    }
  }
}
