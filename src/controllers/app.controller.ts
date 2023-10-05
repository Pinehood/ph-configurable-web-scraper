import { Controller, Get, Render } from "@nestjs/common";
import { CronExpression, SchedulerRegistry } from "@nestjs/schedule";
import {
  AppRoutes,
  getJobSchedule,
  getJobStatus,
  HISTORY,
  JOB,
  OPTION,
  SCRAPER,
  Views,
} from "@/common";
import { StorageService } from "@/services";

@Controller(AppRoutes.BASE)
export class AppController {
  constructor(private readonly schedulerRegistry: SchedulerRegistry) {}

  @Get(["", AppRoutes.HOME])
  @Render(Views.HOME)
  index() {
    return {};
  }

  @Get(AppRoutes.CREATE)
  @Render(Views.CREATE)
  create() {
    return {
      options: Object.keys(CronExpression)
        .map((k) => OPTION(k.replace(/\_/g, " "), CronExpression[k]))
        .join(" "),
    };
  }

  @Get(AppRoutes.JOBS)
  @Render(Views.JOBS)
  jobs() {
    const data = StorageService.data();
    return {
      rows: data.jobs
        .map((j, i) => {
          return JOB(j, i, getJobStatus(this.schedulerRegistry, j));
        })
        .join(" "),
    };
  }

  @Get(AppRoutes.SCRAPERS)
  @Render(Views.SCRAPERS)
  scrapers() {
    const data = StorageService.data();
    return {
      rows: data.scrapers
        .map((s, i) => {
          return SCRAPER(s, i, getJobSchedule(data, s));
        })
        .join(" "),
    };
  }

  @Get(AppRoutes.HISTORY)
  @Render(Views.HISTORY)
  history() {
    const data = StorageService.histories();
    return {
      rows: data.map((h, i) => HISTORY(h, i)).join(" "),
    };
  }
}
