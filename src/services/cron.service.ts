import { ScraperConfig } from "@/common";
import { Injectable } from "@nestjs/common";
import { Timeout, SchedulerRegistry, CronExpression } from "@nestjs/schedule";
import { CronJob } from "cron";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { ScraperService } from "@/services/scraper.service";
import { StorageService } from "@/services/storage.service";

@Injectable()
export class CronService {
  constructor(
    @InjectPinoLogger(CronService.name) private readonly logger: PinoLogger,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  @Timeout(5000)
  async load(): Promise<void> {
    try {
      const loaded = StorageService.load();
      if (loaded == true) {
        const data = StorageService.data();
        this.logger.info("Loaded data");
        data.jobs.forEach((job) => {
          this.schedulerRegistry.addCronJob(
            job.name,
            new CronJob(job.expression, async () => {
              await this.scraper(
                data.scrapers.find((s) => s.name == job.scraper),
              );
            }),
          );
          this.logger.info(
            "Started cron job %s for scraper %s",
            job.name,
            job.scraper,
          );
        });
        this.schedulerRegistry.addCronJob(
          "save",
          new CronJob(CronExpression.EVERY_10_MINUTES, () =>
            StorageService.save(),
          ),
        );
      }
    } catch (error: any) {
      this.logger.error(error);
    }
  }

  private async scraper(config: ScraperConfig): Promise<void> {
    try {
      const scraped = await ScraperService.scrape(config);
      if (scraped) {
        this.logger.info(
          "%s scraped content amount %d in %d seconds",
          scraped.scraper.name,
          scraped.stats.amount,
          (scraped.stats.end - scraped.stats.start) / 1000,
        );
      }
    } catch (error: any) {
      this.logger.error(error);
    }
  }
}
