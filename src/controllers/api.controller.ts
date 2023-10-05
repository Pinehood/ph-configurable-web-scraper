import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import {
  ApiRoutes,
  CommonConstants,
  KeyGuard,
  PathParams,
  ScraperConfig,
} from "@/common";
import { StorageService } from "@/services";

@Controller(ApiRoutes.BASE)
export class ApiController {
  constructor(private readonly schedulerRegistry: SchedulerRegistry) {}

  @Get(ApiRoutes.SCRAPER_SINGLE)
  getScraperConfig(@Param(PathParams.NAME) name: string): ScraperConfig {
    return StorageService.data().scrapers.find((s) => s.name === name);
  }

  @Post(ApiRoutes.SCRAPER_LIST)
  @UseGuards(KeyGuard)
  createScraper(@Body() body: any): void {
    const cron = body.cron;
    delete body.cron;
    const config = body as ScraperConfig;
    if (StorageService.scraper("add", config) == true) {
      if (
        StorageService.job("add", {
          name: config.name + CommonConstants.CRONJOB_SUFFIX,
          expression: cron,
          scraper: config.name,
        }) == true
      ) {
        StorageService.save();
      }
    } else {
      throw new BadRequestException();
    }
  }

  @Delete(ApiRoutes.SCRAPER_SINGLE)
  @UseGuards(KeyGuard)
  deleteScraper(@Param(PathParams.NAME) name: string): void {
    if (StorageService.scraper("remove", name) == true) {
      StorageService.save();
    } else {
      throw new BadRequestException();
    }
  }

  @Delete(ApiRoutes.HISTORY)
  @UseGuards(KeyGuard)
  deleteHistory(): void {
    StorageService.clear("history");
  }

  @Put(ApiRoutes.JOB)
  @UseGuards(KeyGuard)
  startJob(@Param(PathParams.NAME) name: string): void {
    try {
      const job = this.schedulerRegistry.getCronJob(name);
      if (job && job.running == false) {
        job.start();
      }
    } catch {
      return;
    }
  }

  @Delete(ApiRoutes.JOB)
  @UseGuards(KeyGuard)
  stopJob(@Param(PathParams.NAME) name: string): void {
    try {
      const job = this.schedulerRegistry.getCronJob(name);
      if (job && job.running == true) {
        job.stop();
      }
    } catch {
      return;
    }
  }
}
